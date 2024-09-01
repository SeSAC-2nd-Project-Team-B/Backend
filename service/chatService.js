const { Room, Message, Product } = require("../models/Index");

exports.createOrGetRoom = async ({ productId, senderId, receiverId }) => {
        
    console.log("사용자가 연결되었습니다.");


    if (productId !== undefined && senderId !== undefined && receiverId !== undefined) {
        console.log("🚀 ~ exports.1createOrGetRoom= ~ productId, senderId, receiverId:", productId, senderId, receiverId)

            const existsProduct = await Product.findOne({ where: { productId } });
            console.log("🚀 ~ exports.createOrGetRoom= ~ existsProduct:", existsProduct.productId)
            if (!existsProduct) {
                console.log("찾을 수 없는 상품입니다."); 
                throw new Error("찾을 수 없는 상품입니다.");
            }

            console.log("🚀 ~ exports.2createOrGetRoom= ~ productId, senderId, receiverId:", productId, senderId, receiverId)
            // 이미 방이 있는지 확인
            let room = await Room.findOne({
                where: { productId, senderId, receiverId }
                
            });
            
            if (room) {
                console.log(`기존 방이 존재하므로 해당 방으로 접속합니다. roomId: ${room.roomId}`);
            } else {
                // 없으면 생성
                room = await Room.create({ productId, senderId, receiverId });
                console.log(`방이 존재하지 않으므로 새로운 방을 생성합니다. roomId: ${room.roomId}`);
            }

            return room;

    } else {
        throw new Error("채팅방을 생성하는데 필요한 정보가 부족합니다.");
    }
};



exports.getRoomsByUserId = async (userId) => {
    if (userId !== undefined) {
        return await Room.findAll({
            where: {
                [Op.or]: [
                    { senderId: userId },
                    { receiverId: userId }
                ]
            },
            include: [
                { model: User, as: 'Sender', attributes: ['nickname'] },
                { model: User, as: 'Receiver', attributes: ['nickname'] }
            ]
        });
    } else {
        throw new Error("userId가 올바르지 않습니다.");
    }
};

exports.createMessage = async ({ roomId, senderId, receiverId, messageText }) => {
    if (roomId !== undefined && senderId !== undefined && receiverId !== undefined && messageText !== undefined) {
        return await Message.create({ roomId, senderId, receiverId, messageText });
    } else {
        throw new Error("메시지를 생성하는 데 필요한 정보가 부족합니다.");
    }
};
