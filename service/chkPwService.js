const { User } = require("../models/Index");
const encUtil = require("../utils/encrypt");

exports.chkPassword = async (req, res) => {
    const userId = req.params.userId;
    const password = req.body.password;

    try {
        // 존재하는 유저인지 확인
        const user = await User.findOne({ where: { userId } });
        if (!user) {
            return res.status(404).json({ success: false, message: '회원을 찾을 수 없습니다.' });
        }

        // 기존 비밀번호와 비교
        const isMatch = await encUtil.comparePw(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: '비밀번호가 일치하지 않습니다.' });
        }

        // 비밀번호가 일치하는 경우
        return res.status(200).json({ success: true, message: '비밀번호가 일치합니다.' });
    } catch (err) {
        return res.status(500).json({ success: false, message: '비밀번호 확인 중 오류가 발생했습니다.' });
    }
};



exports.chkPasswordInPatch = async (userId, password) => {

    try {
        // 존재하는 유저인지 확인
        const user = await User.findOne({ where: { userId } });
        if (!user) {
            return { success: false, message: '회원을 찾을 수 없습니다.' };
        }

        // 기존 비밀번호와 비교
        const isMatch = await encUtil.comparePw(password, user.password);
        if (!isMatch) {
            return { success: false, message: '비밀번호가 일치하지 않습니다.' };
        }

        return { success: true, message: '비밀번호가 일치합니다.' };
    } catch (err) {
        console.log("비밀번호 확인 중 오류가 발생했습니다.", err.message);
        return { success: false, message: '비밀번호 확인 중 오류가 발생했습니다.' };
    }
};