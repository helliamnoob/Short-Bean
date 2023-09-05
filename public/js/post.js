// 신고하기 모달 열기
const reportButton = document.querySelector('#postReport');
reportButton.addEventListener('click', function () {
  const reportModal = new bootstrap.Modal(document.getElementById('reportModal'));
  reportModal.show();
});

// 신고하기 api 요청
const loginForm = document.getElementById('reportForm');
loginForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const content = document.getElementById('content').value;
  const userId = document.getElementById('userId').value;
  const post_id = document.getElementById('postLike').value;

  const formData = {
    report_content: content,
    reported_user_id: userId,
  };
  fetch('/api/reports', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('신고 성공:', data);
      alert('신고가 완료되었습니다.');
      //location.reload();
    })
    .catch((error) => {
      console.error('신고 실패:', error);
      alert('신고를 실패하였습니다.');
    });
});

//좋아요 버튼
const likeButton = document.querySelector('#postLike');
reportButton.addEventListener('click', function () {
  event.preventDefault();
});

// 댓글 작성: 이게 진짜
const params = new URLSearchParams(window.location.search);
const post_id = params.get('post_id');

document.getElementById('commentCreate').addEventListener('click', async function () {
  const content = document.getElementById('commentInput').value;

  await fetch(`/api/post/${post_id}/comment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      {
        alert('댓글이 저장되었습니다.');
        // 저장 성공 시의 처리
        // } else {
        //   alert('질문 저장에 실패했습니다.');
        //   // 저장 실패 시의 처리
        console.log(data.message);

        // 댓글이 성공적으로 저장되면 화면에 추가
        const commentList = document.getElementById('commentList');
        if (commentList) {
          const commentItem = document.createElement('div');
          commentItem.className = 'comment-item';
          commentItem.textContent = content;
          commentList.appendChild(commentItem);
          // } else {
          //   console.error(error);
          // }
        }
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('오류가 발생했습니다.');
    });
});

// 댓글 수정
document.getElementById('commentUpdate').addEventListener('click', async function () {
  const content = document.getElementById('commentInput').value;

  fetch('/api/post/:post_id/comment/:comment_id', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      {
        alert('댓글이 수정되었습니다.');
        console.log(data.message);
        window.location.reload();
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('댓글 수정 실패');
    });
});

// 댓글 삭제
const commentDeleteBtn = document.getElementById('commentDelete');
commentDeleteBtn.addEventListener('click', function () {
  fetch('/api/post/:post_id/comment/:comment_id', {
    method: 'DELETE',
  })
    .then((response) => response.json())
    .then((data) => {
      // if (data.message === '댓글 삭제 성공')
      {
        alert('댓글이 삭제되었습니다.');
        // 원하는 처리
        console.log(data.message);
        window.location.reload();
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('댓글 삭제 실패');
    });
});

// // 댓글 리스트
// window.addEventListener('DOMContentLoaded', async function () {
//   fetch('/api/post/:post_id/comment', {})
//     .then((response) => response.json())
//     .then((data) => {
//       let rows = data.data;
//       console.log(data);
//       const commentBox = document.getElementById('commentBox');
//       rows.forEach((comment) => {
//         let content = comment['content'];

//         let temp_html = `<div class="mypost">`;
//         //  <div class="card w-75">
//         // <div class="card-body">
//         // <p class="card-text">${content}</p>
//         // </div>
//         // </div>
//         // </div>`;
//         commentBox.insertAdjacentHTML('beforeend', temp_html);
//       });
//     });
// });

// 프론트엔드에서 게시글 메인(상세) 띄우기
async function fetchPostMain(post_id) {
  try {
    const response = await fetch(`/api/post/${post_id}`);
    if (!response.ok) {
      throw new Error('게시글을 불러오는 중 오류가 발생했습니다.');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('게시글 조회 오류:', error);
    throw error;
  }
}

// 페이지 로딩 시 게시글 상세 정보를 가져와서 화면에 표시
async function loadPostMain() {
  const params = new URLSearchParams(window.location.search);
  const post_id = params.get('post_id');
  try {
    const postMain = await fetch(`/api/post/${post_id}`).then((response) => response.json());

    console.log(postMain.data);
    // 프론트엔드에서 게시글 상세 정보를 화면에 표시: 이미지는 따로
    const postTitleElement = document.getElementById('postTitle');
    const postContentElement = document.getElementById('postContent');
    const postSubjectElement = document.getElementById('postSubject');
    const postImageElement = document.getElementById('postImage');

    postTitleElement.textContent = postMain.data.title;
    postContentElement.textContent = postMain.data.content;
    postSubjectElement.textContent = postMain.data.subject;

    // 만약 image가 null이 아니라면, 즉 이미지가 있다면 해당 image 문자열을 img 태그의 src로 설정합니다.
    if (postMain.data.image) {
      // S3 버킷 경로와 파일 이름을 조합하여 전체 이미지 URL 생성
      let imageUrl = postMain.data.image;
      console.log(imageUrl);

      // img 태그를 문서에 추가합니다. 여기서는 'postImage' 요소 안에 추가합니다.
      postImageElement.innerHTML = `<img src="${imageUrl}" />`;
    }
  } catch (error) {
    // 에러 처리
    console.error('게시글 상세 정보 로딩 오류:', error);
  }
}
// 페이지 로딩 시 게시글 상세 정보 로딩 함수 호출
loadPostMain();

// ---------------------------------------------------------------------

// 게시글 ID를 가져오는 함수 (URL에서 추출)
function getPostIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('post_id');
}

// 댓글을 가져와서 화면에 표시하는 함수
async function fetchComments(post_id) {
  try {
    const response = await fetch(`/api/post/${post_id}/comment`);
    if (!response.ok) {
      throw new Error('댓글을 불러오는 중 오류가 발생했습니다.');
    }
    const comments = await response.json();
    const commentList = document.getElementById('commentList');
    commentList.innerHTML = ''; // 이전 댓글 제거
    comments.forEach((comment) => {
      const li = document.createElement('li');
      li.textContent = comment.text;
      commentList.appendChild(li);
    });
  } catch (error) {
    console.error('댓글 조회 오류:', error);
  }
}

// 댓글 작성을 처리하는 함수
async function submitComment(event) {
  event.preventDefault();
  const commentText = document.getElementById('commentText').value;
  const post_id = getPostIdFromUrl();

  try {
    const response = await fetch(`/api/post/${post_id}/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: commentText }),
    });

    if (!response.ok) {
      throw new Error('댓글 작성 중 오류가 발생했습니다.');
    }

    // 댓글 작성 후, 다시 댓글 목록을 가져와서 표시
    fetchComments(post_id);

    // 댓글 작성 폼 초기화
    document.getElementById('commentText').value = '';
  } catch (error) {
    console.error('댓글 작성 오류:', error);
  }
}

// 페이지 로딩 시 댓글 목록을 가져와서 표시
const postId = getPostIdFromUrl();
fetchComments(post_id);

// 댓글 작성 폼의 submit 이벤트 핸들러 등록
document.getElementById('commentInput').addEventListener('submit', submitComment);

// 게시글 작성 버튼 눌렀을 때, 이동
const createPostButton = document.getElementById('createPostButton');
createPostButton.addEventListener('click', async () => {
  window.location.href = ``;
});

// 댓글 리스트 ..
let currentPage = 1;
const commentsPerPage = 10; // 한 페이지당 표시할 댓글 수

window.addEventListener('DOMContentLoaded', async function () {
  fetchComments(currentPage);

  // 페이지네이션 버튼 클릭 시 다음 페이지 댓글 로드
  const loadMoreButton = document.getElementById('loadMoreButton');
  loadMoreButton.addEventListener('click', function () {
    currentPage++;
    fetchComments(currentPage);
  });
});

async function fetchComments(page) {
  try {
    const response = await fetch(
      `/api/post/${post_id}/comment?page=${page}&limit=${commentsPerPage}`
    );
    if (!response.ok) {
      throw new Error('댓글을 불러오는 중 오류가 발생했습니다.');
    }
    const data = await response.json();
    const comments = data.data.comments;

    const commentList = document.getElementById('commentList');

    if (page === 1) {
      commentList.innerHTML = ''; // 첫 페이지일 때만 초기화
    }

    comments.forEach((comment) => {
      const content = comment.content;
      const li = document.createElement('li');
      li.textContent = content;
      commentList.appendChild(li);
    });

    // 페이지네이션 버튼 표시 여부 결정
    const loadMoreButton = document.getElementById('loadMoreButton');
    loadMoreButton.style.display = data.data.hasMorePages ? 'block' : 'none';
  } catch (error) {
    console.error('댓글 조회 오류:', error);
  }
}

// 댓글 작성을 처리하는 함수
async function submitComment(event) {
  event.preventDefault();
  const commentText = document.getElementById('commentText').value;

  try {
    const response = await fetch(`/api/post/${post_id}/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: commentText }),
    });

    if (!response.ok) {
      throw new Error('댓글 작성 중 오류가 발생했습니다.');
    }

    // 댓글 작성 후, 현재 페이지의 댓글 목록을 다시 불러옴
    fetchComments(currentPage);

    // 댓글 작성 폼 초기화
    document.getElementById('commentText').value = '';
  } catch (error) {
    console.error('댓글 작성 오류:', error);
  }
}

// 댓글 작성 폼의 submit 이벤트 핸들러 등록
document.getElementById('commentInput').addEventListener('submit', submitComment);
