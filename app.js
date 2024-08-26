const express = require('express');
const session = require('express-session');
const app = express();
const router = require("./routes/index");

const { sequelize } = require("./models/index");
const path = require("path");
const dotenv = require("dotenv");

const cookieParser = require('cookie-parser');
const multer = require('multer');

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/public", express.static(__dirname + "/static"));
app.use('/uploads', express.static(__dirname + '/uploads'));



dotenv.config({
  path: path.resolve(__dirname, ".env"),
}); // default .env file

dotenv.config({
  // NODE_ENV 따라서 적절한 .env 파일을 로드
  path: path.resolve(__dirname, `.env.${process.env.NODE_ENV}`),
  override: true,
}); // load env file depending on NODE_ENV

app.use("/", router);

// 404 처리
app.get('*', (req, res) => {
  res.render('404')
})

// Sequelize 연결 설정
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
    }
);


sequelize
    .sync({ force: false })
    .then(() => {
        app.listen(port, () => {
            console.log('Database connected!');
            console.log(`Server running in PORT: ${port}`);
        });
    })
    .catch((err) => {
        console.error(err)
    });