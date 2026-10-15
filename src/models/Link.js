const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    url: { type: String, required: true },
    // The signed-in user who created the link (absent on links made before auth existed).
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Link", linkSchema);
