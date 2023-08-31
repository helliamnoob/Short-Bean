// 유저 환영 문구 불러오기
function displayWelcomeMessage(userName) {
  var welcomeLabel = document.getElementById('welcome-label');
  welcomeLabel.textContent = '학생 ' + userName + '님 환영합니다';
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
// 맨밑이랑 겹쳐서 에러나서 맨밑에다 추가함
// window.onload = function () {
//   fetchUserName();
// };

// 마이페이지 버튼 클릭 시 이동: 유저네임 or 유저아이디 고민
function setupMyPageButton(user_id) {
  const myPageButton = document.getElementById('mypage-button');
  myPageButton.addEventListener('click', function () {
    window.location.href = `/public/views/userInfo.html?user_id=${user_id}`; // 추후에 만들어진 마이페이지 URL로 이동
  });
}

// 질문하기 버튼 클릭 시 페이지 이동
document.getElementById('question-button').addEventListener('click', function () {
  fetch('/api/user') // 현재 로그인된 사용자의 정보를 가져옴
    .then((response) => response.json())
    .then((data) => {
      const user_id = data.user_id; // 현재 로그인된 사용자의 user_id
      const questionPageURL = `/public/views/post-detail.html?user_id=${user_id}`; // 질문 페이지 URL 생성
      window.location.href = questionPageURL; // 페이지 이동
    })
    .catch((error) => {
      console.error('사용자 정보를 가져오는 중 에러 발생:', error);
    });
});

// 1:1 상담 버튼 클릭 시 페이지 이동
// const chatButton = document.getElementById('chat-button');
// chatButton.addEventListener('click', function () {
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

// // 인기 순으로 게시글 데이터를 받아와 화면에 표시하는 함수
// function displayPosts(posts) {
//   const postList = document.getElementById('post-list');

//   posts.forEach((post) => {
//     const postContainer = document.createElement('div');
//     postContainer.classList.add('post');

//     const image = document.createElement('img');
//     image.src = post.imageURL;
//     image.alt = post.title;

//     const title = document.createElement('h2');
//     title.textContent = post.title;

//     postContainer.appendChild(image);
//     postContainer.appendChild(title);

//     postList.appendChild(postContainer);
//   });
// }

// // API 엔드포인트에서 게시글 목록을 가져와 화면에 표시하는 함수 호출
// fetch('/api/posts/likes') // API 엔드포인트에 요청을 보냅니다.
//   .then((response) => response.json())
//   .then((data) => {
//     const sortedPosts = data.posts.sort((a, b) => b.likes - a.likes); // 좋아요 순으로 정렬
//     displayPosts(sortedPosts); // 게시글 표시 함수 호출
//   })
//   .catch((error) => {
//     console.error('게시글 정보를 가져오는 중 에러 발생:', error);
//   });

// 프론트엔드 스크립트에서 사용하는 API 엔드포인트
const popularPostsApi = '/api/popular-posts';
const allPostsApi = '/api/all-posts';

// 인기 문제 불러오기
function displayPopularPosts(data) {
  const popularPostsContainer = document.getElementById('popular-posts-container');
  popularPostsContainer.innerHTML = ''; // 기존 내용 초기화

  data.forEach((post) => {
    const postCard = document.createElement('div');
    postCard.className = 'post-card';

    // 이미지 추가
    const imageElement = document.createElement('img');
    imageElement.src = post.image; // 이미지 경로 설정
    postCard.appendChild(imageElement);

    // 제목 추가
    const titleElement = document.createElement('h2');
    titleElement.textContent = post.title; // 제목 설정
    postCard.appendChild(titleElement);

    popularPostsContainer.appendChild(postCard);
  });
}

// 전체 문제 불러오기
function displayAllPosts(data) {
  const allPostsContainer = document.getElementById('all-posts-container');
  allPostsContainer.innerHTML = ''; // 기존 내용 초기화

  data.forEach((post) => {
    const postCard = document.createElement('div');
    postCard.className = 'post-card';

    // 이미지 추가
    const imageElement = document.createElement('img');
    imageElement.src = post.image; // 이미지 경로 설정: post_id? post?
    postCard.appendChild(imageElement);

    // 제목 추가
    const titleElement = document.createElement('h2');
    titleElement.textContent = post.title; // 제목 설정: post_id? post?
    postCard.appendChild(titleElement);

    allPostsContainer.appendChild(postCard);
  });
}

// // API를 호출하여 데이터 가져오기 및 표시
// function fetchAndDisplayData(apiEndpoint, displayFunction) {
//   fetch(apiEndpoint)
//     .then((response) => response.json())
//     .then((data) => {
//       displayFunction(data);
//     })
//     .catch((error) => {
//       console.error('데이터를 가져오는 중 에러 발생:', error);
//     });
// }

// // 페이지 로드 시 데이터 가져와서 표시
// window.onload = function () {
//   fetchUserName();
//   fetchAndDisplayData(popularPostsApi, displayPopularPosts);
//   fetchAndDisplayData(allPostsApi, displayAllPosts);
// };

// 페이지 로드 시 데이터 가져와서 표시
document.addEventListener('DOMContentLoaded', function () {
  fetchUserName();
  fetchAndDisplayData(popularPostsApi, displayPopularPosts);
  fetchAndDisplayData(allPostsApi, displayAllPosts);
});
