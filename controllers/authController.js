const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");

function showLogin(req, res) {
  res.render("customer/login", { title: "Login", error: null });
}

function showRegister(req, res) {
  res.render("customer/register", { title: "Register", error: null });
}

async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.render("customer/register", { title: "Register", error: "Semua field wajib diisi" });
    }
    const existing = await userModel.findByEmail(email);
    if (existing) return res.render("customer/register", { title: "Register", error: "Email sudah digunakan" });
    const hashed = await bcrypt.hash(password, 10);
    await userModel.createCustomer({ name, email, password: hashed });
    return res.redirect("/login");
  } catch (error) {
    console.error("Register error:", error);
    if (error.code === "42P01") {
      return res.render("customer/register", { title: "Register", error: "Tabel users belum ada. Jalankan migration dulu." });
    }
    if (error.code === "23505") {
      return res.render("customer/register", { title: "Register", error: "Email sudah digunakan" });
    }
    return res.render("customer/register", { title: "Register", error: `Gagal register: ${error.message}` });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await userModel.findByEmail(email);
  if (!user) return res.render("customer/login", { title: "Login", error: "Email atau password salah" });
  const valid = (await bcrypt.compare(password, user.password)) || password === user.password;
  if (!valid) return res.render("customer/login", { title: "Login", error: "Email atau password salah" });

  req.session.user = { id: user.id, name: user.name, email: user.email, role: user.role };
  if (user.role === "admin") return res.redirect("/admin/dashboard");
  return res.redirect("/customer/products");
}

function logout(req, res) {
  req.session.destroy(() => res.redirect("/login"));
}

module.exports = { showLogin, showRegister, register, login, logout };
