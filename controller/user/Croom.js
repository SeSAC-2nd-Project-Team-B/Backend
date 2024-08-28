const db = require('../../models/Index');
const { Room } = require('../../models/user/RoomModel');
const { Op } = require('sequelize');


// 채팅방 생성
exports.postRoom = async(req, res) => { }

// 특정 채팅방 한개 조회
exports.getRoom = async(req, res) => { }

// 특정 유저의 채팅방 목록 조회
exports.getRoomListByUserId = async(req, res) => { }

// 특정 채팅방 삭제
exports.deleteRoom = async(req, res) => { }