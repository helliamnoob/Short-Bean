import { socket } from '../util/socket.util.js';

document.addEventListener('DOMContentLoaded', () => {
  if (Notification.permission !== 'granted') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log(Notification.permission);
      } else {
        console.log(Notification.permission);
      }
    });
  }
});

socket.on('notice_message', (msg) => {
  if (Notification.permission === 'granted') {
    const notification = new Notification('새 메시지', {
      body: msg,
    });

    notification.onclick = () => {
      window.location.href = `/public/views/chat.html`;
      notification.close();
    };
  }
});
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
window.onload = function () {
  fetchUserName();
};

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
  // fetch('/api/user') // 현재 로그인된 사용자의 정보를 가져옴
  //   .then((response) => response.json())
  //   .then((data) => {
  //     window.location.href = `/public/views/chat.html`; // 채팅 페이지 URL
  //   })
  //   .catch((error) => {
  //     console.error('사용자 정보를 가져오는 중 에러 발생:', error);
  //   });
  // 쿠키로 검증해서 api호출 안해도 될듯해서 주석처리했습니다
  // 패치쓰면 async await 안써도되나요???
  window.location.href = `/public/views/chat.html`; // 채팅 페이지 URL
});

document.getElementById('mypage-button').addEventListener('click', function () {
  window.location.href = `/public/views/userinfo.html`;
});

document.getElementById('all-question-button').addEventListener('click', function () {
  window.location.href = `/public/views/post-list.html`;
});

// --------------------------------------------------------------------------------------------------------
// 인기순 게시글 리스트2
// 좋아요 내림차순 게시글 리스트 표시
// 대체이미지
const defaultImage = '/public/images/콩 (10).png';

document.addEventListener('DOMContentLoaded', async function () {
  try {
    const response = await fetch('/api/posts/likes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();

      // 데이터를 활용하여 화면에 게시글 리스트 표시하기
      const postListContainer = document.getElementById('posts-box1');

      data.slice(0, 4).forEach((post) => {
        let title = post.title;
        let subject = post.subject;
        let image = post.image;
        if (!image) {
          image = defaultImage;
        }
        let temp_html = `
        <div data-post-id="${post.post_id}" class="card" style="width: 18rem">
            <img src="${image}" class="card-img-top" alt="${image}" />
            <div class="card-body">
            <p>이름: ${post.User.nickname}</p> 
            <h5 class="card-title">제목: ${title}</h5>
            <p>과목: ${subject}</p>
            </div>
          </div>`;
        postListContainer.insertAdjacentHTML('beforeend', temp_html);
      });
    } else {
      console.error('게시글 조회 실패:', response.statusText);
      alert('게시글 조회에 실패했습니다.');
    }
  } catch (error) {
    console.error('게시글 조회 오류:', error);
    alert('게시글 조회 중 오류가 발생했습니다.');
  }
});
const hotPostList = document.getElementById('posts-box1');

hotPostList.addEventListener('click', (e) => {
  const post = e.target.closest('div');
  const postId = post.getAttribute('data-post-id');
  if (postId) window.location.href = `/public/views/post.html?post_id=${postId}}`;
});

// 게시글 리스트
document.addEventListener('DOMContentLoaded', async function () {
  let rows = await getPosts();
  const postBox = document.getElementById('posts-box');
  postBox.innerHTML = '';

  rows.forEach((post) => {
    console.log(post);
    let title = post['title'];
    let subject = post['subject'];
    let image = post.image;
    if (!image) {
      image = defaultImage;
    }

    let temp_html = `<div data-post-id="${post.post_id}" class="card" style="width: 18rem">
    <img src="${image}" alt="${image}" />
    <div class="card-body">
    <p>이름: ${post.User.nickname}</p> 
    <h5 class="card-title">제목: ${title}</h5>
    <p>과목: ${subject}</p>
    </div>
  </div>`;
    postBox.insertAdjacentHTML('beforeend', temp_html);
  });
});

const postList = document.getElementById('posts-box');

postList.addEventListener('click', (e) => {
  const post = e.target.closest('div');
  const postId = post.getAttribute('data-post-id');
  if (postId) window.location.href = `/public/views/post.html?post_id=${postId}}`;
});

const searchBtn = document.getElementById('searchBtn');
searchBtn.addEventListener('click', search);

async function search() {
  //검색으로 새로 불러오는 데이터
  let Allposts = await getPosts();
  let inputText = document.getElementById('searchInput').value;

  //검색 유효성 검사
  if (inputText.trim() === '') {
    alert('검색어를 입력해주세요.');
    return;
  }

  const searchData = Allposts.filter((post) => {
    return post.title.includes(inputText) || post.User.nickname.includes(inputText);
  });

  const postBox = document.getElementById('posts-box');
  postBox.innerHTML = '';
  searchData.forEach((post) => {
    let title = post['title'];
    let subject = post['subject'];
    let image = post.image;
    if (!image) {
      image = defaultImage;
    }

    let temp_html = `<div data-post-id="${post.post_id}" class="post-card">
    <img src="${image}" alt="${image}">
    <h5 class="card-title">제목: ${title}</h5>
    <p>이름: ${post.User.nickname}</p>
    <p>과목: ${subject}</p>
    </div>`;
    postBox.insertAdjacentHTML('beforeend', temp_html);
  });
}

async function getPosts() {
  try {
    const response = await fetch('/api/post', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();

      return data.data;
    } else {
      const data = await response.json();
      alert(`fail : ${data.message}`);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// 튜터리스트 페이지 이동
const reportButton = document.querySelector('#tutor-button');
reportButton.addEventListener('click', function () {
  window.location.href = '../tutorlist';
});

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
