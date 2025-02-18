const express = require('express');
const router = express.Router();
const { getUserLedger, addLedger, deleteLedger, updateLedgerStatus } = require('../controllers/ledgerController');

// 根据当前登录用户获取账本
router.get('/getUserLedger', getUserLedger);

// 新增账本
router.post('/addLedger', addLedger);

// 删除账本
router.get('/deleteLedger', deleteLedger);

// 修改账本的 is_active 字段
router.post('/updateLedgerStatus', updateLedgerStatus);

module.exports = router;
