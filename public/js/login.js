const loginForm = document.getElementById('login');
const loginbtn = loginForm.querySelector('button');
const emailInput = document.getElementById('email');
const pwdInput = document.getElementById('password');

loginbtn.addEventListener('click', async () => {
  try {
    const response = await fetch('/api/login', {
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
      window.location.href = `/`;
    } else {
      const data = await response.json();
      alert(`로그인 실패: ${data.message}`);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
});

function setCookie() {
  localStorage.setItem();
}
