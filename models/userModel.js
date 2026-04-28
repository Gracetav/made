const db = require("../config/db");

async function createCustomer({ name, email, password }) {
  const [result] = await db.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'customer')",
    [name, email, password]
  );
  return result.insertId;
}

async function findByEmail(email) {
  const [rows] = await db.query("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
  return rows[0] || null;
}

module.exports = { createCustomer, findByEmail };
