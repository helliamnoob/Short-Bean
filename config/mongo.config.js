const mongoose = require('mongoose');
require('dotenv').config();
const env = process.env;

exports.mongoDB = () => {
  mongoose
    .connect(env.MONGODB_INFO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('mongoDB 연결완료'))
    .catch(() => console.log('mongodb 연결실패'));
};
