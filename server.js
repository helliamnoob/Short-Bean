const SocketIO = require('socket.io');
const express = require('express');
const app = express();

const port = 3000;
const http = require('http');
const cookieParser = require('cookie-parser');
const { mongoDB } = require('./config/mongo.config');

const chatRouter = require('./routes/chat.route');
const authRouter = require('./routes/auth.route');
const commentRouter = require('./routes/comment.route');
const postRouter = require('./routes/post.route');
const likeRouter = require('./routes/like.route');
const reportRouter = require('./routes/report.route');
const useMarkRouter = require('./routes/userMark.route');
const facechatRouter = require('./routes/facechat.route');

const server = http.createServer(app);
const faceSocketController = require('./face.socket');  // 실제 경로에 따라 수정해야 합니다.
const io = SocketIO(server);
mongoDB();

app.use(express.json());
app.use(cookieParser());
app.set('view engine', 'html');
app.set('views', __dirname + '/public/views');
app.set('io', io);
faceSocketController(io);
app.use('/public', express.static(__dirname + '/public'));
app.use('/api', [
  authRouter,
  chatRouter,
  commentRouter,
  likeRouter,
  postRouter,
  reportRouter,
  useMarkRouter,
  facechatRouter,
]);

app.get('/', (_, res) => {
  res.sendFile(__dirname + '/public/views/index.html');
});
app.get('/facechat', (_, res) => {
  res.sendFile(__dirname + '/public/views/facechat.html');
});
app.get('/api/login', (_, res) => {
  res.sendFile(__dirname + '/public/views/zoom.html');
});
app.use(cookieParser());

server.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});

// const socketLogic = require('./chat.socket');
// socketLogic(io);
