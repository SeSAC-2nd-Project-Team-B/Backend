const { Product } = require("../Index");

// Product 모델 정의
const ProductModel = (sequelize, DataTypes) =>{
    const Product = sequelize.define(
        'Product', 
        { 
        // 상품 인덱스
        productId:{
            type:DataTypes.BIGINT,
            primaryKey : true,
            autoIncrement :true,
            allowNull : false,
        },
        // 상품명 (제목)
        productName :{
            type:DataTypes.STRING(20),
            allowNull:false,
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        userId:{
            type:DataTypes.BIGINT,
            allowNull : false,
        },
        price:{
            type:DataTypes.BIGINT,
            allowNull : false,
            defaultValue : 0
        },
        content:{
            type:DataTypes.STRING(2000),
            allowNull : false,
        },
        viewCount:{
            type:DataTypes.BIGINT,
            allowNull : false,
            defaultValue : 0
        },
        status:{
            type:DataTypes.STRING(10),
            allowNull : true,
            defaultValue:"판매중"
        },
    },
    {
        freezeTableName : true, 
        timestamps : true, 
    }
);
    return Product;
    Product.associate = function (models) {
        Product.belongsTo(models.User, {foreignKey:'userId'});
        Product.hasMany(models.ProductHashtag, {foreignKey: 'productId'});
        Product.hasOne(models.ProductImage, {foreignKey: 'productId'});
        Product.hasOne(models.Category,{foreignKey: 'productId'});
        Product.hasOne(models.Like,{foreignKey: 'productId'});
        Product.hasOne(models.Report,{foreignKey: 'productId'});
}

}


module.exports=ProductModel;

