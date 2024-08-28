const userCouponModel = (sequelize, DataTypes) => {
    const UserCoupon = sequelize.define('UserCoupon', {
        
        // 사용자 쿠폰 식별 번호
        userCouponId: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },

        // 쿠폰 식별 번호
        couponId: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },

        // 사용자 식별 번호
        userId: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
    }, 
    {
        tableName: 'UserCoupon',
        freezeTableName: true,
        timestamps: false,
    });

    // 관계 설정
    UserCoupon.associate = (models) => {
        UserCoupon.belongsTo(models.Coupon, { foreignKey: 'couponId' }); // 다대일 : 각 userCoupon는 하나의 쿠폰
        UserCoupon.belongsTo(models.User, { foreignKey: 'userId' }); // 다대일 : 각 userCoupon는 하나의 유저
    };
    
    return UserCoupon;
};

module.exports = userCouponModel;
