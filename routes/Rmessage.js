const express = require(`express`);
const router = express.Router();
const controller = require(`../controller/user/Cmessage`);

// 기본 요청 경로 localhost:PORT/message

// 특정 메세지 한개 조회
// router.get(`/:messageId`, controller.getMessage);

// 특정 유저의 메세지 목록 조회
// router.get(`/list/:userId`, controller.getMessageListByUserId);

// 특정 메세지 삭제
// router.delete(`/:messageId`, controller.deleteMessage);

module.exports = router;