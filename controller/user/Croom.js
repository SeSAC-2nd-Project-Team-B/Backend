const chatService = require("../../service/chatService");

// 채팅방 생성
exports.postRoom = async (req, res) => {
    const { productId, senderId, receiverId } = req.body;
    console.log("🚀 ~ exports.postRoom= ~ productId, senderId, receiverId:", productId, senderId, receiverId)
    
    try {
        const room = await chatService.createOrGetRoom({ productId, senderId, receiverId });
        console.log(`채팅방 ${room.roomId} 에 입장하셨습니다.`);
        
        res.status(200).json({ 
            message: `채팅방 ${room.roomId} 에 입장하셨습니다.`,
            roomId: room.roomId,
            senderId,
            receiverId
        })
    } catch (err) {
        res.status(500).json({ message: '서버 오류', err: err.message });
    }
};

// 특정 사용자의 채팅방 목록 조회
exports.getRoomListByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const rooms = await chatService.getRoomsByUserId(userId);
        res.status(200).json(rooms);
    } catch (err) {
        res.status(500).json({ message: '서버 오류', err: err.message });
    }
};

