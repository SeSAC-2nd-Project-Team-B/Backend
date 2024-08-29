const Sequelize = require("sequelize");
const env = process.env.NODE_ENV;
const config = require(__dirname + "/../config/config.js")[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    dialect: config.dialect
  }
);


// 모델 불러오기
const Active = require("./user/ActiveModel")(sequelize, Sequelize);
const Coupon = require("./user/CouponModel")(sequelize, Sequelize);
const Location = require("./user/LocationModel")(sequelize, Sequelize);
const Message = require("./user/MessageModel")(sequelize, Sequelize);
const Room = require("./user/RoomModel")(sequelize, Sequelize);
const UserCoupon = require("./user/UserCouponModel")(sequelize, Sequelize);
const User = require("./user/UserModel")(sequelize, Sequelize);

const Product = require('./product/ProductModel')(sequelize,Sequelize);
const ProductImage = require('./product/ProductImageModel')(sequelize,Sequelize);
const NewProduct = require('./product/NewProductModel')(sequelize,Sequelize);
const Review = require('./product/ReviewModel')(sequelize,Sequelize);
const Like = require('./product/LikeModel')(sequelize,Sequelize);
const Report = require('./product/ReportModel')(sequelize,Sequelize);

db.Active = Active;
db.Coupon = Coupon;
db.Location = Location;
db.Message = Message;
db.Room = Room;
db.UserCoupon = UserCoupon;
db.User = User;

db.Product = Product;
db.ProductImage = ProductImage;
db.ProductHashtag = ProductHashtag;
db.NewProduct = NewProduct;
db.Review = Review;
db.Like = Like;
db.Report = Report;

// 모델 동기화
const syncModels = async () => {
  await Active.sync();
  await Coupon.sync();
  await Location.sync();
  await Message.sync();
  await Room.sync();
  await UserCoupon.sync();
  await User.sync();

  await Product.sync();
  await ProductImage.sync();
  await ProductHashtag.sync();
  await NewProduct.sync();
  await Like.sync();
  await Report.sync();
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