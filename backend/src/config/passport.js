const GoogleStrategy = require('passport-google-oauth20').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const mongoose = require('mongoose');
const User = require('../models/Users');
const passport = require('passport');
require('dotenv').config();


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ 'socialAccounts.google': profile.id });

    if (!user) {
      user = await User.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        profilePicture: profile.photos[0].value,
        socialAccounts: { google: profile.id }
      });
    }

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: process.env.TWITTER_CALLBACK_URL,
  includeEmail: true,
},
async (token, tokenSecret, profile, done) => {
  try {
    const user = await User.findOne({ 'socialAccounts.twitter': profile.id });

    if (user) {
      return done(null, user);
    } else {
      const newUser = new User({
        name: profile.displayName,
        email: profile.emails && profile.emails[0] ? profile.emails[0].value : ' ', // Twitter nem sempre envia email!
        socialAccounts: {
          twitter: profile.id
        }
      });
      await newUser.save();
      return done(null, newUser);
    }
  } catch (err) {
    return done(err, null);
  }
}
));