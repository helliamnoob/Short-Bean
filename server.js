const SocketIO = require("socket.io");
const express = require("express");
const app = express();
const port = 3000;
const http = require("http");

const server = http.createServer(app);
const io = SocketIO(server);
// const router = require("./routes");

app.use(express.json());
// app.use("/api", router);
app.set("view engine", "html");
app.set("views", __dirname + "/public/views");
app.set("io", io);
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => {
  res.sendFile(__dirname + "/public/views/index.html");
});
server.listen(port, () => {
  console.log(port, "포트로 서버가 열렸어요!");
});

const socketLogic = require("./socket");
socketLogic(io);
