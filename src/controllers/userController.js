const { User, FamilyMember, Family, Ledger } = require("../models"); // 从 models/index.js 统一引入模型
const { successResponse, errorResponse } = require("../utils/responseHelper"); // 引入响应工具

/**
 * 更新用户的头像和昵称
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
const updateProfile = async (req, res) => {
  try {
    const { openid } = req.user;  // 从请求头解析 token 获取 openid
    const { avatar_url, nick_name } = req.body;  // 从请求体获取新头像和昵称

    // 校验输入数据，确保头像和昵称不为空
    if (!nick_name || !avatar_url) {
      return errorResponse(res, "头像和昵称不能为空");
    }

    // 查找当前用户信息
    const user = await User.findOne({ where: { openid } });
    if (!user) {
      return errorResponse(res, "用户不存在");
    }

    // 更新用户的头像和昵称
    user.avatar_url = avatar_url;
    user.nick_name = nick_name;
    await user.save();

    // 返回更新后的用户信息
    successResponse(res, {
      avatar_url: user.avatar_url,
      city: user.city,
      country: user.country,
      createdAt: user.createdAt,
      gender: user.gender,
      language: user.language,
      lastLoginAt: user.lastLoginAt,
      nick_name: user.nick_name,
      province: user.province,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    console.error("更新用户信息出错:", error);
    errorResponse(res, "更新用户信息失败，请稍后再试");
  }
};

/**
 * 获取用户的基本信息
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
const getUserInfo = async (req, res) => {
  try {
    const { openid } = req.user;  // 获取当前用户的 openid

    // 获取用户基本信息
    const user = await User.findOne({
      where: { openid },
      attributes: ["nick_name", "avatar_url", "gender", "country", "province", "city", "language"],
    });

    // 如果用户不存在，返回错误
    if (!user) {
      return errorResponse(successResponse, {});
    }

    // 返回用户信息
    successResponse(res, {
      nick_name: user.nick_name,
      avatar_url: user.avatar_url,
      gender: user.gender,
      country: user.country,
      province: user.province,
      city: user.city,
      language: user.language,
    });
  } catch (error) {
    console.error("获取用户信息失败:", error);
    errorResponse(res, "获取用户信息失败，请稍后再试");
  }
};

/**
 * 获取当前登录用户所属的家庭信息
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
const getUserFamily = async (req, res) => {
  try {
    const { openid } = req.user;  // 获取当前用户的 openid

    // 查找当前用户所属的家庭信息
    const familyMembers = await FamilyMember.findAll({
      where: { openid },
      include: [{
        model: Family,
        as: 'family'
      }]
    });

    // 如果没有找到家庭成员信息，返回空数组
    if (familyMembers.length === 0) {
      return successResponse(res, []);
    }

    // 获取家庭信息
    const families = familyMembers.map(member => member.family);

    // 返回家庭信息
    successResponse(res, families);
  } catch (error) {
    console.error("获取家庭信息失败:", error);
    errorResponse(res, "获取家庭信息失败，请稍后再试");
  }
};

/**
 * 添加或编辑家庭信息
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
const addOrEditFamily = async (req, res) => {
  try {
    const { openid } = req.user;  // 获取当前用户的 openid
    const { family_name, description1, description2, id } = req.body;  // 获取请求体中的家庭信息

    // 校验家庭名称是否为空
    if (!family_name) {
      return errorResponse(res, "家庭名称不能为空");
    }

    // 如果传入了家庭 id，执行更新操作
    if (id) {
      // 查找要更新的家庭
      const family = await Family.findOne({ where: { id } });

      // 如果找不到该家庭，返回错误
      if (!family) {
        return errorResponse(res, "家庭不存在");
      }

      // 更新家庭信息
      family.family_name = family_name;
      family.description1 = description1;
      family.description2 = description2;
      await family.save();

      // 返回更新后的家庭信息
      successResponse(res, {
        id: family.id,
        family_name: family.family_name,
        description1: family.description1,
        description2: family.description2,
        isAdmin: true,  // 当前用户是管理员
      });
      return;
    }

    // 如果没有传入 id，则执行创建家庭操作
    const family = await Family.create({
      family_name,
      description1,
      description2,
    });

    // 将当前用户添加为家庭成员，并设置为管理员
    await FamilyMember.create({
      family_id: family.id,
      openid,
      is_admin: true,  // 当前用户是家庭管理员
    });

    // 返回创建的家庭信息
    successResponse(res, {
      id: family.id,
      family_name: family.family_name,
      description1,
      description2,
      isAdmin: true,  // 当前用户是管理员
    });
  } catch (error) {
    console.error("创建或更新家庭失败:", error);
    errorResponse(res, "操作失败，请稍后再试");
  }
};

module.exports = {
  updateProfile,
  getUserFamily,
  addOrEditFamily,
  getUserInfo,
};
