const mongoose = require("mongoose");
const Endorsement = require("../models/Endorsement");
const IdeaSchema = require("../models/Idea");

function postSlackEndorsement(req, res) {
  let myRegexp = /\n\n (.*)/;
  let match = myRegexp.exec(req.message.text)[1];

  // query the DB to find the idea that the text is referencing

  IdeaSchema.findOne({ text: match }, function(err, idea) {
    let newEndorsement = new Endorsement({
      user: req.user.id,
      idea_id: idea
    });

    newEndorsement.save();
  });
}

module.exports = {
  postSlackEndorsement
};
