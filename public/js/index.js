const roomList = document.getElementById('roomList');
const enterRoomForm = roomList.querySelector('button');
const userList = document.getElementById('userList');
const chatBox = document.getElementById('chat');
const availableRooms = document.getElementById('rooms');
chatBox.hidden = true;
let roomName;

document.addEventListener('DOMContentLoaded', () => {
  const jwtToken = getCookieValue('authorization');
  if (!jwtToken) {
    alert('로그인 후 이용가능한 서비스입니다.');
    window.location.href = `/public/views/login.html`;
  } else {
    const socket = io({
      auth: {
        token: jwtToken,
      },
    });
    socket.on('show_users', (data) => {
      console.log(data);
      // 이제 요놈들은 띄우면 되고
    });

    socket.on('welcome', (user) => {
      const h3 = chatBox.querySelector('h3');
      h3.innerText = `Room ${roomName}`;
      addMessage(`${user} joined!!`);
    });

    socket.on('new_message', addMessage); // argument 를 조정해줄 필요가 없어서 이렇게 써도 된다

    socket.on('bye', (user) => {
      addMessage(`${user} left`);
    });

    enterRoomForm.addEventListener('click', handleRoomSubmit);

    function handleRoomSubmit(event) {
      event.preventDefault();
      const input = roomList.querySelector('input');
      socket.emit('enter_room', input.value, showRoom);
      roomName = input.value;
      input.value = '';
    }

    function showRoom() {
      roomList.hidden = true;
      userList.hidden = true;
      chatBox.hidden = false;
      const h3 = chatBox.querySelector('h3');
      h3.innerText = `Room ${roomName}`;
      const msg = chatBox.querySelector('#messageInput button');
      msg.addEventListener('click', handleMessageSubmit);
    }
    function handleMessageSubmit() {
      const input = chatBox.querySelector('#messageInput input');
      socket.emit('new_message', input.value, roomName, () => {
        addMessage(`myMessage: ${input.value}`);
      });
    }
  }
});
function getCookieValue(cookieName) {
  const cookieParts = document.cookie.split('; ');

  for (const part of cookieParts) {
    const [name, value] = part.split('=');
    if (name === cookieName) {
      return value;
    }
  }
  return null;
}

// const socket = io();

// 다시짜보자

function addMessage(message) {
  const ul = chatBox.querySelector('ul');
  const li = document.createElement('li');
  li.innerText = message;
  ul.appendChild(li);
}
