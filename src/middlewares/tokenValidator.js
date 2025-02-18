const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis');

/**
 * Token 验证中间件
 */
const tokenValidator = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader; // 提取 Bearer Token
    try {
      // 验证并解析 Token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded && decoded.openid) {
        // 将用户信息挂载到 req 对象
        req.user = { openid: decoded.openid };
        return next(); // 继续处理下一个中间件或路由
      }
      console.warn('Redis 中 Token 无效或已过期');
    } catch (error) {
      console.error('Token 验证错误:', error.message);
    }
  }

  // 如果 Token 验证失败，返回 401 响应
  res.status(401).json({ message: '未授权，无效的 Token' });
};

module.exports = tokenValidator;
