const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Replace strings with refereneces by importing the relevant schemas
// mongoose.Schema.Types.ObjectId, ref: 'Idea'

const EndorsementSchema = new Schema({
  user: {
    type: String,
    required: true,
  },
  idea_id: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("Endorsement", EndorsementSchema);
