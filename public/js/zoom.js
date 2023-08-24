const roomList = document.getElementById('roomList');
const enterRoomForm = roomList.querySelector('button');
const userList = document.getElementById('userList');
const chatBox = document.getElementById('chat');
const availableRooms = document.getElementById('rooms');
chatBox.hidden = true;

//간단로그인
const loginForm = document.getElementById('login');
const loginbtn = loginForm.querySelector('button');
const emailInput = document.getElementById('email');
const pwdInput = document.getElementById('password');

// const socket = io();
// let socket;
loginbtn.addEventListener('click', async () => {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: emailInput.value,
        password: pwdInput.value,
      }),
    });

    if (response.ok) {
      // 로그인 성공시 페이지 이동
      alert('로그인이 되었습니다.');
      console.log(await response.json());
      const jwtToken = getCookieValue('authorization');
      const socket = io({
        auth: {
          token: jwtToken,
        },
      });
      enterRoomForm.addEventListener('click', handleRoomSubmit);

      socket.on('welcome', (user, newCount) => {
        const h3 = chatBox.querySelector('h3');
        h3.innerText = `Room ${roomName} 현재 (${newCount}명)`;
        addMessage(`${user} joined!!`);
      });

      socket.on('bye', (user, newCount) => {
        const h3 = chatBox.querySelector('h3');
        h3.innerText = `Room ${roomName} 현재 (${newCount}명)`;
        addMessage(`${user} left`);
      });

      socket.on('new_message', addMessage); // argument 를 조정해줄 필요가 없어서 이렇게 써도 된다

      socket.on('room_change', (rooms) => {
        availableRooms.innerHTML = '';
        if (rooms.length === 0) {
          return;
        }
        rooms.forEach((room) => {
          const li = document.createElement('li');
          li.innerText = room;
          availableRooms.append(li);
        });
      });

      socket.on('show_users', (users) => {
        const ul = userList.querySelector('ul');
        ul.innerHTML = '';
        if (users.length === 0) {
          return;
        }
        users.forEach((user) => {
          const li = document.createElement('li');
          li.innerHTML = `😊${user}`;
          ul.append(li);
        });
      });

      let roomName;
      function addMessage(message) {
        const ul = chatBox.querySelector('ul');
        const li = document.createElement('li');
        li.innerText = message;
        ul.appendChild(li);
      }

      function handleMessageSubmit() {
        const input = chatBox.querySelector('#messageInput input');
        socket.emit('new_message', input.value, roomName, () => {
          addMessage(`myMessage: ${input.value}`);
        });
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

      function handleRoomSubmit(event) {
        event.preventDefault();
        const input = roomList.querySelector('input');
        socket.emit('enter_room', input.value, showRoom);
        roomName = input.value;
        input.value = '';
      }
    } else {
      const data = await response.json();
      alert(`로그인 실패: ${data.message}`);
    }
  } catch (error) {
    console.error('Error:', error);
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

// 입장먼저하자
