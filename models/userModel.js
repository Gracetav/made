const db = require("../config/db");

async function createCustomer({ name, email, password }) {
  const result = await db.query(
    "insert into users (name, email, password, role) values ($1, $2, $3, 'customer') returning id",
    [name, email, password]
  );
  return result.rows[0].id;
}

async function findByEmail(email) {
  const result = await db.query("select * from users where email = $1 limit 1", [email]);
  return result.rows[0] || null;
}

module.exports = { createCustomer, findByEmail };
