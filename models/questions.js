const mongoose = require("mongoose");
const { Schema } = mongoose;

const questionSchema = new Schema({
  question: String,
  type: String,
  solution: [{ type: String }],
  questionLoc: String,
  opa: Number,
  opb: Number,
  opc: Number,
  opd: Number,
  portal: {
    type: Schema.Types.ObjectId,
    ref: "Portals",
  },
});

module.exports = mongoose.model("Question", questionSchema);
