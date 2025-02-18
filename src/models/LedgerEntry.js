const {  DataTypes } = require('sequelize');
const sequelize = require("../config/db"); // 导入数据库配置

// 定义账单条目模型
const LedgerEntry = sequelize.define('LedgerEntry', {
    // 账单条目 ID，自增主键
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,  // 自动递增
        allowNull: false,  // 不能为空
    },
    // 账本 ID，外键
    ledger_id: {
        type: DataTypes.INTEGER,
        allowNull: false,  // 不能为空
    },
    // 分类名称，外键
    category_name: {
        type: DataTypes.STRING(255), // 使用字符串类型存储分类名称
        allowNull: false, // 不能为空
    },
    // 类型，区分收入和支出等
    type: {
        type: DataTypes.INTEGER,
        allowNull: false,  // 不能为空
    },
    // 金额，最多保留两位小数
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,  // 不能为空
    },
    // 记录日期
    record_date: {
        type: DataTypes.DATE,  // 使用 DATE 类型
        allowNull: false,  // 不能为空
    },
    // 描述，可以为空
    description: {
        type: DataTypes.TEXT,
        allowNull: true,  // 允许为空
    },
    // 输入者（openID）
    entered_by: {
        type: DataTypes.STRING(128),
        allowNull: false,  // 不能为空
    }
}, {
    tableName: 'ledger_entries',
    schema: 'cbook',     // 指定 schema
    timestamps: true,  // 启用自动管理时间戳
    paranoid: true,    // 启用软删除
    underscored: true,  // 字段名使用下划线风格
});

// 导出 LedgerEntry 模型供其他文件使用
module.exports = LedgerEntry;
