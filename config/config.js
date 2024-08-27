const dotenv = require('dotenv');
const path = require('path');

const envFile = process.env.NODE_ENV;

dotenv.config({
  path: path.resolve(__dirname, envFile),
});

const config = {
  "development": {
    "username": process.env.DBUSER,
    "password": process.env.DBPW,
    "database": process.env.DB,
    "host": process.env.DBHOST,
    "dialect": process.env.DBDIALECT,
  }
}

module.exports = config;