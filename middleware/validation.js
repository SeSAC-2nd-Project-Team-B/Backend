const { User } = require("../models/Index");
const { check, validationResult } = require("express-validator");

// 이메일 중복 체크
exports.checkEmail = async (req, res) => {
    const { email } = req.body;
    const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail) {
        return res.status(409).json({ message: "이미 사용중인 이메일입니다." });
      }
  }
    
  // 닉네임 중복 체크
  exports.checkNickname = async (req, res) => {
    const { nickname } = req.body;
    const existingNickname = await User.findOne({ where: { nickname } });
      if (existingNickname) {
        return res.status(409).json({ message: "이미 사용중인 닉네임입니다." });
      }
  }

// 회원가입 시 유효성 검사
exports.validation = async (req, res, next) => {
    try {
        const { nickname, email } = req.body;

        // 닉네임 중복 체크
        const existingNickname = await User.findOne({ where: { nickname } });
        if (existingNickname) {
            return res.status(409).json({ message: "이미 사용중인 닉네임입니다." });
        }

        // 이메일 중복 체크
        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) {
            return res.status(409).json({ message: "이미 사용중인 이메일입니다." });
        }

        await check('email').isEmail().withMessage('유효한 이메일을 입력하세요.').run(req);
        await check('password').isLength({ min: 6 })
                .withMessage('비밀번호는 최소 6자리 이상이어야 합니다.')
                .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('비밀번호에는 최소 하나의 특수문자가 포함되어야 합니다.')
                .matches(/[0-9]/).withMessage('비밀번호에는 최소 하나의 숫자가 포함되어야 합니다.')
                .matches(/[A-Z]/).withMessage('비밀번호에는 최소 하나의 대문자가 포함되어야 합니다.')
                .matches(/[a-z]/).withMessage('비밀번호에는 최소 하나의 소문자가 포함되어야 합니다.')
                .run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        next();
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: '서버 오류', err: err.message });
    }
};
