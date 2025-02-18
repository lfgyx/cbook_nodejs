/**
 * 统一响应格式
 * @param {Object} res - Express 的响应对象
 * @param {number} code - 返回的状态码
 * @param {string} message - 返回的提示信息
 * @param {Object|null} data - 返回的数据
 */
const jsonResponse = (res, code, message, data = null) => {
    res.json({
        code,
        message,
        data,
    });
};

/**
 * 返回成功的响应
 * @param {Object} res - Express 的响应对象
 * @param {Object|null} data - 返回的数据
 * @param {string} message - 成功提示信息
 */
const successResponse = (res, data = null, message = "操作成功") => {
    jsonResponse(res, 200, message, data);
};

/**
 * 返回失败的响应
 * @param {Object} res - Express 的响应对象
 * @param {number} code - 错误码
 * @param {string} message - 错误提示信息
 * @param {Object|null} data - 返回的数据
 */
const errorResponse = (res, message = "操作失败", data = null, code = 500) => {
    jsonResponse(res, code, message, data);
};

module.exports = {
    successResponse,
    errorResponse,
};
