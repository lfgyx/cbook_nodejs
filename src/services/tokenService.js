const axios = require('axios');
const redisClient = require('../config/redis');

const APPID = process.env.APPID;
const APPSECRET = process.env.APPSECRET;

const getAccessToken = async () => {
    const cacheKey = '';

    // 先检查 Redis 缓存
    const cachedToken = await redisClient.get(cacheKey);
    if (cachedToken) return cachedToken;

    // 如果缓存不存在，获取新的 access_token
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`;
    const response = await axios.get(url);
    const { access_token, expires_in } = response.data;

    if (!access_token) throw new Error('Failed to fetch access_token');

    // 缓存到 Redis
    await redisClient.setEx('cacheKey', expires_in, access_token);
    return access_token;
};

module.exports = { getAccessToken };
