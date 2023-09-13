import { jwtToken } from '../util/isLogin.util.js';
// 게시글 작성
document.addEventListener('DOMContentLoaded', function () {
  if (!jwtToken) {
    alert('로그인 후 이용가능한 서비스입니다.');
    window.location.href = `/`;
  }
  const postCreateBtn = document.getElementById('postCreate');
  const postTitle = document.getElementById('post-title');
  const postContent = document.getElementById('post-content');
  const subjectSelect = document.getElementById('subject');
  const imageInput = document.querySelector('.upload-input');

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
