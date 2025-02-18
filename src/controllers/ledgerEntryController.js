const LedgerEntry = require("../models/LedgerEntry"); // 引入账目记录模型
const Category = require("../models/Category"); // 引入分类模型
const { successResponse, errorResponse } = require("../utils/responseHelper"); // 引入响应工具
const sequelize = require("../config/db"); // 引入数据库实例
const moment = require("moment");
const { Op } = require("sequelize");
const Ledger = require("../models/Ledger"); // 引入账本模型

/**
 * 创建账目记录
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
const create = async (req, res) => {
  try {
    const { openid } = req.user; // 从请求头获取用户openid
    const {
      ledgerId,
      categoryName, // 前端传入分类名称
      type = 0,
      amount = 0,
      recordDate,
      description,
    } = req.body;

    // 参数校验
    if (!ledgerId || !categoryName || !recordDate) {
      return errorResponse(res, "账本、分类和记录日期不能为空");
    }

    // 创建账目记录
    const ledgerEntry = await LedgerEntry.create({
      ledger_id: ledgerId,
      category_name: categoryName, // 直接存储分类名称
      type,
      amount,
      record_date: new Date(recordDate), // 使用完整的日期时间对象
      description,
      entered_by: openid,
    });

    // 更新 Category 中当前用户的 categoryName 的 used_at 值
    await Category.update(
      { used_at: new Date() }, // 设置 used_at 为当前时间
      {
        where: {
          openid: openid,
          name: categoryName,
        },
      }
    );

    // 返回成功响应
    successResponse(res, {
      id: ledgerEntry.id,
      message: "记账成功",
    });
  } catch (error) {
    // 回滚事务
    console.error("创建账目记录失败:", error);
    errorResponse(res, "创建账目记录失败，请稍后再试");
  }
};

/**
 * 获取当前登录用户的账单记录
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
const getLedgerEntries = async (req, res) => {
  try {
    const { openid } = req.user; // 从请求头获取用户openid

    // 获取当前激活的账本
    const activeLedger = await Ledger.findOne({
      where: { openid, is_active: true, deleted_at: null },
    });

    if (!activeLedger) {
      return errorResponse(res, "未找到激活的账本");
    }

    // 获取当前日期
    const startOfMonth = moment().startOf("month").toDate();
    const endOfMonth = moment().endOf("month").toDate();

    // 查找当前激活账本的账单记录，仅限当月
    const ledgerEntries = await LedgerEntry.findAll({
      where: {
        ledger_id: activeLedger.id,
        entered_by: openid,
        record_date: {
          [Op.between]: [startOfMonth, endOfMonth], // 仅限当月
        },
        deleted_at: null,
      },
      order: [["record_date", "DESC"]],
    });

    if (!ledgerEntries || ledgerEntries.length === 0) {
      return successResponse(res, {
        entries: [],
        totalMonthlyExpenses: 0,
        totalMonthlyIncome: 0,
      });
    }

    // 计算本月总支出
    const totalMonthlyExpenses = await LedgerEntry.sum("amount", {
      where: {
        ledger_id: activeLedger.id,
        entered_by: openid,
        type: 0, // 支出类型
        record_date: {
          [Op.between]: [startOfMonth, endOfMonth],
        },
        deleted_at: null,
      },
    });

    // 计算本月总收入
    const totalMonthlyIncome = await LedgerEntry.sum("amount", {
      where: {
        ledger_id: activeLedger.id,
        entered_by: openid,
        type: 1, // 收入类型
        record_date: {
          [Op.between]: [startOfMonth, endOfMonth],
        },
        deleted_at: null,
      },
    });

    // 格式化 record_date
    const formattedEntries = ledgerEntries.map((entry) => ({
      ...entry.toJSON(),
      record_date: moment(entry.record_date).format("YYYY-MM-DD HH:mm:ss"),
    }));

    // 返回账单记录信息、本月总支出和本月总收入
    successResponse(res, {
      entries: formattedEntries,
      totalMonthlyExpenses: parseFloat(totalMonthlyExpenses) || 0,
      totalMonthlyIncome: parseFloat(totalMonthlyIncome) || 0,
    });
  } catch (error) {
    console.error("获取账单记录失败:", error);
    errorResponse(res, "获取账单记录失败，请稍后再试");
  }
};

/**
 * 获取本月的账单支出，并合并每天的数据
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
const getMonthlyExpenses = async (req, res) => {
  try {
    const { openid } = req.user; // 从请求头获取用户openid

    // 获取当前激活的账本
    const activeLedger = await Ledger.findOne({
      where: { openid, is_active: true, deleted_at: null },
    });

    if (!activeLedger) {
      return errorResponse(res, "未找到激活的账本");
    }

    // 获取当前日期
    const startOfMonth = moment().startOf("month").toDate();
    const endOfMonth = moment().endOf("month").toDate();

    // 查询本月的支出记录
    const ledgerEntries = await LedgerEntry.findAll({
      where: {
        ledger_id: activeLedger.id,
        entered_by: openid,
        type: 0,
        record_date: {
          [Op.between]: [startOfMonth, endOfMonth],
        },
        deleted_at: null,
      },
      attributes: [
        [sequelize.fn("date", sequelize.col("record_date")), "date"],
        [sequelize.fn("sum", sequelize.col("amount")), "total_amount"],
      ],
      group: ["date"],
      order: [["date", "ASC"]],
    });

    // 格式化结果
    const formattedEntries = ledgerEntries.map((entry) => ({
      date: entry.get("date"),
      value: parseFloat(entry.get("total_amount")),
    }));

    // 返回结果
    successResponse(res, formattedEntries);
  } catch (error) {
    console.error("获取本月账单支出失败:", error);
    errorResponse(res, "获取本月账单支出失败，请稍后再试");
  }
};

module.exports = {
  create,
  getLedgerEntries,
  getMonthlyExpenses,
};
