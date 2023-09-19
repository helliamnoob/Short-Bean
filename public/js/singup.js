const signup_form = document.getElementById('signup');
const signup_btn = document.getElementById('signup_btn');
const sms_auth = document.getElementById('sms_auth_btn');
const sms_check = document.getElementById('check_btn');
const email_input = document.getElementById('email');
const pwd_input = document.getElementById('password');
const confirm_password_input = document.getElementById('confirm_password');
const nickname_input = document.getElementById('nickname');
const user_name_input = document.getElementById('user_name');
const phone_number_input = document.getElementById('phone_number');
const birth_date_input = document.getElementById('birth_date');
const auth_input = document.getElementById('auth');

signup_btn.style.display = 'none';

signup_btn.addEventListener('click', async () => {
  try {
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email_input.value,
        password: pwd_input.value,
        nickname: nickname_input.value,
        user_name: user_name_input.value,
        phone_number: phone_number_input.value,
        birth_date: birth_date_input.value,
      }),
    });

    if (response.ok) {
      // 로그인 성공시 페이지 이동
      alert('회원가입이 되었습니다.');
      window.location.href = `/`;
    } else {
      const data = await response.json();
      alert(`회원가입 실패: ${data.message}`);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
});

sms_auth.addEventListener('click', async () => {
  try {
    const response = await fetch('/api/smsauth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: user_name_input.value,
        phone: phone_number_input.value,
      }),
    });

    if (response.ok) {
      alert('전송 되었습니다.');
    } else {
      const data = await response.json();
      alert(`전송 실패: ${data.message}`);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
});

sms_check.addEventListener('click', async () => {
  try {
    let code = 0;
    const response = await fetch('/api/smscheck', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: phone_number_input.value,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        let rows = data;
        code = rows['data'];
      });

    if (auth_input.value == code) {
      alert('인증 성공');
      signup_btn.style.display = 'block';
      return;
    }
    alert(`인증 실패`);
    return;
  } catch (error) {
    console.error('Error:', error.message);
  }
});
