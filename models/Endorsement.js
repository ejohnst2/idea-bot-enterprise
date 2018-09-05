const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var Idea = mongoose.model('Idea', IdeaSchema);
var User = mongoose.model('User', UserSchema);

const EndorsementSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User',
    required: true,
  },
  idea_id: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Idea',
    required: true,
  }
});

module.exports = mongoose.model("Endorsement", EndorsementSchema);
