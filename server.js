const SocketIO = require("socket.io");
const express = require("express");
const app = express();
const port = 3000;
const http = require("http");

const server = http.createServer(app);
const io = SocketIO(server);
// const router = require("./routes");

app.use(express.json());
app.use(express.static("./public")); //정적파일 사용하기 위해, assets의 html, css, js, 이미지 등
// app.use("/api", router);
app.get("/", (_, res) => {
  res.sendFile(__dirname + "/public/views/chatTest.html");
});

server.listen(port, () => {
  console.log(port, "포트로 서버가 열렸어요!");
});

const socketLogic = require("./socket");
socketLogic(io);
