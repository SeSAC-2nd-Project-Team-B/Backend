const Sequelize = require("sequelize");
const env = process.env.NODE_ENV;
const config = require(__dirname + "/../config/config.js")[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  
  {
    host: config.host,
    dialect: config.dialect
  }
);

console.log("🚀 ~ sequelize:", sequelize.options.host)


// 모델 불러오기
const Active = require("./user/ActiveModel")(sequelize, Sequelize);
const Coupon = require("./user/CouponModel")(sequelize, Sequelize);
const Location = require("./user/LocationModel")(sequelize, Sequelize);
const Message = require("./user/MessageModel")(sequelize, Sequelize);
const Room = require("./user/RoomModel")(sequelize, Sequelize);
const UserCoupon = require("./user/UserCouponModel")(sequelize, Sequelize);
const User = require("./user/UserModel")(sequelize, Sequelize);
const Review = require('./user/ReviewModel')(sequelize,Sequelize);

const Product = require('./product/ProductModel')(sequelize,Sequelize);
const ProductImage = require('./product/ProductImageModel')(sequelize,Sequelize);
const NewProduct = require('./product/NewProductModel')(sequelize,Sequelize);
const Category = require('./product/CategoryModel')(sequelize,Sequelize);
const Likes = require('./product/LikesModel')(sequelize,Sequelize);
const Report = require('./product/ReportModel')(sequelize,Sequelize);
const ProductHashtag = require('./product/ProductHashtagModel')(sequelize,Sequelize);


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
db.Category = Category;
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
  await Review.sync();

  await Product.sync();
  await ProductImage.sync();
  await ProductHashtag.sync();
  await NewProduct.sync();
  await Category.sync();
  await Likes.sync();
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

