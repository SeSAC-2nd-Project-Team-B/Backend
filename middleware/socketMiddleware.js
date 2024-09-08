const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");
const Cmessage = require("../controller/user/Cmessage");

module.exports = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    // 채팅방 입장
    socket.on("joinRoom", ({ roomId, buyerId, productId, token }) => {
      console.log(`>>>>>>>>>>>>>>>>>>사용자 ${buyerId}가 방 ${roomId}에 입장`);

      console.log(`클라이언트 연결됨: ${socket.id}`);
      console.log("🚀 ~ socket.on ~ token:", token);
      try {
        // JWT 인증
        const actualToken = token.startsWith("Bearer ")
          ? token.split(" ")[1]
          : token;
        const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
        const { userId, isActive } = decoded;
        console.log("🚀 ~ socket.on ~ userId, isActive:", userId, isActive);

        if (!isActive) {
          throw new Error("비활성화된 계정입니다.");
        }
        console.log("🚀 ~ socket.on ~ buyerId:", buyerId);

        if (userId !== buyerId) {
          throw new Error("토큰과 발신자 정보가 일치하지 않습니다.");
        }

        socket.join(roomId);
        console.log(
          `사용자 ${buyerId}이(가) 상품 ${productId}을(를) 위해 방 ${roomId}에 입장했습니다. socket.id:${socket.id}`
        );
      } catch (err) {
        console.error("JWT 인증 실패:", err.message);
        socket.emit("error", { message: "채팅방 입장 중 인증 실패했습니다." });
      }
    });

    // 메시지 전송
    socket.on("sendMessage", async ({ roomId, senderId, messageText }) => {
      console.log("서버로부터 sendMessage 이벤트 수신:", {
        roomId,
        senderId,
        messageText,
      });

      await Cmessage.sendMessage(io, roomId, senderId, messageText);

      console.log(`메시지 ${messageText}를 방 ${roomId}에 브로드캐스트`);
    });

    socket.on("disconnect", (reason) => {
      console.log(`클라이언트 연결 종료: ${socket.id}, 이유: ${reason}`);
      console.log("사용자가 연결을 종료했습니다.");
    });
  });
};
