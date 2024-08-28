// 신고 모델 정의
const ReportModel = (sequelize, DataTypes) =>{
    const Report = sequelize.define(
        'Report', 
        { 
        // 신고 수 인덱스
        reportId:{
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
        reportCount:{
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
    return Report;
}

Report.associate = function (models) {
    Report.belongsTo(models.Product,{foreignKey:"productId", sourceKey:"productId"});
    Report.belongsTo(models.User,{foreignKey:"userId", sourceKey:"userId"});
}

module.exports=ReportModel;

