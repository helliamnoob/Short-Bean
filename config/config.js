require('dotenv').config();
const env = process.env;

const development = {
  username:"yerim",
  password: "sola4718",
  database: "SHORT_BEAN",
  host:"express-database.c0efzklyxqhv.ap-northeast-2.rds.amazonaws.com",
  dialect: 'mysql',
};

const production = {
  username: env.MYSQL_USERNAME,
  password: env.MYSQL_PASSWORD,
  database: env.MYSQL_DATABASE,
  host: env.MYSQL_HOST,
  dialect: 'mysql',
};

const test = {
  username: env.MYSQL_USERNAME,
  password: env.MYSQL_PASSWORD,
  database: env.MYSQL_DATABASE_TEST,
  host: env.MYSQL_HOST,
  dialect: 'mysql',
};

module.exports = { development, production, test };

