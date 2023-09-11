const signup_form = document.getElementById('signup');
const email_input = document.getElementById('email');
const pwd_input = document.getElementById('password');
const admin_name_input = document.getElementById('admin_name');
const admin_signup_btn = document.getElementById('admin_signup_btn');


admin_signup_btn.addEventListener('click', async () => {
  try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email_input.value,
          password: pwd_input.value,
          admin_name : admin_name_input.value,
        }),
      });

      if (response.ok) {
        // 로그인 성공시 페이지 이동
        alert('회원가입이 되었습니다.');
        window.location.href = `/public/views/admin_login.html`;
      } else {
        const data = await response.json();
        alert(`회원가입 실패: ${data.message}`);
      }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
});

