const mongoose = require("mongoose");
const Endorsement = require("../models/Endorsement");

function getEndorsements(req, res) {
  const query = Idea.find({});
  query.exec((err, Endorsements) => {
    if (err) res.send(err);
    res.json(Endorsements);
  });
}

function postEndorsement(req, res) {
  let newEndorsement = new Endorsement({
    ideator_id: req.text,
    user: req.user_id,
    idea_id: req.channel_name
  });

  newEndorsement.save();
}

module.exports = {
  getEndorsements,
  postEndorsement
};
