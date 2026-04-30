const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

async function setup() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "127.0.0.1",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    multipleStatements: true
  });

  console.log("Menghubungkan ke MySQL...");

  try {
    const sql = fs.readFileSync(path.join(__dirname, "sql", "jaya_motospart.sql"), "utf8");
    await connection.query(sql);
    console.log("Database 'jaya_motospart' berhasil dibuat dan diinisialisasi!");
  } catch (err) {
    console.error("Gagal inisialisasi database:", err.message);
  } finally {
    await connection.end();
  }
}

setup();
