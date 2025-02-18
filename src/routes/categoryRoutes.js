const express = require('express');
const router = express.Router();
const { getCategories, addCategory, deleteCategory } = require('../controllers/categoryController');

// 查询分类（需要身份验证）
router.get('/getCategories', getCategories);

// 新增分类（需要身份验证）
router.post('/addCategory', addCategory);

// 修改分类（需要身份验证）
router.get('/deleteCategory', deleteCategory);

module.exports = router;
