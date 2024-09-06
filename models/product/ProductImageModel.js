// ProductImage 모델 정의
const ProductImageModel = (sequelize, DataTypes) => {
    const ProductImage = sequelize.define(
        'ProductImage',
        {
            // 상품이미지 인덱스
            imageId: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            // 상품 인덱스
            productId: {
                type: DataTypes.BIGINT,
                allowNull: false,
            },
            // 상품 이미지
            productImage: {
                type: DataTypes.STRING(2000),
                allowNull: false,
            },
        },
        {
            freezeTableName: true,
            timestamps: true,
        }
    );
    ProductImage.associate = function (models) {
        ProductImage.belongsTo(models.Product, { foreignKey: "productId" });
    };

    return ProductImage;
}




module.exports = ProductImageModel;

