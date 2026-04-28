const express = require("express");
const productController = require("../controllers/productController");
const orderController = require("../controllers/orderController");
const { isAuthenticated, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(isAuthenticated, isAdmin);

router.get("/dashboard", async (req, res) => {
  res.render("admin/dashboard", { title: "Admin Dashboard" });
});

router.get("/products", productController.adminProducts);
router.post("/products", productController.createProduct);
router.put("/products/:id", productController.updateProduct);
router.delete("/products/:id", productController.deleteProduct);

router.get("/orders", orderController.adminOrders);
router.post("/orders/:id/verify", orderController.verifyPayment);
router.get("/invoices/:id", orderController.showInvoice);

module.exports = router;
