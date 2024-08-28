const RoomModel = (sequelize, DataTypes) => {
    const Room = sequelize.define('Room', {
        
        // 채팅방 식별 번호
        roomId: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },

        // 보내는 사람 (구매자)
        senderId: {
            type: DataTypes.BIGINT,
            allowNull: false
        },

        // 받는 사람 (판매자)
        receiverId: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
    }, 
        {
            tableName: 'Room',
            freezeTableName: true,
            timestamps: true, // 생성일자(createdAt), 수정일자(updatedAt)
        }
    );

    // 관계 설정
    Room.associate = (models) => {
        Room.belongsTo(models.User, { foreignKey: 'senderId', as: 'Sender' }); // 다대일 : 각 채팅방은 하나의 회원(보내는 사람)
        Room.belongsTo(models.User, { foreignKey: 'receiverId', as: 'Receiver' }); // 다대일 : 각 채팅방은 하나의 회원(받는 사람)
        Room.hasMany(models.Message, { foreignKey: 'roomId' }); // 일대다 : 각 채팅방은 여러 개의 메세지
    };
  
    return Room;
};

module.exports = RoomModel;