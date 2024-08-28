const couponModel = (sequelize, DataTypes) => {
    const Coupon = sequelize.define('Coupon', {
        
        // 쿠폰 식별 번호
        couponId: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },

        // 쿠폰 이름
        couponName: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        // 쿠폰 내용
        couponInfo: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        // 할인 가격
        couponPrice: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    }, 
    {
        tableName: 'Coupon',
        freezeTableName: true,
        timestamps: false,
    });

    // 관계 설정
    Coupon.associate = (models) => {
        Coupon.hasMany(models.UserCoupon, { foreignKey: 'couponId' }); // 일대다: 각 쿠폰은 여러개의 userCoupon
    };

    return Coupon;
};

module.exports = couponModel;
