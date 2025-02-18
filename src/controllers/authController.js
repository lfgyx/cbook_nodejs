const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis');
const { loginWithCode } = require('../services/authService');
const { successResponse, errorResponse } = require('../utils/responseHelper');
const User = require('../models/User');

const login = async (req, res) => {
  try {
    const { code } = req.query;
    const { authorization } = req.headers
    // 如果有token的话，更新session_key 并返回头像等信息
    if (authorization && authorization != undefined && authorization != null) {
      const token = authorization;
      // 验证和解码 token
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const openid = decoded.openid; // 获取 openid
        // 查询数据库中是否存在该用户
        let user = await User.findOne({ where: { openid } });
        let userInfo = { avatar_url: user.avatar_url, nick_name: user.nick_name }
        user.last_login_at = new Date()
        user.save()
        // 如果 token 有效，则可以更新用户的 session_key 和其他信息
        const { session_key } = await loginWithCode(code); // 根据 code 获取新的 session_key
        await redisClient.set(`session_key:${openid}`, session_key, 'EX', 3600); // 更新 Redis 中的 session_key，1小时过期
        // 返回更新后的用户信息或其它相关数据
        return successResponse(res, { message: "用户已登录并更新 session_key", userInfo });

      } catch (err) {
        console.error("无效的token: ", token);
      }
    }

    // 参数校验
    if (!code) {
      return errorResponse(res, '缺少 code 参数')
    }

    // 调用服务获取 openid 和 session_key
    const { openid, session_key } = await loginWithCode(code);
    if (!openid || !session_key) {
      return errorResponse(res, '获取 openid 失败')
    }

    // 查询user表中是否存在此用户
    let user = await User.findOne({ where: { openid } });

    // 如果用户不存在，创建新的用户记录
    if (!user) {
      user = await User.create({
        openid, gender: 0
      });
    }

    // 设置 Token 的过期时间为 7 天（以秒为单位）
    const TOKEN_EXPIRATION_DAYS = 7;
    const TOKEN_EXPIRATION_SECONDS = TOKEN_EXPIRATION_DAYS * 24 * 60 * 60;

    // 签发 JWT Token
    const token = jwt.sign({ openid }, process.env.JWT_SECRET, {
      expiresIn: `${TOKEN_EXPIRATION_SECONDS}s`, // 设置为 7 天过期
    });

    // 返回 Token 和有效期
    successResponse(res, {
      token,
      expiresIn: TOKEN_EXPIRATION_SECONDS
    });
  } catch (error) {
    console.error("登录错误: ", error);
    errorResponse(res, "登录失败，请稍后再试")
  }
};

/**
 * 验证token是否有效
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
const validateToken = async (req, res) => {
  try {
    const { token } = req.body;

    // 参数校验
    if (!token) {
      return errorResponse(res, 'Token不能为空');
    }

    // 验证token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded && decoded.openid) {
        // token有效
        return successResponse(res, {
          valid: true
        });
      }
    } catch (error) {
      // token无效或过期
      return successResponse(res, {
        valid: false,
        message: 'Token无效或已过期'
      });
    }

  } catch (error) {
    console.error('验证token失败:', error);
    errorResponse(res, '验证token失败，请稍后再试');
  }
};

module.exports = { login, validateToken };
