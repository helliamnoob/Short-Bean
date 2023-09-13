const loginForm = document.getElementById('login');
const loginbtn = loginForm.querySelector('button');
const emailInput = document.getElementById('email');
const pwdInput = document.getElementById('password');
const logoutbtn = document.getElementById('logoutBtn');
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
      tutor_check();
    } else {
      const data = await response.json();
      alert(`로그인 실패: ${data.message}`);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
});

logoutbtn.addEventListener('click', async () => {
  try {
    const response = await fetch('/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        credentials: 'include',
      },
    });
    if (response.ok) {
      // 로그인 성공시 페이지 이동
      alert('로그아웃이 되었습니다.');
    } else {
      alert(`로그아웃 실패: ${data.message}`);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
});

async function user_cookie_check() {
  console.log('start');
  if (cookie) {
    if (cookie_check()) {
      return;
    } else {
      console.log('user totur check');
      console.log(tutor_check());
      return;
    }
  } else return console.log('end');
}

async function tutor_check() {
  try {
    const response = await fetch('/api/usercheck/tutor', {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data['data'] == false) {
          console.log('user');
          window.location.href = `/public/views/user-main.html`;
          return;
        }
        window.location.href = `/public/views/tutor-main.html`;
        console.log('tutor');
        return;
      });
  } catch (error) {
    console.error('Error:', error.message);
    return;
  }
}
async function cookie_check() {
  try {
    const response = await fetch('/api/usercheck', {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        return data;
      });
  } catch (error) {
    console.error('Error:', error.message);
    return;
  }
}

// 코드수정 -이승준
function redircetSignUp() {
  window.location.href = `/public/views/signup.html`;
}
