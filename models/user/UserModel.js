const UserModel = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        
        // 사용자 식별 번호
        userId: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },

        // 닉네임
        nickname: {
            type: DataTypes.STRING(20),
            allowNull: false
        },

        // 이메일 (아이디)
        email: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        // 비밀번호
        password: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        // 성별 (1: 남자, 0: 여자)
        gender: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        
        // 나이
        age: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        
        // 온도 (소수점 첫째자리)
        temp: {
            type: DataTypes.FLOAT,
            defaultValue: 36.5,
            set(value) {
                this.setDataValue('temp', Math.floor(value * 10) / 10);
            }
        },

        // 프로필 이미지
        profile_image: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        // 충전 금액
        money: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },

        // 포인트
        point: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    }, 
        {
            tableName: 'User',
            freezeTableName: true,
            timestamps: true, // 유저생성일자(createdAt), 유저정보수정일자(updatedAt)
        }
    );

    // 관계 설정
    User.associate = (models) => {
        User.hasMany(models.Product, { foreignKey: 'userId' }); // 일대다 : 각 유저는 여러개의 상품
        User.hasMany(models.Room, { foreignKey: 'senderId', as: 'SentRooms' }); // 일대다 : 각 유저가 메세지 보낸 채팅방
        User.hasMany(models.Room, { foreignKey: 'receiverId', as: 'ReceivedRooms' }); // 일대다 : 각 유저가 메세지 받은 채팅방
        User.hasMany(models.Message, { foreignKey: 'userId' }); // 일대다 : 각 유저는 여러개의 메세지
        User.hasMany(models.UserCoupon, { foreignKey: 'userId' }); // 일대다 : 각 유저는 여러 개의 userCoupon
        User.hasMany(models.Report, { foreignKey: 'userId' }); // 일대다 : 각 유저는 여러개의 신고
        User.hasMany(models.Location, { foreignKey: 'userId'}); // 일대다 : 각 유저는 여러개의 위치
        User.hasOne(models.Active, { foreignKey: 'userId' }); // 일대일: 각 유저는 하나의 Active
        User.hasMany(models.Product, { foreignKey: 'buyerId' }); // 일대다 : 각 유저는 여러개의 상품 구매가능

        User.hasMany(models.Review, { foreignKey: 'buyerId', as: 'BuyerReview' }); // 일대다 : 각 유저는 여러개의 리뷰
        User.hasMany(models.Review, { foreignKey: 'sellerId', as: 'SellerReview' }); // 일대다 : 각 유저는 여러개의 리뷰
        User.hasMany(models.Product, { foreignKey: 'buyerId' }); // 일대다 : 각 유저는 여러개의 상품 구매가능

      };

    return User;
};

module.exports = UserModel;