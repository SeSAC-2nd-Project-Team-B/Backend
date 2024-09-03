const express = require("express");
const router = express.Router();
const controller = require("../controller/user/Creview");
const { authenticate, adminOrUser, admin } = require("../middleware/auth");


// 기본 요청 경로 localhost:PORT/review

// 리뷰 생성
router.post(`/`, authenticate(adminOrUser), controller.postReview);

// 특정 유저의 리뷰 목록 조회 (판매자 또는 구매자 기준)
// localhost:PORT/review/1?type=seller (userId = 1인 유저의 상점에 작성된 리뷰)
// localhost:PORT/review/1?type=buyer (userId = 1인 유저가 작성한 리뷰)
router.get(`/list/:userId`, authenticate(adminOrUser), controller.getReviewListByUserId);

// 특정 리뷰 한개 조회
router.get(`/:reviewId`, authenticate(adminOrUser), controller.getReview);

// 리뷰 전체 목록 조회
router.get(`/list`, authenticate(admin), controller.getReviewList);

// 특정 리뷰 수정
router.patch(`/:reviewId`, authenticate(adminOrUser), controller.patchReview);

// 특정 리뷰 삭제
router.delete(`/:reviewId`, authenticate(adminOrUser), controller.deleteReview);

module.exports = router;