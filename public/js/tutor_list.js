window.onload = function () {
  loadTutorList();

  function loadTutorList() {
    fetch(`/api/tutors`, {
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
        console.error('튜터 조회 실패:', error);
      });
  }
  function renderTutorData(data) {
    const tutorListDiv = document.getElementById('tutorList');
    data.forEach((tutorData) => {
      const status = tutorData['status'];

      const user_name = tutorData.User['user_name'];
      const school_name = tutorData['school_name'];
      const career = tutorData['career'];
      const tutor_id = tutorData['tutor_id'];
      if (status == '수리') {
        const temp_html = `<li class="list-group-item"><p>튜터 성함: ${user_name} </p>
      튜터 출신 학교: ${school_name} 
    , 튜터 경력: ${career}<div><button id='userMarkBtn' value =${tutor_id}>즐겨찾기</button></div></li>`;
        tutorListDiv.insertAdjacentHTML('beforeend', temp_html);
      }
    });

    // 즐겨찾기 api 요청
    const userMarkBtn = document.querySelector('#userMarkBtn');
    const tutorId = document.getElementById('userMarkBtn').value;
    userMarkBtn.addEventListener('click', function () {
      fetch(`/api/userMarks/${tutorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.data === true) {
            alert('즐겨찾기 완료되었습니다.');
            location.reload();
          } else if (data.data === false) {
            alert('즐겨찾기가 취소되었습니다.');
            location.reload();
          } else {
            location.reload();
          }
        })
        .catch((error) => {
          console.error({ message: error.message });
        });
    });
  }
};
