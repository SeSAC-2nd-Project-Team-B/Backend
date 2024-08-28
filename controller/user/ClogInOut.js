const db = require('../../models/Index');
const { User } = require('../../models/user/UserModel');
const jwt = require("jsonwebtoken");
const encUtil = require("../../utils/encrypt");


// 로그인
exports.userLogin = async (req, res) => {
    try {
        const { email, currentPassword } = req.body;
  
        // 아이디로 회원 찾기
        const user = await User.findOne({ where: { email } });

        if (!user) return res.status(401).json({ message: "아이디 또는 비밀번호가 틀렸습니다." });

        // 비밀번호 비교
        const isMatch = await encUtil.comparePw(currentPassword, user.password);

        if (!isMatch) return res.status(401).json({ message: "아이디 또는 비밀번호가 틀렸습니다." });
        

        res.json({ message: user, });

    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: '서버 오류', err: err.message });
    }
};


// 로그아웃
exports.userLogout = async (req, res) => {
    try {
        
        res.status(200).json({ message: "로그아웃 되었습니다." });
        
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: '서버 오류', err: err.message });
    }

  };
  