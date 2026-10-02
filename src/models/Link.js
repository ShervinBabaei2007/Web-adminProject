const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    url: { type: String, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Link", linkSchema);
