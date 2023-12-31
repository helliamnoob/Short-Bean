import { jwtToken } from '../util/isLogin.util.js';
// import { loadGraphModel } from '@tensorflow/tfjs-converter';

// // 이게 아닌가..?
// const usersModelPath = 'models/users.js';
// const postsModelPath = 'models/posts.js';

// // Users 모델 로드
// const loadUsersModel = async () => {
//   const usersModel = await loadGraphModel(usersModelPath);
//   return usersModel;
// };

// // Posts 모델 로드
// const loadPostsModel = async () => {
//   const postsModel = await loadGraphModel(postsModelPath);
//   return postsModel;
// };

//파라미터 값 받아오기
const params = new URLSearchParams(window.location.search);
const post_id = params.get('post_id');

// 신고하기 모달 열기
const reportButton = document.querySelector('#postReport');
reportButton.addEventListener('click', function () {
  const reportModal = new bootstrap.Modal(document.getElementById('reportModal'));
  reportModal.show();
});

// 신고하기 api 요청
const loginForm = document.getElementById('reportForm');
loginForm.addEventListener('submit', async function (event) {
  event.preventDefault();
  const data = await fetch(`/api/post/${post_id}`).then((response) => response.json());

  const content = document.getElementById('content').value;
  //const userId = document.getElementById('userId').value;
  const postUser = data.data.user_id;

  const formData = {
    report_content: content,
    reported_user_id: postUser,
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
// ------------------------------------------------------------------------------
//댓글: 여기가 진짜

//댓글 조회
function addCommentToDOM(commentList, content, commentId, nickname) {
  const commentElement = document.createElement('div');
  commentElement.classList.add('comment');
  commentElement.dataset.id = commentId;
  const comment_id = commentId;

  const commentText = document.createElement('span');
  commentText.classList.add('comment-text');
  commentText.textContent = content;

  commentElement.appendChild(commentText);

  // 댓글에 닉네임 추가
  const commentNickname = document.createElement('div');
  commentNickname.className = 'comment-nickname';
  commentNickname.textContent = `작성자: ${nickname}`;
  commentElement.appendChild(commentNickname);

  commentList.appendChild(commentElement);

  // 현재 날짜 및 시간 정보 가져오기
  // const currentDate = new Date();
  // const createdDate = new Date();

  // 댓글 아이템에 생성일자 추가
  const commentDate = document.createElement('div');
  commentDate.className = 'comment-date';
  // 작성 시간으로 바꾸기
  const updatedDate = new Date();
  commentDate.textContent = `작성 시간: ${updatedDate.toLocaleDateString()}`;
  commentElement.appendChild(commentDate);

  // 댓글 수정 버튼 추가
  const updateButton = document.createElement('button');
  updateButton.type = 'button';
  updateButton.className = 'btn btn-dark';
  updateButton.id = 'commentUpdate';
  updateButton.textContent = '댓글 수정';
  commentElement.appendChild(updateButton);
  updateButton.addEventListener('click', async function () {
    console.log('Update button clicked.'); // 버튼 클릭 로그

    const newContent = window.prompt('댓글을 수정하세요:', content);
    if (newContent) {
      console.log(`New content: ${newContent}`); // 새로운 댓글 내용 로그
      console.log(`Post ID: ${post_id}, Comment ID: ${comment_id}`); // 포스트 ID와 댓글 ID 로그

      try {
        const response = await fetch(`/api/post/${post_id}/comment/${comment_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: newContent,
          }),
        });

        console.log('Fetch request made.'); // Fetch 요청 로그
        console.log(`Response status: ${response.status}, Response ok: ${response.ok}`); // 응답 상태 로그

        const data = await response.json();
        console.log('Response data:', data); // 응답 데이터 로그

        if (data && data.success) {
          commentElement.textContent = newContent;
          commentElement.appendChild(updateButton);
          alert('댓글이 수정되었습니다.');
          // window.location.reload();
        } else if (data.error === '권한이 없습니다.') {
          alert('권한이 없습니다.');
        }
        // window.location.reload();
        // alert('댓글이 수정되었습니다.');

        // window.location.reload();
      } catch (error) {
        console.error('An error occurred:', error); // 에러 로그
        alert('오류가 발생했습니다.');
      }
      // alert('댓글이 수정되었습니다.');
      // window.location.reload();
    }
    window.location.reload();
  });
  // 댓글 삭제 버튼 추가
  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'btn btn-dark';
  deleteButton.id = 'commentDelete';
  deleteButton.textContent = '댓글 삭제';
  commentElement.appendChild(deleteButton);

  deleteButton.addEventListener('click', async function () {
    // 사용자에게 댓글을 삭제할 것인지 물어봅니다.
    const isConfirmed = window.confirm('이 댓글을 삭제하시겠습니까?');
    if (isConfirmed) {
      try {
        // 서버에 DELETE 요청을 보냅니다.
        const response = await fetch(`/api/post/${post_id}/comment/${comment_id}`, {
          method: 'DELETE',
        });

        // 요청의 결과를 확인합니다.
        if (response.ok) {
          const data = await response.json();
          if (data && data.success) {
            // 성공적으로 삭제되면, DOM에서도 댓글을 제거합니다.
            commentElement.remove();
            alert('댓글이 삭제되었습니다.');
            // } else if (data.error === '권한이 없습니다.') {
            //   alert('권한이 없습니다.');
            // } else {
            //   alert('댓글 삭제에 실패했습니다.');
          }

          window.location.reload();
        } else {
          console.error(`Failed to delete comment: ${response.status}`);
          alert('권한이 없습니다.');
        }
      } catch (error) {
        console.error('An error occurred:', error);
        alert('오류가 발생했습니다.');
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', async function () {
  if (!jwtToken) {
    alert('로그인 후 이용가능한 서비스입니다.');
    window.location.href = `/`;
  } else {
    const commentList = document.getElementById('commentList');

    // GET 요청으로 댓글 데이터 가져오기
    try {
      const response = await fetch(`/api/post/${post_id}/comment`);
      if (response.ok) {
        const comments = await response.json();
        // console.log(comments);

        if (Array.isArray(comments.data)) {
          comments.data.forEach((comment) => {
            console.log(comment);

            addCommentToDOM(
              commentList,
              comment.content,
              comment.comment_id,
              comment.User.nickname
            );
          });
        } else {
          console.warn('Received data is not an array');
        }
      } else {
        console.error(`Failed to fetch comments: ${response.status}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('댓글을 가져오는 데 실패했습니다.');
    }
  }
});
// --------------------------------------------------------------------------------------------
// 댓글 작성
document.getElementById('commentCreate').addEventListener('click', async function () {
  const commentList = document.getElementById('commentList'); // 댓글 리스트 DOM 요소를 미리 가져옵니다.
  const content = document.getElementById('commentInput').value;

  try {
    const response = await fetch(`/api/post/${post_id}/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
      }),
    });

    const data = await response.json();

    if (response.ok && data && data.success) {
      alert('댓글이 저장되었습니다.');

      const newCommentId = data.commentId;

      // 새 댓글을 DOM에 추가합니다.
      addCommentToDOM(commentList, content, newCommentId);
      // } else {
      alert('댓글 작성 성공');
      console.log(data.message);
      // window.reload();
    }
    window.location.reload();
  } catch (error) {
    console.error('Error:', error);
    alert('오류가 발생했습니다.');
  }
});
// -----------------------------------------------------------------
//좋아요 버튼
const likeButton = document.querySelector('#postLike');
likeButton.addEventListener('click', function (event) {
  event.preventDefault();
  console.log('버튼눌림');
  fetch(`/api/post/${post_id}/likes`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.data === true) {
        console.log('좋아요 성공:', data);
        alert('좋아요 완료되었습니다.');
        location.reload();
      } else if (data.data === false) {
        console.log('좋아요 취소:', data);
        alert('좋아요가 취소되었습니다.');
        location.reload();
      } else {
        console.log(data);
        location.reload();
      }
    })
    .catch((error) => {
      console.error('신고 실패:', error);
      alert('좋아요 실패하였습니다.');
    });
});
// ------------------------------------------------------------
// 게시글 조회
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

const titleInput = document.getElementById('titleInput');
const contentInput = document.getElementById('contentInput');
// 페이지 로딩 시 게시글 상세 정보를 가져와서 화면에 표시
async function loadPostMain() {
  const params = new URLSearchParams(window.location.search);
  const post_id = params.get('post_id');
  try {
    const postMain = await fetch(`/api/post/${post_id}`).then((response) => response.json());
    // 프론트엔드에서 게시글 상세 정보를 화면에 표시: 이미지는 따로
    const postTitleElement = document.getElementById('postTitle');
    const postContentElement = document.getElementById('postContent');
    const postSubjectElement = document.getElementById('postSubject');
    const postImageElement = document.getElementById('postImage');
    const postLikeImageElement = document.getElementById('postLikeImage');
    const postLikeCountElement = document.getElementById('postLikesCount');

    postTitleElement.textContent = postMain.data.title;
    postContentElement.textContent = postMain.data.content;
    postSubjectElement.textContent = postMain.data.subject;
    postLikeCountElement.textContent = ` : ${postMain.data.post_like}`;

    titleInput.value = postMain.data.title;
    contentInput.value = postMain.data.content;
    // 만약 image가 null이 아니라면, 즉 이미지가 있다면 해당 image 문자열을 img 태그의 src로 설정합니다.
    if (postMain.data.image) {
      // S3 버킷 경로와 파일 이름을 조합하여 전체 이미지 URL 생성
      let imageUrl = postMain.data.image;
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

// 게시글 작성 버튼
document.getElementById('postCreate').addEventListener('click', function () {
  window.location.href = '/public/views/post-detail.html'; // 여기에 게시글 작성 페이지의 URL
});
// ---------------------------------------------------------------------

// 게시글 작성 버튼 클릭 이벤트 리스너 추가
document.getElementById('postCreate').addEventListener('click', function () {
  window.location.href = `/public/views/post-detail.html`; // 여기에 게시글 작성 페이지의 URL을 넣으세요.
});

// 게시글 수정
const postUpdateBtn = document.getElementById('postUpdate');
const updatePostModal = document.getElementById('updatePostModal');

postUpdateBtn.addEventListener('click', function () {
  updatePostModal.style.display = 'block';

  // 각각의 인풋 값 가져오기
  // 제목이랑 본문은 페이지 렌더링할 때 위에서 이미 선언했습니다
  // db접근 최소화 시키려고
  const subjectInput = document.getElementById('subjectSelect');
  const imageInput = document.getElementById('imageUpload');
  const editButton = document.getElementById('editButton');

  //수정하기 버튼을 눌러야 실행됩니다.
  editButton.addEventListener('click', async () => {
    const formData = new FormData();
    formData.append('title', titleInput.value);
    formData.append('content', contentInput.value);
    formData.append('subject', subjectInput.value);
    if (imageInput && imageInput.files && imageInput.files.length > 0) {
      // 파일이 선택된 경우에만 실행
      formData.append('image', imageInput.files[0]);
    }
    try {
      const response = await fetch(`/api/post/${post_id}`, {
        method: 'PUT',
        body: formData,
      });
      if (response.ok) {
        alert('게시글이 수정되었습니다.');
        location.reload();
      } else {
        const data = await response.json();
        alert(data.error);
        location.reload();
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  });
});
const closeBtn = document.querySelector('.close');
closeBtn.addEventListener('click', () => {
  updatePostModal.style.display = 'none';
});

const deleteBtn = document.getElementById('postDelete');
// 게시글 삭제 버튼 클릭 이벤트 리스너 추가
deleteBtn.addEventListener('click', async function () {
  const prompt = confirm('정말 삭제하시겠습니까?');
  if (prompt) {
    try {
      const response = await fetch(`/api/post/${post_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('게시글이 삭제되었습니다.');
        window.location.href = `/public/views/main.html`;
      } else {
        const data = await response.json();
        alert(data.error);
        location.reload();
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  }
});
