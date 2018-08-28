const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TeamSchema = new Schema({
  botAuthorization: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("Team", TeamSchema);
