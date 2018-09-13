const mongoose = require("mongoose");
const Team = require("../models/Team");

function getTeams(req, res) {
  const query = Team.find({});
  query.exec((err, Teams) => {
    if (err) res.send(err);
    res.json(Teams);
  });
}

function postTeamOnInstall(req, auth, res) {
  const newTeam = new Team({
    botAuthorization: auth,
    slack_team_id: req.id,
    allowance: 20
  });
  newTeam.save((err, Team) => {
    if (err) res.send(err);
    if (res) {
      res.json({
        message: "Team successfully saved!",
        Team
      });
    }
  });
}

function postTeam(req, res) {
  const newTeam = new Team(req.body);
  newTeam.save((err, Team) => {
    if (err) res.send(err);
    res.json({
      message: "Team successfully saved!",
      Team
    });
  });
}

function getTeam(req, res) {
  Team.findById(req.params.id, (err, Team) => {
    if (err) res.send(err);
    res.json(Team);
  });
}

function deleteTeam(req, res) {
  Team.remove(
    {
      _id: req.params.id
    },
    (err, result) => {
      res.json({
        message: "Team successfully deleted!",
        result
      });
    }
  );
}

function updateTeam(req, res) {
  Team.findById(
    {
      _id: req.params.id
    },
    (err, Team) => {
      if (err) res.send(err);
      Object.assign(Team, req.body).save((err, Team) => {
        if (err) res.send(err);
        res.json({
          message: "Team successfully updated!",
          Team
        });
      });
    }
  );
}

module.exports = {
  getTeams,
  postTeamOnInstall,
  postTeam,
  getTeam,
  deleteTeam,
  updateTeam
};
