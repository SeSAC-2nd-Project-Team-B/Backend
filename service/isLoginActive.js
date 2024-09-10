// 유저 비활성화 여부 함수
const { Product } = require('../models/Index');

const isLoginUser = async(req, res) => {
    // const session = req.session;
    const userId = req.userId;
    console.log('login userId : ', userId);

    if (!userId) {
        res.status(401).json({ message: '로그인 내역이 존재하지 않습니다.' });
        return false;
    } else if (!req.isActive) {
        res.status(401).json({ message: '비활성화 된 계정입니다.' });
        return false;
    }
    return true;
}

// 작성자와 일치 조회
const isWriter = async (req, productId) => {
    // const session = req.session;
    const userId = req.userId;
    const isAdmin = req.isAdmin;

    const find = await Product.findOne({ where : { productId, userId } })
    console.log("find >> ", find);
    if (isAdmin || find) return true;
    else return false;
}

module.exports = { isLoginUser, isWriter };