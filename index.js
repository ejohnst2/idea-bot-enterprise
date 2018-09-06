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
const cors = require("cors");

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
  `<a href=https://slack.com/oauth/authorize?scope=identity.basic,identity.team&client_id=${process.env.SLACK_CLIENT_ID}><img alt="Sign in with Slack" height="40" width="172" src="https://platform.slack-edge.com/img/sign_in_with_slack.png" srcset="https://platform.slack-edge.com/img/sign_in_with_slack.png 1x, https://platform.slack-edge.com/img/sign_in_with_slack@2x.png 2x" /></a>`
  )
});

// cors init
app.use(cors({ origin: port }));

/**
 * @desc disclude slack uris as the slack middleware rejects body-parser requests
 */
app.use(/\/((?!slack).)*/, bodyParser.json());
app.use(/\/((?!slack).)*/, bodyParser.urlencoded({ extended: true }));
app.use(/\/((?!slack).)*/, bodyParser.text());
app.use(/\/((?!slack).)*/, bodyParser.json({ type: "Header/json" }));

app.use(passport.initialize());

/************************************************************************/

// the overall authentication strategy used for auth requests, conditional on whether it's add to slack or sign in with

passport.use(
  new SlackStrategy(
    {
      clientID: process.env.SLACK_CLIENT_ID,
      clientSecret: process.env.SLACK_CLIENT_SECRET,
      scope: ['identity.basic', 'identity.team', 'users.list', 'chat:write:bot'],
      skipUserProfile: true
    },
    (accessToken, scopes, team, extra, profiles, done) => {
      if (extra.bot != null){
        botAuthorizations[team.id] = extra.bot.accessToken;
      }
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
const Endorsement = require("./routes/Endorsement");



app
  .route("/Team")
  .get(Team.getTeams)
  .post(Team.postTeam);
app
  .route("/Team/:id")
  .get(Team.getTeam)
  .delete(Team.deleteTeam)
  .put(Team.updateTeam);

// get route for our ideas
app.route("/Idea").get(Idea.getIdeas);

/**
 * @desc api endpoint for the /idea slash command
 */

const UserSchema = require("./models/User");
const TeamSchema = require("./models/Team");
const IdeaSchema = require("./models/Idea");
const EndorsementSchema = require("./models/Endorsement");



app.use('/slack/actions', slackInteractions.expressMiddleware());


const firstIdea = {
    "text": "This is your first idea, please opt in to post it!",
    "attachments": [
        {
            "text": "Would you like to opt in?",
            "fallback": "Please contact your administrator to upgrade your plan.",
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


// endorsement action, can endorse an idea directly on the idea itself in Slack
slackInteractions.action('endorse_idea', addEndorsement);

function addEndorsement(payload){
  Endorsement.postSlackEndorsement(payload)
}

// if amount of users meets the allowance, notify user to get in touch with administrator with admin name
function checkTeamAllowance(req){
  if (TeamSchema.findOne({type: req.team}).allowance === UserSchema.count({ team: req.team })) {

  UserSchema.findOne({team: req.team}, {admin: true}, function (err, admin){

    let adminChannelId = 'channel'

    var message = {
      token: botAuthorizations[teamId],
      channel: adminChannelId,
      as_user: false,
      username: "daniel",
      text: "Hey human, your team is having so many ideas that you might need to upgrade your plan."
    }

    chat.postMessage();

  });
    // send admin a private message
    // how do you raise the next action from happening?
  }
}

// for first time ideators to opt in as a user of the app
slackInteractions.action({callbackId: 'add_user'}, createUserAndIdea)

function createUserAndIdea(payload, respond) {
  if (payload.actions[0].value === 'yes') {
    respond ({text: "Awesome, you're now a user and can now log your ideas whenever you have them."});

    console.log(payload)
    User.postUserPayload(payload)
  }
  if (payload.actions[0].value === 'no') {
    respond ({text: "Ok then, sorry to see you miss out on the ideation"});
  }
};


// when a user posts an idea in a channel
// add a slash command for ideaboard so people can access it on demand, make that only visible to the person

app.post('/Idea', (req, res, next) => {

  const idea_response = {
  response_type: 'in_channel', // || ephermal
  channel: req.channel_id,
  text: `<@${req.body.user_id}> posted a new idea! \n\n ${req.body.text}`,
  };

    UserSchema.findOne({
          username: req.body.user_id
      }, function(err, user) {
          if (err) {
              return done(err);
          }
          //No user was found... so give them the option to opt in
          if (!user) {
              // check allowance before prompting them
              return res.json(firstIdea)
          } else {
            //found user, steady as she goes
            checkTeamAllowance(req.body)
            Idea.postIdea(req.body)
            res.json(idea_response);
            next()
          }
      })
  },

  (err, erq, res, next) => {
  res.json(response)
  res.status(500)
  next()

});


/************************************************************************/

module.exports = app;
