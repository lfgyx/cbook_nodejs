// createAdmin.js

const bcrypt = require('bcrypt');
const User = require('../src/models/User');  // 导入 User 模型

// 密码加密
const hashPassword = async (password) => {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
};

// 创建管理员用户
const createAdminUser = async () => {
  const adminData = {
    username: 'lf',   // 设置管理员的用户名
    email: 'lfgyx@outlook.com',  // 设置管理员的邮箱
    password_hash: await hashPassword('1026l5211314'),  // 设置加密后的密码
    is_admin: true,  // 设置该用户为管理员
  };

  try {
    const adminUser = await User.create(adminData);
    console.log('Admin user created:', adminUser);
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

// 执行脚本
createAdminUser();
