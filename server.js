const SocketIO = require('socket.io');
const express = require('express');
const app = express();
const port = 3000;
const http = require('http');
const cookieParser = require('cookie-parser');
const chatRouter = require('./routes/chat.route');
const authRouter = require('./routes/auth.route');
const commentRouter = require('./routes/comment.route');
const postRouter = require('./routes/post.route');
const likeRouter = require('./routes/like.route');
const reportRouter = require('./routes/report.route');
const useMarkRouter = require('./routes/userMark.route');

const server = http.createServer(app);
const io = SocketIO(server);

app.use(express.json());
app.use(cookieParser());
app.set('view engine', 'html');
app.set('views', __dirname + '/public/views');
app.set('io', io);
app.use('/public', express.static(__dirname + '/public'));
app.use('/api', [
  authRouter,
  chatRouter,
  commentRouter,
  likeRouter,
  postRouter,
  reportRouter,
  useMarkRouter,
]);
app.get('/', (_, res) => {
  res.sendFile(__dirname + '/public/views/index.html');
});
app.use(cookieParser());

server.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});

const socketLogic = require('./socket');
socketLogic(io);

// API 통신
// 소켓 통신
