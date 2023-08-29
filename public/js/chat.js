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

    socket.on('new_message', addMessage); // argument 를 조정해줄 필요가 없어서 이렇게 써도 된다

    socket.on('bye', (user) => {
      addMessage(`${user} left`);
    });
    socket.on('enter_room', (room) => (roomId = room));

    socket.on('show_users', (data) => {
      userList.innerHTML = '';
      // data 배열을 순회하며 버튼을 생성하여 목록에 추가
      data.forEach((user) => {
        const h3 = document.createElement('h3');
        h3.textContent = user.userName;
        // span.setAttribute('id', user.userId);

        // "CHAT" 버튼 생성
        const button = document.createElement('button');
        button.textContent = '채팅하기';
        button.classList.add('button'); // "box person" 클래스 추가
        button.addEventListener('click', handleRoomSubmit);

        // 사용자 이름 <span>과 "CHAT" 버튼을 포함하는 <div> 생성
        const userDiv = document.createElement('div');
        userDiv.setAttribute('id', user.userId);
        userDiv.classList.add('box', 'person'); // "box person" 클래스 추가

        userDiv.appendChild(h3);
        userDiv.appendChild(button);

        userList.appendChild(userDiv);
      });
    });
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
