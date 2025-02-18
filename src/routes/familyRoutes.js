const express = require('express');
const router = express.Router();
const { generateInviteCode, joinFamilyByInvite, getFamilyMembers } = require('../controllers/familyController');

// 生成邀请码
router.post('/generateInviteCode', generateInviteCode);

// 通过邀请码加入家庭
router.post('/joinFamilyByInvite', joinFamilyByInvite);

// 查询家庭成员
router.get('/getFamilyMembers', getFamilyMembers);

module.exports = router; 