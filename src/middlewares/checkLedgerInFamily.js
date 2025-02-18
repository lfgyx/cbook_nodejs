const { Ledger, FamilyMember } = require('../models');  // 根据你的模型路径调整

/**
 * 中间件：检查当前账本是否属于当前用户所属的家庭
 */
const checkLedgerInFamily = async (req, res, next) => {
    try {
        const { openid } = req.user;  // 当前用户的 openid
        const { ledgerId } = req.params;  // 从请求中获取账本ID

        // 查找账本，确认账本是否属于当前用户所属的家庭
        const ledger = await Ledger.findOne({
            where: { id: ledgerId },
        });

        if (!ledger) {
            return res.status(404).json({ message: '账本不存在' });
        }

        // 查找家庭成员，确认当前用户是否是该账本所属家庭的一员
        const familyMember = await FamilyMember.findOne({
            where: { family_id: ledger.family_id, openid },
        });

        if (!familyMember) {
            return res.status(403).json({ message: '当前账本不属于您所属的家庭' });
        }

        // 账本属于该家庭，继续执行后续操作
        next();
    } catch (error) {
        console.error('检查账本是否属于家庭时出错:', error);
        res.status(500).json({ message: '服务器内部错误' });
    }
};

module.exports = checkLedgerInFamily;
