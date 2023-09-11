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

          // 현재 날짜 및 시간 정보 가져오기
          const currentDate = new Date();

          // 댓글 아이템에 생성일자 추가
          const commentDate = document.createElement('div');
          commentDate.className = 'comment-date';
          commentDate.textContent = `작성 시간: ${currentDate.toLocaleDateString()}`;
          commentItem.appendChild(commentDate);

          // 댓글 아이템을 최상단에 추가
          commentList.insertBefore(commentItem, commentList.firstChild);
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
// // 댓글 수정: 예림님이랑!
// document.getElementById('commentUpdate').addEventListener('click', async function () {
//   const content = document.getElementById('commentInput').value;

//   fetch('/api/post/${post_id}/comment/${comment_id}', {
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       content,
//     }),
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       {
//         // alert('댓글이 수정되었습니다.');
//         alert(data.message);
//         console.log(data.message);
//         // window.location.reload();
//       }
//     })
//     .catch((error) => {
//       console.error('Error:', error);
//       alert('댓글 수정 실패');
//     });
// });

// // 댓글 삭제: 예림님께 배우기
// const commentDeleteBtn = document.getElementById('commentDelete');
// commentDeleteBtn.addEventListener('click', function () {
//   fetch('/api/post/:post_id/comment/:comment_id', {
//     method: 'DELETE',
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       // if (data.message === '댓글 삭제 성공')
//       {
//         alert('댓글이 삭제되었습니다.');
//         // 원하는 처리
//         console.log(data.message);
//         // window.location.reload();
//       }
//     })
//     .catch((error) => {
//       console.error('Error:', error);
//       alert('댓글 삭제 실패');
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

const titleInput = document.getElementById('titleInput');
const contentInput = document.getElementById('contentInput');
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

    titleInput.value = postMain.data.title;
    contentInput.value = postMain.data.content;
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

// // 게시글 ID를 가져오는 함수 (URL에서 추출)
// function getPostIdFromUrl() {
//   const urlParams = new URLSearchParams(window.location.search);
//   return urlParams.get('post_id');
// }

// // 댓글을 가져와서 화면에 표시하는 함수
// async function fetchComments(post_id) {
//   try {
//     const response = await fetch(`/api/post/${post_id}/comment`);
//     if (!response.ok) {
//       throw new Error('댓글을 불러오는 중 오류가 발생했습니다.');
//     }
//     const comments = await response.json();
//     const commentList = document.getElementById('commentList');
//     commentList.innerHTML = ''; // 이전 댓글 제거
//     comments.forEach((comment) => {
//       const li = document.createElement('li');
//       li.textContent = comment.text;
//       commentList.appendChild(li);
//     });
//   } catch (error) {
//     console.error('댓글 조회 오류:', error);
//   }
// }

// // 댓글 작성을 처리하는 함수
// async function submitComment(event) {
//   event.preventDefault();
//   const commentText = document.getElementById('commentText').value;
//   const post_id = getPostIdFromUrl();

//   try {
//     const response = await fetch(`/api/post/${post_id}/comment`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ text: commentText }),
//     });

//     if (!response.ok) {
//       throw new Error('댓글 작성 중 오류가 발생했습니다.');
//     }

//     // 댓글 작성 후, 다시 댓글 목록을 가져와서 표시
//     fetchComments(post_id);

//     // 댓글 작성 폼 초기화
//     document.getElementById('commentText').value = '';
//   } catch (error) {
//     console.error('댓글 작성 오류:', error);
//   }
// }

// // 페이지 로딩 시 댓글 목록을 가져와서 표시
// const post_id = getPostIdFromUrl();
// fetchComments(post_id);

// // 댓글 작성 폼의 submit 이벤트 핸들러 등록
// document.getElementById('commentInput').addEventListener('submit', submitComment);

// // 게시글 작성 버튼 눌렀을 때, 이동
// const createPostButton = document.getElementById('createPostButton');
// createPostButton.addEventListener('click', async () => {
//   window.location.href = ``;
// });

// // 댓글 리스트 ..
// let currentPage = 1;
// const commentsPerPage = 10; // 한 페이지당 표시할 댓글 수

// window.addEventListener('DOMContentLoaded', async function () {
//   fetchComments(currentPage);

//   // 페이지네이션 버튼 클릭 시 다음 페이지 댓글 로드
//   const loadMoreButton = document.getElementById('loadMoreButton');
//   loadMoreButton.addEventListener('click', function () {
//     currentPage++;
//     fetchComments(currentPage);
//   });
// });

async function fetchComments(page) {
  try {
    const response = await fetch(`/api/post/${post_id}/comment`);
    if (!response.ok) {
      throw new Error('댓글을 불러오는 중 오류가 발생했습니다.');
    }
    const data = await response.json();

    const comments = data.data;

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
fetchComments();

// // 댓글 작성을 처리하는 함수
// async function submitComment(event) {
//   event.preventDefault();
//   const commentText = document.getElementById('commentText').value;

//   try {
//     const response = await fetch(`/api/post/${post_id}/comment`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ text: commentText }),
//     });

//     if (!response.ok) {
//       throw new Error('댓글 작성 중 오류가 발생했습니다.');
//     }

//     // 댓글 작성 후, 현재 페이지의 댓글 목록을 다시 불러옴
//     fetchComments(currentPage);

//     // 댓글 작성 폼 초기화
//     document.getElementById('commentText').value = '';
//   } catch (error) {
//     console.error('댓글 작성 오류:', error);
//   }
// }

// 댓글 작성 폼의 submit 이벤트 핸들러 등록
// document.getElementById('commentInput').addEventListener('submit', submitComment);

// // ---------------------------------------

// // 게시글 수정 버튼 클릭 이벤트 리스너 추가
// document.getElementById('postUpdate').addEventListener('click', function () {
//   // 예를 들어, 모달을 열거나 수정할 게시글의 ID를 얻어와서 해당 게시글 수정 페이지로 이동할 수 있습니다.
// });

// // 게시글 삭제 버튼 클릭 이벤트 리스너 추가
// document.getElementById('postDelete').addEventListener('click', function () {
//   // 게시글 삭제 로직을 여기에 추가
//   // 예를 들어, 확인 대화상자를 띄우고 확인 시 게시글을 삭제할 수 있습니다.
// });

// -----------------------------------------------

// // 모달
// const modal = document.getElementById('modal');
// function modalOn() {
//   modal.classList.add('on');
// }
// function modalOff() {
//   modal.classList.remove('on');
// }
// const btnModal = document.getElementById('commentModal');
// btnModal.addEventListener('click', modalOn);

// const closeBtn = modal.querySelector('.close-area');
// modal.addEventListener('click', function (e) {
//   if (e.target === this) {
//     modalOff();
//   }
// });
// closeBtn.addEventListener('click', modalOff);

// ---------------------wkfwhagkwk-------------------
// // 댓글 수정 모달 열기
// const commentEditButton = document.querySelector('#commentEdit');
// commentEditButton.addEventListener('click', function () {
//   // 선택한 댓글의 내용을 가져옵니다.
//   const selectedComment = getSelectedComment(); // 이 함수는 선택한 댓글을 가져오는 로직을 구현해야 합니다.

//   // 모달 창에 댓글 내용을 채웁니다.
//   document.getElementById('editCommentText').value = selectedComment;

//   // 모달을 열어줍니다.
//   const commentEditModal = new bootstrap.Modal(document.getElementById('commentEditModal'));
//   commentEditModal.show();
// });

// // 댓글 수정 버튼 클릭 이벤트 리스너 추가
// document.getElementById('saveComment').addEventListener('click', function () {
//   // 수정된 댓글 내용을 가져옵니다.
//   const updatedComment = document.getElementById('editCommentText').value;

//   // 서버에 수정된 댓글을 저장하는 함수 호출
//   saveUpdatedComment(updatedComment); // 이 함수는 서버에 수정된 댓글을 보내는 로직을 구현해야 합니다.

//   // 모달을 닫습니다.
//   const commentEditModal = new bootstrap.Modal(document.getElementById('commentEditModal'));
//   commentEditModal.hide();
// });

// // 선택한 댓글을 가져오는 함수 (예시로 선택한 댓글을 하드코딩으로 반환)
// function getSelectedComment() {
//   return '선택한 댓글 내용'; // 실제로 선택한 댓글 내용을 가져오는 로직을 구현해야 합니다.
// }

// // 서버에 수정된 댓글을 저장하는 함수 (실제로 서버로 보내는 코드를 추가해야 합니다)
// function saveUpdatedComment(updatedComment) {
//   // 여기에 서버로 수정된 댓글을 전송하는 로직을 추가합니다.
// }

// 게시글 작성 버튼 클릭 이벤트 리스너 추가
document.getElementById('postCreate').addEventListener('click', function () {
  window.location.href = `/public/views/post-detail.html`; // 여기에 게시글 작성 페이지의 URL을 넣으세요.
});

// // 버튼 클릭 이벤트 리스너 추가
// document.getElementById('postUpdate').addEventListener('click', function () {
//   window.location.href = `/public/views/post.html?post_id=${data.data.post_id}`; // 여기에 게시글 작성 페이지의 URL을 넣으세요.
// });

// 게시글 수정
// 게시글 수정 버튼 클릭 이벤트 리스너
const postUpdateBtn = document.getElementById('postUpdate');
// 모달창 생성
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
  editButton.addEventListener('click', () => {
    const formData = new FormData();
    formData.append('title', titleInput.value);
    formData.append('content', contentInput.value);
    formData.append('subject', subjectInput.value);

    if (imageInput && imageInput.files && imageInput.files.length > 0) {
      // 파일이 선택된 경우에만 실행
      formData.append('image', imageInput.files[0]);
    }
    fetch(`/api/post/${post_id}`, {
      method: 'POST',
      body: formData,
      // headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        location.reload();
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('오류가 발생했습니다.');
      });
  });
});
function closeModal() {
  updatePostModal.style.display = 'none';
}
// document.addEventListener('DOMContentLoaded', function () {
//   const postTitle = document.getElementById('postTitle');
//   const postContent = document.getElementById('postContent');
//   const subjectSelect = document.getElementById('postSubject');

// 현재 페이지의 post_id 값을 가져옴 (URL에서 추출하거나 다른 방법으로 설정)
const postId = extractPostIdFromUrl(); // 예: /public/views/post.html?post_id=123

// // 게시글 내용 불러오기
// fetch(`/api/post/${post_id}`)
//   .then((response) => response.json())
//   .then((data) => {
//     if (data.code === 200) {
//       const { title, content, subject } = data.data;
//       postTitle.value = title;
//       postContent.value = content;
//       postSubject.value = subject;
//     } else {
//       console.error(data);
//     }
//   })
//   .catch((error) => {
//     console.error('Error:', error);
//     alert('게시글을 불러오는 중 오류가 발생했습니다.');
//   });
// });

function extractPostIdFromUrl() {
  var urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('post_id');
}
