const { TwitterApi } = require('twitter-api-v2');

class TwitterService {
  constructor(accessToken, accessSecret) {
    this.client = new TwitterApi({
      appKey: process.env.TWITTER_CONSUMER_KEY,
      appSecret: process.env.TWITTER_CONSUMER_SECRET,
      accessToken,
      accessSecret,
    });
  }

  async getUserProfile() {
    try {
      const user = await this.client.v2.me();
      return user.data;
    } catch (error) {
      console.error('Erro ao buscar perfil do Twitter:', error);
      throw error;
    }
  }

  async getTweets(userId, maxResults = 100) {
    try {
      const tweets = await this.client.v2.userTimeline(userId, {
        max_results: maxResults,
        'tweet.fields': ['created_at', 'public_metrics', 'entities'],
      });
      return tweets.data;
    } catch (error) {
      console.error('Erro ao buscar tweets:', error);
      throw error;
    }
  }

  async getLikes(userId, maxResults = 100) {
    try {
      const likes = await this.client.v2.userLikedTweets(userId, {
        max_results: maxResults,
        'tweet.fields': ['created_at', 'public_metrics', 'entities'],
      });
      return likes.data;
    } catch (error) {
      console.error('Erro ao buscar likes:', error);
      throw error;
    }
  }

  async getFollowing(userId, maxResults = 100) {
    try {
      const following = await this.client.v2.following(userId, {
        max_results: maxResults,
        'user.fields': ['name', 'username', 'profile_image_url'],
      });
      return following.data;
    } catch (error) {
      console.error('Erro ao buscar following:', error);
      throw error;
    }
  }

  async checkFuriaFollowing() {
    try {
      const furiaId = '894704535037513729'; // ID da FURIA no Twitter
      const following = await this.getFollowing(furiaId);
      return following.some(user => user.id === furiaId);
    } catch (error) {
      console.error('Erro ao verificar following da FURIA:', error);
      return false;
    }
  }
}

module.exports = TwitterService; 