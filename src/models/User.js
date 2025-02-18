// 导入 Sequelize 数据类型
const { DataTypes } = require("sequelize");
// 导入数据库配置
const sequelize = require("../config/db");

// 定义用户模型
const User = sequelize.define(
  "User",
  {
    // 用户唯一标识符：openid，作为主键，最大长度为 128 字符，不能为空
    openid: {
      type: DataTypes.STRING(128),
      primaryKey: true, // 设置 openid 为主键
      allowNull: false, // 不能为空
    },
    // 用户昵称：最大长度为 100 字符，可以为空
    nick_name: {
      type: DataTypes.STRING(100),
      allowNull: true, // 允许为空
    },
    // 用户头像 URL：最大长度为 2048 字符，可以为空
    avatar_url: {
      type: DataTypes.STRING(2048),
      allowNull: true, // 允许为空
    },
    // 用户性别：使用 SMALLINT 类型，可以为空
    gender: {
      type: DataTypes.SMALLINT,
      allowNull: true, // 允许为空
    },
    // 用户所在国家：最大长度为 100 字符，可以为空
    country: {
      type: DataTypes.STRING(100),
      allowNull: true, // 允许为空
    },
    // 用户所在省份：最大长度为 100 字符，可以为空
    province: {
      type: DataTypes.STRING(100),
      allowNull: true, // 允许为空
    },
    // 用户所在城市：最大长度为 100 字符，可以为空
    city: {
      type: DataTypes.STRING(100),
      allowNull: true, // 允许为空
    },
    // 用户语言：最大长度为 50 字符，可以为空
    language: {
      type: DataTypes.STRING(50),
      allowNull: true, // 允许为空
    },
  },
  {
    // 配置模型的其他选项
    tableName: "users", // 指定数据库表名为 'users'
    schema: "cbook", // 指定 schema 为 'cbook'
    timestamps: true, // 启用自动时间戳（自动管理 createdAt 和 updatedAt 字段）
    underscored: true, // 字段名使用下划线风格（例如：created_at，而不是 createdAt）
  }
);

// 导出 User 模型供其他文件使用
module.exports = User;
