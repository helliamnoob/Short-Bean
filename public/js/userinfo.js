const userinfo_form = document.getElementById('userinfo');
const email = document.getElementById('email');
const nickname = document.getElementById('nickname');
const user_name = document.getElementById('user_name');
const phone_number = document.getElementById('phone_number');
const birth_date = document.getElementById('birth_date');
const infoupdate_btn = document.getElementById('infoupdate_btn');
const delete_btn = document.getElementById('delete_btn');

window.onload = info();
async function info() {
  try {
      const response = await fetch('http://localhost:3000/api/usertest', {
      method: 'GET',
    }).then(res => res.json()).then(data => {
        console.log(data['user']);
        let rows = data['user']
        email.textContent=rows.email;
        nickname.textContent=rows.nickname;
        user_name.textContent=rows.user_name;
        phone_number.textContent=rows.phone_number;
        birth_date.textContent=rows.birth_date;
    });

    if (response.ok) {
    } else {
      const data = await response.json();
    }
      return;
  } catch (error) {
    console.error('Error:', error.message);
  }
};

infoupdate_btn.addEventListener('click', async () => {
  window.location.href = `/public/views/infoupdate.html`;
});

delete_btn.addEventListener('click', async () => {
  try {
      const response = await fetch('http://localhost:3000/api/signout', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // 로그인 성공시 페이지 이동
        alert('탈퇴 되었습니다.');
      } else {
        const data = await response.json();
        alert(`탈퇴 실패: ${data.message}`);
      }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
});