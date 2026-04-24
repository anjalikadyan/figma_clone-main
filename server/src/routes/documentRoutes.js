const express = require("express");
const {
  getDocumentByRoomId,
  upsertDocument,
} = require("../controllers/documentController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:roomId", protect, getDocumentByRoomId);
router.put("/:roomId", protect, upsertDocument);

module.exports = router;
