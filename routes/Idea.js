const mongoose = require("mongoose");
const Idea = require("../models/Idea");

function getIdeas(req, res) {
  const query = Team.find({});
  query.exec((err, Ideas) => {
    if (err) res.send(err);
    res.json(Ideas);
  });
}

function postIdea(req, res) {
  const newIdea = new Idea(req.body);
  newIdea.save((err, Idea) => {
    if (err) res.json({ err });
    else
      res.json({
        message: "Idea successfully saved!",
        Idea
      });
  });
}

module.exports = {
  getIdeas,
  postIdea
};
