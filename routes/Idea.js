const mongoose = require("mongoose");
const Idea = require("../models/Idea");

function getIdeas(req, res) {
  const query = Team.find({});
  query.exec((err, Ideas) => {
    if (err) res.send(err);
    res.json(Ideas);
  });
}

function postIdea(req, res, next) {
  let newIdea = new Idea({
    text: req.event.text,
    user: req.event.user,
    channel: req.event.channel,
    teamId: req.team_id
  });

  newIdea.save(err => {
    if (err) console.error(err);
  });
}

module.exports = {
  getIdeas,
  postIdea
};
