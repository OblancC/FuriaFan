const GoogleStrategy = require('passport-google-oauth20').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const mongoose = require('mongoose');
const User = require('../models/User');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const discordConfig = require('./discord');
require('dotenv').config();


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    // Se já está logado, vincule a conta Google
    if (req.user) {
      const user = await User.findById(req.user._id);
      user.socialMedia = user.socialMedia || {};
      user.socialMedia.google = {
        id: profile.id,
        email: profile.emails[0].value
      };
      await user.save();
      return done(null, user);
    }
    // Procura usuário pelo id do Google
    let user = await User.findOne({ 'socialMedia.google.id': profile.id });
    // Se não encontrar, procura pelo email
    if (!user) {
      user = await User.findOne({ email: profile.emails[0].value });
      if (user) {
        user.socialMedia = user.socialMedia || {};
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
  passReqToCallback: true,
  scope: ['read', 'users.read', 'tweet.read', 'list.read', 'follows.read', 'offline.access']
},
async (req, token, tokenSecret, profile, done) => {
  try {
    // Se já está logado, vincule a conta Twitter
    if (req.user) {
      const user = await User.findById(req.user._id);
      user.socialMedia = user.socialMedia || {};
      user.socialMedia.twitter = {
        id: profile.id,
        username: profile.username,
        accessToken: token,
        accessSecret: tokenSecret,
        lastSync: new Date()
      };
      await user.save();
      return done(null, user);
    }
    // Procura usuário pelo id do X
    let user = await User.findOne({ 'socialMedia.twitter.id': profile.id });
    // Se não encontrar, procura pelo email (se disponível)
    if (!user && profile.emails && profile.emails[0]) {
      user = await User.findOne({ email: profile.emails[0].value });
      if (user) {
        user.socialMedia = user.socialMedia || {};
        user.socialMedia.twitter = {
          id: profile.id,
          username: profile.username,
          accessToken: token,
          accessSecret: tokenSecret,
          lastSync: new Date()
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
            username: profile.username,
            accessToken: token,
            accessSecret: tokenSecret,
            lastSync: new Date()
          }
        }
      });
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

passport.use(new DiscordStrategy({
  clientID: discordConfig.clientID,
  clientSecret: discordConfig.clientSecret,
  callbackURL: discordConfig.callbackURL,
  scope: discordConfig.scope,
  passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    // Se já está logado, vincule a conta Discord
    if (req.user) {
      const user = await User.findById(req.user._id);
      user.socialMedia = user.socialMedia || {};
      user.socialMedia.discord = {
        id: profile.id,
        username: profile.username,
        email: profile.email,
        avatar: profile.avatar,
        accessToken,
        refreshToken,
        guilds: profile.guilds
      };
      await user.save();
      return done(null, user);
    }
    // Procurar usuário existente
    let user = await User.findOne({ 'socialMedia.discord.id': profile.id });
    if (user) {
      user.socialMedia = user.socialMedia || {};
      user.socialMedia.discord = {
        id: profile.id,
        username: profile.username,
        email: profile.email,
        avatar: profile.avatar,
        accessToken,
        refreshToken,
        guilds: profile.guilds
      };
    } else {
      // Criar novo usuário
      user = new User({
        name: profile.username,
        email: profile.email,
        socialMedia: {
          discord: {
            id: profile.id,
            username: profile.username,
            email: profile.email,
            avatar: profile.avatar,
            accessToken,
            refreshToken,
            guilds: profile.guilds
          }
        }
      });
    }
    await user.save();
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

module.exports = passport;