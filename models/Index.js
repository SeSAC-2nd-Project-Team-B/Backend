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
const Active = require("../models/user/ActiveModel")(sequelize, Sequelize);
const Coupon = require("../models/user/CouponModel")(sequelize, Sequelize);
const Location = require("../models/user/LocationModel")(sequelize, Sequelize);
const Message = require("../models/user/MessageModel")(sequelize, Sequelize);
const Room = require("../models/user/RoomModel")(sequelize, Sequelize);
const UserCoupon = require("../models/user/UserCouponModel")(sequelize, Sequelize);
const User = require("../models/user/UserModel")(sequelize, Sequelize);

const Product = require('../models/product/ProductModel')(sequelize,Sequelize);
const ProductImage = require('../models/product/ProductImageModel')(sequelize,Sequelize);
const ProductHashtag = require('../models/product/ProductHashtagModel')(sequelize,Sequelize);
const NewProduct = require('../models/product/NewProductModel')(sequelize,Sequelize);
const Review = require('../models/product/ReviewModel')(sequelize,Sequelize);
const Likes = require('../models/product/LikesModel')(sequelize,Sequelize);
const Report = require('../models/product/ReportModel')(sequelize,Sequelize);

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
db.Likes = Likes;
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
