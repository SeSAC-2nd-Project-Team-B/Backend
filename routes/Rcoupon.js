const express = require(`express`);
const router = express.Router();
const controller = require(`../controller/Ccoupon`);

// 기본 요청 경로 localhost:PORT/coupon

// 쿠폰 생성
router.post(`/`, controller.postCoupon);

// 전체 쿠폰 리스트 조회
router.get(`/`, controller.getCouponList);

// 특정 쿠폰 한개 조회
router.get(`/:couponId`, controller.getCoupon);

// 특정 유저 소유 쿠폰 목록 조회
router.get(`/:userId`, controller.getCouponListByUserId);

// 특정 쿠폰 내용 수정
router.patch(`/:couponId`, controller.patchCoupon);

// 특정 쿠폰 삭제
router.delete(`/:couponId`, controller.deleteCoupon);

module.exports = router;