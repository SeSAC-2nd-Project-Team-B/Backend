const chatService = require("../../service/chatService");

exports.sendMessage = async (io, roomId, senderId, receiverId, messageText) => {
    try {
        const message = await chatService.createMessage({ roomId, senderId, receiverId, messageText });
        console.log('메시지가 생성되었습니다:', message);
        io.to(roomId).emit('receiveMessage', message);
    } catch (err) {
        console.error('메시지 전송 중 오류 발생:', err.message);
    }
};
