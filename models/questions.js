const mongoose = require("mongoose");
const { Schema } = mongoose;

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

const questionSchema = new Schema({
  question: String,
  type: String,
  solution: [ImageSchema],
  questionLoc: ImageSchema,
  opa: { type: Number, default: 0 },
  opb: { type: Number, default: 0 },
  opc: { type: Number, default: 0 },
  opd: { type: Number, default: 0 },
  portal: {
    type: Schema.Types.ObjectId,
    ref: "Portal",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Question", questionSchema);
