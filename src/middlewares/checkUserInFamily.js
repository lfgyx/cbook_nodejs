const { FamilyMember } = require('../models');  // 根据你的模型路径调整

/**
 * 中间件：检查当前用户是否属于当前家庭
 */
const checkUserInFamily = async (req, res, next) => {
    try {
        const { openid } = req.user;  // 当前用户的 openid
        const { familyId } = req.params;  // 从请求中获取当前家庭ID

        // 查找家庭成员，确认当前用户是否属于该家庭
        const familyMember = await FamilyMember.findOne({
            where: { family_id: familyId, openid },
        });

        if (!familyMember) {
            return res.status(403).json({ message: '当前用户不属于该家庭' });
        }

        // 用户属于该家庭，继续执行后续操作
        next();
    } catch (error) {
        console.error('检查用户是否属于家庭时出错:', error);
        res.status(500).json({ message: '服务器内部错误' });
    }
};

module.exports = checkUserInFamily;
