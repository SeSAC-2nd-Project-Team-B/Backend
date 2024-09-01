const chatService = require("../../service/chatService");

exports.sendMessage = async (io, roomId, senderId, receiverId, messageText) => {
    try {
        const message = await chatService.createMessage({ roomId, senderId, receiverId, messageText });
        console.log('메시지가 생성되었습니다:', message.messageId, message.senderId, message.messageText);
        io.to(roomId).emit('receiveMessage', message);
        console.log(`메세지 보낸 방번호 ${roomId}`);
        
    } catch (err) {
        console.error('메시지 전송 중 오류 발생:', err.message);
    }
};
