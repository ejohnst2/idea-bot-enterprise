const mongoose = require("mongoose");
const Endorsement = require("../models/Endorsement");

function postSlackEndorsement(req, res) {

  let myRegexp = /\n\n (.*)/;
  let match = myRegexp.exec(req.message.text)[1];

  let idea_reference = IdeaSchema.findOne({text: match})

  let newEndorsement = new Endorsement({
    user: req.user.id,
    idea_id: idea_reference
  });

  newEndorsement.save();
}

module.exports = {
  postSlackEndorsement
};
