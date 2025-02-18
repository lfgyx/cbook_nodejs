// 引入 dotenv 库并加载 .env 文件
require('dotenv').config();

// 从环境变量中获取数据库连接信息
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME, // 数据库名
  process.env.DB_USER, // 用户名
  process.env.DB_PASSWORD, // 密码
  {
    host: process.env.DB_HOST, // 数据库主机
    port: process.env.DB_PORT, // 数据库端口
    dialect: 'postgres', // 使用 PostgreSQL 数据库
    timezone: '+08:00', // 设置时区为东八区（例如，中国标准时间）
    dialectOptions: {
      useUTC: false, // 不使用 UTC 时间
    },
    logging: false, // 禁用 SQL 查询日志
    define: {
      timestamps: true, // 自动添加 createdAt 和 updatedAt 字段
      underscored: true, // 使用下划线命名
    }
  }
);

module.exports = sequelize;
