const sequelize = require("../config/db");
const Category = require("../models/Category");
const User = require("../models/User"); // 引入用户模型
const { successResponse, errorResponse } = require("../utils/responseHelper"); // 引入响应工具

/**
 * 获取当前用户的所有分类
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
const getCategories = async (req, res) => {
  try {
    const { openid } = req.user; // 从请求中获取openid

    // 查找该用户的所有分类
    const categories = await Category.findAll({
      where: { openid },
      order: [
        [sequelize.literal("used_at IS NULL"), "ASC"],
        ["used_at", "DESC"],
      ],
      attributes: {
        exclude: ["openid"], // 排除 openid 字段
      },
    });
    successResponse(res, categories);
  } catch (error) {
    console.error("查询分类失败:", error);
    errorResponse(res, "查询分类失败，请稍后再试");
  }
};

/**
 * 新增分类
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
const addCategory = async (req, res) => {
  try {
    const { openid } = req.user;
    const { name, icon } = req.body;

    // 校验分类名称不能为空
    if (!name) {
      return errorResponse(res, "分类名称不能为空");
    }

    // 检查当前用户是否已存在该分类
    const existingCategory = await Category.findOne({
      where: {
        openid,
        name,
      },
    });

    if (existingCategory) {
      return errorResponse(res, "该分类已存在");
    }

    // 创建新的分类
    const category = await Category.create({
      name,
      icon,
      openid, // 使用 openid 作为外键
    });

    // 获取当前用户的所有分类
    const categories = await Category.findAll({
      where: { openid },
    });

    // 返回所有分类
    successResponse(res, categories);
  } catch (error) {
    console.error("新增分类失败:", error);
    errorResponse(res, "新增分类失败，请稍后再试");
  }
};

/**
 * 删除分类
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
const deleteCategory = async (req, res) => {
  try {
    const { openid } = req.user; // 获取当前用户的 openid
    const { categoryId } = req.query; // 从 query 参数中获取要删除的分类ID

    if (!categoryId) {
      return errorResponse(res, "分类ID不能为空");
    }

    // 查找要删除的分类
    const category = await Category.findOne({
      where: {
        id: categoryId,
        openid, // 确保该分类是当前用户的
      },
    });

    if (!category) {
      return errorResponse(res, "分类不存在或不属于该用户");
    }

    // 删除分类
    await category.destroy();

    // 查找该用户的所有分类
    const categories = await Category.findAll({
      where: { openid },
    });

    successResponse(res, categories);
  } catch (error) {
    console.error("删除分类失败:", error);
    errorResponse(res, "删除分类失败，请稍后再试");
  }
};

module.exports = {
  getCategories,
  addCategory,
  deleteCategory,
};
