// 게시글 리스트
window.addEventListener('DOMContentLoaded', async function () {
  fetch('/api/post', {})
    .then((response) => response.json())
    .then((data) => {
      let rows = data.data;
      console.log(data);
      const postBox = document.getElementById('posts-box');
      rows.forEach((post) => {
        let title = post['title'];
        let content = post['content'];
        let subject = post['subject'];

        let temp_html = `<div class="solo-card">
      <div class="card w-75">
      <div class="card-body">
      <h5 class="card-title">제목: ${title}</h5>
      <p class="card-text">${content}</p>
      <p class="card-text">과목: ${subject}</p>
      </div>
      </div>
      </div>`;
        postBox.insertAdjacentHTML('beforeend', temp_html);
      });
    });
});
