const productModel = require("../models/productModel");

async function showProducts(req, res) {
  const products = await productModel.getAllProducts();
  res.render("customer/products", { title: "Products", products });
}

async function showProductDetail(req, res) {
  const product = await productModel.getProductById(req.params.id);
  if (!product) return res.status(404).send("Produk tidak ditemukan");
  res.render("customer/product-detail", { title: "Product Detail", product });
}

async function adminProducts(req, res) {
  const products = await productModel.getAllProducts();
  res.render("admin/products", { title: "Manage Products", products });
}

async function createProduct(req, res) {
  await productModel.createProduct(req.body);
  res.redirect("/admin/products");
}

async function updateProduct(req, res) {
  await productModel.updateProduct(req.params.id, req.body);
  res.redirect("/admin/products");
}

async function deleteProduct(req, res) {
  await productModel.deleteProduct(req.params.id);
  res.redirect("/admin/products");
}

module.exports = {
  showProducts,
  showProductDetail,
  adminProducts,
  createProduct,
  updateProduct,
  deleteProduct
};
