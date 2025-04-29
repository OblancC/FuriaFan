require('dotenv').config();

module.exports = {
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_CALLBACK_URL || 'http://localhost:5000/api/auth/discord/callback',
    scope: ['identify', 'email', 'guilds', 'guilds.members.read']
}; 