const loginForm = document.getElementById('login');
const emailInput = document.getElementById('email');
const pwdInput = document.getElementById('password');
const logoutbtn = document.getElementById('logoutBtn');
const loginbtn = document.getElementById('loginBtn');
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
      alert('로그인이 되었습니다.');
      window.location.href = `/public/views/main.html`;
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

async function logout() {
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
}

function redircetlogin() {
  window.location.href = `/public/views/login.html`;
}

function redircetmyinfo() {
  window.location.href = `/public/views/main.html`;
}
async function usercheck() {
  try {
    const response = await fetch('/api/userInfo', {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        let rows = data['user'];
      });

    if (response.ok) {
      return;
    } else {
      alert('로그인이 필요합니다.');
      window.location.href = `/public/views/login.html`;
      return;
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}
