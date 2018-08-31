const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IdeaSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  channel: {
    type: String,
  },
  teamId: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("Idea", IdeaSchema);
