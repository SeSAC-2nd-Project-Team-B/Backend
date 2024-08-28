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
        locationInfo: {
            type: DataTypes.TEXT,
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
        Location.belongsTo(models.User, { foreignKey: 'userId' }); // 다대일: 각 위치는 하나의 유저
    };

    return Location;
};

module.exports = LocationModel;
