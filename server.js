const SocketIO = require('socket.io');
const express = require('express');
const session = require('express-session');
// const sql_store = require('express-mysql-session');
const cors = require('cors');
const app = express();
const memory_session = require('memorystore')(session);
const checkLogin = require('./routes/check.js');

const port = 3000;
const http = require('http');
const cookieParser = require('cookie-parser');
const { mongoDB } = require('./config/mongo.config');

const options = {
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
};
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    store: new memory_session(options),
  })
);

const {
  chatRouter,
  authRouter,
  commentRouter,
  postRouter,
  likeRouter,
  reportRouter,
  useMarkRouter,
  facechatRouter,
  tutorRouter,
  adminRouter,
  adminSessionRouter,
} = require('./routes');

const server = http.createServer(app);
const io = SocketIO(server);
mongoDB();

app.use(
  cors({
    origin: '*',
    credentials: 'include',
  })
);
app.use(express.json());
app.use(cookieParser());
app.set('view engine', 'html');
app.set('views', __dirname + '/public/views');
app.set('io', io);
app.use('/public', express.static(__dirname + '/public'));
// app.use('/', express.static(__dirname + '/public/views'));
// 경로숨기는 옵션도 존재한다.
app.use('/api', [
  authRouter,
  chatRouter,
  commentRouter,
  likeRouter,
  postRouter,
  reportRouter,
  useMarkRouter,
  facechatRouter,
  tutorRouter,
  adminRouter,
  adminSessionRouter,
]);

app.get('/', (_, res) => {
  res.sendFile(__dirname + '/public/views/login.html');
});

app.get('/login', (_, res) => {
  res.sendFile(__dirname + '/public/views/login.html');
});
app.get('/facechat', (_, res) => {
  res.sendFile(__dirname + '/public/views/facechat.html');
});
// app.get('/api/login', (_, res) => {
//   res.sendFile(__dirname + '/public/views/zoom.html');
// });
app.get('/admin', checkLogin, (req, res) => {
  res.sendFile(__dirname + '/public/views/admin.html');
});
app.get('/post', (_, res) => {
  res.sendFile(__dirname + '/public/views/post.html');
});

app.get('/admin/id=:id', (req, res) => {
  res.sendFile(__dirname + '/public/views/report-detail.html');
});
app.get('/admin/tutors/id=:id', (req, res) => {
  res.sendFile(__dirname + '/public/views/tutor-detail.html');
});
app.get('/public/tutorlist', (req, res) => {
  res.sendFile(__dirname + '/public/views/tutor-list.html');
});
app.get('/admin/login', (req, res) => {
  res.sendFile(__dirname + '/public/views/admin_login.html');
});

// app.use(cookieParser(process.env.COOKIE_SECRET));

server.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});

const socketLogic = require('./chat.socket');
socketLogic(io);
