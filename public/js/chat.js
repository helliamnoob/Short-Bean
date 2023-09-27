const chatContainer = document.getElementById('chat');
const chatBox = document.getElementById('chatBox');
const faceChatBtn = document.getElementById('faceChatBtn').querySelector('button');
const faceChatForm = document.getElementById('faceChatForm');
const userList = document.getElementById('user-list');
import { socket } from '../util/socket.util.js';

let roomId;
let jwtToken;
let currentUserId;
let userName;
let facechatId;

const screenWidth = window.screen.width;
const screenHeight = window.screen.height;

faceChatForm.style.display = 'none';
chatContainer.style.display = 'none';
document.addEventListener('DOMContentLoaded', async () => {
  jwtToken = getCookieValue('authorization');
  if (!jwtToken || !socket) {
    alert('로그인 후 이용가능한 서비스입니다.');
    window.location.href = `/`;
  } else {
    currentUserId = getUserIdFromToken(jwtToken);
    socketOn();
    socket.emit('register', currentUserId);
    socket.on('receive_invite', async (inviterId, roomId) => {
      const accept = confirm('화상 채팅 초대가 도착했습니다! 수락하시겠습니까?');
      if (accept) {
        try {
          // API에 POST 요청을 보낼 데이터 설정
          const data = {
            target_user_id: currentUserId, // 현재 유저의 ID
            user_id: inviterId, // 초대한 사람의 ID
            facechat_room_id: roomId, // 방 ID
          };

          // API에 POST 요청을 보냄
          const response = await fetch('/api/facechat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          if (response.status === 200 || response.status === 201) {
            const responseData = await response.json();
            facechatId = responseData.facechat_id;
            console.log('API POST successful');
            
            // 값을 localStorage에 저장
            localStorage.setItem('facechatId', facechatId);
            socket.emit('accept_face_chat', inviterId, currentUserId, roomId);
          } else {
            console.error('API POST failed', response);
            console.error('Failed response details:', response.statusText);
          }
        } catch (error) {
          console.error('An error occurred while making a POST request', error);
        }
      }
    });

    socket.on('start_face_chat', (roomId) => {
      console.log('Invitation accepted! Attempting to open chat window for room:', roomId);
      window.open(
        `/facechat?room=${roomId}`,
        '_blank',
        `width=${screenWidth},height=${screenHeight}`
      );
    });
  }
});
document.body.addEventListener('click', (event) => {
  if (event.target.classList.contains('facechatBtn')) {
    const inviteeId = event.target.getAttribute('data-user-id');
    if (inviteeId === String(currentUserId)) {
      alert('자기 자신에게는 화상채팅을 할 수 없습니다.');
      return;
    }

    const roomId = uuidv4();
    console.log(`Generated room ID using UUID: ${roomId}`);

    socket.emit('invite_face_chat', inviteeId, currentUserId, roomId);
    console.log(`Invitation sent to user with ID: ${inviteeId}`);
    window.open(`/facechat?room=${roomId}`, '_blank', 'width=800,height=600');
  }
});

async function socketOn() {
  socket.on('no_room', async (targetUesrId) => {
    const prompt = confirm('방이 없습니다. 방을 만드시겠습니까?');
    if (prompt) {
      await createRoom(targetUesrId);
    }
  });
  socket.on('getName', (name) => (userName = name));

  socket.on('new_message', (msg) => addMessage(msg, getCurrentTime())); // argument 를 조정해줄 필요가 없어서 이렇게 써도 된다

  socket.on('bye', (user) => {
    addMessage(`${user}가 떠났습니다`);
  });
  socket.on('enter_room', (room, exChatMessages) => {
    chatBox.innerHTML = '';
    roomId = room;

    exChatMessages.forEach((chat) => {
      chat.createdAt = formatTime(chat.createdAt);
      addMessage(chat.message, chat.createdAt);
    });
    scrollToBottom();
  });
  socket.on('welcome', (user) => {
    addMessage(`${user}가 입장했습니다.`);
  });
  socket.on('show_users', (socketUser) => {
    userList.innerHTML = '';
    renderUsers(socketUser);
  });
  socket.on('notice_message', (msg, targetUserName) => {
    if (Notification.permission === 'granted') {
      const notification = new Notification('새 메시지', {
        body: msg,
      });
      notification.onclick = () => {
        const targetUserDiv = document.querySelector(
          `.userInterface[data-user-name="${targetUserName}"]`
        );
        if (targetUserDiv) {
          const buttonChat = targetUserDiv.querySelector('.button-chat');
          if (buttonChat) {
            buttonChat.click();
          }
        }
        notification.close();
      };
    }
  });
  faceChatBtn.addEventListener('click', () => {
    faceChatForm.style.display = 'block';
    socket.emit('show_tutor', handleFaceChatBtn);
  });
  // 수정;
  // await getAllUsers();
}

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
function addMessage(message, createdAt) {
  const div = document.createElement('div');

  const [sender, content] = message.split(':');
  if (sender == userName) {
    div.classList.add('right-message');
  } else if (!content) {
    div.classList.add('notice-message');
  } else {
    div.classList.add('left-message');
  }

  div.innerText = message;

  const createdAtSpan = document.createElement('span');
  createdAtSpan.classList.add('createdAt');
  createdAtSpan.textContent = createdAt;

  div.appendChild(createdAtSpan);

  chatBox.appendChild(div);
  scrollToBottom();
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
const closeBtn = document.querySelector('.close');
closeBtn.addEventListener('click', () => {
  faceChatForm.style.display = 'none';
});
function handleFaceChatBtn(tutors) {
  const tutorListExceptMe = tutors.filter((tutor) => tutor.userId !== currentUserId);

  const tutorList = document.getElementById('tutorList');
  tutorList.innerHTML = '';
  tutorListExceptMe.forEach((tutor) => {
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
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
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

      // allUserList.innerHTML = '';
      const allUserExceptMe = data.data.filter((user) => user.user_id !== currentUserId);
      return allUserExceptMe;
    } else {
      const data = await response.json();
      alert(`fail : ${data.message}`);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}
async function renderUsers(socketUser) {
  const socketUserExceptMe = socketUser.filter((user) => user.userId !== currentUserId);
  const allUserExceptMe = await getAllUsers();
  const offlineUser = allUserExceptMe.filter(
    (alluser) => !socketUserExceptMe.some((connectUser) => connectUser.userId === alluser.user_id)
  );
  socketUserExceptMe.forEach((user) => {
    const div = document.createElement('div');
    div.setAttribute('data-user-id', user.userId);
    div.setAttribute('data-user-name', user.userName);
    div.classList.add('userInterface');
    div.textContent = `🟢${user.userName}`;
    const chatBtn = document.createElement('button');
    chatBtn.textContent = '채팅하기';
    chatBtn.classList.add('button-chat');
    chatBtn.addEventListener('click', handleRoomSubmit);
    div.appendChild(chatBtn);
    userList.appendChild(div);
  });
  offlineUser.forEach((user) => {
    const div = document.createElement('div');
    div.setAttribute('data-user-id', user.user_id);
    div.setAttribute('data-user-name', user.user_name);
    div.textContent = `🔴${user.user_name}`;
    div.classList.add('userInterface');
    const chatBtn = document.createElement('button');
    chatBtn.textContent = '채팅하기';
    chatBtn.classList.add('button-chat');
    chatBtn.addEventListener('click', handleRoomSubmit);
    div.appendChild(chatBtn);
    userList.appendChild(div);
  });
}

function handleRoomSubmit(e) {
  const targetUserId = e.target.closest('div').getAttribute('data-user-id');
  const targetUserName = e.target.closest('div').getAttribute('data-user-name');
  socket.emit('enter_room', targetUserId, targetUserName, showRoom);
}

function showRoom(targetUserName) {
  chatContainer.style.display = 'block';
  const h2 = chatContainer.querySelector('h2');
  h2.innerText = `${targetUserName}님 과 채팅`;
  h2.setAttribute('data-user-name', targetUserName); // 1
  const sendBtn = chatContainer.querySelector('#send');
  sendBtn.addEventListener('click', handleMessageSubmit);
  const input = chatContainer.querySelector('#message');
  input.addEventListener('keydown', (e) => {
    e.preventDefault();
    if (e.key == 'Enter') {
      handleMessageSubmit();
    }
  });
  input.focus();
  scrollToBottom();
}
function handleMessageSubmit() {
  const targetUserName = chatContainer.querySelector('h2').getAttribute('data-user-name');
  const input = chatContainer.querySelector('#message');
  if (!input.value) return;
  socket.emit('new_message', input.value, roomId, targetUserName, () => {
    addMessage(`${userName}: ${input.value}`, getCurrentTime());
    input.value = '';
  });
}

function getCurrentTime() {
  const now = new Date(); // 현재 날짜와 시간을 생성
  const hours = now.getHours(); // 현재 시간(시) 가져오기
  const minutes = now.getMinutes(); // 현재 시간(분) 가져오기

  // 현재 시간을 시:분:초 형식으로 반환
  const minutesWith0 = minutes < 10 ? `0${minutes}` : minutes;
  const currentTime = `${hours}:${minutesWith0}`;

  return currentTime;
}
function formatTime(dateString) {
  const date = new Date(dateString);
  date.setUTCHours(date.getUTCHours());

  const hours = date.getHours().toString().padStart(2, '0'); // 시
  const minutes = date.getMinutes().toString().padStart(2, '0'); // 분

  const formattedTime = `${hours}:${minutes}`;
  return formattedTime;
}
function scrollToBottom() {
  chatBox.scrollTop = chatBox.scrollHeight;
}

const logoutBtn = document.getElementById('logout');
logoutBtn.addEventListener('click', async () => {
  const prompt = confirm('로그아웃 하시겠습니까?');
  if (!prompt) {
    return;
  } else {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert(`로그아웃 되었습니다.`);
        window.location.href = '/';
      } else {
        const data = await response.json();
        alert(`fail : ${data.message}`);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  }
});
