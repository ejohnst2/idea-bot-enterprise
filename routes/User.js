const mongoose = require("mongoose");
const User = require("../models/User");

function getUsers(req, res) {
  const query = User.find({})
  query.exec((err, Users) => {
    if (err) res.send(err)
    res.json(Users)
  })
}

function postUser(req, res) {
  let newUser = new User({
    username: req.user_id,
    team: req.team_id
  });
  newUser.save();
}

module.exports = {
  getUsers,
  postUser
};
