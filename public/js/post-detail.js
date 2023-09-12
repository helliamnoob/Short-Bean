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
//                 <div class="post-card">
//                     <h2>${title}</h2>
//                     <p>${content}</p>
//                     <span>업데이트 시간: ${updatedAt}</span>
//                 </div>
//             `;
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

//     // // 새 게시글 객체 생성
//     // var newPost = {
//     //     id: globalPosts.length + 1, // 임시 방식으로 id 생성 (실제 백엔드와 연동 필요)
//     //     title: titleInput.value,
//     //     content: contentInput.value,
//     //     updatedAt: new Date().toISOString() // 현재 시간으로 설정
//     // };

//     updatePostDeck(newPost); // 게시글 카드 업데이트
//     newPostForm.reset(); // 입력 폼 초기화
//   }
// };

// 게시글 작성
document.addEventListener('DOMContentLoaded', function () {
  const postCreateBtn = document.getElementById('postCreate');
  const postTitle = document.getElementById('post-title');
  const postContent = document.getElementById('post-content');
  const subjectSelect = document.getElementById('subject');
  const imageInput = document.querySelector('.upload-input');

  console.log(postCreateBtn);
  console.log(postTitle);
  console.log(postContent);
  console.log(subjectSelect);

  if (!postCreateBtn || !postTitle || !postContent || !subjectSelect) {
    console.error('One or more elements not found.');
    return;
  }

  postCreateBtn.addEventListener('click', function () {
    const title = postTitle.value;
    const content = postContent.value;
    const subject = subjectSelect.value;
    const image = imageInput.value;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('subject', subject);
    // 이미지
    // const imageInput = document.querySelector('.upload-input');
    // if (imageInput.files.length > 0) {
    formData.append('image', imageInput.files[0]);
    // }

    fetch('/api/post', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        alert('질문이 저장되었습니다.');
        // 저장 성공 시의 처리
        // } else {
        //   alert('질문 저장에 실패했습니다.');
        //   // 저장 실패 시의 처리
        console.log(imageInput); // 아무 값 안뜸
        console.log(image); // 사진 이름 뜸
        console.log(imageInput.files); // FileList {0: File, length: 1}

        console.log(data.message);
        window.location.href = `/public/views/post.html?post_id=${data.data.post_id}`;
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('오류가 발생했습니다.');
      });
  });
});
