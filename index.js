require("dotenv").config();

const slackEventsApi = require("@slack/events-api");
const SlackClient = require("@slack/client").WebClient;
const passport = require("passport");
const SlackStrategy = require("@aoberoi/passport-slack").default.Strategy;
const http = require("http");
const express = require("express");

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

const app = express();

app.use(passport.initialize());
app.get("/", (req, res) => {
  res.send(
    '<a href="/auth/slack"><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a>'
  );
});

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
  if (!message.subtype && message.text.indexOf("hi") >= 0) {
    const slack = getClientByTeamId(body.team_id);
    if (!slack) {
      return console.log("No Authorization found for this team");
    }
    slack.chat
      .postMessage({
        channel: message.channel,
        text: `Hello <@${message.user}>! :tada:`
      })
      .catch(console.error);
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

const port = process.env.PORT || 3000;
http.createServer(app).listen(port, () => {
  console.log(`server listening on port ${port}`);
});
