const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  team: [{ type: Schema.Types.ObjectId, ref: 'Team' }]
});

module.exports = mongoose.model("User", UserSchema);
