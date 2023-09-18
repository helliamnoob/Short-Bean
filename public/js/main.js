import { socket } from '../util/socket.util.js';

let myRole;

document.addEventListener('DOMContentLoaded', async () => {
  const jwtToken = getCookieValue('authorization');

  if (!jwtToken || !socket) {
    alert('로그인 후 이용가능한 서비스입니다.');
    window.location.href = `/`;
  } else {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log(Notification.permission);
        } else {
          console.log(Notification.permission);
        }
      });
    }
  }

  await tutorList();

  const tutorImage = '/public/images/15.png';
  //튜터 좋아요기준 리스트
  async function tutorList() {
    fetch(`/api/tutors_likes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // 데이터를 활용하여 화면에 게시글 리스트 표시하기
        const tutorListContainer = document.getElementById('tutorList');

        data.slice(0, 4).forEach((data) => {
          let name = data.User.user_name;
          let school = data.school_name;
          let image = tutorImage;
          let tutorId = data.tutor_id;
          let temp_html = `<ul class="tutor-list">
                            <li class="tutor-item">
                              <img src="${image}" class="card-img-top" alt="..." />
                              ${name} / ${school}   
                              <button id="${tutorId}" class="usermark" >
                              <i class="fa-solid fa-heart"></i>
                              </button>
                            </li>
                            <div class="button-container">
                              <button>채팅하기</button>
                            </div>
                          </ul>`;
          tutorListContainer.insertAdjacentHTML('beforeend', temp_html);
        });
      })
      .catch((error) => {
        console.error('튜터 조회 실패:', error);
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
function displayWelcomeMessage(userName, role) {
  var welcomeLabel = document.getElementById('welcome-label');
  welcomeLabel.textContent = `${userName} ${role} 환영합니다`;
}

// 페이지가 로드될 때 사용자 정보를 가져와 환영 메시지를 표시합니다.
function fetchUserName() {
  fetch('/api/user') // API 엔드포인트에 요청을 보냅니다.
    .then((response) => response.json())
    .then((data) => {
      if (data.user.TutorInfo) {
        myRole = '선생님';
      } else {
        myRole = '학생';
      }

      displayWelcomeMessage(data.user.user_name, myRole);
    })
    .catch((error) => {
      console.error('사용자 정보를 가져오는 중 에러 발생:', error);
    });
}
document.getElementById(`question-button`).addEventListener('click', () => {
  window.location.href = `/public/views/post-detail.html`;
});

document.getElementById('chat-button').addEventListener('click', function () {
  window.location.href = `/public/views/chat.html`; // 채팅 페이지 URL
});

document.getElementById('mypage-button').addEventListener('click', function () {
  if (myRole == '선생님') window.location.href = `/public/views/tutorinfo.html`;
  else if (myRole == '학생') window.location.href = `/public/views/userinfo.html`;
  else console.log(myRole);
});

// 인기순 게시글 리스트2
// 좋아요 내림차순 게시글 리스트 표시
// 대체이미지
const defaultImage = '/public/images/콩 (10).png';

document.addEventListener('DOMContentLoaded', async function () {
  fetchUserName();
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
  if (postId) window.location.href = `/public/views/post.html?post_id=${postId}`;
});

// 게시글 리스트
document.addEventListener('DOMContentLoaded', async function () {
  let rows = await getPosts();
  const postBox = document.getElementById('posts-box');
  postBox.innerHTML = '';

  rows.forEach((post) => {
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
  if (postId) window.location.href = `/public/views/post.html?post_id=${postId}`;
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

    let temp_html = `<div data-post-id="${post.post_id}" class="card" style="width: 18rem">
    <img src="${image}" alt="${image}" />
    <div class="card-body">
    <p>이름: ${post.User.nickname}</p> 
    <h5 class="card-title">제목: ${title}</h5>
    <p>과목: ${subject}</p>
    </div>
  </div`;
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

window.onload = function () {
  //async function test() {
  // 즐겨찾기 api 요청
  const markBtns = document.querySelectorAll('usermark');
  console.log(markBtns);
  const tutorId = document.querySelector('tutor-item');
  markBtns.forEach((markBtn) => {
    markBtn.addEventListener('click', function () {
      console.log('버튼버튼');
      fetch(`/api/userMarks/${tutorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.data === true) {
            alert('즐겨찾기 완료되었습니다.');
            location.reload();
          } else if (data.data === false) {
            alert('즐겨찾기가 취소되었습니다.');
            location.reload();
          } else {
            location.reload();
          }
        })
        .catch((error) => {
          console.error({ message: error.message });
        });
    });
  });
};
//};

const tutorListContainer = document.getElementById('tutorList');
tutorListContainer.addEventListener('click', (e) => {
  const markBtn = e.target.closest('button');

  if (markBtn) {
    const tutorId = markBtn.getAttribute('id');
    console.log(tutorId);
    fetch(`/api/userMarks/${tutorId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.data === true) {
          alert('즐겨찾기 완료되었습니다.');
          //location.reload();
        } else if (data.data === false) {
          alert('즐겨찾기가 취소되었습니다.');
          //location.reload();
        } else {
          //location.reload();
        }
      })
      .catch((error) => {
        console.error({ message: error });
      });
  }
});
function getAdmin() {
  fetch(`/api/admin/session`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error({ message: error });
    });
}
