const { Room } = require("../../models/Index");
const chatService = require("../../service/chatService");
const auth = require("../../middleware/auth");
const { Op } = require("sequelize");

// 채팅방 생성
exports.postRoom = async (req, res) => {
    const { productId, buyerId, sellerId } = req.body;

    if (buyerId === sellerId) return res.status(401).json({ message: '해당 상품은 본인이 판매자인 상품입니다.'})

    console.log("🚀 ~ exports.postRoom= ~ req.body:", req.body)
    console.log("🚀 ~ exports.postRoom= ~ productId, buyerId, sellerId:", productId, buyerId, sellerId)
    
    try {
        const room = await chatService.createOrGetRoom({ productId, buyerId, sellerId });
        console.log(`채팅방 ${room.roomId} 에 입장하셨습니다.`);
        
        res.status(200).json({ 
            message: `채팅방 ${room.roomId} 에 입장하셨습니다.`,
            roomId: room.roomId,
            buyerId,
            sellerId
        })
    } catch (err) {
        res.status(500).json({ message: '서버 오류', err: err.message });
    }
};

// 특정 사용자의 채팅방 목록 조회
exports.getRoomListByUserId = async (req, res) => {
    const { userId } = req.userId;
    try {
        const rooms = await chatService.getRoomsByUserId(userId);
        res.status(200).json(rooms);
    } catch (err) {
        res.status(500).json({ message: '서버 오류', err: err.message });
    }
};


// 토큰으로 채팅방 조회
exports.getRoomByToken = async (req, res) => {
    try {
        const userInfo = await auth.getUserInfoByToken(req, res); // 비동기 처리
        console.log("🚀 ~ exports.getRoomByToken= ~ userInfo:", userInfo);
        if (!userInfo) return;

        const { userId } = userInfo;
        console.log("🚀 ~ exports.getRoomByToken= ~ userId:", userId);

        const rooms = await Room.findAll({
            where: {
                [Op.or]: [
                    { buyerId: userId },
                    { sellerId: userId }
                ]
            }
        });
        console.log("🚀 ~ exports.getRoomByToken= ~ rooms:", rooms);

        if (!rooms || rooms.length === 0) {
            return res.status(404).json({ message: '생성된 채팅방 목록이 없습니다.' });
        }

        return res.status(200).json(rooms);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: '서버 오류', err: err.message });
    }
}