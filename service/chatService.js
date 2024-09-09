const { User, Room, Message, Product } = require("../models/Index");
const { Op } = require("sequelize");
const { Sequelize } = require("../models/Index");

exports.createOrGetRoom = async ({ productId, buyerId, sellerId }) => {
  console.log("채팅방 생성을 위해 준비 중입니다.");

  if (
    productId !== undefined &&
    buyerId !== undefined &&
    sellerId !== undefined
  ) {
    console.log(
      "🚀 ~ exports.1createOrGetRoom= ~ productId, buyerId, sellerId:",
      productId,
      buyerId,
      sellerId
    );

    const existsProduct = await Product.findOne({ where: { productId } });
    if (!existsProduct) {
      console.log("찾을 수 없는 상품입니다.");
      throw new Error("찾을 수 없는 상품입니다.");
    }
    console.log(
      "🚀 ~ exports.createOrGetRoom= ~ existsProduct:",
      existsProduct.productId
    );

    console.log(
      "🚀 ~ exports.2createOrGetRoom= ~ productId, buyerId, sellerId:",
      productId,
      buyerId,
      sellerId
    );
    // 이미 방이 있는지 확인
    let room = await Room.findOne({
      where: { productId, buyerId, sellerId },
    });
    console.log("🚀 ~ exports.createOrGetRoom= ~ room:", room);

    if (!room) {
      // 없으면 생성
      room = await Room.create({ productId, buyerId, sellerId });
      console.log(
        `방이 존재하지 않으므로 새로운 방을 생성합니다. roomId: ${room.roomId}`
      );
    } else {
      console.log("🚀 ~ exports.createOrGetRoom= ~ room:", room);
      console.log(
        `기존 방이 존재하므로 해당 방으로 접속합니다. roomId: ${room.roomId}`
      );
    }

    console.log("사용자가 연결되었습니다.");

    return room;
  } else {
    throw new Error("채팅방을 생성하는데 필요한 정보가 부족합니다.");
  }
};

// 유저 아이디가 속한 채팅방 목록
exports.getRoomsByUserId = async (userId) => {
  if (userId !== undefined) {
    return await Room.findAll({
      where: {
        [Op.or]: [{ buyerId: userId }, { sellerId: userId }],
      },
      include: [
        { model: User, as: "Buyer", attributes: ["nickname"] },
        { model: User, as: "Seller", attributes: ["nickname"] },
        {
          model: Product,
          attributes: ["productName"],
        },
        {
          model: Message,
          attributes: ["messageText", "createdAt"],
          order: [["createdAt", "DESC"]],
          limit: 1,
        },
      ],
      order: [
        [
          Sequelize.literal(
            "(SELECT MAX(`Message`.`createdAt`) FROM `Message` WHERE `Message`.`roomId` = `Room`.`roomId`)"
          ),
          "DESC",
        ],
      ],
    });
  } else {
    throw new Error("유저 상태가 올바르지 않습니다.");
  }
};

// 메세지 생성
exports.createMessage = async ({ roomId, senderId, messageText }) => {
  if (
    roomId !== undefined &&
    senderId !== undefined &&
    messageText !== undefined
  ) {
    const room = await Room.findOne({
      where: { roomId },
      attributes: ["buyerId", "sellerId"],
    });

    if (!room) {
      throw new Error("해당 채팅방을 찾을 수 없습니다.");
    }

    // senderId에 따라 receiverId 결정
    let receiverId;
    if (senderId === room.buyerId) {
      receiverId = room.sellerId;
    } else if (senderId === room.sellerId) {
      receiverId = room.buyerId;
    } else {
      throw new Error("보내는 사람이 들어가려는 채팅방의 구성원이 아닙니다.");
    }

    // 메시지 생성
    return await Message.create({
      roomId,
      senderId,
      receiverId,
      messageText,
    });
  } else {
    throw new Error("메시지를 생성하는 데 필요한 정보가 부족합니다.");
  }
};
