const express = require("express");
const productController = require("../controllers/productController");
const orderController = require("../controllers/orderController");
const { isAuthenticated, isCustomer } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(isAuthenticated, isCustomer);

router.get("/products", productController.showProducts);
router.get("/products/:id", productController.showProductDetail);
router.post("/cart", orderController.addToCart);
router.get("/cart", orderController.showCart);
router.post("/checkout", orderController.checkout);
router.get("/orders", orderController.customerOrders);

module.exports = router;
