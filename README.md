# Idea Bot Enterprise

Development Environment Startup

```
yarn run dev
yarn run bot
cd client && yarn run dev
```

Navigate to `localhost:8080` inside your browser

---

Scripts

```
db.teams.createIndex( { "botAuthorization": 1 }, { unique: true } )
db.users.createIndex( { "user_id": 1 }, { unique: true } )
