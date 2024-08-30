const { Room, Message } = require("../models/Index");

const findOrCreateRoom = async ({ productId, senderId, receiverId }) => {
    let room = await Room.findOne({
        where: {
            productId, senderId, receiverId
        }
    });

    // 기존 채팅 방이 없으면 생성
    if (!room) {
        room = await Room.create({ productId, senderId, receiverId });
    }

    return room;
};