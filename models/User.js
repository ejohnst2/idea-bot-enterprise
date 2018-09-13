const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: String,
  user_id: {
    type: Schema.Types.String,
    required: true,
    unique: true
  },
  email: String,
  access_token: String,
  team_id: String,
  team_name: String,
  isAdmin: {
    type: Boolean,
    default: false
  },
  image_24: String,
  image_32: String,
  image_48: String,
  image_72: String,
  image_192: String,
  image_512: String,
  image_1024: String
});

module.exports = mongoose.model("User", UserSchema);
