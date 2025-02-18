const redis = require('redis');

// 创建 Redis 客户端
const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT, // Redis 默认端口
  },
  username: "default",
  password: process.env.REDIS_PASSWORD
});

// 连接 Redis
redisClient.connect()
  .then(() => console.log('Connected to Redis'))
  .catch((err) => console.error('Redis connection error:', err));

module.exports = redisClient;
