const Ledger = require('../models/Ledger');  // 引入 Ledger 模型
const Family = require('../models/Family');  // 引入 Family 模型
const FamilyMember = require('../models/FamilyMember');  // 引入 FamilyMember 模型
const { successResponse, errorResponse } = require('../utils/responseHelper');
const { Op } = require('sequelize');  // 引入 Op 操作符

/**
 * 根据当前登录用户获取相应的账本
 */
const getUserLedger = async (req, res) => {
    try {
        const { openid } = req.user;  // 获取当前登录用户的 openid

        // 查找当前登录用户的账本
        const ledger = await Ledger.findAll({
            where: { openid: openid, deleted_at: null },  // 使用 openid 查找该用户下未删除的账本
            order: [['createdAt', 'ASC']]  // 按照创建日期升序排列
        });

        if (!ledger || ledger.length === 0) {
            return errorResponse(res, '未找到账本');
        }

        // 返回账本信息
        successResponse(res, ledger);
    } catch (error) {
        console.error('获取账本失败:', error);
        errorResponse(res, '获取账本失败，请稍后再试');
    }
};


const addLedger = async (req, res) => {
    try {
        const { openid } = req.user;  // 获取当前登录用户的 openid
        const { name } = req.body;  // 获取账本名称

        // 参数校验
        if (!name) {
            return errorResponse(res, '账本名称不能为空');
        }

        // 先将用户下的所有账本的 is_active 设置为 false
        await Ledger.update(
            { is_active: false },
            { where: { openid: openid, deleted_at: null } }
        );

        // 创建新的账本
        const ledger = await Ledger.create({
            openid: openid,  // 关联到当前用户
            name,
            is_active: true,  // 默认新创建的账本为激活状态
        });

        await ledger.save();

        const ledgers = await Ledger.findAll({
            where: { openid: openid, deleted_at: null },
            order: [['createdAt', 'ASC']]  // 按照创建日期升序排列
        });

        successResponse(res, ledgers);
    } catch (error) {
        console.error('创建账本失败:', error);
        errorResponse(res, '创建账本失败，请稍后再试');
    }
};



/**
 * 删除账本
 */
const deleteLedger = async (req, res) => {
    try {
        const { ledgerId } = req.query;  // 使用 query 参数获取账本 ID
        const { openid } = req.user;      // 获取当前用户的 openid

        // 获取账本信息
        const ledger = await Ledger.findOne({ where: { id: ledgerId } });

        if (!ledger) {
            return errorResponse(res, '账本不存在')
        }

        // 查找账本所属的家庭ID
        if (ledger.openid !== openid) {
            return errorResponse(res, '您没有权限删除此账本')
        }

        // 获取账本信息
        const ledgerNum = await Ledger.findAll({ where: { openid } });

        if (ledgerNum.length <= 1) {
            return errorResponse(res, '只剩一个账本不允许删除')
        }


        // 如果要删除的是激活账本，则需要设置其他账本为激活状态
        if (ledger.is_active) {
            // 查找同一家庭下的另一个账本并设置为激活账本
            const otherLedger = await Ledger.findOne({
                where: { openid, is_active: false },
                order: [['createdAt', 'ASC']]  // 选取一个最早创建的账本（可以根据实际需求进行修改）
            });

            if (otherLedger) {
                // 将其他账本设置为激活
                otherLedger.is_active = true;
                await otherLedger.save();
            }
        }

        // 执行删除账本
        await ledger.destroy();

        const ledgers = await Ledger.findAll({
            where: { openid },
            order: [['createdAt', 'ASC']]  // 按照创建日期升序排列
        })

        successResponse(res, ledgers);
    } catch (error) {
        console.error('删除账本失败:', error);
        errorResponse(res, '删除账本失败，请稍后再试');
    }
};

/**
 * 修改 Ledger 的 is_active 字段
 */
const updateLedgerStatus = async (req, res) => {
    try {
        const { ledgerId, isActive } = req.body;  // 获取账本 ID 和是否激活的状态
        const { openid } = req.user;      // 获取当前用户的 openid

        // 校验参数
        if (typeof isActive !== 'boolean') {
            return errorResponse(res, 'isActive 必须是布尔值');
        }

        // 查找账本
        const ledger = await Ledger.findOne({
            where: { id: ledgerId },
        });

        if (!ledger) {
            return errorResponse(res, '账本不存在');
        }


        if (ledger.openid !== openid) {
            return errorResponse(res, '您没有权限修改此账本')
        }

        // 如果要激活一个账本，首先需要将家庭中所有其他账本的 is_active 设置为 false
        if (isActive) {
            await Ledger.update(
                { is_active: false },  // 设置其他账本为非激活状态
                { where: { openid, id: { [Op.ne]: ledgerId } } }  // 排除当前账本
            );
        }

        // 更新 is_active 字段
        ledger.is_active = isActive;
        await ledger.save();


        const ledgers = await Ledger.findAll({
            where: { openid },
            order: [['createdAt', 'ASC']]  // 按照创建日期升序排列
        })
        successResponse(res, ledgers);
    } catch (error) {
        console.error('修改账本状态失败:', error);
        errorResponse(res, '修改账本状态失败，请稍后再试');
    }
};


module.exports = {
    getUserLedger,
    addLedger,
    deleteLedger,
    updateLedgerStatus
};
