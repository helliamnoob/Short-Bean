const userList = document.getElementById('userList');
const chatContainer = document.getElementById('chat');
const chatBox = document.getElementById('chatBox');
const availableRooms = document.getElementById('rooms');
chatContainer.hidden = true;
let roomId;

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

    socket.on('welcome', (user) => {
      addMessage(`${user}님이 입장했습니다!!`);
    });

    socket.on('no_room', async (targetUesrId) => {
      const prompt = confirm('방이 없습니다. 방을 만드시겠습니까?');
      if (prompt) {
        await createRoom(targetUesrId);
      }
    });

    socket.on('new_message', addMessage); // argument 를 조정해줄 필요가 없어서 이렇게 써도 된다

    socket.on('bye', (user) => {
      addMessage(`${user}가 떠났습니다`);
    });
    socket.on('enter_room', (room, exChatMessages) => {
      roomId = room;
      exChatMessages.forEach((chat) => {
        addMessage(chat);
      });
    });
    socket.on('sameUser', () => {
      alert('본인과 대화할 수 없습니다.');
    });

    socket.on('show_users', (data) => {
      userList.innerHTML = '';
      renderConnectedUsers(data);
    });

    function renderConnectedUsers(data) {
      data.forEach((user) => {
        const h3 = document.createElement('h3');
        h3.textContent = user.userName;

        const button = document.createElement('button');
        button.textContent = '채팅하기';
        button.classList.add('button'); // "box person" 클래스 추가
        button.addEventListener('click', handleRoomSubmit);

        const userDiv = document.createElement('div');
        userDiv.setAttribute('id', user.userId);
        userDiv.classList.add('box', 'person'); // "box person" 클래스 추가

        userDiv.appendChild(h3);
        userDiv.appendChild(button);

        userList.appendChild(userDiv);
      });
    }

    function handleRoomSubmit(e) {
      const targetUserId = e.target.closest('div').getAttribute('id');
      const targetUserName = e.target.closest('div').querySelector('h3').textContent;
      socket.emit('enter_room', targetUserId, targetUserName, showRoom);
    }

    function showRoom(userName, targetUserName) {
      userList.hidden = true;
      chatContainer.hidden = false;
      const h3 = chatContainer.querySelector('h3');
      h3.innerText = `${userName}님 ${targetUserName}님 의 채팅방`;
      const msg = chatContainer.querySelector('#send-button');
      msg.addEventListener('click', handleMessageSubmit);
    }
    function handleMessageSubmit() {
      const input = chatContainer.querySelector('#chat-input');
      socket.emit('new_message', input.value, roomId, () => {
        addMessage(`myMessage: ${input.value}`);
        input.value = '';
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
function addMessage(message) {
  const li = document.createElement('li');
  li.innerText = message;
  chatBox.appendChild(li);
}

async function createRoom(targetUesrId) {
  console.log(targetUesrId);
  try {
    const response = await fetch('/api/rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        targetId: targetUesrId,
      }),
    });

    if (response.ok) {
      alert('방이 만들어졌습니다.');
      location.reload();
    } else {
      const data = await response.json();
      alert(`fail : ${data.message}`);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}
