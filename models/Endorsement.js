const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// var Idea = mongoose.model('Idea', Idea);
// var User = mongoose.model('User', User);
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
