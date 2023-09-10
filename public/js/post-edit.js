const postUpdateBtn = document.getElementById('postUpdate');
postUpdateBtn.addEventListener('click', function () {
  const title = postTitle.value;
  const content = postContent.value;
  const subject = subjectSelect.value;

  const formData = new FormData();
  formData.append('title', title);
  formData.append('content', content);
  formData.append('subject', subject);

  // 이미지
  const imageInput = document.querySelector('.upload-input');
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
      console.log(data.message);
      window.location.href = `/public/views/post.html?post_id=${data.data.post_id}`;
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('오류가 발생했습니다.');
    });
});
const params = new URLSearchParams(window.location.search);
const post_id = params.get('post_id');

document.getElementById('updatePost', 'onnicknamePut').addEventListener('click', async function () {
  // 게시글 수정 버튼 클릭 시

  document.getElementById('updatePost').addEventListener('click', async function () {
    const postTitle = document.getElementById('post-title').value;
    const postContent = document.getElementById('post-content').value;
    const subject = document.getElementById('subject').value;

    const newdata = JSON.stringify({
      postTitle,
      postContent,
      subject,
    });

    console.log(newdata);

    fetch(`/api/post/${post_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: newdata,
    })
      .then((response) => {
        if (response.ok) {
          // 게시글 수정 성공
          // 팝업 창으로 로그인 완료 메시지 전송
          window.opener.postMessage('loggedIn', '*');
          window.close();
        } else {
          // 게시글 수정 실패
          alert('게시글 수정에 실패했습니다.');
        }
      })

      .catch((error) => {
        console.error('게시글 수정 중 오류가 발생했습니다.', error);
        alert('게시글 수정 중 오류가 발생했습니다.');
      });
  });
});
