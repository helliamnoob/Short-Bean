const tutorinfo_form = document.getElementById('tutorinfo');
const age = document.getElementById('age');
const sex = document.getElementById('sex');
const user_name = document.getElementById('user_name');
const school_name = document.getElementById('school_name');
const career = document.getElementById('career');
const tutor_like = document.getElementById('tutor_like');
const infoupdate_btn = document.getElementById('infoupdate_btn');

window.onload = info(),tutorinfo();

async function tutorinfo() {
    try {
        const response = await fetch('http://localhost:3000/api/tutors', {
        method: 'GET',
      }).then(res => res.json()).then(data => {
        let rows = data[0];
          school_name.textContent=rows['school_name'];
          career.textContent=rows['career'];
          tutor_like.textContent=rows['tutor_like'];
      });
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

async function info() {
    try {
        const response = await fetch('http://localhost:3000/api/usertest', {
        method: 'GET',
        mode: 'cors',
        credentials: 'same-origin' ,
      }).then(res => res.json()).then(data => {
          let rows = data['user']
          user_name.textContent=rows.user_name;
      });
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  infoupdate_btn.addEventListener('click', async () => {
    window.location.href = `/public/views/infoupdate.html`;
  });
