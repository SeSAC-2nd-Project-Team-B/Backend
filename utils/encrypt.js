const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
  path: path.resolve(__dirname, `../.env`),
});

const saltN = parseInt(process.env.SALTROUND, 10); //2^10 회 반복

// 비밀번호 해싱
exports.hashPw = (password) => {
    return bcrypt.hashSync(password, saltN);
};

// 평문 비밀번호와 해싱 비밀번호 비교
exports.comparePw = (password, originalPW) => {
  return bcrypt.compareSync(password, originalPW);
};