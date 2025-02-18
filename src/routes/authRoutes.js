const express = require('express');
const { login } = require('../controllers/authController');
const { validateToken } = require('../controllers/authController');

const router = express.Router();

// 登录路由
router.get('/login', login);

// token验证接口
router.post('/validateToken', validateToken);

module.exports = router;
