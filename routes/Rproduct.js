const express = require('express');
const controller = require('../controller/product/Cproduct');
const router = express.Router();

// 기본 요청 경로 localhost:PORT/product

// 전체 상품 리스트
// router.get('/', controller.getProductList);

// 상품 상세 페이지
router.get('/:productId', controller.getProduct);

// 상품 등록
// router.post('/write', controller.postProduct);

// // 특정 상품 수정
// router.patch('/:productId', controller.patchProduct);

// // 특정 상품 삭제
// router.delete('/:productId', controller.deleteProduct);

// // 좋아요 추가, 삭제
// router.post('/like/:productId', controller.postLike);

// // 신고 추가, 삭제 
// router.post('/report/:productId', controller.postReport);

module.exports = router;