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
