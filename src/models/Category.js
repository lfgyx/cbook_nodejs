const {  DataTypes } = require('sequelize');
const sequelize = require("../config/db"); // 导入数据库配置

// 定义分类模型
const Category = sequelize.define('Category', {
    // 分类 ID，自增主键
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,  // 自动递增
        allowNull: false,  // 不能为空
    },
    // 用户 openid，外键
    openid: {
        type: DataTypes.STRING(128),
        allowNull: false,  // 不能为空
    },
    // 分类名称，最大长度 255 字符
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,  // 不能为空
    },
    // 分类图标，最大长度 2048 字符
    icon: {
        type: DataTypes.STRING(2048),
        allowNull: true,  // 允许为空
    },
    // 使用时间（可为空）
    used_at: {
        type: DataTypes.DATE,
        allowNull: true,  // 允许为空
    },
}, {
    tableName: 'categories',
    schema: 'cbook',     // 指定 schema
    timestamps: true,  // 启用自动管理时间戳
    underscored: true,  // 字段名使用下划线风格
});

// 导出 Category 模型供其他文件使用
module.exports = Category;
