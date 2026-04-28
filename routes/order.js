const express = require("express");
const multer = require("multer");
const path = require("path");
const orderController = require("../controllers/orderController");
const { isAuthenticated } = require("../middleware/authMiddleware");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, path.join(__dirname, "../public/uploads")),
  filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`)
});
const upload = multer({ storage });

router.use(isAuthenticated);
router.get("/upload-proof/:id", orderController.showUploadProof);
router.get("/invoice/:id", orderController.showInvoice);
router.post("/upload-proof/:id", upload.single("payment_proof"), orderController.uploadProof);

module.exports = router;
