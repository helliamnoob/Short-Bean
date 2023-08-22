const express = require('express');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth.route.js');
const chatRouter = require('./routes/chat.route.js');
const commentRouter = require('./routes/comment.route');
const likeRouter = require('./routes/like.route.js');
const postRouter = require('./routes/post.route.js');
const reportRouter = require('./routes/report.route.js');
const useMarkRouter = require('./routes/userMark.route.js');
const app = express();

const PORT = 3000;
app.use(express.json());
app.use(cookieParser());

app.use('/api', [
  authRouter,
  chatRouter,
  commentRouter,
  likeRouter,
  postRouter,
  reportRouter,
  useMarkRouter,
]);
app.listen(PORT, () => {
  console.log(PORT, '포트 번호로 서버가 실행되었습니다.');
});
