const mongoose = require("mongoose");

const SnippetSchema = new mongoose.Schema({
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Category"
  },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  htmlCode: { type: String, default: "" },
  cssCode: { type: String, default: "" },
  tailwindCode: { type: String, default: "" },
  reactCode: { type: String, default: "" },
  jsCode: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Snippet", SnippetSchema);