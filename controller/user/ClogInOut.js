const db = require('../../models/Index');
const { User, Location, Active } = require('../../models/Index');
const jwt = require("jsonwebtoken");
const encUtil = require("../../utils/encrypt");
const auth = require('../../middleware/auth');


// 로그인
exports.userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
  
        // 아이디로 회원 찾기
        const user = await User.findOne({ 
            where: { email }, 
            include : [
            {
                model: Location,
                attributes: ['depth1', 'depth2', 'depth3', 'depth4']
            },
            {
                model: Active,
                attributes: ['isAdmin', 'isActive']
            }
            ]   
        });

        if (!user) return res.status(401).json({ message: "아이디 또는 비밀번호가 틀렸습니다." });

        // 비밀번호 비교
        const isMatch = await encUtil.comparePw(password, user.password);

        if (!isMatch) return res.status(401).json({ message: "아이디 또는 비밀번호가 틀렸습니다." });
        
        auth.createSession(req, user.userId, user.Active.isActive, user.Active.isAdmin);
        const token = auth.createToken(req.sessionID);

        res.json({ message: '로그인 성공', user, token: `Bearer ${token}`});

    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: '서버 오류', err: err.message });
    }
};



// 로그아웃
exports.userLogout = async (req, res) => {
    try {
        
        await auth.deleteSession(req, res);
        
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: '서버 오류', err: err.message });
    }
};