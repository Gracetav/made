const path = require("path");
const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel");

function isFinalizedStatus(status) {
  return status === "confirmed" || status === "siap diambil";
}

async function addToCart(req, res) {
  const { product_id, qty } = req.body;
  const product = await productModel.getProductById(product_id);
  if (!product) return res.redirect("/customer/products");
  if (!req.session.cart) req.session.cart = [];

  const found = req.session.cart.find((item) => item.product_id === Number(product_id));
  if (found) {
    found.qty += Number(qty);
  } else {
    req.session.cart.push({
      product_id: product.id,
      name: product.name,
      qty: Number(qty),
      price: Number(product.price)
    });
  }
  res.redirect("/customer/cart");
}

function showCart(req, res) {
  const cart = req.session.cart || [];
  const total = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  res.render("customer/cart", { title: "Cart", cart, total });
}

async function checkout(req, res) {
  const cart = req.session.cart || [];
  if (!cart.length) return res.redirect("/customer/cart");
  const total = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  const orderId = await orderModel.createOrder({
    userId: req.session.user.id,
    items: cart,
    total
  });
  req.session.cart = [];
  res.redirect(`/orders/upload-proof/${orderId}`);
}

async function showUploadProof(req, res) {
  const order = await orderModel.getOrderById(req.params.id);
  if (!order) return res.status(404).send("Pesanan tidak ditemukan");
  if (req.session.user.role === "customer" && order.user_id !== req.session.user.id) {
    return res.status(403).send("Forbidden");
  }
  if (isFinalizedStatus(order.status)) {
    return res.redirect(`/orders/invoice/${order.id}`);
  }
  res.render("customer/upload-proof", { title: "Upload Bukti Transfer", order });
}

async function uploadProof(req, res) {
  const orderId = req.params.id;
  const order = await orderModel.getOrderById(orderId);
  if (!order) return res.status(404).send("Pesanan tidak ditemukan");
  if (req.session.user.role === "customer" && order.user_id !== req.session.user.id) {
    return res.status(403).send("Forbidden");
  }
  if (isFinalizedStatus(order.status)) {
    return res.redirect(`/orders/invoice/${order.id}`);
  }
  if (!req.file) return res.redirect(`/orders/upload-proof/${orderId}`);
  const filePath = `/uploads/${path.basename(req.file.path)}`;
  await orderModel.updatePaymentProof(orderId, filePath);
  res.redirect(`/orders/invoice/${orderId}`);
}

async function showInvoice(req, res) {
  const order = await orderModel.getOrderById(req.params.id);
  if (!order) return res.status(404).send("Invoice tidak ditemukan");
  if (req.session.user.role === "customer" && order.user_id !== req.session.user.id) {
    return res.status(403).send("Forbidden");
  }
  if (req.session.user.role === "customer" && !order.payment_proof) {
    return res.redirect(`/orders/upload-proof/${order.id}`);
  }
  res.render("customer/invoice", { title: "Invoice", order });
}

async function customerOrders(req, res) {
  const orders = await orderModel.getOrdersByUser(req.session.user.id);
  res.render("customer/orders", { title: "My Orders", orders });
}

async function adminOrders(req, res) {
  const orders = await orderModel.getAllOrders();
  res.render("admin/orders", { title: "All Orders", orders });
}

async function verifyPayment(req, res) {
  await orderModel.updateOrderStatus(req.params.id, req.body.status);
  res.redirect("/admin/orders");
}

module.exports = {
  addToCart,
  showCart,
  checkout,
  showUploadProof,
  uploadProof,
  showInvoice,
  customerOrders,
  adminOrders,
  verifyPayment
};
