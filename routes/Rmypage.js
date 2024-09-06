const express = require('express');
const controller = require('../controller/user/Cmypage');
const likesController = require('../service/likesService');
const reportController = require('../service/reportService');
const { authenticate, adminOrUser, admin } = require('../middleware/auth');

const router = express.Router();

// 마이페이지
// 기본 요청 경로 localhost:PORT/mypage

// 결제하기 버튼 클릭시
router.post('/payment', controller.postPayment);

// 구매 및 판매 내역
// router.post('/', authenticate(adminOrUser), controller.getBuyList)
router.post('/', controller.buySellLikesList);

// 판매 내역 - 상품 판매 수락/거절/발송완료
router.post('/issell', controller.postSellCheck);

// 구매 내역 - 상품 확인완료/거절
router.post('/check', controller.postProductCheck);

// 찜 내역 삭제
router.delete('/likesdelete', controller.deleteLikesDelete);

module.exports = router;
