const connectedUserList = document.getElementById('connectedUserList');
const chatContainer = document.getElementById('chat');
const allUserList = document.getElementById('allUserList');
const chatBox = document.getElementById('chatBox');
const availableRooms = document.getElementById('rooms');
const faceChatBtn = document.getElementById('faceChatBtn').querySelector('button');
const faceChatForm = document.getElementById('faceChatForm');
const connectedUserForm = document.getElementById('connectedUserForm');
const allUserForm = document.getElementById('allUserForm');

faceChatForm.style.display = 'none';
chatContainer.hidden = true;
let roomId;

document.addEventListener('DOMContentLoaded', async () => {
  const jwtToken = getCookieValue('authorization');
  const currentUserId = getUserIdFromToken(jwtToken);

  if (!jwtToken) {
    alert('로그인 후 이용가능한 서비스입니다.');
    window.location.href = `/public/views/login.html`;
  } else {
    const socket = io({
      auth: {
        token: jwtToken,
      },
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
    socket.on('show_users', (socketUser) => {
      connectedUserList.innerHTML = '';
      renderConnectedUsers(socketUser);
    });
    faceChatBtn.addEventListener('click', () => {
      faceChatForm.style.display = 'block';
      socket.emit('show_tutor', handleFaceChatBtn);
    });
    // 수정;
    await getAllUsers();

    function renderConnectedUsers(socketUser) {
      console.log(socketUser);
      socketUser.forEach((user) => {
        const h3 = document.createElement('h3');
        h3.textContent = user.userName;

        const chatBtn = document.createElement('button');
        chatBtn.textContent = '채팅하기';
        chatBtn.classList.add('button'); // "box person" 클래스 추가
        chatBtn.addEventListener('click', handleRoomSubmit);

        const userDiv = document.createElement('div');
        userDiv.setAttribute('id', user.userId);
        userDiv.classList.add('box', 'person'); // "box person" 클래스 추가

        userDiv.appendChild(h3);
        userDiv.appendChild(chatBtn);

        connectedUserList.appendChild(userDiv);
      });
    }
    function handleFaceChatBtn(tutors) {
      const tutorList = document.getElementById('tutorList');
      tutorList.innerHTML = '';
      tutors.forEach((tutor) => {
        const h3 = document.createElement('h3');
        h3.textContent = `${tutor.userName} 선생님`;

        const chatBtn = document.createElement('button');
        chatBtn.textContent = '채팅하기';

        const faceChatBtn = document.createElement('button');
        faceChatBtn.textContent = '화상채팅하기';
        faceChatBtn.classList.add('facechatBtn');
        faceChatBtn.setAttribute('data-user-id', tutor.userId);

        // button.addEventListener('click', handleRoomSubmit);

        const userDiv = document.createElement('div');
        userDiv.setAttribute('id', tutor.userId);
        userDiv.classList.add('box', 'person'); // "box person" 클래스 추가

        userDiv.appendChild(h3);
        userDiv.appendChild(faceChatBtn);
        userDiv.appendChild(chatBtn);

        tutorList.appendChild(userDiv);
      });
    }
    function handleRoomSubmit(e) {
      const targetUserId = e.target.closest('div').getAttribute('id');
      const targetUserName = e.target.closest('div').querySelector('h3').textContent;
      socket.emit('enter_room', targetUserId, targetUserName, showRoom);
    }

    function showRoom(userName, targetUserName) {
      connectedUserForm.style.display = 'none';
      allUserForm.style.display = 'none';
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
    async function getAllUsers() {
      try {
        const response = await fetch('/api/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          allUserList.innerHTML = '';
          data.data.forEach((user) => {
            const h3 = document.createElement('h3');
            h3.textContent = user.user_name;

            const button = document.createElement('button');
            button.textContent = '채팅하기';
            button.classList.add('button'); // "box person" 클래스 추가
            button.addEventListener('click', handleRoomSubmit);

            const userDiv = document.createElement('div');
            userDiv.setAttribute('id', user.user_id);
            userDiv.classList.add('box', 'person'); // "box person" 클래스 추가

            userDiv.appendChild(h3);
            userDiv.appendChild(button);

            allUserList.appendChild(userDiv);
          });
        } else {
          const data = await response.json();
          alert(`fail : ${data.message}`);
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
    }
    // 에림님 코드
    socket.emit('register', currentUserId);

    document.body.addEventListener('click', (event) => {
      if (event.target.classList.contains('facechatBtn')) {
        const inviteeId = event.target.getAttribute('data-user-id');
        // 로그인한 사용자가 자기 자신에게 화상채팅을 걸 수 없도록 체크
        if (inviteeId === String(currentUserId)) {
          alert('자기 자신에게는 화상채팅을 할 수 없습니다.');
          return;
        }
        socket.emit('invite_face_chat', inviteeId);
        console.log(`Invitation sent to user with ID: ${inviteeId}`);
      }
    });

    // 초대 수신 시의 이벤트 처리
    socket.on('receive_invite', (inviteeId) => {
      const accept = confirm('화상 채팅 초대가 도착했습니다! 수락하시겠습니까?');
      if (accept) {
        socket.emit('accept_face_chat', inviteeId);
      }
    });

    // 초대가 수락되었을 때 처리하는 이벤트 핸들러
    socket.on('start_face_chat', () => {
      console.log('Invitation accepted! Start the face chat.');
      window.location.href = '/facechat'; // 화상 채팅 페이지 URL을 가정한 것입니다.
    });
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
function closeModal() {
  faceChatForm.style.display = 'none';
}

function exitChatRoom() {
  chatBox.innerHTML = '';
  chatContainer.hidden = true;
  connectedUserForm.style.display = 'block';
  allUserForm.style.display = 'block';
}
function getUserIdFromToken(token) {
  // JWT 토큰에서 사용자 ID 추출
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

  console.log('base64:', base64); // 콘솔
  const payloadObj = JSON.parse(window.atob(base64));

  console.log('payloadObj:', payloadObj); // 콘솔
  const currentUserId = payloadObj.user_id; // 현재 로그인한 사용자의 ID
  return currentUserId;
}
