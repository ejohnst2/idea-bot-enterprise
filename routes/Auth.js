const Team = require('../models/Team')
const User = require('../models/User')

function authenticateTeamDashboard(team, user){
  if TeamSchema.findOne({ team_id: user.team.id }) {
  // redirect user to secure route in client to team dashboard
  }
  else {
  // redirect user to sign up for the app and add to their teams slack
  }
};

// check the team of the user
// cross reference the token of that team with the token of the users team
// route them to the dashboard

// everyone should be able
// anyone on the team can view the dashboard
// anybody can endorse ideas
// user boolean isActive only gets switched on when user
