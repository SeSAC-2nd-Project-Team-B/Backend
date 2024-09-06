// 카테고리 모델 정의
const CategoryModel = (sequelize, DataTypes) => {
    const Category = sequelize.define(
        'Category',
        {
            // 카테고리 인덱스
            categoryId: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            //카테고리명
            categoryName: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            //상위 카테고리 인덱스
            parentCategoryId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            // 카테고리 레벨
            level: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
        },
        {
            freezeTableName: true,
            timestamps: true,
        }
    );
    Category.associate = function (models) {
        Category.hasMany(models.Product, { foreignKey: 'categoryId', sourceKey: 'categoryId' });
    };
    return Category;
};

module.exports = CategoryModel;
