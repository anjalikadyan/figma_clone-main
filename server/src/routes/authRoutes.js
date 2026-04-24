const express = require("express");
const {
  signup,
  signin,
  getCurrentUser,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { authLimiter, loginLimiter } = require("../middleware/rateLimiters");

const router = express.Router();

router.post("/signup", authLimiter, signup);
router.post("/signin", loginLimiter, signin);
router.post("/refresh", authLimiter, refreshAccessToken);
router.post("/logout", authLimiter, logout);
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password", authLimiter, resetPassword);
router.get("/me", protect, getCurrentUser);

module.exports = router;
