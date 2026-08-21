# 🤖 Discord Bot with Node.js

A beginner-friendly Discord Bot built using **Node.js** and **discord.js**.

This project demonstrates how to create a Discord application, create and connect a bot to a Discord server, listen for messages, respond to users, create slash commands, and integrate the bot with external services such as MongoDB and a URL Shortener API.

---

## 📌 What We Learn

In this project, we learn:

- How Discord works
- How to create a Discord Server
- How to create a Discord Developer Application
- How to create a Discord Bot
- How to add a Bot to a Discord Server
- How Discord Bot authentication works
- What a Bot Token is
- What Gateway Intents are
- How to use `discord.js`
- How to listen for Discord messages
- How to respond to messages
- How to prevent the Bot from replying to itself
- How to create Slash Commands
- How to handle Interactions
- How to connect MongoDB
- How to integrate a URL Shortener with Discord
- How a Discord Bot can act as an adapter/proxy layer
- How external APIs can be integrated with a Discord Bot

---

# 🧠 Basic Discord Architecture

The basic flow looks like this:

```text
Discord User
     │
     ▼
Discord Server
     │
     ▼
Discord Bot
     │
     ▼
Node.js Application
     │
     ├── MongoDB
     │
     ├── URL Shortener
     │
     └── External APIs
```

The user interacts with Discord, while our Node.js application receives those interactions through the Discord Bot.

---

# 1. Create a Discord Account

First, create an account on Discord.

Official website:

https://discord.com/

---

# 2. Create a Discord Server

A Discord Server is the place where users and bots can interact.

For example:

```text
Piyush Garg Server
│
├── General
├── Development
└── Bot Commands
```

A server can contain multiple channels.

---

# 3. Create a Discord Developer Application

Go to the Discord Developer Portal:

https://discord.com/developers/applications

Create a new application.

Example:

```text
Application Name:
YouTube
```

The application represents our Discord application.

---

# 4. Create the Bot

Inside the Discord Developer Portal:

```text
Application
   │
   └── Bot
        │
        └── Create Bot
```

Example bot username:

```text
Piyush Garg Bot
```

The bot will act as the user that interacts with our Discord server.

---

# 5. Add the Bot to the Server

Discord provides an OAuth2 URL generator.

The generated URL allows us to select:

- Application
- Bot
- Permissions
- Server

The general flow is:

```text
Discord Developer Portal
          │
          ▼
      OAuth2 URL
          │
          ▼
      Select Server
          │
          ▼
       Authorize
          │
          ▼
     Bot joins Server
```

---

# 🔐 6. Bot Token

A Discord Bot needs a **Token** to authenticate with Discord.

The token works similarly to an authentication credential.

Example:

```text
Bot Token
   ↓
Discord verifies the Bot
   ↓
Bot gets authenticated
```

### ⚠️ Important

Never expose your Bot Token.

Do NOT:

```text
GitHub
README.md
Discord messages
Screenshots
Public repositories
```

Instead, store it in an environment variable.

Example:

```env
DISCORD_TOKEN=your_secret_token
```

And add `.env` to `.gitignore`.

```gitignore
.env
node_modules/
```

If a token is accidentally exposed, regenerate/reset it immediately.

---

# 📦 7. Initialize Node.js Project

Create a project:

```bash
mkdir discord-bot
cd discord-bot
npm init -y
```

Install discord.js:

```bash
npm install discord.js
```

---

# 📁 Project Structure

A basic structure can look like:

```text
discord-bot/
│
├── node_modules/
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── index.js
└── command.js
```

---

# 🤖 8. Create a Discord Client

Import the required modules:

```js
import {
    Client,
    GatewayIntentBits,
    Events
} from "discord.js";
```

Create the client:

```js
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});
```

---

# 🧠 What is a Client?

The `Client` represents our Discord Bot application.

You can think of it as:

```text
Discord Bot
     ↓
Discord Client
     ↓
Node.js Application
```

The client allows our application to communicate with Discord.

---

# 🎯 9. What are Gateway Intents?

Gateway Intents tell Discord what type of events/data our Bot wants to receive.

For example:

```js
GatewayIntentBits.Guilds
```

Allows the bot to receive guild/server-related events.

```js
GatewayIntentBits.GuildMessages
```

Allows the bot to receive message-related events in guilds.

```js
GatewayIntentBits.MessageContent
```

Allows the bot to read message content.

---

# ⚙️ 10. Enable Message Content Intent

For message content, Discord requires the **Message Content Intent** to be enabled in the Developer Portal.

Go to:

```text
Developer Portal
      ↓
Your Application
      ↓
Bot
      ↓
Privileged Gateway Intents
      ↓
Message Content Intent
```

Enable it.

Without this, the bot may receive message events but won't be able to read their content.

---

# 👂 11. Listening for Messages

Discord.js provides event listeners.

Example:

```js
client.on(Events.MessageCreate, (message) => {
    console.log(message.content);
});
```

The idea is:

```text
User sends message
        ↓
Discord
        ↓
Bot receives event
        ↓
MessageCreate
        ↓
Callback function runs
```

---

# 💬 12. Reading Message Content

The message object contains information about the message.

```js
client.on(Events.MessageCreate, (message) => {
    console.log(message.content);
});
```

If the user sends:

```text
Hello
```

The console will show:

```text
Hello
```

---

# 🔁 13. Replying to a Message

A message can be replied to:

```js
message.reply("Hi from Bot");
```

Example:

```js
client.on(Events.MessageCreate, (message) => {

    if (message.author.bot) return;

    message.reply("Hi from Bot");
});
```

---

# 🚨 14. Prevent the Bot From Replying to Itself

This is very important.

Without this:

```js
if (message.author.bot) return;
```

the bot can respond to its own message.

Example of the problem:

```text
User:
Hello

Bot:
Hi from Bot

Bot sees its own message:
Hi from Bot

Bot:
Hi from Bot

Bot:
Hi from Bot

...
```

This creates an infinite reply loop.

Therefore:

```js
if (message.author.bot) return;
```

means:

> If the message was sent by a bot, ignore it.

---

# 🧩 Complete Basic Bot

```js
import {
    Client,
    GatewayIntentBits,
    Events
} from "discord.js";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.on(Events.MessageCreate, (message) => {

    if (message.author.bot) return;

    console.log(message.content);

    message.reply("Hi from Bot");
});

client.login(process.env.DISCORD_TOKEN);
```

---

# 🔑 15. Login

The Bot connects to Discord using its token:

```js
client.login(process.env.DISCORD_TOKEN);
```

The token authenticates the Bot.

Conceptually:

```text
Bot Token
    ↓
client.login()
    ↓
Discord Authentication
    ↓
Bot Connected
```

---

# ⚡ 16. Slash Commands

Discord supports interactive commands.

Example:

```text
/ping
```

Instead of sending a normal message:

```text
ping
```

users can use:

```text
/ping
```

Discord can display registered commands automatically.

---

# 🛠️ 17. Registering Commands

Create a file:

```text
command.js
```

The purpose of this file is to register commands with Discord.

Example command:

```text
/ping
```

The command can be used as a simple connectivity test.

---

# 📡 18. REST Client

Discord.js provides a REST client for communicating with Discord's REST API.

Conceptually:

```text
Node.js
   │
   ▼
REST Client
   │
   ▼
Discord REST API
   │
   ▼
Register Commands
```

A command can be registered using the application's Client ID.

---

# 🖱️ 19. Interactions

Slash commands generate **Interactions**.

Example:

```text
User:
/ping

       ↓

Discord

       ↓

Interaction

       ↓

Node.js Bot

       ↓

interaction.reply()
```

---

# 💬 20. Handling Interactions

We can listen for interaction events:

```js
client.on(Events.InteractionCreate, (interaction) => {
    console.log(interaction);
});
```

For a slash command:

```js
client.on(Events.InteractionCreate, (interaction) => {

    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "ping") {
        interaction.reply("Pong!");
    }
});
```

---

# 🏓 21. `/ping` Command

The purpose of `/ping` is to check whether the Bot is working.

User:

```text
/ping
```

Bot:

```text
Pong!
```

This is commonly used as a simple connectivity test.

---

# 🆚 Message vs Interaction

## Normal Message

```text
User
 ↓
"Hello"
 ↓
MessageCreate
 ↓
message.reply()
```

## Slash Command

```text
User
 ↓
/ping
 ↓
InteractionCreate
 ↓
interaction.reply()
```

---

# 🔗 22. Connecting the Bot with MongoDB

The Discord Bot can communicate with a database.

For example:

```text
Discord User
      ↓
Discord Bot
      ↓
Node.js
      ↓
MongoDB
```

MongoDB can store:

- Users
- Commands
- URLs
- Short IDs
- Logs
- Analytics
- Bot configuration

---

# 🔗 23. Discord Bot + URL Shortener

The project can be extended to integrate our previously created URL Shortener.

For example, the user can type:

```text
/create https://example.com
```

The Bot can:

1. Receive the message
2. Extract the URL
3. Generate a Short ID
4. Store the URL in MongoDB
5. Return the Short ID to the user

Flow:

```text
Discord User
      │
      ▼
/create https://example.com
      │
      ▼
Discord Bot
      │
      ▼
Extract URL
      │
      ▼
Generate Short ID
      │
      ▼
MongoDB
      │
      ▼
Return Short URL
```

---

# 🧠 24. Example Logic

```js
if (message.content.startsWith("create")) {

    const url = message.content.split(" ")[1];

    console.log("Generating short ID for:", url);

    // Save URL to MongoDB
    // Generate short ID

    message.reply("Short URL generated!");
}
```

The actual database logic can use the same URL Shortener architecture built previously.

---

# 🌐 25. Discord Bot as an Adapter / Proxy Layer

One of the most interesting concepts from this project is that the Discord Bot can act as an adapter layer.

Example:

```text
Discord User
      │
      ▼
Discord Bot
      │
      ▼
Node.js Application
      │
      ├── MongoDB
      ├── URL Shortener API
      ├── External API
      └── AI API
```

The Bot receives the user's input, processes it, and sends the result back.

---

# 🤖 26. Discord + AI

The same architecture can be used to integrate an AI service.

Example:

```text
User
 │
 │ "Explain JWT"
 ▼
Discord Bot
 │
 ▼
Node.js
 │
 ▼
AI API
 │
 ▼
Response
 │
 ▼
Discord Bot
 │
 ▼
User
```

This means Discord can become the interface while Node.js handles the backend logic.

---

# 🔌 27. External API Integration

The Bot can also communicate with other APIs.

For example:

```text
Discord
   ↓
Node.js
   ↓
Weather API
   ↓
Weather Data
   ↓
Discord
```

Or:

```text
Discord
   ↓
Node.js
   ↓
Movie API
   ↓
Movie Information
   ↓
Discord
```

---

# 📚 Important Concepts

| Concept | Meaning |
|---|---|
| Discord Server | Community/server where users interact |
| Application | Discord application created in Developer Portal |
| Bot | Automated Discord user |
| Client | Discord.js object representing the Bot |
| Token | Credential used to authenticate the Bot |
| Gateway Intent | Specifies which events/data the Bot receives |
| MessageCreate | Event triggered when a message is created |
| InteractionCreate | Event triggered by interactions such as slash commands |
| Slash Command | Discord command beginning with `/` |
| REST API | Used for operations such as registering commands |
| MongoDB | Database that can store application data |

---

# 🔐 Security Rules

Never commit:

```text
.env
Bot Token
API Keys
Database Credentials
JWT Secrets
```

Use:

```env
DISCORD_TOKEN=your_token
MONGO_URI=your_mongodb_connection
```

And:

```gitignore
node_modules/
.env
```

---

# 🚀 Possible Future Features

This Bot can be extended with:

- `/ping`
- `/help`
- `/create`
- URL Shortener
- MongoDB integration
- User authentication
- User-specific commands
- Weather API
- Movie API
- AI chatbot
- Moderation
- Server statistics
- Custom slash commands
- Logging system
- Role management
- Automated responses

---

# 🎯 Key Takeaway

The main idea of this project is not just creating a Discord Bot.

The important concept is learning how an external platform can communicate with our Node.js backend.

```text
Discord
   ↓
Bot
   ↓
Node.js
   ↓
Business Logic
   ↓
Database / APIs
   ↓
Response
   ↓
Discord
```

Once this architecture is understood, many different applications can be built around the same concept.

---

## 📝 Quick Revision

```text
1. Create Discord Account
2. Create Discord Server
3. Create Developer Application
4. Create Bot
5. Generate OAuth2 URL
6. Add Bot to Server
7. Generate Bot Token
8. Initialize Node.js
9. Install discord.js
10. Create Client
11. Configure Gateway Intents
12. Enable Message Content Intent
13. Listen for MessageCreate
14. Read message.content
15. Reply using message.reply()
16. Ignore bot messages
17. Create Slash Commands
18. Register Commands using REST
19. Listen for InteractionCreate
20. Handle interaction.commandName
21. Connect MongoDB
22. Integrate URL Shortener / APIs
```

---

## 🏁 Project Goal

Build a Discord Bot that can interact with users and connect Discord with our backend services.

The final architecture can be:

```text
                 ┌──────────────┐
                 │ Discord User │
                 └──────┬───────┘
                        │
                        ▼
                 ┌──────────────┐
                 │ Discord Bot  │
                 └──────┬───────┘
                        │
                        ▼
                 ┌──────────────┐
                 │   Node.js    │
                 └──────┬───────┘
                        │
              ┌─────────┼─────────┐
              ▼         ▼         ▼
          MongoDB    APIs      Services
```

**This project demonstrates how Discord can be used as a frontend/interface for a Node.js backend.**