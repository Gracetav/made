const db = require("../config/db");

function generateInvoiceNumber() {
  return `INV-${Date.now()}`;
}

async function createOrder({ userId, items, total }) {
  const invoiceNumber = generateInvoiceNumber();
  const client = await db.connect();
  try {
    await client.query("begin");
    const orderRes = await client.query(
      "insert into orders (user_id, invoice_number, total, status, payment_status) values ($1, $2, $3, 'pending', 'pending') returning id",
      [userId, invoiceNumber, total]
    );
    const orderId = orderRes.rows[0].id;

    for (const item of items) {
      await client.query(
        "insert into order_items (order_id, product_id, qty, price) values ($1, $2, $3, $4)",
        [orderId, item.product_id, item.qty, item.price]
      );
      await client.query("update products set stock = stock - $1 where id = $2", [item.qty, item.product_id]);
    }

    await client.query("commit");
    return orderId;
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}

async function getOrderById(id) {
  const orderRes = await db.query(
    `select o.*, u.name as customer_name
     from orders o
     join users u on u.id = o.user_id
     where o.id = $1`,
    [id]
  );
  if (!orderRes.rows[0]) return null;

  const itemsRes = await db.query(
    `select oi.*, p.name as product_name
     from order_items oi
     join products p on p.id = oi.product_id
     where oi.order_id = $1`,
    [id]
  );

  return { ...orderRes.rows[0], items: itemsRes.rows };
}

async function getOrdersByUser(userId) {
  const result = await db.query("select * from orders where user_id = $1 order by created_at desc", [userId]);
  return result.rows;
}

async function getAllOrders() {
  const result = await db.query(
    `select o.*, u.name as customer_name
     from orders o
     join users u on u.id = o.user_id
     order by o.created_at desc`
  );
  return result.rows;
}

async function updatePaymentProof(orderId, filePath) {
  await db.query("update orders set payment_proof = $1 where id = $2", [filePath, orderId]);
}

async function updateOrderStatus(orderId, status) {
  await db.query("update orders set status = $1, payment_status = $1 where id = $2", [status, orderId]);
}

module.exports = {
  createOrder,
  getOrderById,
  getOrdersByUser,
  getAllOrders,
  updatePaymentProof,
  updateOrderStatus
};
