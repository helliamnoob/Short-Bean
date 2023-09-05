const loginForm = document.getElementById('login');
const loginbtn = loginForm.querySelector('button');
const emailInput = document.getElementById('email');
const pwdInput = document.getElementById('password');
const cookie = document.cookie;

window.onload = user_cookie_check();

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
      admin_check();
    } else {
      const data = await response.json();
      alert(`로그인 실패: ${data.message}`);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
});

async function user_cookie_check() {
  console.log('start');
  if(!cookie){
    console.log("no cookie")
    return;
  }
  else{
    console.log("cookie and api call")
    tutor_check();
  }
}

async function tutor_check() {
  try {
    const response = await fetch('http://localhost:3000/api/tutors', {
      method: 'GET',
    })
      .then((res) => res.json());
      window.location.href = `/public/views/tutor-main.html`;
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function admin_check() {
  try {
    const response = await fetch('http://localhost:3000/api/tutors', {
      method: 'GET',
    })
      .then((res) => res.json());
      window.location.href = `/public/views/tutor-main.html`;
  } catch (error) {
    console.error('Error:', error.message);
  }
}


// 코드수정 -이승준
function redircetSignUp() {
  window.location.href = `/public/views/signup.html`;
}
