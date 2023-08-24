const mongoose = require('mongoose');

exports.mongoDB = () => {
  mongoose
    .connect('mongodb+srv://sparta:short_bean_3333@cluster0.ixlq5pz.mongodb.net/TEST', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('mongoDB 연결완료'))
    .catch(() => console.log('mongodb 연결실패'));
};
