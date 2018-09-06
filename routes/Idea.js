const mongoose = require("mongoose");
const Idea = require("../models/Idea");

function getIdeas(req, res) {
  let last_id = null;
  const idea_per_page = 10;

  const query = Idea.find({}).sort({ _id: -1 });
  query.exec((err, Ideas) => {
    if (err) res.send(err);
    res.json(Ideas);
  });
}

function postIdea(req, res) {

  // let category_regex = /\B\#\w\w+\b/g
  // let category = req.text(category_regex);

  let category_regex = /\B\#\w\w+\b/g;
  let category = (req.text).match(category_regex);

  let newIdea = new Idea({
    text: req.text,
    user: req.user_id,
    channel: req.channel_name,
    category: category,
    teamId: req.team_id
  });

  newIdea.save();
}

module.exports = {
  getIdeas,
  postIdea
};
