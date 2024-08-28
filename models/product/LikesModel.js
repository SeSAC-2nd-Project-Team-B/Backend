// 좋아요 모델 정의
const LikesModel = (sequelize, DataTypes) =>{
    const Likes = sequelize.define(
        'Likes', 
        { 
        // 좋아요 인덱스
        LikesId:{
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
        LikesCount:{
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
Likes.associate = function (models) {
    Likes.belongsTo(models.Product,{foreignKey:"productId", sourceKey:"productId"});
    Likes.belongsTo(models.User,{foreignKey:"userId", sourceKey:"userId"});
}
    return Likes;
}


module.exports=LikesModel;

