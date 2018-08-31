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
  console.log("req", req);

  let newIdea = new Idea({
    text: req.event.text,
    user: req.event.user,
    channel: req.event.channel,
    teamId: req.team_id
  });

  newIdea.save()

  // newIdea.save(function(err, newIdea) {
  //   if (err) return console.error(err);
  //   else
  //     res.json({
  //       message: "Idea successfully saved!"
  //     });
  // });
}

module.exports = {
  getIdeas,
  postIdea
};
