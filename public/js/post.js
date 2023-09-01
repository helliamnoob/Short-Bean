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

  const postId = document.getElementById('postLike').value;

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

// 댓글 작성
// const commentCreateBtn = document.getElementById('commentCreate');
// commentCreateBtn.addEventListener('click', function () {
//   const commentText = document.getElementById('comment').value;

//   const formData = new FormData();
//   formData.append('comment', commentText);

//   fetch('/api/post/:post_id/comment', {
//     method: 'POST',
//     body: formData,
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       // if (data.message === '댓글 작성 성공')
//       {
//         console.log(data);

//         alert('댓글이 작성되었습니다.');
//         // 원하는 처리
//         // } else {
//         alert('댓글 작성 실패');
//         // window.location.reload();
//       }
//     })
//     .catch((error) => {
//       console.error('Error:', error);
//       alert('오류가 발생했습니다.');
//     });
// });

// 댓글 작성
// document.addEventListener('DOMContentLoaded', function (post_id) {
//   const postId = String(post_id);
//   const commentCreateBtn = document.getElementById('commentCreate');
//   const commentInput = document.getElementById('commentInput');
//   commentCreateBtn.addEventListener('click', async function () {
//     const commentText = commentInput.value;

// 댓글 작성: 이게 진짜
const params = new URLSearchParams(window.location.search);
const post_id = params.get('post_id');

document.getElementById('commentCreate').addEventListener('click', async function () {
  const content = document.getElementById('commentInput').value;

  // const formData = new FormData();
  // formData.append('comment', commentText);

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
        const commentItem = document.createElement('div');
        commentItem.className = 'comment-item';
        commentItem.textContent = content;
        commentList.appendChild(commentItem);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('오류가 발생했습니다.');
    });
});

// 댓글 수정
// const commentUpdateBtn = document.getElementById('commentUpdate');
// commentUpdateBtn.addEventListener('click', function () {
//   const commentText = document.getElementById('comment').value;
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

// 댓글 리스트
window.addEventListener('DOMContentLoaded', async function () {
  fetch('/api/post/:post_id/comment', {})
    .then((response) => response.json())
    .then((data) => {
      let rows = data.data;
      console.log(data);
      const commentBox = document.getElementById('comments-box');
      rows.forEach((comment) => {
        let content = comment['content'];

        let temp_html = `<div class="solo-card">
      <div class="card w-75">
      <div class="card-body">
      <p class="card-text">${content}</p>
      </div>
      </div>
      </div>`;
        commentBox.insertAdjacentHTML('beforeend', temp_html);
      });
    });
});
