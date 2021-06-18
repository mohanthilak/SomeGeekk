const mongoose = require("mongoose");
const { Schema } = mongoose;

const portalSchema = new Schema({
  subject: String,
  date: String,
  question: [
    {
      type: Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
});

module.exports = mongoose.model("Portal", portalSchema);
