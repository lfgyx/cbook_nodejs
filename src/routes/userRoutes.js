const express = require('express');
const router = express.Router();
const { updateProfile, getUserFamily, addOrEditFamily, getUserInfo } = require('../controllers/userController');

// 更新用户头像和昵称接口
router.post('/updateProfile', updateProfile);
router.get('/getUserFamily', getUserFamily);
router.post('/addOrEditFamily', addOrEditFamily);
// 获取用户信息
router.get('/getUserInfo', getUserInfo);

module.exports = router;
