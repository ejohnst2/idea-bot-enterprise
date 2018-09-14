const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IdeaSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  channel: {
    type: String,
  },
  category: {
    type: Array,
  },
  teamId: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("Idea", IdeaSchema);
