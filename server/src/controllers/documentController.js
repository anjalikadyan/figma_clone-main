const CanvasDocument = require("../models/CanvasDocument");

const getDocumentByRoomId = async (req, res) => {
  try {
    const { roomId } = req.params;
    const document = await CanvasDocument.findOne({ roomId });

    if (!document) {
      return res.status(404).json({ message: "Document not found." });
    }

    return res.status(200).json(document);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const upsertDocument = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { title, data } = req.body;

    const updatedDocument = await CanvasDocument.findOneAndUpdate(
      { roomId },
      {
        roomId,
        ...(title !== undefined ? { title } : {}),
        ...(data !== undefined ? { data } : {}),
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.status(200).json(updatedDocument);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDocumentByRoomId,
  upsertDocument,
};
