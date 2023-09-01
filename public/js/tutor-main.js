// 사용자 환영 메시지 표시 함수
function displayWelcomeMessage(userName) {
  var welcomeLabel = document.getElementById('welcome-label');
  welcomeLabel.textContent = '선생님 ' + userName + '님 환영합니다';
}

// '인기 문제' 박스 멘트 표시 함수
function displayFameQuestionMessage(userName) {
  var fameQuestionLabel = document.getElementById('fameQuestion-label');
  fameQuestionLabel.textContent = userName + '선생님의 답변을 기다리는 문제';
}

// 페이지가 로드될 때 사용자 정보를 가져와 환영 메시지를 표시합니다.
function fetchUserName() {
  fetch('/api/user')
    .then((response) => response.json())
    .then((data) => {
      displayWelcomeMessage(data.userName); // 사용자 환영 메시지 표시
      displayFameQuestionMessage(data.userName); // '인기 문제' 박스 멘트 표시
    })
    .catch((error) => {
      console.error('사용자 정보를 가져오는 중 에러 발생:', error);
    });
}

// 페이지가 로드될 때 사용자 이름을 가져와 환영 메시지를 표시합니다.
window.onload = function () {
  fetchUserName();
};

// 선생님용 마이페이지 버튼 클릭 시 이동
function setupMyPageButton(tutor_id) {
  const myPageButton = document.getElementById('mypage-button');
  myPageButton.addEventListener('click', function () {
    window.location.href = '/mypage'; // 마이페이지 URL로 이동
  });
}

// 실시간 화상 응답 클릭 시 이동
// user_id로 되는 거 확인했으니 추후 tutor인증 받은 아이디로 tutor_id 하면 됨
document.getElementById('facechat-button').addEventListener('click', function () {
  fetch('/api/user') // 현재 로그인된 사용자의 정보를 가져옴
    .then((response) => response.json())
    .then((data) => {
      const user_id = data.user_id; // 현재 로그인된 사용자의 user_id
      window.location.href = `/public/views/facechat.html?user_id=${user_id}`;
    })
    .catch((error) => {
      console.error('사용자 정보를 가져오는 중 에러 발생:', error);
    });
});

// 1:1 메신저 응답 클릭 시 이동
document.getElementById('chat-button').addEventListener('click', function () {
  fetch('/api/user') // 현재 로그인된 사용자의 정보를 가져옴
    .then((response) => response.json())
    .then((data) => {
      const user_id = data.user_id; // 현재 로그인된 사용자의 user_id
      window.location.href = `/public/views/chat.html?user_id=${user_id}`; // 채팅 페이지 URL
    })
    .catch((error) => {
      console.error('사용자 정보를 가져오는 중 에러 발생:', error);
    });
});

// 실시간 질문 리스트
window.addEventListener('DOMContentLoaded', async function () {
  fetch('/api/post', {})
    .then((response) => response.json())
    .then((data) => {
      let rows = data.data;
      console.log(data);
      const postBox = document.getElementById('posts-box');
      rows.forEach((post) => {
        let title = post['title'];
        let content = post['content'];
        let subject = post['subject'];

        let temp_html = `<div class="solo-card">
    <div class="card w-75">
    <div class="card-body">
    <h5 class="card-title">제목: ${title}</h5>
    <p class="card-text">${content}</p>
    <p class="card-text">과목: ${subject}</p>
    </div>
    </div>
    </div>`;
        postBox.insertAdjacentHTML('beforeend', temp_html);
      });
    });
});
