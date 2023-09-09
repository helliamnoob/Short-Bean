// // 게시글 수정
// // 게시글 수정 버튼 클릭 이벤트 리스너
// const postUpdateBtn = document.getElementById('postUpdate');

// postUpdateBtn.addEventListener('click', function () {
//   // 현재 페이지의 post_id 값을 가져옴 (URL에서 추출하거나 다른 방법으로 설정)
//   const postId = extractPostIdFromUrl(); // 예: /public/views/post.html?post_id=123

//   function extractPostIdFromUrl() {
//     var urlParams = new URLSearchParams(window.location.search);
//     return urlParams.get('post_id');
//   }

//   window.location.href = `/public/views/post-edit.html?post_id=${post_id}`;

//   // 게시글 내용 불러오기
//   fetch(`/api/post/${post_id}`)
//     .then((response) => response.json())
//     .then((data) => {
//       if (data.code === 200) {
//         const { image, title, content, subject } = data.data;
//         postImage.value = image;
//         postTitle.value = title;
//         postContent.value = content;
//         postSubject.value = subject;
//       } else {
//         console.error(data);
//       }
//     })
//     .catch((error) => {
//       console.error('Error:', error);
//       alert('게시글을 불러오는 중 오류가 발생했습니다.');
//     });

//   const image = postImage.value;
//   const title = postTitle.value;
//   const content = postContent.value;
//   const subject = postSubject.value;

//   const formData = new FormData();
//   formData.append('image', image);
//   formData.append('title', title);
//   formData.append('content', content);
//   formData.append('subject', subject);

//   // 이미지
//   const imageInput = document.querySelector('.upload-input');

//   if (imageInput && imageInput.files && imageInput.files.length > 0) {
//     // 파일이 선택된 경우에만 실행
//     formData.append('image', imageInput.files[0]);
//   }

//   fetch(`/api/post/${post_id}`, {
//     method: 'POST',
//     body: formData,
//     // headers: { 'Content-Type': 'multipart/form-data' },
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       if (data.code === 200) {
//         alert('게시글이 수정되었습니다.');
//         window.location.href = `/public/views/post.html?post_id=${post_id}`;
//       } else {
//         console.error(data);
//         alert('게시글 수정에 실패했습니다.');
//       }
//     })
//     .catch((error) => {
//       console.error('Error:', error);
//       alert('오류가 발생했습니다.');
//     });
// });
// ------------------------------------------버전3-----------------------------------
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
//     fetch(`/api/post/${post_id}`)
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.code === 200) {
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
//           })
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
//               console.error('Error:', error);
//               alert('오류가 발생했습니다.');
//             });
//         } else {
//           console.error(data);
//         }
//       })
//       .catch((error) => {
//         console.error('Error:', error);
//         alert('게시글을 불러오는 중 오류가 발생했습니다.');
//       });

//     // 페이지 이동은 이 부분에서 실행되어야 합니다.
//     window.location.href = `/public/views/post-edit.html?post_id=${post_id}`;
//   });
// }
