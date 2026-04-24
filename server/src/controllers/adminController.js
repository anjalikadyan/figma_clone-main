const User = require("../models/User");
const CanvasDocument = require("../models/CanvasDocument");

const getAdminSummary = async (_req, res) => {
  try {
    const [usersCount, documentsCount, adminsCount] = await Promise.all([
      User.countDocuments(),
      CanvasDocument.countDocuments(),
      User.countDocuments({ role: "admin" }),
    ]);

    return res.status(200).json({
      metrics: {
        usersCount,
        documentsCount,
        adminsCount,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getAdminSummary };
