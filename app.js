const express = require('express');
const app = express();
const router = require("./routes/index");
const { sequelize } = require("./models/index");
const path = require("path");
const dotenv = require("dotenv");

const cookieParser = require('cookie-parser');
const multer = require('multer');
const sessionMiddleware = require("./middleware/sessionMiddleware");

// dotenv.config(); // config.js와 중복부분(불러오지 못할 시 주석 해제)
const config = require('./config/config')[process.env.NODE_ENV || 'development'];
const port = process.env.PORT || 8080;

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(sessionMiddleware);
app.use(router);


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