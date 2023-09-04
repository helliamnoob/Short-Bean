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

    const temp_html = `<li class="list-group-item">${user_name},${school_name},${career},${status}</li>`;
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
  return labels;
}

const ctx = document.getElementById('myChart');

new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
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
