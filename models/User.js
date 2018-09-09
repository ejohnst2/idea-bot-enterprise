const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  team_id: String
});


module.exports = mongoose.model("User", UserSchema);
