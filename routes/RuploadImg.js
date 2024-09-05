const express = require("express");
const router = express.Router();
const controller = require("../controller/user/CuploadImg");
const { upload } = require("../middleware/uploadImgMiddleware");
const { authenticate, adminOrUser, admin } = require("../middleware/auth");

// 기본 요청 경로 localhost:PORT/uploadImg

// S3 사진 업로드
router.post(`/:type/:userId`, upload.single('profileImg'), controller.postImg);

// S3 사진 조회
router.get(`/:type/:userId`, controller.getImg);

// S3 사진 삭제
router.delete(`/:type/:userId`, controller.deleteImg);


module.exports = router;