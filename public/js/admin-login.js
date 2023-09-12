const admin_loginForm = document.getElementById('admin_login');
const admin_login_btn = document.getElementById('admin_login_btn');
const admin_signup_btn = document.getElementById('admin_signup_btn');
const admin_logout_btn = document.getElementById('admin_logout_btn');
const emailInput = document.getElementById('email');
const pwdInput = document.getElementById('password');

admin_login_btn.addEventListener('click', async () => {
  try {
    const response = await fetch('/api/admin/session/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        credentials: 'include',
      },
      body: JSON.stringify({
        email: emailInput.value,
        password: pwdInput.value,
      }),
    });
    if (response.ok) {
      // 로그인 성공시 페이지 이동
      alert('로그인이 되었습니다.');
      window.location.href = `/admin`;
    } else {
      const data = await response.json();
      alert(`로그인 실패: ${data.message}`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
});

admin_signup_btn.addEventListener('click', async () => {
  window.location.href = `/public/views/admin_signup.html`;
});

admin_logout_btn.addEventListener('click', async () => {
  try {
    console.log('실행');
    const response = await fetch('/api/admin/session/logout', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        credentials: 'include',
      },
    });
    if (response.ok) {
      // 로그아웃 성공시 페이지 이동
      alert('로그아웃 되었습니다.');
      window.location.href = `/admin/login`;
    } else {
      const data = await response.json();
      alert(`로그아웃 실패: ${data.message}`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
});
