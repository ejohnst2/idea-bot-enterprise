require('dotenv').config()

const slackEventsApi = require('@slack/events-api')
const SlackClient = require('@slack/client').WebClient
const passport = require('passport')
const SlackStrategy = require('@aoberoi/passport-slack').default.Strategy
const { createMessageAdapter } = require('@slack/interactive-messages')
const slackInteractions = createMessageAdapter(process.env.SLACK_SIGNING_SECRET)
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 3000
const cors = require('cors')
const serveStatic = require('serve-static')

const session = require('express-session');

// serve app to the home page
app.use(serveStatic(__dirname + '/client/dist'))

/**
 * SERVER
 */

// serve dashboard.html to client
// use sign in with Slack to verify access

app.get('/dashboard', (req, res) => {
  res.send(
    `<a href=https://slack.com/oauth/authorize?scope=identity.basic,identity.team&client_id=${
      process.env.SLACK_CLIENT_ID
    }><img alt="Sign in with Slack" height="40" width="172" src="https://platform.slack-edge.com/img/sign_in_with_slack.png" srcset="https://platform.slack-edge.com/img/sign_in_with_slack.png 1x, https://platform.slack-edge.com/img/sign_in_with_slack@2x.png 2x" /></a>`
  )
})

// TODO: call the function on the dashboard route and pass in the decoded user json

// cors init
app.use(cors({ origin: port }))

/**
 * @desc disclude slack uris as the slack middleware rejects body-parser requests
 */
app.use(/\/((?!slack).)*/, bodyParser.json())
app.use(/\/((?!slack).)*/, bodyParser.urlencoded({ extended: true }))
app.use(/\/((?!slack).)*/, bodyParser.text())
app.use(/\/((?!slack).)*/, bodyParser.json({ type: 'Header/json' }))


app.use(session({
  cookie: {
    // secure should be enabled in a production app, but disabled for simplicity
    // secure: true,
  },
  resave: false,
  saveUninitialized: false,
  secret: 'CHANGE ME',
}));

app.use(passport.initialize())
app.use(passport.session());


/************************************************************************/

const UserSchema = require('./models/User')
const TeamSchema = require('./models/Team')

// the overall authentication strategy used for auth requests, conditional on whether it's add to slack or sign in with

passport.use(
  new SlackStrategy(
    {
      clientID: process.env.SLACK_CLIENT_ID,
      clientSecret: process.env.SLACK_CLIENT_SECRET,
      scope: [
        'identity.basic',
        'identity.avatar',
        'identity.email',
        'identity.team',
        'users.list',
        'chat:write:bot',
      ],
      skipUserProfile: false,
    },
    (accessToken, scopes, team, extra, profiles, done) => {
      if (extra.bot != null) {
        Team.postTeamOnInstall(team, extra.bot.accessToken)
      } else {
        User.postUser(accessToken, profiles)
      }
      done(null, profiles.user)
    }
  )
)

// When using Passport's session functionality, you need to tell passport how to
// serialize/deserialize the user object to the session store
passport.serializeUser((user, done) => {
  // Simplest possible serialization
  done(null, JSON.stringify(user));
});

passport.deserializeUser((json, done) => {
  // Simplest possible deserialization
  done(null, JSON.parse(json));
});

mongoose.connect(
  process.env.MONGO_DB_URI,
  {
    useNewUrlParser: true,
  }
)

/**
 * wrapper supresses testign suite error
 * @see http://www.marcusoft.net/2015/10/eaddrinuse-when-watching-tests-with-mocha-and-supertest.html
 */
if (!module.parent) {
  app.listen(port)
}

/**
 * @see https://github.com/slackapi/node-slack-events-api#usage
 */
const slackEvents = slackEventsApi.createEventAdapter(
  process.env.SLACK_SIGNING_SECRET,
  {
    includeBody: true,
  }
)

app.get(
  '/auth/slack',
  passport.authenticate('slack', {
    scope: ['bot'],
  })
)

app.get(
  '/auth/slack/callback',
  passport.authenticate('slack', { session: false }),
  (req, res) => {
    res.redirect('/Idea')
  },
  (err, erq, res, next) => {
    res
      .status(500)
      .send(`<p>Think Fish failed to install</p> <pre>${err}</pre>`)
  }
)

// creating routes for specific teams and users to see their ideas

app.param('userId', function(request, response, next, userId) {
  // Fetch the story by its ID (storyId) from a database
  // Save the found story object into request object
  request.story = story;
});

// Home page that doesn't require logging in, but displays login state. See 'views/index.ejs'
app.get('/:userId/ideas', (req, res) => {
  console.log(req.user)
});



// get app using different capabilities of the slack API

app.use('/slack/events', slackEvents.expressMiddleware())

slackEvents.on('error', error => {
  if (error.code === slackEventsApi.errorCodes.TOKEN_VERIFICATION_FAILURE) {
    console.error(`An unverified request was sent to the Slack events Request URL. Request body: \
${error}`)
  } else {
    console.error(
      `An error occurred while handling a Slack event: ${error.message}`
    )
  }
})

/************************************************************************/

/**
 * ROUTES
 */

const Team = require('./routes/Team')
const Idea = require('./routes/Idea')
const User = require('./routes/User')
const Endorsement = require('./routes/Endorsement')

app
  .route('/Team')
  .get(Team.getTeams)
  .post(Team.postTeam)
  .post(Team.postTeamOnInstall)
app
  .route('/Team/:id')
  .get(Team.getTeam)
  .delete(Team.deleteTeam)
  .put(Team.updateTeam)

// get route for our ideas
app
  .route('/Idea')
  .get(Idea.getIdeas)

/**
 * @desc api endpoint for the /idea slash command
 */

app.use('/slack/actions', slackInteractions.expressMiddleware())

const firstIdea = {
  text: `Please sign up as a user via the following link! http://${
    process.env.BASE_URL
  }/Login`,
}

// endorsement action, can endorse an idea directly on the idea itself in Slack
slackInteractions.action('endorse_idea', addEndorsement)

function addEndorsement(payload) {
  Endorsement.postSlackEndorsement(payload)
}

// if amount of users meets the allowance, notify user to get in touch with administrator with admin name
function checkTeamAllowance(req) {
  // connect to web client to call api methods such as retreiving info and sending direct messages
  const web = new SlackClient(process.env.BOT_USER_ACCESS_TOKEN)

  if (
    TeamSchema.findOne({ team_id: req.slack_team_id }).allowance ===
    UserSchema.count({ team: req.team_id })
  ) {
    web.users
      .list()
      .then(res => {
        res.members.forEach(member => {
          // looping through to find all members where admin is true
          if (member.is_admin === true) {
            // store admin in DB
            User.postAdminUser(member)
            // message each admin to let them know that they need to upgrade their plan
            web.chat
              .postMessage({
                channel: member.id,
                text: `Your team is almost at its limit, log in to <https://www.innervate.app/${
                  member.team_id
                }/|your team dashboard> to upgrade plan.`,
              })
              .then(res => {
                console.log('Message sent: ', res.ts)
              })
              .catch(console.error)
          }
        })
      })
      .catch(console.error)
  }
}

// for first time ideators to opt in as a user of the app
slackInteractions.action({ callbackId: 'add_user' }, createUserOnIdea)

function createUserOnIdea(payload) {
  User.postUser(payload)

  checkTeamAllowance(req.body)
}

// when a user posts an idea in a channel
// add a slash command for ideaboard so people can access it on demand, make that only visible to the person

app.post(
  '/Idea',
  (req, res, next) => {
    const idea_response = {
      response_type: 'in_channel', // || ephermal
      channel: req.channel_id,
      text: `<@${req.body.user_id}> posted a new idea! \n\n ${req.body.text}`,
    }

    UserSchema.findOne(
      {
        user_id: req.body.user_id,
      },
      function(err, user) {
        if (err) {
          return done(err)
        }
        //No user was found... so give them the option to opt in
        if (!user) {
          // give user the ability to opt in
          return res.json(firstIdea)
        } else {
          //found user, steady as she goes
          Idea.postIdea(req.body)
          res.json(idea_response)
          next()
        }
      }
    )
  },

  (err, erq, res, next) => {
    res.json(response)
    res.status(500)
    next()
  }
)

/************************************************************************/

module.exports = app
