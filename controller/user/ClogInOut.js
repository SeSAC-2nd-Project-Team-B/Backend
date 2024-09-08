const db = require('../../models/Index');
const { User, Location, Active } = require('../../models/Index');
const encUtil = require("../../utils/encrypt");
const auth = require('../../middleware/auth');

// 로그인
exports.userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
  
        // 이메일로 회원 찾기
        const user = await User.findOne({ 
            where: { email }, 
            include: [
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

        // JWT 토큰 생성
        const token = auth.createToken(user.userId, user.Active.isActive, user.Active.isAdmin);

        res.json({ message: '로그인 성공', user, token: `Bearer ${token}` });

    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: '서버 오류', err: err.message });
    }
};

// 로그아웃
exports.userLogout = async (req, res) => {
    try {
        // 로그아웃 시 서버에서 특별한 처리가 필요 없음 (클라이언트가 토큰을 삭제하면 됨)
        res.status(200).json({ message: "로그아웃 성공. 클라이언트에서 토큰을 삭제하세요." });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: '서버 오류', err: err.message });
    }
};