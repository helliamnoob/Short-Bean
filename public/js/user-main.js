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

// // 프론트엔드 스크립트에서 사용하는 API 엔드포인트
// const popularPostsApi = '/api/popular-posts';
// const allPostsApi = '/api/all-posts';

// // 인기 문제 불러오기
// function displayPopularPosts(data) {
//   const popularPostsContainer = document.getElementById('popular-posts-container');
//   popularPostsContainer.innerHTML = ''; // 기존 내용 초기화

//   data.forEach((post) => {
//     const postCard = document.createElement('div');
//     postCard.className = 'post-card';

//     // 이미지 추가
//     const imageElement = document.createElement('img');
//     imageElement.src = post.image; // 이미지 경로 설정
//     postCard.appendChild(imageElement);

//     // 제목 추가
//     const titleElement = document.createElement('h2');
//     titleElement.textContent = post.title; // 제목 설정
//     postCard.appendChild(titleElement);

//     popularPostsContainer.appendChild(postCard);
//   });
// }

// // 전체 문제 불러오기
// function displayAllPosts(data) {
//   const allPostsContainer = document.getElementById('all-posts-container');
//   allPostsContainer.innerHTML = ''; // 기존 내용 초기화

//   data.forEach((post) => {
//     const postCard = document.createElement('div');
//     postCard.className = 'post-card';

//     // 이미지 추가
//     const imageElement = document.createElement('img');
//     imageElement.src = post.image; // 이미지 경로 설정: post_id? post?
//     postCard.appendChild(imageElement);

//     // 제목 추가
//     const titleElement = document.createElement('h2');
//     titleElement.textContent = post.title; // 제목 설정: post_id? post?
//     postCard.appendChild(titleElement);

//     allPostsContainer.appendChild(postCard);
//   });
// }

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

// // 페이지 로드 시 데이터 가져와서 표시
// document.addEventListener('DOMContentLoaded', function () {
//   fetchUserName();
//   fetchAndDisplayData(popularPostsApi, displayPopularPosts);
//   fetchAndDisplayData(allPostsApi, displayAllPosts);
// });

// // 전체 질문
// window.onload = function () {
//   let globalPosts; // 전역 변수로 게시글 데이터를 저장할 배열

//   const options = {
//     method: 'GET',
//     headers: {
//       accept: 'application/json',
//       Authorization: 'Bearer YOUR_ACCESS_TOKEN', // 액세스 토큰을 적절한 값으로 대체해야 합니다.
//     },
//   };

//   function fetchPosts() {
//     fetch('YOUR_BACKEND_API_URL', options) // 백엔드 API의 URL을 적절한 값으로 대체해야 합니다.
//       .then((response) => response.json())
//       .then((data) => {
//         globalPosts = data; // 전역 변수에 게시글 데이터 저장
//         renderPostCards(data);
//       });
//   }

//   // 페이지 로드시 최초 게시글 데이터 불러오기
//   fetchPosts();

//   // 신규 게시글이 올라올 때마다 자동으로 게시글 카드 덱으로 변경
//   function updatePostDeck(newPost) {
//     globalPosts.unshift(newPost); // 새 게시글을 배열의 맨 앞에 추가
//     renderPostCards(globalPosts);
//   }

//   // 게시글 카드 UI 업데이트
//   function renderPostCards(posts) {
//     var cardContainer = document.querySelector('.card-container');
//     cardContainer.innerHTML = ''; // 기존 카드 제거
//     let cardHTML = '';

//     posts.forEach((post) => {
//       var id = post.id;
//       var title = post.title;
//       var content = post.content;
//       var updatedAt = new Date(post.updatedAt).toLocaleString(); // 업데이트 시간 포맷팅

//       cardHTML += `
//               <div class="post-card">
//                   <h2>${title}</h2>
//                   <p>${content}</p>
//                   <span>업데이트 시간: ${updatedAt}</span>
//               </div>
//           `;
//     });

//     cardContainer.innerHTML = cardHTML;
//   }

//   // 여기서부터는 이벤트 리스너 등록 코드입니다.

//   // 신규 게시글 추가 이벤트 리스너 등록
//   var newPostForm = document.getElementById('new-post-form');
//   newPostForm.addEventListener('submit', handleNewPost);

//   // 신규 게시글 추가 이벤트 핸들러
//   function handleNewPost(event) {
//     event.preventDefault();

//     var titleInput = document.getElementById('post-title');
//     var contentInput = document.getElementById('post-content');

//     // 새 게시글 객체 생성
//     var newPost = {
//       id: globalPosts.length + 1, // 임시 방식으로 id 생성 (실제 백엔드와 연동 필요)
//       title: titleInput.value,
//       content: contentInput.value,
//       updatedAt: new Date().toISOString(), // 현재 시간으로 설정
//     };

//     updatePostDeck(newPost); // 게시글 카드 업데이트
//     newPostForm.reset(); // 입력 폼 초기화
//   }

// 게시글 리스트
document.addEventListener('DOMContentLoaded', async function () {
  let rows = await getPost();
  const postBox = document.getElementById('posts-box');
  rows.forEach((post) => {
    console.log(post);
    let title = post['title'];
    let content = post['content'];
    let subject = post['subject'];
    let postId = post['post_id'];
    // let image = post['image'];

    let temp_html = `<div data-post-id="${post.post_id}" class="post-card">
    <img src="https://health.chosun.com/site/data/img_dir/2016/12/16/2016121602199_0.jpg" alt="https://health.chosun.com/site/data/img_dir/2016/12/16/2016121602199_0.jpg">
    <h5 class="card-title">제목: ${title}</h5>
    <p>이름: ${post.User.nickname}</p>
    <p>과목: ${subject}</p>
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

// window.location.href = `/public/views/post.html?post_id=${rows[index].post_id}`;
async function search() {
  //검색으로 새로 불러오는 데이터
  let { results: movies } = await getMovies();
  let inputText;
  inputText = document.getElementById('search-input').value.toUpperCase(); // 대문자 변환해서 입력받은 데이터 할당

  //검색 유효성 검사
  if (inputText.trim() === '') {
    alert('검색어를 입력해주세요.');
    return;
  }

  const searchData = movies.filter((x) => {
    let a = x.title.toUpperCase();
    return a.includes(inputText);
  }); // title 도 대문자로 includes로 문자열이 포함되어있으면 serchData로 반환

  seepage(searchData);
}

async function getPost() {
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

// window.addEventListener('DOMContentLoaded', async function () {
//   try {
//     const response = await fetch('/api/post', {
//       method: 'GET',

//       headers: {
//         'Content-Type': 'application/json',
//       },
//       order: [['post_like', 'DESC']],
//     });

//     if (response.ok) {
//       const data = await response.json();
//       displayPosts(data);
//     } else {
//       console.error('게시글 조회 실패:', response.statusText);
//       alert('게시글 조회에 실패했습니다.');
//     }
//   } catch (error) {
//     console.error('게시글 조회 오류:', error);
//     alert('게시글 조회 중 오류가 발생했습니다.');
//   }
// });

function displayPosts(posts) {
  postsContainer.innerHTML = ''; // 이전 결과를 지우고 새로운 결과 표시

  if (posts.length === 0) {
    postsContainer.textContent = '게시글이 없습니다.';
  } else {
    const ulElement = document.createElement('ul');

    posts.forEach((post) => {
      const liElement = document.createElement('li');
      liElement.textContent = `제목: ${post.title}, 내용: ${post.content}`;
      ulElement.appendChild(liElement);
    });

    postsContainer.appendChild(ulElement);
  }
}
// 튜터리스트 페이지 이동
const reportButton = document.querySelector('#tutor-button');
reportButton.addEventListener('click', function () {
  window.location.href = '../tutorlist';
});
