const axios = require('axios');
const APPID = process.env.APPID;
const APPSECRET = process.env.APPSECRET;

const loginWithCode = async (code) => {
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${APPID}&secret=${APPSECRET}&js_code=${code}&grant_type=authorization_code`;
    const response = await axios.get(url);
    const { openid, session_key, errcode, errmsg } = response.data;

    if (errcode) throw new Error(errmsg);
    return { openid, session_key };
};

module.exports = { loginWithCode };
