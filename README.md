# Idea Bot Enterprise

Scripts

```
db.teams.createIndex( { "botAuthorization": 1 }, { unique: true } )
db.users.createIndex( { "user_id": 1 }, { unique: true } )

Getting Started With Slack 

1. Go to https://api.slack.com and create a new app 
2. Load your credentials into the .env 
3. Install ngrok to tunnel for an https address 
4. This https address you get when you run ngrok will need to be used to config Slack for your dev environment

Place 1: Interactive Components - this is where we use some interactive components, buttons etc.  
https://YOURNGROKURLID.ngrok.io/slack/actions

Place 2: Slash Commands - this is for the slash commands such as '/idea' which is the main bit 
https://YOURNGROKURLID.ngrok.io/Idea

Place 3: OAuth & Permissions - this is for the authentication process that Slack will use when people install or sign in with slack
https://YOURNGROKURLID.ngrok.io/auth/slack/callback
