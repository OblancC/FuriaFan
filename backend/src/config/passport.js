const GoogleStrategy = require('passport-google-oauth20').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const mongoose = require('mongoose');
const User = require('../models/User');
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
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Procura usuário pelo id do Google
    let user = await User.findOne({ 'socialMedia.google.id': profile.id });

    // Se não encontrar, procura pelo email
    if (!user) {
      user = await User.findOne({ email: profile.emails[0].value });
      if (user) {
        // Vincula o Google à conta existente
        user.socialMedia.google = {
          id: profile.id,
          email: profile.emails[0].value
        };
        await user.save();
      }
    }

    // Se ainda não existe, cria novo usuário
    if (!user) {
      user = await User.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        socialMedia: {
          google: {
            id: profile.id,
            email: profile.emails[0].value
          }
        }
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
    // Procura usuário pelo id do Twitter
    let user = await User.findOne({ 'socialMedia.twitter.id': profile.id });

    // Se não encontrar, procura pelo email (se disponível)
    if (!user && profile.emails && profile.emails[0]) {
      user = await User.findOne({ email: profile.emails[0].value });
      if (user) {
        // Vincula o Twitter à conta existente
        user.socialMedia.twitter = {
          id: profile.id,
          username: profile.username
        };
        await user.save();
      }
    }

    // Se ainda não existe, cria novo usuário
    if (!user) {
      user = await User.create({
        name: profile.displayName,
        email: profile.emails && profile.emails[0] ? profile.emails[0].value : '',
        socialMedia: {
          twitter: {
            id: profile.id,
            username: profile.username
          }
        }
      });
    }

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));