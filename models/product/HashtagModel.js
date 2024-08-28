// 해시태그 모델 정의
const HashtagModel = (sequelize, DataTypes) =>{
    const Hashtag = sequelize.define(
        'Hashtag', 
        { 
        // 해시태그 인덱스
        hashtagId:{
            type:DataTypes.BIGINT,
            primaryKey : true,
            autoIncrement :true,
            allowNull : false,
        },
        // 해시태그명
        hashtagName:{
            type:DataTypes.VARCHAR(100),
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
    return Hashtag;
}

module.exports=HashtagModel;

