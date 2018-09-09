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
    username: req.user.id,
    team_id: req.team.id
  });
  newUser.save();
}


module.exports = {
  getUsers,
  postUser
};
