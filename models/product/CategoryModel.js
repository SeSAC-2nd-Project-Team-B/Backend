// 카테고리 모델 정의
const CategoryModel = (sequelize, DataTypes) =>{
    const Category = sequelize.define(
        'Category', 
        { 
        // 카테고리 인덱스
        categoryId:{
            type:DataTypes.BIGINT,
            primaryKey : true,
            autoIncrement :true,
            allowNull : false,
        },
        //카테고리명
        category_name:{
            type:DataTypes.VARCHAR(255),
            allowNull:false,
        },
        // 상품 인덱스
        productId:{
            type:DataTypes.BIGINT,
            allowNull : false,
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        //상위 카테고리 인덱스
        parent_category_id:{
            type:DataTypes.INT,
            allowNull : true,
        },
        // 카테고리 레벨
        level:{
            type:DataTypes.INTEGER,
            allowNull : false,
        },
    },
    {
        freezeTableName : true, 
        timestamps : true, 
    }
);
    return Category;
}

Category.associate = function (models) {
    Category.belongsTo(models.Product,{foreignKey:"productId", sourceKey:"productId"});
}
module.exports=CategoryModel;

