const mongoose = require("mongoose");
const Endorsement = require("../models/Endorsement");
const IdeaSchema = require("../models/Idea");

function postSlackEndorsement(req, res) {

  let myRegexp = /\n\n (.*)/;
  let match = myRegexp.exec(req.message.text)[1];

  // query the DB to find the idea that the text is referencing

  // let idea_reference = IdeaSchema.findOne({text: match})

  // save endorsement with placeholder
  let newEndorsement = new Endorsement({
    user: req.user.id,
    idea_id: match
  });

  newEndorsement.save();
}

module.exports = {
  postSlackEndorsement
};
