const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const SystemConst = require('../common/consts/system_const');
dotenv.config();
// Tạo token
const secretToken = process.env.ACCESS_TOKEN_SECRET;
const createToken = (user)=> jwt.sign(user, secretToken, { expiresIn: SystemConst.EXPIRES_IN });

module.exports = createToken;