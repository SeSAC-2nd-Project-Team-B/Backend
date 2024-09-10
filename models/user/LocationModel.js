const LocationModel = (sequelize, DataTypes) => {
    const Location = sequelize.define('Location', {
        
        // 위치 식별 번호
        locationId: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },

        // 사용자 식별 번호
        userId: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },

        // 위치 정보
        depth1: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        
        depth2: {
            type: DataTypes.STRING(50),
            allowNull: false
        },

        depth3: {
            type: DataTypes.STRING(50),
            allowNull: false
        },

        depth4: {
            type: DataTypes.STRING(50),
            allowNull: true
        },

    }, 
    {
        tableName: 'Location',
        freezeTableName: true,
        timestamps: false,
    });

    // 관계 설정
    Location.associate = (models) => {
        Location.belongsTo(models.User, { foreignKey: 'userId',  onDelete: 'CASCADE' }); // 다대일: 각 위치는 하나의 유저
        Location.hasMany(models.Product, { foreignKey: 'userId',  sourceKey: 'userId', onDelete: 'CASCADE' }); // 다대일: 각 위치는 하나의 유저
    };

    return Location;
};

module.exports = LocationModel;
