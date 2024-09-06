const express = require('express');
const router = express.Router();
const controller = require("../controller/user/CuploadImg");
const pro_controller = require('../controller/product/Cproduct');
const { upload, postUploadFile } = require("../middleware/uploadImgMiddleware");

// 기본 요청 경로 localhost:PORT/test

// user s3 test 용 ejs 기본 접속 주소 // http://localhost:8000/test/views/user/1
router.get('/views/:type/:userId', (req, res) => {
    const type = req.params.type;
    const userId = req.params.userId; 
    res.render('index', { type, userId, profileImgUrl: '', errorMessage: null });
});

// s3 post 테스트
router.post('/post/:type/:userId', upload.single('profileImg'), controller.s3ImgPostTest);

// // s3 get 테스트
// router.get('/test/get/:userId', controller.s3ImgGetTest);

// // s3 delete 테스트
// router.get('/test/delete/:userId', controller.s3ImgDeleteTest);


// test/product/write
router.get('/product/write', (req, res) => {

    res.render('index', { type : 'product', userId : 1, profileImgUrl: '', errorMessage: null });
});

router.post('/product/write' , postUploadFile, pro_controller.postProduct )

module.exports = router;