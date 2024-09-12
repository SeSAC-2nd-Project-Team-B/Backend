const express = require('express');
const router = express.Router();
const controller = require('../controller/product/Cproduct');
const likesController = require('../service/likesService');
const reportController = require('../service/reportService');
const utilController = require('../utils/apiHandler');
const { postUpProductImage } = require('../middleware/uploadImgProductMiddleware');
const { authenticate, adminOrUser, admin } = require('../middleware/auth');

// 기본 요청 경로 localhost:PORT/product

// 새상품 정보 받아오기
router.get('/search/api', utilController.getNproductPrice);

// 검색 버튼 클릭시 -닉네임/상품 선택하여 검색 가능
router.post('/search', controller.postSearch);

// 전체 상품 리스트
router.get('/list', controller.getProductList);

// 상품 상세 페이지
router.get('/read', controller.getProduct);

// 상품 작성 페이지
router.get('/write', authenticate(adminOrUser), controller.getProductWrite);

// 상품 등록 버튼 클릭시
router.post('/write', authenticate(adminOrUser), postUpProductImage, controller.postProduct);

// 특정 상품 수정 페이지
router.get('/update', authenticate(adminOrUser), controller.getProductUpdate);

// 특정 상품 수정 버튼 클릭시
router.post('/update', authenticate(adminOrUser), postUpProductImage, controller.postProductUpdate);

// 특정 상품 삭제
router.delete('/delete', authenticate(adminOrUser), controller.deleteProduct);

// 상품별 찜 - 전체 개수 조회
router.get('/likes', authenticate(adminOrUser), likesController.getLikes);

// 상품 페이지 - 찜 버튼 클릭시
router.post('/likes', authenticate(adminOrUser), likesController.postLikes);

// 상품 페이지 - 신고 버튼 클릭시
router.post('/report', authenticate(adminOrUser), reportController.postReportProduct);

// 안전거래 버튼 클릭시
router.get('/order', authenticate(adminOrUser), controller.getOrder);

// 카테고리
router.get('/category', controller.postCategory);

module.exports = router;
