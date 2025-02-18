const {  DataTypes } = require('sequelize');
const sequelize = require("../config/db"); // 导入数据库配置

// 定义家庭成员模型
const FamilyMember = sequelize.define('FamilyMember', {
    // 家庭成员 ID，自增主键
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
    // 家庭 ID，外键
    family_id: {
        type: DataTypes.INTEGER,
        allowNull: false,  // 不能为空
    },
    // 是否为管理员
    is_admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,  // 默认为非管理员
        allowNull: false,  // 不能为空
    },
}, {
    tableName: 'family_members',
    schema: 'cbook',     // 指定 schema
    timestamps: true,  // 启用自动管理时间戳
    underscored: true,  // 字段名使用下划线风格
});

// 导出 FamilyMember 模型供其他文件使用
module.exports = FamilyMember;
