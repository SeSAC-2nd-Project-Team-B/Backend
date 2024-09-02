const RoomModel = (sequelize, DataTypes) => {
    const Room = sequelize.define('Room', {
        
        // 채팅방 식별 번호
        roomId: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },

        // 제품 식별 번호
        productId: {
            type: DataTypes.BIGINT,
            allowNull: false
        },

        // 구매자 식별 번호 (userId)
        buyerId: {
            type: DataTypes.BIGINT,
            allowNull: false
        },

        // 판매자 식별 번호 (userId)
        sellerId: {
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
        Room.belongsTo(models.User, { foreignKey: 'buyerId', as: 'Buyer' }); // 다대일 : 각 채팅방은 하나의 회원(보내는 사람)
        Room.belongsTo(models.User, { foreignKey: 'sellerId', as: 'Seller' }); // 다대일 : 각 채팅방은 하나의 회원(받는 사람)
        Room.hasMany(models.Message, { foreignKey: 'roomId' }); // 일대다 : 각 채팅방은 여러 개의 메세지
        Room.belongsTo(models.Product, { foreignKey: 'productId' }); // 다대일 : 각 채팅방은 하나의 상품
    };
  
    return Room;
};

module.exports = RoomModel;