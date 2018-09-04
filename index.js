require("dotenv").config();

const slackEventsApi = require("@slack/events-api");
const SlackClient = require("@slack/client").WebClient;
const passport = require("passport");
const SlackStrategy = require("@aoberoi/passport-slack").default.Strategy;
const { createMessageAdapter } = require('@slack/interactive-messages');
const slackInteractions = createMessageAdapter(process.env.SLACK_SIGNING_SECRET);
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3000;

let UserModel = require("./models/User");

/**
 * SERVER
 */

// serve index.html to client

app.get("/", (req, res) => {
  res.send(
    `<a href="https://slack.com/oauth/authorize?client_id=${process.env.SLACK_CLIENT_ID}&scope=commands,bot"><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a>`
  );
});


// serve dashboard.html to client
// use sign in with Slack to verify access

app.get("/dashboard", (req, res) => {
  res.send(
  `<a href=https://slack.com/oauth/authorize?scope=identity.basic,identity.team&client_id=${process.env.SLACK_CLIENT_ID}><img src="https://api.slack.com/img/sign_in_with_slack.png" /></a>`
  )
});


/**
 * @desc disclude slack uris as the slack middleware rejects body-parser requests
 */
app.use(/\/((?!slack).)*/, bodyParser.json());
app.use(/\/((?!slack).)*/, bodyParser.urlencoded({ extended: true }));
app.use(/\/((?!slack).)*/, bodyParser.text());
app.use(/\/((?!slack).)*/, bodyParser.json({ type: "Header/json" }));

app.use(passport.initialize());

/************************************************************************/

passport.use(
  new SlackStrategy(
    {
      clientID: process.env.SLACK_CLIENT_ID,
      clientSecret: process.env.SLACK_CLIENT_SECRET,
      scope: ['identity.basic', 'identity.team'],
      skipUserProfile: true
    },
    (accessToken, scopes, team, extra, profiles, done) => {
      botAuthorizations[team.id] = extra.bot.accessToken;
      done(null, {});
    }
  )
);

const MongoClient = require("mongodb").MongoClient;

mongoose.connect(
  process.env.MONGO_DB_URI,
  {
    useNewUrlParser: true
  }
);

/**
 * wrapper supresses testign suite error
 * @see http://www.marcusoft.net/2015/10/eaddrinuse-when-watching-tests-with-mocha-and-supertest.html
 */
if (!module.parent) {
  app.listen(port);
}

/**
 * @see https://github.com/slackapi/node-slack-events-api#usage
 */
const slackEvents = slackEventsApi.createEventAdapter(
  process.env.SLACK_SIGNING_SECRET,
  {
    includeBody: true
  }
);

/**
 * @desc teams authorized to use the bot
 */
const botAuthorizations = {};

/**
 * @desc cache and lookup appropriate client info
 */
const clients = {};

function getClientByTeamId(teamId) {
  if (!clients[teamId] && botAuthorizations[teamId]) {
    clients[teamId] = new SlackClient(botAuthorizations[teamId]);
  }
  if (clients[teamId]) {
    return clients[teamId];
  }
  return null;
}

 //=============================
//LOCAL LOGIN MIDDLEWARE FOR ACCESS TO DASHBOARD
//=============================
// app.post("/login", passport.authenticate("local", {
//   successRedirect: "/QAApplicationHub",
//   failureRedirect: "/login",
//   failureFlash: true
// }));

// app.get("/logout", (req, res) => {
//   req.logout();
//   req.flash("success", "Successfuly signed out!")
//   res.redirect("/login");
// });


// add a slash command for ideaboard so people can access it on demand, make that only visible to the person


app.get(
  "/auth/slack",
  passport.authenticate("slack", {
    scope: ["bot"]
  })
);

app.get(
  "/auth/slack/callback",
  passport.authenticate("slack", { session: false }),
  (req, res) => {
    res.send("<p>Think Fish was successfully installed on your team.</p>");
  },
  (err, erq, res, next) => {
    res
      .status(500)
      .send(`<p>Think Fish failed to install</p> <pre>${err}</pre>`);
  }
);

// get app using different capabilities of the slack API

app.use("/slack/events", slackEvents.expressMiddleware());

slackEvents.on("reaction_added", (event, body) => {
  const slack = new SlackClient(botAuthorizations[team.id]);

  if (!slack) {
    return console.error("No authorization for this team");
  }

  slack.chat
    .postMessage({ channel: event.item.channel, text: `testingtons` })
    .catch(console.error);

});

slackEvents.on("error", error => {
  if (error.code === slackEventsApi.errorCodes.TOKEN_VERIFICATION_FAILURE) {
    console.error(`An unverified request was sent to the Slack events Request URL. Request body: \
${error}`);
  } else {
    console.error(
      `An error occurred while handling a Slack event: ${error.message}`
    );
  }
});

/************************************************************************/

/**
 * ROUTES
 */

const Team = require("./routes/Team");
const Idea = require("./routes/Idea");
const User = require("./routes/User");


app
  .route("/Team")
  .get(Team.getTeams)
  .post(Team.postTeam);
app
  .route("/Team/:id")
  .get(Team.getTeam)
  .delete(Team.deleteTeam)
  .put(Team.updateTeam);

/**
 * @desc api endpoint for the /idea slash command
 */


function checkTeamAllowance(){
  // if amount of users meets the allowance, notify user to get in touch with administrator with admin name
}


// function authenticateUser(req){

//   passport.use(new SlackStrategy({
//       clientID: process.env.SLACK_CLIENT_ID,
//       clientSecret: process.env.SLACK_CLIENT_SECRET,
//       callbackURL: 'https://ee5f062a.ngrok.io/auth/slack/callback',
//   }, function(accessToken, refreshToken, profile, done) {
//     console.log(profile.user_id)
//     User.findOrCreate({username: profile.user_id}, function (error, user) {
//       return done(error, user);
//     });
//   }
//   ));

// }


const UserSchema = require("./models/User");
app.use('/slack/actions', slackInteractions.expressMiddleware());


const firstIdea = {
    "text": "This is your first idea, please opt in to post it!",
    "attachments": [
        {
            "text": "Would you like to opt in?",
            "fallback": "You are unable to choose at this time because your company got no monies",
            "color": "#3AA3E3",
            "callback_id": "add_user",
            "attachment_type": "default",
            "actions": [
                {
                    "name": "add_user",
                    "text": "Yes",
                    "type": "button",
                    "value": "yes"
                },
                {
                    "name": "add_user",
                    "text": "No",
                    "type": "button",
                    "callback_id": "add_user",
                    "value": "no"
                }
            ]
        }
    ]
}

// create an endorsement action, can endorse an idea directly on the idea itself in Slack

slackInteractions.action('endorse_idea', addEndorsement);

function addEndorsement(){
  console.log('this is working, now just need endorsement logic init')
}


// for first time ideators to opt in as a user of the app

slackInteractions.action({callbackId: 'add_user'}, createUserAndIdea)

function createUserAndIdea(payload, respond) {
  console.log(`The user chose ${payload.actions[0].value} ${payload.user.id} ${payload.team.id}`);

  if (payload.actions[0].value === 'yes') {
    console.log('add the user and send response')
    respond ({text: "Great! You're now a user, you can now log your ideas until that money run out boy."});

    User.postUserPayload(payload)

  }
  if (payload.actions[0].value === 'no') {
    respond ({text: "Ok then, you can miss out on the action"});
  }
};


// when a user posts an idea in a channel

app.post('/Idea', (req, res, next) => {

  const idea_response = {
  response_type: 'in_channel', // || ephermal
  channel: req.channel_id,
  text: `<@${req.body.user_id}>, you're a goddamn user already, and you posted a new idea! \n\n ${req.body.text}`,
  };

    UserSchema.findOne({
          username: req.body.user_id
      }, function(err, user) {
          if (err) {
              return done(err);
          }
          //No user was found... so give them the option to opt in
          if (!user) {
              console.log('you aint no goddamn user yet')
              // check allowance before prompting them
              return res.json(firstIdea)
          } else {
            //found user, steady as she goes
            Idea.postIdea(req.body)
            res.json(idea_response);
            next()
          }
      })
  },

  (err, erq, res, next) => {
  console.log('error')
  res.json(response)
  res.status(500)
  next()

});

/************************************************************************/

module.exports = app;
