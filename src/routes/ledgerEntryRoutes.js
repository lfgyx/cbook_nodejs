const express = require('express');
const router = express.Router();
const { create, getLedgerEntries, getMonthlyExpenses } = require('../controllers/ledgerEntryController');

// 新增账目记录
router.post('/create', create);

// 获取当前登录用户的账单记录
router.get('/getLedgerEntries', getLedgerEntries);

// 获取本月的账单支出
router.get('/getMonthlyExpenses', getMonthlyExpenses);

module.exports = router; 