const express = require('express');
const controller = require('../controller/product/Cproduct');
const likesController = require('../service/likesService');
const reportController = require('../service/reportService');
const utilController = require('../utils/apiHandler');
const { postUpProductImage } = require('../middleware/uploadImgProductMiddleware');
const router = express.Router();

// 기본 요청 경로 localhost:PORT/product

router.get('/search/api', utilController.getNproductPrice);

// 검색 버튼 클릭시
router.post('/search', controller.postSearch);

// 전체 상품 리스트
router.get('/list', controller.getProductList);

// 상품 상세 페이지
router.get('/read', controller.getProduct);

// 상품 작성 페이지
router.get('/write', controller.getProductWrite);

// 상품 등록 버튼 클릭시
router.post('/write', postUpProductImage, controller.postProduct);

// 특정 상품 수정 페이지
router.get('/update', controller.getProductUpdate);

// 특정 상품 수정 버튼 클릭시
router.patch('/update', controller.patchProductUpdate);

// 특정 상품 삭제
router.delete('/delete', controller.deleteProduct);

// 상품별 찜 - 전체 개수 조회
router.get('/likes', likesController.getLikes);

// 상품 페이지 - 찜 버튼 클릭시
router.post('/likes', likesController.postLikes);

// 상품 페이지 - 신고 버튼 클릭시
router.post('/report', reportController.postReportProduct);

// 안전거래 버튼 클릭시
router.get('/order', controller.getOrder);

// 카테고리
router.get('/category',controller.postCategory);

module.exports = router;
