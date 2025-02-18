const {  DataTypes } = require('sequelize');
const sequelize = require("../config/db"); // 导入数据库配置

// 定义家庭模型
const Family = sequelize.define('Family', {
    // 家庭 ID，自增主键
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,  // 自动递增
        allowNull: false,  // 不能为空
    },
    // 家庭名称，最大长度 100 字符
    family_name: {
        type: DataTypes.STRING(100),
        allowNull: true,  // 允许为空
    },
    // 家庭描述1
    description1: {
        type: DataTypes.TEXT,
        allowNull: true,  // 允许为空
    },
    // 家庭描述2
    description2: {
        type: DataTypes.TEXT,
        allowNull: true,  // 允许为空
    },
}, {
    tableName: 'families',
    schema: 'cbook',     // 指定 schema
    timestamps: true,  // 启用自动管理时间戳
    underscored: true,  // 字段名使用下划线风格
});

// 导出 Family 模型供其他文件使用
module.exports = Family;
