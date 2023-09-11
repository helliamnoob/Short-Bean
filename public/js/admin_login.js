const admin_loginForm = document.getElementById('admin_login');
const admin_login_btn = document.getElementById('admin_login_btn');
const admin_signup_btn = document.getElementById('admin_signup_btn');
const emailInput = document.getElementById('email');
const pwdInput = document.getElementById('password');

admin_login_btn.addEventListener('click', async () => {
  try {
    const response = await fetch('/api/admin/login', {
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
      window.location.href = `/public/views/admin.html`;
    } else {
      const data = await response.json();
      alert(`로그인 실패: ${data.message}`);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
});

admin_signup_btn.addEventListener('click', async () => {
  window.location.href = `/public/views/admin_signup.html`;
});
