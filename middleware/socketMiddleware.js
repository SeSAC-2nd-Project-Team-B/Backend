const socketIo = require("socket.io");
const Cmessage = require("../controller/user/Cmessage");
const auth = require("../middleware/auth")

module.exports = (server) => {
    const io = socketIo(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {

        // 채팅방 입장
        socket.on('joinRoom', ({ roomId, senderId, productId }) => {
            // 본인 확인
            auth.authenticate(adminOrUser); 
            
            socket.join(roomId);
            console.log(`사용자 ${senderId}이(가) 상품 ${productId}을(를) 위해 방 ${roomId}에 입장했습니다. socket.id:${socket.id}`);
        });

        // 메시지 전송
        socket.on('sendMessage', async ({ roomId, senderId, messageText }) => {
            await Cmessage.sendMessage(io, roomId, senderId, messageText);
        });

        socket.on('disconnect', () => {
            console.log('사용자가 연결을 종료했습니다.');
        });
    });
};
