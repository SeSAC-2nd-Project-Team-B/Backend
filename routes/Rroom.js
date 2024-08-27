const express = require(`express`);
const router = express.Router();
const controller = require(`../controller/Croom`);

// 기본 요청 경로 localhost:PORT/room

// 채팅방 생성
router.post(`/`, controller.postRoom);

// 특정 채팅방 한개 조회
router.get(`/:roomId`, controller.getRoom);

// 특정 유저의 채팅방 목록 조회
router.get(`/:userId`, controller.getRoomListByUserId);

// 특정 채팅방 삭제
router.delete(`/:roomId`, controller.deleteRoom);

module.exports = router;