const mongoose = require("mongoose");
const Endorsement = require("../models/Endorsement");
const IdeaSchema = require("../models/Idea");


// function for creating an endorsement for an idea

function postSlackEndorsement(req, res) {
      console.log('hey')

  let myRegexp = /\n\n (.*)/;
  let match = myRegexp.exec(req.message.text)[1];

  // query the DB to find the idea that the text is referencing
  // let idea_reference = IdeaSchema.findOne({text: match})


  // placeholder for endorsement
  let newEndorsement = new Endorsement({
    user: req.user.id,
    idea_id: match
  });

  console.log(newEndorsement)


  newEndorsement.save();
}

module.exports = {
  postSlackEndorsement
};
