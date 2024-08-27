const express = require(`express`);
const router = express.Router();
const controller = require(`../controller/Cuser`);

// 기본 요청 경로 localhost:PORT/user

// 유저 생성
router.post(`/`, controller.postUser);

// 특정 유저 한명 조회
router.get(`/:userId`, controller.getUser);

// 전체 유저 목록 조회
router.get(`/`, controller.getUserList);

// 특정 유저 내용 수정
router.patch(`/:userId`, controller.patchUser);

// 특정 유저 삭제
router.delete(`/:userId`, controller.deleteUser);

module.exports = router;