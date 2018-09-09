const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  team: String,
  isAdmin: Boolean
});


module.exports = mongoose.model("User", UserSchema);
