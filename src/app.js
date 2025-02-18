const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const redisClient = require("./config/redis"); // 如果有 Redis 客户端初始化
const ledgerRoutes = require("./routes/ledgerRoutes");
const familyRoutes = require("./routes/familyRoutes");
const ledgerEntryRoutes = require("./routes/ledgerEntryRoutes"); // 添加账目记录路由
const tokenValidator = require("./middlewares/tokenValidator");

const app = express();

// 中间件设置
app.use(cors()); // 允许跨域
app.use(bodyParser.json()); // 解析 JSON 请求体
app.use(bodyParser.urlencoded({ extended: true })); // 解析 URL 编码的请求体

// Redis 初始化（如果需要）
redisClient.on("connect", () => {
  console.log("Redis client connected");
});
redisClient.on("error", (err) => {
  console.error("Redis error: ", err);
});

// 全局中间件：日志记录
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// 路由设置
// 登录相关的路由
app.use("/auth", authRoutes);
// 用户相关的路由
app.use("/users", tokenValidator, userRoutes);
// 分类相关的路由
app.use("/categories", tokenValidator, categoryRoutes);
// 账本相关的路由
app.use("/ledgers", tokenValidator, ledgerRoutes);
// 账目记录相关的路由
app.use("/ledgerEntries", tokenValidator, ledgerEntryRoutes);
// 账目记录相关的路由
app.use("/family", tokenValidator, familyRoutes);

// 捕获 404 错误
app.use((req, res, next) => {
  res.status(404).json({ error: "404 Not Found" });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 服务器启动
const PORT = process.env.PORT || 3000;
const IP = "0.0.0.0";
app.listen(PORT, IP, () => {
  console.log(`Server is running : http://${IP}:${PORT}`);
});
