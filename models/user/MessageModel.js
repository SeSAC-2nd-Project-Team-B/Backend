const MessageModel = (sequelize, DataTypes) => {
    const Message = sequelize.define('Message', {
        
        // 메세지 식별 번호
        messageId: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },

        // 채팅방 식별 번호
        roomId: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },

        // 보내는 사람 (구매자)
        senderId: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },

        // 받는 사람 (판매자)
        receiverId: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },

        // 메세지 내용
        messageText: {
            type: DataTypes.TEXT,
            allowNull: false
        },

        // // 메시지 확인 여부
        // isRead: {
        //     type: DataTypes.BOOLEAN,
        //     allowNull: false,
        //     defaultValue: false
        // }
    }, 
        {
            tableName: 'Message',
            freezeTableName: true,
            timestamps: true,
        }
    );

    // 관계 설정
    Message.associate = (models) => {
        Message.belongsTo(models.User, { foreignKey: 'senderId', as: 'Sender' }); // 다대일 : 각 채팅방은 하나의 회원(보내는 사람)
        Message.belongsTo(models.User, { foreignKey: 'receiverId', as: 'Receiver' }); // 다대일 : 각 채팅방은 하나의 회원(받는 사람)
        Message.belongsTo(models.Room, { foreignKey: 'roomId' }); // 각 메세지는 하나의 채팅방
    };
  
    return Message;
};

module.exports = MessageModel;
