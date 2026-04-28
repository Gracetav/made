const db = require("../config/db");

async function getAllProducts() {
  const [rows] = await db.query("SELECT * FROM products ORDER BY created_at DESC");
  return rows;
}

async function getProductById(id) {
  const [rows] = await db.query("SELECT * FROM products WHERE id = ? LIMIT 1", [id]);
  return rows[0] || null;
}

async function createProduct({ name, price, stock, description, image }) {
  await db.query(
    "INSERT INTO products (name, price, stock, description, image) VALUES (?, ?, ?, ?, ?)",
    [name, price, stock, description, image || null]
  );
}

async function updateProduct(id, { name, price, stock, description, image }) {
  await db.query(
    "UPDATE products SET name=?, price=?, stock=?, description=?, image=? WHERE id=?",
    [name, price, stock, description, image || null, id]
  );
}

async function deleteProduct(id) {
  await db.query("DELETE FROM products WHERE id = ?", [id]);
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
