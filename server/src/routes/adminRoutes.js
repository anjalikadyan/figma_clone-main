const express = require("express");
const { getAdminSummary } = require("../controllers/adminController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/summary", protect, authorizeRoles("admin"), getAdminSummary);

module.exports = router;
