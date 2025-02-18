const {  DataTypes } = require('sequelize');
const sequelize = require("../config/db"); // 导入数据库配置

// 定义账本模型
const Ledger = sequelize.define('Ledger', {
    // 账本 ID，自增主键
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
    // 账本名称，最大长度 255 字符
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,  // 不能为空
    },
    // 账本图标，最大长度 255 字符
    icon: {
        type: DataTypes.STRING(255),
        allowNull: true,  // 允许为空
    },
    // 是否激活，默认为 false
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,  // 默认为不激活
        allowNull: false,  // 不能为空
    }
}, {
    tableName: 'ledgers',
    schema: 'cbook',     // 指定 schema
    timestamps: true,  // 启用自动管理时间戳
    paranoid: true,    // 启用软删除
    underscored: true,  // 字段名使用下划线风格
});

// 导出 Ledger 模型供其他文件使用
module.exports = Ledger;
