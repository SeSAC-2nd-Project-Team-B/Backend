// 좋아요 모델 정의
const LikeModel = (sequelize, DataTypes) =>{
    const Like = sequelize.define(
        'Like', 
        { 
        // 좋아요 인덱스
        likeId:{
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        // 상품 인덱스 
        productId:{
            type: DataTypes.BIGINT,
            allowNull: false,
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        // 유저 인덱스
        userId:{
            type: DataTypes.BIGINT,
            allowNull: false,
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        likeCount:{
            type:DataTypes.BIGINT,
            allowNull:false,
            defaultValue:0
        }
    },
    {
        freezeTableName : true, 
        timestamps : true, 
    }
);
    return Like;
}

module.exports=LikeModel;

