const Sequelize = require("sequelize");
const env = process.env.NODE_ENV;
const config = require(__dirname + "/../config/config.js")[env];
const db = {};

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
);

// 모델 불러오기
const Active = require("./activeModel")(sequelize, Sequelize);
const Coupon = require("./couponModel")(sequelize, Sequelize);
const Location = require("./locationModel")(sequelize, Sequelize);
const Message = require("./messageModel")(sequelize, Sequelize);
const Room = require("./roomModel")(sequelize, Sequelize);
const UserCoupon = require("./userCouponModel")(sequelize, Sequelize);
const User = require("./userModel")(sequelize, Sequelize);

db.Active = Active;
db.Coupon = Coupon;
db.Location = Location;
db.Message = Message;
db.Room = Room;
db.UserCoupon = UserCoupon;
db.User = User;

// 모델 동기화
const syncModels = async () => {
  await Active.sync();
  await Coupon.sync();
  await Location.sync();
  await Message.sync();
  await Room.sync();
  await UserCoupon.sync();
  await User.sync();
};

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.syncModels = syncModels;

// db 객체에 모델 추가
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
