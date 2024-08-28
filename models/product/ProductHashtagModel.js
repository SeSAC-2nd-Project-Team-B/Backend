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
            type:DataTypes.VARCHAR(100),
            allowNull:false,
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
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
    return ProductHashtag;
}

module.exports=ProductHashtagModel;

