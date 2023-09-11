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

//댓글
const params = new URLSearchParams(window.location.search);
const post_id = params.get('post_id');

//댓글 조회
function addCommentToDOM(commentList, content, commentId) {
  const commentElement = document.createElement('div');
  commentElement.classList.add('comment');
  commentElement.dataset.id = commentId;
  const comment_id = commentId;

  const commentText = document.createElement('span');
  commentText.classList.add('comment-text');
  commentText.textContent = content;

  commentElement.appendChild(commentText);
  commentList.appendChild(commentElement);

  // 현재 날짜 및 시간 정보 가져오기
  const currentDate = new Date();

  // 댓글 아이템에 생성일자 추가
  const commentDate = document.createElement('div');
  commentDate.className = 'comment-date';
  commentDate.textContent = `작성 시간: ${currentDate.toLocaleDateString()}`;
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
        } else {
          alert('댓글 수정에 실패했습니다.');
        }
      } catch (error) {
        console.error('An error occurred:', error); // 에러 로그
        alert('오류가 발생했습니다.');
      }
    }
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
          } else {
            alert('댓글 삭제에 실패했습니다.');
          }
        } else {
          console.error(`Failed to delete comment: ${response.status}`);
          alert('댓글 삭제에 실패했습니다.');
        }
      } catch (error) {
        console.error('An error occurred:', error);
        alert('오류가 발생했습니다.');
      }
    }
  });

  // 댓글 아이템을 최상단에 추가
  commentList.insertBefore(commentElement, commentList.firstChild);
}

document.addEventListener('DOMContentLoaded', async function () {
  const commentList = document.getElementById('commentList');

  // GET 요청으로 댓글 데이터 가져오기
  try {
    const response = await fetch(`/api/post/${post_id}/comment`);
    if (response.ok) {
      const comments = await response.json();
      console.log(comments);

      if (Array.isArray(comments.data)) {
        comments.data.forEach((comment) => {
          addCommentToDOM(commentList, comment.content, comment.comment_id);
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
});

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
    } else {
      alert('댓글 생성에 실패했습니다.');
      console.log(data.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('오류가 발생했습니다.');
  }
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
// ------------------------------------------------------------

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
      const userName = comment.user.userName; // 작성자 이름 추가
      const comment_id = comment.comment_id; // 댓글 ID 추가

      const li = document.createElement('li');
      li.innerHTML = `
        <span>${userName}: ${content}</span>
        <button class="edit-comment" data-comment-id="${comment_id}">수정</button>
        <button class="delete-comment" data-comment-id="${comment_id}">삭제</button>
      `;

      commentList.appendChild(li);

      // 수정 버튼 클릭 이벤트 리스너 추가
      li.querySelector('.edit-comment').addEventListener('click', function () {
        const comment_id = this.getAttribute('data-comment-id');
        // 댓글 수정 모달을 여는 함수를 호출하도록 수정
        openEditCommentModal(comment_id);
      });

      // 삭제 버튼 클릭 이벤트 리스너 추가
      li.querySelector('.delete-comment').addEventListener('click', function () {
        const comment_id = this.getAttribute('data-comment-id');
        // 댓글 삭제 함수를 호출하도록 수정
        deleteComment(comment_id);
      });
    });

    // 페이지네이션 버튼 표시 여부 결정
    const loadMoreButton = document.getElementById('loadMoreButton');
    loadMoreButton.style.display = data.data.hasMorePages ? 'block' : 'none';
  } catch (error) {
    console.error('댓글 조회 오류:', error);
  }
}

// ------------------------------------버전1-----------------밑의 거로 최대한 했으나 안됐음..---------------
// // 게시글 수정 버튼 클릭 이벤트 리스너
// const postUpdateBtn = document.getElementById('postUpdate');

// if (postUpdateBtn) {
//   postUpdateBtn.addEventListener('click', function () {
//     // 현재 페이지의 post_id 값을 가져옴 (URL에서 추출하거나 다른 방법으로 설정)
//     const post_id = extractPostIdFromUrl(); // 예: /public/views/post.html?post_id=123

//     function extractPostIdFromUrl() {
//       var urlParams = new URLSearchParams(window.location.search);
//       return urlParams.get('post_id');
//     }

//     // 게시글 내용 불러오기
//     // fetch(`/api/post/${post_id}`)
//     fetch(`/api/post/${post_id}`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         // body: formData,
//       },
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.code === 200 && data.data) {
//           // 데이터가 존재하는 경우에만 처리
//           const { image, title, content, subject } = data.data;

//           // 이미지
//           const imageInput = document.querySelector('.upload-input');
//           if (imageInput && imageInput.files && imageInput.files.length > 0) {
//             formData.append('image', imageInput.files[0]);
//           }

//           formData.append('image', image);
//           formData.append('title', title);
//           formData.append('content', content);
//           formData.append('subject', subject);

//           // 게시글 수정
//           fetch(`/api/post/${post_id}`, {
//             method: 'PUT',
//             body: formData,
//           });
//           console
//             .log(formData)

//             .then((response) => response.json())
//             .then((data) => {
//               if (data.code === 200) {
//                 alert('게시글이 수정되었습니다.');
//                 window.location.href = `/public/views/post.html?post_id=${post_id}`;
//               } else {
//                 console.error(data);
//                 alert('게시글 수정에 실패했습니다.');
//               }
//             })
//             .catch((error) => {
//               console.error(error);
//               alert('게시글을 수정하는 중 오류가 발생했습니다.');
//             });
//           // } else {
//           //   console.error(data);
//           //   alert('게시글을 불러오는 중 오류가 발생.');
//         }
//       })
//       .catch((error) => {
//         console.error(error);
//         alert('게시글을 불러오는 중 오류가 발생했습니다.');
//       });

//     // 페이지 이동은 이 부분에서 실행되어야 합니다.
//     // 여기서 페이지 이동 처리를 추가합니다.
//     window.location.href = `/public/views/post-edit.html?post_id=${post_id}`;
//   });
// }

// // 기존 게시글 수정 요청
// function updatePost(post_id, updatedData) {
//   fetch(`/api/post/${post_id}`, {
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(updatedData),
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       // 성공적으로 업데이트된 데이터 처리
//       console.log('게시글이 성공적으로 업데이트되었습니다.', data);
//     })
//     .catch((error) => {
//       // 오류 처리
//       console.error('게시글 업데이트 중 오류가 발생했습니다.', error);
//     });
// }

// // 기존 게시글 수정 버튼 클릭 시 호출되는 함수
// function handleUpdateButtonClick() {
//   const post_id = '${post_id}';

//   // 수정할 데이터 준비
//   const updatedData = {
//     title: 'updatedData.title',
//     content: 'updatedData.content',
//     subject: 'updatedData.subject',
//     image: 'updatedData.image',
//   };

//   // 서버에 수정 요청 보내기
//   updatePost(post_id, updatedData);
// }

// // 버튼 클릭 이벤트 리스너 등록 (예시로 document의 버튼을 대상으로 등록)
// document.querySelector('#postUpdate').addEventListener('click', handleUpdateButtonClick);
// ---------------------------------버전2-----------------------
// // 기존 게시글 수정 요청
// function updatePost(post_id, updatedData) {
//   const url = `/api/post/${post_id}`; // API 엔드포인트 URL

//   fetch(url, {
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(updatedData),
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       // 성공적으로 업데이트된 데이터 처리
//       console.log('게시글이 성공적으로 업데이트되었습니다.', data);
//     })
//     .catch((error) => {
//       // 오류 처리
//       console.error('게시글 업데이트 중 오류가 발생했습니다.', error);
//     });
// }

// // 기존 게시글 수정 버튼 클릭 시 호출되는 함수
// function handleUpdateButtonClick() {
//   const post_id = '${post_id}'; // post_id 변수에 올바른 값을 할당

//   // 수정할 데이터 준비
//   const updatedData = {
//     title: 'updatedData.title',
//     content: 'updatedData.content',
//     subject: 'updatedData.subject',
//     image: 'updatedData.image',
//   };

//   // 서버에 수정 요청 보내기
//   updatePost(post_id, updatedData);
// }
// // 버튼 동적 생성 및 이벤트 리스너 등록 (예시로 document의 body 요소에 버튼을 추가)
// const button = document.createElement('button');
// button.textContent = '게시글 수정';
// button.addEventListener('click', handleUpdateButtonClick);
// document.body.appendChild(button);
//  -----------------------------------------------------new
// const commentUpdateButtons = document.querySelectorAll('.comment-update-button');

// commentUpdateButtons.forEach((button) => {
//   button.addEventListener('click', async () => {
//     // 댓글 수정 모달 열기
//     const comment_id = button.dataset.comment_id;
//     const commentText = button.dataset.commentText;
//     const editCommentText = document.getElementById('editCommentText');
//     editCommentText.value = commentText;

//     // 모달 열기
//     const commentModal = new bootstrap.Modal(document.getElementById('commentModal'));
//     commentModal.show();

//     // "저장" 버튼 클릭 이벤트 핸들러 추가
//     const saveCommentButton = document.getElementById('saveComment');
//     saveCommentButton.addEventListener('click', async () => {
//       const updatedCommentText = editCommentText.value;
//       // 서버로 댓글 수정 요청 보내기
//       try {
//         const response = await fetch(`/api/post/${post_id}/comment/${comment_id}`, {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             content: updatedCommentText,
//           }),
//         });
//         if (!response.ok) {
//           throw new Error('댓글 수정에 실패했습니다.');
//         }
//         // 댓글 수정 모달 닫기
//         commentModal.hide();
//         // 페이지 새로고침 또는 댓글 목록 업데이트 로직 추가
//       } catch (error) {
//         console.error('댓글 수정 오류:', error);
//       }
//     });
//   });
// });

// ---------예림님이 주신 것---------
document.addEventListener('DOMContentLoaded', () => {
  const commentForm = document.getElementById('comment-form');
  const commentInput = document.getElementById('comment-input');
  const commentList = document.getElementById('comment-list');

  const cardContainer = document.querySelector('.card');
  const cardId = parseInt(cardContainer.dataset.cardId, 10);
  console.log('cardId:', cardId);

  commentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const content = commentInput.value.trim();
    if (!content) return;

    createComment(content).then(() => {
      commentInput.value = '';
      loadComments();
    });
  });

  commentList.addEventListener('click', async (e) => {
    if (
      e.target.classList.contains('edit-comment-btn') ||
      e.target.classList.contains('delete-comment-btn')
    ) {
      const commentElement = e.target.closest('li.list-group-item');
      const comment_idAttr = commentElement.getAttribute('data-comment-id');
      const comment_id = comment_idAttr ? parseInt(comment_idAttr, 10) : null;

      if (e.target.classList.contains('edit-comment-btn')) {
        const content = prompt('수정할 내용을 입력해주세요');
        if (content !== null && comment_id !== null) {
          await updateComment(comment_id, content);
          await loadComments();
        }
      } else if (e.target.classList.contains('delete-comment-btn')) {
        if (confirm('댓글을 삭제하시겠습니까?')) {
          if (comment_id) {
            await deleteComment(comment_id);
            await loadComments();
          } else {
            console.error('댓글을 삭제할 수 없습니다. comment_id가 정의되지 않았습니다.');
          }
        }
      }
    }
  });

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const formatter = new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    return formatter.format(date);
  };

  const loadComments = async () => {
    const comments = await getComments();
    commentList.innerHTML = comments
      .map(
        (comment) =>
          `<li class="list-group-item" data-comment-id="${comment.comment_id}">
  ${comment.name}: ${comment.content}
  <span class="text-muted">${formatDate(comment.updatedAt)}</span>
  <button class="btn btn-sm btn-outline-secondary edit-comment-btn">수정</button>
  <button class="btn btn-sm btn-outline-danger delete-comment-btn">삭제</button>
  </li>`
      )
      .join('');

    console.log('Generated HTML:', commentList.innerHTML);
  };

  const getComments = async () => {
    const response = await fetch(`api/cards/${cardId}/comments`);
    const data = await response.json();
    console.log('comments data:', data);
    return data.data;
  };

  const createComment = async (content) => {
    const response = await fetch(`/api/cards/${cardId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      console.error(`Error: ${response.status} ${response.statusText}`);
      const responseText = await response.text();
      console.error(`Response Text: ${responseText}`);
      throw new Error('Error creating comment');
    }

    const newComment = await response.json();
    return newComment.id;
  };

  const updateComment = async (comment_id, content) => {
    const response = await fetch(`/api/comments/${comment_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      console.error(`Error: ${response.status} ${response.statusText}`);
      const responseText = await response.text();
      console.error(`Response Text: ${responseText}`);
      throw new Error('Error updating comment');
    }

    const updatedComment = await response.json();
    return updatedComment;
  };

  const deleteComment = async (comment_id) => {
    const response = await fetch(`/api/comments/${comment_id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      console.error(`Error: ${response.status} ${response.statusText}`);
      const responseText = await response.text();
      console.error(`Response Text: ${responseText}`);
      throw new Error('Error deleting comment');
    }

    return response.json();
  };

  loadComments();
});
