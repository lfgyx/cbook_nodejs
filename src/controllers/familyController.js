const { v4: uuidv4 } = require("uuid");
const redisClient = require("../config/redis"); // 引入 Redis 客户端
const { FamilyMember, Family, User } = require("../models"); // 从 models/index.js 统一引入模型
const { successResponse, errorResponse } = require("../utils/responseHelper"); // 引入响应工具

/**
 * 生成邀请码
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
const generateInviteCode = async (req, res) => {
  try {
    const { openid } = req.user;

    // 查找当前用户的家庭
    const familyMember = await FamilyMember.findOne({
      where: { openid },
      include: [{ model: Family, as: "family" }],
    });

    if (!familyMember) {
      return errorResponse(res, "您不属于任何家庭");
    }

    // 生成唯一的邀请码
    const inviteCode = uuidv4();

    // 将邀请码存储到 Redis，设置有效期为2小时（7200秒）
    redisClient.set(
      `invite:${inviteCode}`,
      7200,
      JSON.stringify({
        family_id: familyMember.family.id,
        used: false,
      })
    );

    // 返回邀请码
    successResponse(res, { inviteCode });
  } catch (error) {
    console.error("生成邀请码失败:", error);
    errorResponse(res, "生成邀请码失败，请稍后再试");
  }
};

/**
 * 通过邀请码加入家庭
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
const joinFamilyByInvite = async (req, res) => {
  try {
    const { openid } = req.user;
    const { inviteCode, avatarUrl, nickName } = req.body;

    // 从 Redis 中查找邀请码
    redisClient.get(`invite:${inviteCode}`, async (err, data) => {
      if (err || !data) {
        return errorResponse(res, "邀请码无效或已过期");
      }

      const invite = JSON.parse(data);

      if (invite.used) {
        return errorResponse(res, "邀请码已被使用");
      }

      // 将用户加入家庭
      await FamilyMember.create({
        family_id: invite.family_id,
        openid,
        avatar_url: avatarUrl,
        nick_name: nickName,
        is_admin: false, // 默认不是管理员
      });

      // 标记邀请码为已使用
      invite.used = true;
      redisClient.set(`invite:${inviteCode}`, JSON.stringify(invite));

      // 返回成功响应
      successResponse(res, { message: "成功加入家庭" });
    });
  } catch (error) {
    console.error("通过邀请码加入家庭失败:", error);
    errorResponse(res, "通过邀请码加入家庭失败，请稍后再试");
  }
};

/**
 * 查询家庭成员
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
const getFamilyMembers = async (req, res) => {
  try {
    const { openid } = req.user;

    // 查找当前用户的家庭
    const familyMember = await FamilyMember.findOne({
      where: { openid },
      include: [{ model: Family, as: 'family' }],
    });

    if (!familyMember) {
      return errorResponse(res, '您不属于任何家庭');
    }

    // 查询家庭的所有成员，并关联 User 表
    const familyMembers = await FamilyMember.findAll({
      where: { family_id: familyMember.family.id },
      include: [{
        model: User,
        as: 'user', // 使用指定的别名
        attributes: ['openid', 'nick_name', 'avatar_url', 'gender', 'country', 'province', 'city', 'language'], // 选择需要返回的字段
      }],
    });

    // 格式化返回结果
    const formattedMembers = familyMembers.map(member => ({
      nick_name: member.user.nick_name,
      avatar_url: member.user.avatar_url,
      gender: member.user.gender,
      country: member.user.country,
      province: member.user.province,
      city: member.user.city,
      language: member.user.language,
      is_admin: member.is_admin,
    }));

    // 返回家庭成员信息
    successResponse(res, formattedMembers);
  } catch (error) {
    console.error('查询家庭成员失败:', error);
    errorResponse(res, '查询家庭成员失败，请稍后再试');
  }
};

module.exports = {
  generateInviteCode,
  joinFamilyByInvite,
  getFamilyMembers,
};
