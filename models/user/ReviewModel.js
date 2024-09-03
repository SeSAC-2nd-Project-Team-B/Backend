const ReviewModel = (sequelize, DataTypes) =>{
    const Review = sequelize.define('Review', { 
        
        // 리뷰 식별 번호
        reviewId: {
            type:DataTypes.BIGINT,
            primaryKey : true,
            autoIncrement :true,
            allowNull : false,
        },

        // 상품 식별 번호
        productId: {
            type:DataTypes.BIGINT,
            allowNull : false,
        },

        // 판매자 식별 번호 (상점)
        sellerId: {
            type:DataTypes.BIGINT,
            allowNull:false,
        },

        // 구매자 식별 번호 (리뷰 작성자)
        buyerId: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },

        // 리뷰 내용
        reviewContent: {
            type:DataTypes.STRING,
            allowNull:false,
        },

        // 리뷰 점수
        reviewScore: {
            type: DataTypes.BIGINT,
            allowNull: false,
        }
    },
    {
        freezeTableName : true, 
        timestamps : true, 
    }
);

    // 관계 설정 // 추후 소프트 삭제 적용 필요
    Review.associate = (models) => {
        Review.belongsTo(models.User, { foreignKey: 'sellerId', as: 'Seller' }); // 다대일 : 각 댓글은 하나의 회원
        Review.belongsTo(models.User, { foreignKey: 'buyerId', as: 'Buyer' }); // 다대일 : 각 댓글은 하나의 회원
        Review.belongsTo(models.Product, { foreignKey: 'productId' }); // 다대일 : 각 리뷰는 하나의 상품

    };

    return Review;
}

module.exports = ReviewModel;

