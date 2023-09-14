const infoupdate_form = document.getElementById('infoupdate');
const infoupdate_btn = document.getElementById('infoupdate_btn');
const email_input = document.getElementById('email');
const pwd_input = document.getElementById('password');
const confirm_password_input = document.getElementById('confirm_password');
const nickname_input = document.getElementById('nickname');
const phone_number_input = document.getElementById('phone_number');

infoupdate_btn.addEventListener('click', async () => {
  try {
      const response = await fetch('/api/userinfo', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email_input.value,
        password: pwd_input.value,
        nickname : nickname_input.value,
        phone_number : phone_number_input.value,
      }),
    });

    if (response.ok) {
      // 로그인 성공시 페이지 이동
      alert('수정 되었습니다.');
    } else {
      const data = await response.json();
      alert(`수정 실패: ${data.message}`);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
});
