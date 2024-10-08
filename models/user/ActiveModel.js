const ActiveModel = (sequelize, DataTypes) => {
    const Active = sequelize.define('Active', {
        
        // 사용자 식별 번호
        userId: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false
        },

        // 활성화 상태
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            default: 1
        },

        // 관리자 여부
        isAdmin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            default: 0
        },
    }, 
    {
        indexes: [
            {
                unique: true, // 중복 방지
                fields: ['userId']
            }
        ],

        tableName: 'Active',
        freezeTableName: true,
        timestamps: false,
    });

    // 관계 설정
    Active.associate = (models) => {
        Active.belongsTo(models.User, { foreignKey: 'userId',  onDelete: 'CASCADE' }); // 일대일 : 각 Active는 하나의 유저
    };

    return Active;
};

module.exports = ActiveModel;
