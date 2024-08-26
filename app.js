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


app.use(cookieParser());
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

const port = process.env.PORT;
const dbName = process.env.DATABASE_NAME;
const dbPw = process.env.DATABASE_PW;

app.use("/", router);

// 404 처리
app.get('*', (req, res) => {
  res.render('404')
})
app.listen(port, () => {
              console.log('Database connected!');
              console.log(`Server running in PORT: ${port}`);
});
    