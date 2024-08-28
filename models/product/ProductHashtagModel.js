// 상품별해시태그 모델 정의
const ProductHashtagModel = (sequelize, DataTypes) =>{
    const ProductHashtag = sequelize.define(
        'ProductHashtag', 
        { 
        // 상품별해시태그 인덱스
        productHashtagId:{
            type:DataTypes.BIGINT,
            primaryKey : true,
            autoIncrement :true,
            allowNull : false,
        },
        // 해시태그 인덱스
        hashtagId :{
            type:DataTypes.STRING(100),
            allowNull:false,
        },
        // 해시태그 명
        hashtagName :{
            type:DataTypes.STRING(100),
            allowNull:false,
        },
        // 상품 인덱스
        productId :{
            type:DataTypes.BIGINT,
            allowNull:false,
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
    },
    {
        freezeTableName : true, 
        timestamps : true, 
    }
);
ProductHashtag.associate = function (models) {
    ProductHashtag.belongsTo(models.Product,{foreignKey:"productId", sourceKey:"productId"});
}
    return ProductHashtag;
}

module.exports=ProductHashtagModel;

