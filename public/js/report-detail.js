window.onload = function () {
  let url = location.href;
  let idx = url.indexOf('=');
  let id;
  if (idx >= 0) {
    idx = idx + 1;
    id = url.substring(idx, url.length);
  }
  loadReportDetail(id);
  console.log(url);
  console.log(idx);
  console.log(id);

  // 신고하기 처리완료 버튼
  const acceptBtn = document.querySelector('#accept');
  acceptBtn.addEventListener('click', function (event) {
    event.preventDefault();
    let status = '처리완료';
    const formData = {
      report_status: status,
    };

    fetch(`/api/admin/reports/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('신고 처리완료 성공:', data);
        console.log(formData);
        alert('신고 처리 완료되었습니다.');
        location.reload();
      })
      .catch((error) => {
        console.error('신고 처리 실패:', error);
        alert('신고 처리를 실패하였습니다.');
      });
  });
  // 신고하기 처리거부 버튼
  const cancelBtn = document.querySelector('#cancel');
  cancelBtn.addEventListener('click', function (event) {
    event.preventDefault();
    let status = '처리취소';
    const formData = {
      report_status: status,
    };

    fetch(`/api/admin/reports/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('신고 처리취소 성공:', data);
        console.log(formData);
        alert('신고 처리취소 완료되었습니다.');
        location.reload();
      })
      .catch((error) => {
        console.error('신고 처리취소 실패:', error);
        alert('신고 처리취소를 실패하였습니다.');
      });
  });
};

function loadReportDetail(reportId) {
  fetch(`/api/reports/${reportId}`, {
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
  const reportDetailDiv = document.getElementById('reportDetail');
  let reportData = data.data;
  const report_content = reportData['report_content'];
  const reported_user_id = reportData['reported_user_id'];
  const report_status = reportData['report_status'];

  const temp_html = `<div><p> 신고내용: ${report_content}</p> <p> 피신고자: ${reported_user_id}</p> <p> 신고 상태: ${report_status} </p></div>`;
  reportDetailDiv.insertAdjacentHTML('beforeend', temp_html);
}
