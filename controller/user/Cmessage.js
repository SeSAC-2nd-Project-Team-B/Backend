const chatService = require("../../service/chatService");
const { User, Message } = require("../../models/Index");

// 메세지 생성
exports.sendMessage = async (io, roomId, senderId, messageText) => {
    try {
        const message = await chatService.createMessage({ roomId, senderId, messageText });
        const sender = await User.findOne({ where: { userId: message.senderId }, attributes: ['nickname', 'userId'] });
        const receiver = await User.findOne({ where: { userId: message.receiverId }, attributes: ['nickname', 'userId'] });

        if (!sender || !receiver) {
            throw new Error('발신자 또는 수신자를 찾을 수 없습니다.');
        }

        console.log(`메시지가 생성되었습니다: 
                    메세지Id: ${message.messageId}, 
                    발신자: ${sender.nickname} | ${sender.userId}, 
                    수신자: ${receiver.nickname} | ${receiver.userId},
                    메세지내용: ${message.messageText}`);

        io.to(roomId).emit('receiveMessage', {
            messageId: message.messageId,
            roomId: message.roomId,
            senderId: sender.userId,
            senderNickname: sender.nickname,
            receiverId: receiver.userId,
            receiverNickname: receiver.nickname,
            messageText: message.messageText,
        });

        console.log(`메세지 보낸 방번호 ${roomId}`);
        
    } catch (err) {
        console.error('메시지 전송 중 오류 발생:', err.message);
    }
};


// 채팅방에 속한 메시지 조회
exports.getMessagesByRoomId = async (req, res) => {
    const roomId = req.params.roomId;

    try {
        const messages = await Message.findAll({
            where: { roomId },
            order: [['createdAt', 'ASC']],
            attributes: ['senderId', 'messageText', 'createdAt'],
            include: [
                {
                    model: User,
                    as: 'Sender',
                    attributes: ['nickname']
                }
            ]
        });

        if (!messages || messages.length === 0) {
            return res.status(404).json({ message: '해당 채팅방의 메시지가 없습니다.' });
        }

        return res.status(200).json(messages);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: '서버 오류', err: err.message });
    }
};


