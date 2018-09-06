const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  team: String,
  admin: Boolean
});


module.exports = mongoose.model("User", UserSchema);
