const mongoose = require("mongoose");
const { Schema } = mongoose;

const questionSchema = new Schema({
  question: String,
  type: String,
  solution: [{ type: String }],
  questionLoc: String,
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
