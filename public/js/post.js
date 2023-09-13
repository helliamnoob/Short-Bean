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
// ------------------------------------------------------------------------------
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
          // } else {
          //   alert('댓글 수정에 실패했습니다.');
        }
        window.location.reload();
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
            // } else {
            //   alert('댓글 삭제에 실패했습니다.');
          }
          window.location.reload();
          // } else {
          //   console.error(`Failed to delete comment: ${response.status}`);
          //   alert('댓글 삭제에 실패했습니다.');
        }
      } catch (error) {
        console.error('An error occurred:', error);
        alert('오류가 발생했습니다.');
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', async function () {
  const commentList = document.getElementById('commentList');

  // GET 요청으로 댓글 데이터 가져오기
  try {
    const response = await fetch(`/api/post/${post_id}/comment`);
    if (response.ok) {
      const comments = await response.json();
      // console.log(comments);

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

    postTitleElement.textContent = postMain.data.title;
    postContentElement.textContent = postMain.data.content;
    postSubjectElement.textContent = postMain.data.subject;

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
// 댓글 조회?
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

// ---------------------------------버전2-----------------------

// -------댓글 수정 삭제-----------------------------
document.addEventListener('DOMContentLoaded', () => {
  const commentForm = document.getElementById('comment-form');
  const commentInput = document.getElementById('comment-input');
  const commentList = document.getElementById('commentList');

  // const cardContainer = document.querySelector('.card');
  // const cardId = parseInt(cardContainer.dataset.cardId, 10);
  // console.log('cardId:', cardId);
  console.log(commentForm);
  commentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const content = commentInput.value.trim();
    if (!content) return;

    createComment(content).then(() => {
      commentInput.value = '';
      loadComments();
    });
  });
  console.log(commentList);
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
    const response = await fetch(`api/post/${post_id}/comment/${comment_id}`);
    const data = await response.json();
    console.log('comments data:', data);
    return data.data;
  };

  const createComment = async (content) => {
    const response = await fetch(`/api/post/${post_id}/comment/${comment_id}`, {
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
    const response = await fetch(`/api/post/${post_id}/comment/${comment_id}`, {
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
    const response = await fetch(`/api/post/${post_id}/comment/${comment_id}`, {
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
  // -------------------------------------------------------------

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
          // headers: {
          //   'Content-Type': 'application/json',
          // },
        });
        if (response.ok) {
          console.log(response);
          alert('게시글이 수정되었습니다.');
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
});
// ---------------------------------------------------------
