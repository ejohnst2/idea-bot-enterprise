const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TeamSchema = new Schema({
  botAuthorization: {
    type: String,
    // allowance represents the limit based on the package they chose
    allowance: Number,
    required: true,
  }
});

module.exports = mongoose.model("Team", TeamSchema);
