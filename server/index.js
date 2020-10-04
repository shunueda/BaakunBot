import Twitter from "twitter";
import axios from "axios";
const express = require("express");
const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;

const app = express();

let isRunning = false
let textboxMessage = ""
let tweetList= []
let pastTweet
let access_token
let token_secret

setInterval(() => {
  const messageArr = textboxMessage.split(', ')
  let randMessage = messageArr[messageArr.length * Math.random() | 0]
  while (pastTweet === randMessage) {
    randMessage = messageArr[messageArr.length * Math.random() | 0]
  }
  if (isRunning && access_token !== undefined) {
    const client = new Twitter({
      consumer_key: 'Wq93OZ5bA8XQyotcmUKBfijE0',
      consumer_secret: 'OUR21tKZCtFYQqDjj4MPniEAzxd9FODxQZ60yz9yYeENgUwUl6',
      access_token_key: access_token,
      access_token_secret: token_secret
    })
    client.post('statuses/update', {status: randMessage}, (error, tweet, response) => {
      if(error) throw error;
      tweetList.push(tweet.id_str)
    })
    if (tweetList.length > 5) {
      client.post('statuses/destroy', {id: tweetList[0]}, (error, tweet, response) => {
        if (error) console.log(error)
      })
    }
    pastTweet = randMessage
  }
}, 900000)

app.get("/updateUserInfo", (req, res) => {
  access_token = req.query.access_token
  token_secret = req.query.token_secret
})

app.get("/tweet", (req, res) => {
  const client = new Twitter({
    consumer_key: 'Wq93OZ5bA8XQyotcmUKBfijE0',
    consumer_secret: 'OUR21tKZCtFYQqDjj4MPniEAzxd9FODxQZ60yz9yYeENgUwUl6',
    access_token_key: req.query.key,
    access_token_secret: req.query.secret
  })
  client.post('statuses/update', {status: req.query.message}, (error, tweet, response) => {
    if (error) console.log(error)
    res.send(tweet)
  })
})

app.get("/isRunning", (req, res) => {
  res.send(isRunning)
})

app.get("/toggle", (req, res) => {
  isRunning = (isRunning !== true)
  res.send(isRunning)
})

app.get("/getTextboxMessage", (res, req) => {
  req.send(textboxMessage)
})

app.get("/updateTextboxMessage", (res, req) => {
  textboxMessage = req.req.query.text
  res.send(textboxMessage)
})














app.use(require("morgan")("combined")); // optional
app.use(require("cookie-parser")());
app.use(require("body-parser").urlencoded({ extended: true }));
app.use(
  require("express-session")({
    secret: "some secret",
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: "auto"
    }
  })
);
app.use(passport.initialize());
app.use(passport.session());

// twitter
passport.use(
  new TwitterStrategy(
    {
      consumerKey: "Wq93OZ5bA8XQyotcmUKBfijE0",
      consumerSecret: "OUR21tKZCtFYQqDjj4MPniEAzxd9FODxQZ60yz9yYeENgUwUl6",
      callbackURL: "http://localhost:3000/callback"
    },
    function(token, tokenSecret, profile, done) {
      profile.access_token = token;
      profile.token_secret = tokenSecret;
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

app.post("/hello", (req, res) => res.send("world"));

// twitter
app.get("/auth/twitter", passport.authenticate("twitter"));
app.get(
  "/auth/twitter/callback",
  passport.authenticate("twitter"),
  (req, res) => {
    res.json({ user: req.user });
  }
);

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = {
  path: "/server",
  handler: app
};

