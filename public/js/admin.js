window.onload = function () {
  loadTutorList();
  loadReportList();
};
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
    if (status == '처리중') {
      const user_name = tutorData.User['user_name'];
      const school_name = tutorData['school_name'];
      const career = tutorData['career'];
      const tutor_id = tutorData['tutor_id'];

      const temp_html = `<li class="list-group-item"><a href="admin/tutors/id=${tutor_id}" class="reportA">${user_name},${school_name},${career},${status}</a></li>`;
      tutorListDiv.insertAdjacentHTML('beforeend', temp_html);
    }
  });
}

function loadReportList() {
  fetch(`/api/reports`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      renderReportData(data);
      showReportData(data);
    })
    .catch((error) => {
      console.error('리포트 조회 실패:', error);
    });
}
function renderReportData(data) {
  const reportListDiv = document.getElementById('reportList');
  data.data.forEach((reportData) => {
    const report_status = reportData['report_status'];
    if (report_status == '처리중') {
      const report_content = reportData['report_content'];
      const reported_user_id = reportData['reported_user_id'];
      const report_id = reportData['report_id'];

      const temp_html = `<li class="list-group-item"><a href="admin/id=${report_id}" class="reportA">${report_content},${reported_user_id},${report_status} </a></li>`;
      reportListDiv.insertAdjacentHTML('beforeend', temp_html);
    }
  });
}

function showReportData(data) {
  let arr = [];
  data.data.forEach((reportData) => {
    const reported_user_id = reportData['reported_user_id'];

    arr.push(`${reported_user_id}`);
  });
  const result = arr.reduce((accu, curr) => {
    accu[curr] = (accu[curr] || 0) + 1;
    return accu;
  }, {});

  JSON.stringify(result);
  let keys = Object.keys(result);
  let value = Object.values(result);
  console.log(keys);
  console.log(value);
  const ctx = document.getElementById('myChart');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: keys,
      datasets: [
        {
          label: '# of report',
          data: value,
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}
// 지난 신고 내역 모달 열기
const reportButton = document.querySelector('#pastReport');
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
