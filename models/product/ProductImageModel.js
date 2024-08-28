// ProductImage 모델 정의
const ProductImageModel = (sequelize, DataTypes) =>{
    const ProductImage = sequelize.define(
        'ProductImage', 
        { 
        // 상품이미지 인덱스
        imageId:{
            type:DataTypes.BIGINT,
            primaryKey : true,
            autoIncrement :true,
            allowNull : false,
        },
        // 상품 인덱스
        productId:{
            type:DataTypes.BIGINT,
            allowNull:false,
        },
        // 상품 이미지
        productImage:{
            type:DataTypes.BIGINT,
            allowNull:false,
        },
    },
    {
        freezeTableName : true, 
        timestamps : true, 
    }
);
    return ProductImage;
}

ProductImage.associate = function(models) {
    ProductImage.belongsTo(models.Product,{foreignKey:"productId", sourceKey:"productId"});
};



module.exports=ProductImageModel;

