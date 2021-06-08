const mongoose = require("mongoose");
const { Schema } = mongoose;

const portalSchema = new Schema({
  Subject: String,
  date: String,
  question: [
    {
      type: Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
});

module.exports = mongoose.model("Portal", portalSchema);
