const express = require("express");
const router = express.Router();
const controller = require("../controller/user/Cuser");
const controllerMoney = require("../controller/user/Cmoney");
const { authenticate, adminOrUser, admin } = require("../middleware/auth");
const { validation, checkEmail, checkNickname } = require("../middleware/validation")

// 기본 요청 경로 localhost:PORT/user

// 유저 생성
router.post(`/`, validation, controller.postUser);

// 머니 충전
router.post(`/money/:userId`, authenticate(adminOrUser), controllerMoney.postMoney);

// 토큰으로 유저 조회
router.post(`/token`, controller.getUserByToken);

// 전체 유저 목록 조회 (검색)
/** 
 * localhost:8000/user/list?nickname= (회원전체 검색)
 * localhost:8000/user/list?nickname=a (닉네임에 a가 들어간 회원 검색 / 순서: 일치->포함)
 * localhost:8000/user/list (회원전체 검색)
*/
router.get(`/list`, authenticate(admin), controller.getUserList);

// 이메일 중복 체크
router.post(`/checkEmail`, checkEmail);

// 닉네임 중복 체크
router.post(`/checkNickname`, checkNickname);


// 특정 유저 한명 조회
// router.get(`/:userId`, authenticate(adminOrUser), controller.getUser);
router.get(`/:userId`, controller.getUser);

// 특정 유저 내용 수정
router.patch(`/:userId`, authenticate(adminOrUser), validation, controller.patchUser);

// 특정 유저 삭제
router.delete(`/:userId`, authenticate(adminOrUser), controller.deleteUser);


module.exports = router;