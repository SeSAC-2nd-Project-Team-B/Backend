const db = require("../../models/Index");
const { Room } = require("../../models/user/RoomModel");
const { Op } = require("sequelize");


// 채팅방 생성
exports.postRoom = async(req, res) => { 
    try {
        const { userId : senderId, userId : receiverId, productId } = req.body;

        await Room.create({
            userId : senderId, userId : receiverId, productId
        });


        res.status(201).json({ message: "채팅방이 생성되었습니다." });


    } catch(err) {
        console.log(err.message);
        res.status(500).json({ message: '서버 오류', err: err.message });
    }
}

// 특정 채팅방 한개 조회
exports.getRoom = async(req, res) => { 
    try {
        const { roomId } = req.body;

        const findRoomByroomId = await Room.findOne({ 
            where: { roomId },
            include: [
                {
                    model: Message,
                    attributes: [ 'messageId', 'senderId', 'receiverId', 'messageText' ]
                }
            ]
        });

        res.status(201).json({ message: "조회가 완료 되었습니다.", findRoomByroomId });


    } catch(err) {
        console.log(err.message);
        res.status(500).json({ message: '서버 오류', err: err.message });
    }
}

// 채팅방 전체 목록 조회
exports.getRoomList = async(req, res) => { }

// 특정 유저의 채팅방 목록 조회
exports.getRoomListByUserId = async(req, res) => { }

// 특정 채팅방 삭제
exports.deleteRoom = async(req, res) => { }

