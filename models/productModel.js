const db = require("../config/db");

async function getAllProducts() {
  const result = await db.query("select * from products order by created_at desc");
  return result.rows;
}

async function getProductById(id) {
  const result = await db.query("select * from products where id = $1 limit 1", [id]);
  return result.rows[0] || null;
}

async function createProduct({ name, price, stock, description, image }) {
  await db.query(
    "insert into products (name, price, stock, description, image) values ($1, $2, $3, $4, $5)",
    [name, price, stock, description, image || null]
  );
}

async function updateProduct(id, { name, price, stock, description, image }) {
  await db.query(
    "update products set name=$1, price=$2, stock=$3, description=$4, image=$5 where id=$6",
    [name, price, stock, description, image || null, id]
  );
}

async function deleteProduct(id) {
  await db.query("delete from products where id = $1", [id]);
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
