module.exports = (err, req, res, next) => {
    console.error("에러 발생:", err.message);
    
    // multer
    if (err.message === '유효하지 않은 type 입니다.') {
        return res.status(400).json({ errorMessage: err.message });
    }

    
    return res.status(500).json({ errorMessage: '서버 오류가 발생했습니다.' });
};