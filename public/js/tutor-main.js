// 선생님 환영 문구 불러오기
function displayWelcomeMessage(userName) {
  var welcomeLabel = document.getElementById('welcome-label');
  welcomeLabel.textContent = '선생님 ' + userName + '님 환영합니다';
}

// 페이지가 로드될 때 사용자 정보를 가져와 환영 메시지를 표시합니다.
function fetchUserName() {
  fetch('/api/user') // API 엔드포인트에 요청을 보냅니다.
    .then((response) => response.json())
    .then((data) => {
      displayWelcomeMessage(data.userName);
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

// 1:1 메신저 응답 클릭 시 이동
