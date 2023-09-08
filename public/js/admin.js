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
    const user_name = tutorData.User['user_name'];
    const user_id = tutorData['user_id'];
    const school_name = tutorData['school_name'];
    const career = tutorData['career'];
    const status = tutorData['status'];
    const tutor_id = tutorData['tutor_id'];

    const temp_html = `<li class="list-group-item"><a href="admin/tutors/id=${tutor_id}" class="reportA">${user_name},${school_name},${career},${status}</a></li>`;
    tutorListDiv.insertAdjacentHTML('beforeend', temp_html);
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
    const report_content = reportData['report_content'];
    const reported_user_id = reportData['reported_user_id'];
    const report_status = reportData['report_status'];
    const report_id = reportData['report_id'];

    let labels = [];
    labels.push(`${reported_user_id}`);

    const temp_html = `<li class="list-group-item"><a href="admin/id=${report_id}" class="reportA">${report_content},${reported_user_id},${report_status} </a></li>`;
    reportListDiv.insertAdjacentHTML('beforeend', temp_html);
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
