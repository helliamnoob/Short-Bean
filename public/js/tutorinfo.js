import { jwtToken } from '../util/isLogin.util.js';

const email = document.getElementById('email');
const nickname = document.getElementById('nickname');
const user_name = document.getElementById('user_name');
const phone_number = document.getElementById('phone_number');
const birth_date = document.getElementById('birth_date');
const school_name = document.getElementById('school_name');
const career = document.getElementById('career');
const tutor_like = document.getElementById('tutor_like');
const infoupdate_btn = document.getElementById('infoupdate_btn');

document.addEventListener('DOMContentLoaded', () => {
  if (!jwtToken) {
    alert('로그인 후 이용가능한 서비스입니다.');
    window.location.href = `/`;
  } else {
    info();
    tutorinfo();
  }
});
async function tutorinfo() {
  try {
    const response = await fetch('/api/tutors', {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        let rows = data[0];
        school_name.textContent = rows['school_name'];
        career.textContent = rows['career'];
        tutor_like.textContent = rows['tutor_like'];
      });
  } catch (error) {
    console.error('Error:', error.message);
  }
}
async function info() {
  try {
    const response = await fetch('/api/userInfo', {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        let rows = data['user'];
        email.textContent = rows.email;
        nickname.textContent = rows.nickname;
        user_name.textContent = rows.user_name;
        phone_number.textContent = rows.phone_number;
        birth_date.textContent = rows.birth_date;
      });

    if (response.ok) {
    } else {
      const data = await response.json();
    }
    return;
  } catch (error) {
    console.error('Error:', error.message);
  }
}

infoupdate_btn.addEventListener('click', async () => {
  window.location.href = `/public/views/infoupdate.html`;
});
document.addEventListener('DOMContentLoaded', async () => {
  const tutorList = document.getElementById('Tutors');

  const response = await fetch('/api/tutors');
  const tutors = await response.json();

  for (const tutor of tutors) {
    const {
      school_name: tutorName,
      tutor_id: tutorId,
      career: tutorCareer,
      user_id: user_id,
    } = tutor;

    const listTutor = document.createElement('li');
    listTutor.innerHTML = `
            <li>
                <div class="box person">
                    <div class="image round">
                        <img src="/public/images/pic03.jpg" />
                    </div>
                    <h3>${tutorName}</h3>
                    <p>${tutorCareer}</p>
                    <button type="button" class="userMarkBtn" value="${tutorId}">즐겨찾기</button>
                    <button type="button" class="facechatBtn" data-user-id="${user_id}">화상채팅</button>
                </div>
            </li>
        `;

    tutorList.appendChild(listTutor);
  }
});
