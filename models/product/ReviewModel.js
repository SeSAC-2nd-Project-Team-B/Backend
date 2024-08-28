// 댓글 모델 정의
const ReviewModel = (sequelize, DataTypes) =>{
    const Review = sequelize.define(
        'Review', 
        { 
        // 댓글 인덱스
        reviewId:{
            type:DataTypes.BIGINT,
            primaryKey : true,
            autoIncrement :true,
            allowNull : false,
        },
        // 댓글 내용
        reviewContent:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        //상품 인덱스
        productId:{
            type:DataTypes.BIGINT,
            allowNull:false,
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        // 유저 인덱스
        userId:{
            type: DataTypes.BIGINT,
            allowNull: false,
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        }
    },
    {
        freezeTableName : true, 
        timestamps : true, 
    }
);
    return Review;
}

module.exports=ReviewModel;

