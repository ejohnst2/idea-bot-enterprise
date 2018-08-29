require("dotenv").config();

const slackEventsApi = require("@slack/events-api");
const SlackClient = require("@slack/client").WebClient;
const passport = require("passport");
const SlackStrategy = require("@aoberoi/passport-slack").default.Strategy;
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
    '<a href="https://slack.com/oauth/authorize?client_id=346952315347.420991484773&scope=commands,bot"><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a>'
  );
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
      skipUserProfile: true
    },
    (accessToken, scopes, team, extra, profiles, done) => {
      botAuthorizations[team.id] = extra.bot.accessToken;
      done(null, {});
    }
  )
);

const MongoClient = require("mongodb").MongoClient;

mongoose.connect(process.env.MONGO_DB_URI, {
  useNewUrlParser: true,
});

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

app.use("/slack/events", slackEvents.expressMiddleware());

slackEvents.on("message", (message, body) => {
  if (!message.subtype && message.text.indexOf("idea") >= 0) {
    const slack = new SlackClient('xoxb-346952315347-422701107831-9sWNe8vRQnK0PSB4512LR4j2')
    if (!slack) {
      return console.log("No Authorization found for this team");
    }
    slack.chat
      .postMessage({
        channel: message.channel,
        text: `Hello <@${message.user}>! :tada:`
      })
      .catch(console.error);

    Idea.postIdea({
      idea: message.text,
      user: message.user,
      // channel: message.channel,
      // team: body.team_id
    })
    .catch(console.error)
  }
});

slackEvents.on("reaction_added", (event, body) => {
  const slack = getClientByTeamId(body.team_id);

  if (!slack) {
    return console.error("No authnorization for this team");
  }

  slack.chat
    .postMessage(event.item.channel, `${event.reaction}:`)
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

app
  .route("/Team")
  .get(Team.getTeams)
  .post(Team.postTeam);
app
  .route("/Team/:id")
  .get(Team.getTeam)
  .delete(Team.deleteTeam)
  .put(Team.updateTeam);

app
  .route("/Idea")
  .get(Idea.getIdeas)
  .post(Idea.postIdea);

/************************************************************************/

module.exports = app;
