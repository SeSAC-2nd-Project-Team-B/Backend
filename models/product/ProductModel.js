const { Product } = require('../Index');

// Product 모델 정의
const ProductModel = (sequelize, DataTypes) => {
    const Product = sequelize.define(
        'Product',
        {
            // 상품 인덱스
            productId: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            // 상품명 (제목)
            productName: {
                type: DataTypes.STRING(20),
                allowNull: false,
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            userId: {
                type: DataTypes.BIGINT,
                allowNull: false,
            },
            price: {
                type: DataTypes.BIGINT,
                allowNull: false,
                defaultValue: 0,
            },
            content: {
                type: DataTypes.STRING(2000),
                allowNull: false,
            },
            categoryId: {
                type: DataTypes.BIGINT,
                allowNull: false,
            },
            viewCount: {
                type: DataTypes.BIGINT,
                allowNull: false,
                defaultValue: 0,
            },
            status: {
                type: DataTypes.STRING(10),
                allowNull: false,
                defaultValue: '판매중',
            },
            buyerId: {
                type: DataTypes.BIGINT,
                allowNull: true,
            },
        },
        {
            freezeTableName: true,
            timestamps: true,
        }
    );
    Product.associate = function (models) {
        Product.belongsTo(models.User, { foreignKey: 'userId' });
        Product.hasMany(models.ProductHashtag, { foreignKey: 'productId' });
        Product.hasOne(models.ProductImage, { foreignKey: 'productId' });
        Product.belongsTo(models.Category, { foreignKey: 'categoryId' });
        Product.hasOne(models.Likes, { foreignKey: 'productId' });
        Product.hasOne(models.Report, { foreignKey: 'productId' });
    };
    return Product;
};

module.exports = ProductModel;
