const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: String
});

module.exports = mongoose.model("User", UserSchema);
