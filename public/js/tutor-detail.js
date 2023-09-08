window.onload = function () {
  let url = location.href;
  let idx = url.indexOf('=');
  let id;
  if (idx >= 0) {
    idx = idx + 1;
    id = url.substring(idx, url.length);
  }
  loadTutorDetail(id);
  console.log(url);
  console.log(idx);
  console.log(id);

  //튜터 처리완료 버튼
  const acceptBtn = document.querySelector('#accept');
  acceptBtn.addEventListener('click', function (event) {
    event.preventDefault();
    let status = '수리';
    const formData = {
      status: status,
    };

    fetch(`/api/admin/tutors/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('튜터 처리완료 성공:', data);
        console.log(formData);
        alert('튜터 처리 완료되었습니다.');
        location.reload();
      })
      .catch((error) => {
        console.error('튜터 처리 실패:', error);
        alert('튜터 처리를 실패하였습니다.');
      });
  });

  //튜터 처리 거부 버튼
  const cancelBtn = document.querySelector('#cancel');
  cancelBtn.addEventListener('click', function (event) {
    event.preventDefault();
    let status = '반려';
    const formData = {
      status: status,
    };

    fetch(`/api/admin/tutors/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('튜터 처리거부 성공:', data);
        console.log(formData);
        alert('튜터 처리거부 완료되었습니다.');
        location.reload();
      })
      .catch((error) => {
        console.error('튜터 처리거부 실패:', error);
        alert('튜터 처리거부를 실패하였습니다.');
      });
  });
};

function loadTutorDetail(tutorId) {
  fetch(`/api/tutors/${tutorId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      renderTutorData(data);
    })
    .catch((error) => {
      console.error('튜터신청 조회 실패:', error);
    });
}
function renderTutorData(data) {
  const tutorDetailDiv = document.getElementById('tutorDetail');
  let tutorData = data.data;
  const school = tutorData['school_name'];
  const career = tutorData['career'];
  const status = tutorData['status'];

  const temp_html = `<div><p> 학교: ${school}</p> <p> 경력: ${career}</p> <p> 상태: ${status} </p></div>`;
  tutorDetailDiv.insertAdjacentHTML('beforeend', temp_html);
}
