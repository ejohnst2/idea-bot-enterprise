const mongoose = require('mongoose')
const Idea = require('../models/Idea')

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');

function getIdeas(req, res) {

  let token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

    res.status(200).send(decoded);

    // User.findById(decoded.id, function (err, user) {
    //   if (err) return res.status(500).send("There was a problem finding the user.");
    //   if (!user) return res.status(404).send("No user found.");

    //   res.status(200).send(user);
    // });
  });

  let last_id = null
  const idea_per_page = 10

  const query = Idea.find({}).sort({ _id: -1 })
  query.exec((err, Ideas) => {
    if (err) res.send(err)
    res.json(Ideas)
  })
}

function postIdea(req, res) {

  if (req.text.includes('#')) {
    let category_regex = /\B\#\w\w+\b/g
    let category = req.text.match(category_regex)

    let newIdea = new Idea({
      text: req.text,
      username: req.name,
      user_id: req.user_id,
      channel: req.channel_name,
      category: category,
      teamId: req.team_id,
    })

    newIdea.save()
  } else {
    let newIdea = new Idea({
      text: req.text,
      username: req.user_name,
      user_id: req.user_id,
      channel: req.channel_name,
      category: null,
      teamId: req.team_id,
    })

    newIdea.save()
  }
}

module.exports = {
  getIdeas,
  postIdea,
}
