// NewProduct 모델 정의
const NewProductModel = (sequelize, DataTypes) =>{
    const NewProduct = sequelize.define(
        'NewProduct', 
        { 
        // 새상품 최저가 인덱스
        NewProductId:{
            type:DataTypes.BIGINT,
            primaryKey : true,
            autoIncrement :true,
            allowNull : false,
        },
        // 가격
        Price :{
            type:DataTypes.BIGINT,
            allowNull:false,
        },
    },
    {
        freezeTableName : true, 
        timestamps : true, 
    }
);
    return NewProduct;
}

module.exports=NewProductModel;

