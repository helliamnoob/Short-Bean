const socket = io();

const roomList = document.getElementById("roomList");
const enterRoomForm = roomList.querySelector("button");
const userList = document.getElementById("userList");
const chatBox = document.getElementById("chat");
const availableRooms = document.getElementById("rooms");
chatBox.hidden = true;

// 입장먼저하자
enterRoomForm.addEventListener("click", handleRoomSubmit);

let roomName;

function addMessage(message) {
  const ul = chatBox.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit() {
  console.log("??");
  const input = chatBox.querySelector("#messageInput input");
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`myMessage: ${input.value}`);
  });
}

function showRoom() {
  roomList.hidden = true;
  userList.hidden = true;
  chatBox.hidden = false;
  const h3 = chatBox.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  const msg = chatBox.querySelector("#messageInput button");
  msg.addEventListener("click", handleMessageSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = roomList.querySelector("input");
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
}

socket.on("welcome", (user, newCount) => {
  const h3 = chatBox.querySelector("h3");
  h3.innerText = `Room ${roomName} 현재 (${newCount}명)`;
  addMessage(`${user} joined!!`);
});

socket.on("bye", (user, newCount) => {
  const h3 = chatBox.querySelector("h3");
  h3.innerText = `Room ${roomName} 현재 (${newCount}명)`;
  addMessage(`${user} left`);
});

socket.on("new_message", addMessage); // argument 를 조정해줄 필요가 없어서 이렇게 써도 된다

socket.on("room_change", (rooms) => {
  availableRooms.innerHTML = "";
  if (rooms.length === 0) {
    return;
  }
  console.log(rooms);
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    availableRooms.append(li);
  });
});

socket.on("show_users", (users) => {
  console.log(users);
  const ul = userList.querySelector("ul");
  ul.innerHTML = "";
  if (users.length === 0) {
    return;
  }
  users.forEach((user) => {
    const li = document.createElement("li");
    li.innerHTML = `😊${user}`;
    ul.append(li);
  });
});
