const db = require("../config/db");

function generateInvoiceNumber() {
  return `INV-${Date.now()}`;
}

async function createOrder({ userId, items, total }) {
  const invoiceNumber = generateInvoiceNumber();
  const client = await db.getConnection();
  try {
    await client.beginTransaction();
    const [orderRes] = await client.query(
      "INSERT INTO orders (user_id, invoice_number, total, status, payment_status) VALUES (?, ?, ?, 'pending', 'pending')",
      [userId, invoiceNumber, total]
    );
    const orderId = orderRes.insertId;

    for (const item of items) {
      await client.query(
        "INSERT INTO order_items (order_id, product_id, qty, price) VALUES (?, ?, ?, ?)",
        [orderId, item.product_id, item.qty, item.price]
      );
      await client.query("UPDATE products SET stock = stock - ? WHERE id = ?", [item.qty, item.product_id]);
    }

    await client.commit();
    return orderId;
  } catch (error) {
    await client.rollback();
    throw error;
  } finally {
    client.release();
  }
}

async function getOrderById(id) {
  const [orderRows] = await db.query(
    `SELECT o.*, u.name AS customer_name
     FROM orders o
     JOIN users u ON u.id = o.user_id
     WHERE o.id = ?`,
    [id]
  );
  if (!orderRows[0]) return null;

  const [itemsRows] = await db.query(
    `SELECT oi.*, p.name AS product_name
     FROM order_items oi
     JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id = ?`,
    [id]
  );

  return { ...orderRows[0], items: itemsRows };
}

async function getOrdersByUser(userId) {
  const [rows] = await db.query("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC", [userId]);
  return rows;
}

async function getAllOrders() {
  const [rows] = await db.query(
    `SELECT o.*, u.name AS customer_name
     FROM orders o
     JOIN users u ON u.id = o.user_id
     ORDER BY o.created_at DESC`
  );
  return rows;
}

async function updatePaymentProof(orderId, filePath) {
  await db.query("UPDATE orders SET payment_proof = ? WHERE id = ?", [filePath, orderId]);
}

async function updateOrderStatus(orderId, status) {
  await db.query("UPDATE orders SET status = ?, payment_status = ? WHERE id = ?", [status, status, orderId]);
}

module.exports = {
  createOrder,
  getOrderById,
  getOrdersByUser,
  getAllOrders,
  updatePaymentProof,
  updateOrderStatus
};
