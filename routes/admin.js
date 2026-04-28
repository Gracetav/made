const express = require("express");
const multer = require("multer");
const path = require("path");
const productController = require("../controllers/productController");
const orderController = require("../controllers/orderController");
const { isAuthenticated, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, path.join(__dirname, "../public/uploads")),
  filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`)
});
const upload = multer({ storage });

router.use(isAuthenticated, isAdmin);

router.get("/dashboard", async (req, res) => {
  res.render("admin/dashboard", { title: "Admin Dashboard" });
});

router.get("/products", productController.adminProducts);
router.post("/products", upload.single("image_file"), productController.createProduct);
router.put("/products/:id", upload.single("image_file"), productController.updateProduct);
router.delete("/products/:id", productController.deleteProduct);

router.get("/orders", orderController.adminOrders);
router.post("/orders/:id/verify", orderController.verifyPayment);
router.get("/invoices/:id", orderController.showInvoice);

module.exports = router;
