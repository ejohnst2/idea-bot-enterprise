const mongoose = require('mongoose')
const User = require('../models/User')

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');

function getUsers(req, res) {
  const query = User.find({})
  query.exec((err, Users) => {
    if (err) res.send(err)
    res.json(Users)
  })
}

function postAdminUser(req, res) {
  let newUser = new User({
    user_id: req.id,
    team_id: req.team_id,
    isAdmin: true,
  })
  newUser.save()
}

function postUser(accessToken, profiles) {
  let newUser = new User({
    access_token: accessToken,
    name: profiles.user.name,
    user_id: profiles.user.id,
    email: profiles.user.email,
    team_id: profiles.team.id,
    team_name: profiles.team.name,
    isAdmin: false,
    image_24: profiles.user.image_24,
    image_32: profiles.user.image_32,
    image_48: profiles.user.image_48,
    image_72: profiles.user.image_72,
    image_192: profiles.user.image_192,
    image_512: profiles.user.image_512,
    image_1024: profiles.user.image_1024,
  },
  function (err, user) {
    if (err) return res.status(500).send("There was a problem registering the user.")
    // create a token
    let token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });
    res.status(200).send({ auth: true, token: token });
  });
  console.log(token)
  newUser.save()
}

module.exports = {
  getUsers,
  postUser,
}
