const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  prompt_id: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  response: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Response", responseSchema);
