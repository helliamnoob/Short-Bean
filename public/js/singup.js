const signup_form = document.getElementById('signup');
const signup_btn = document.getElementById('signup_btn');
const email_input = document.getElementById('email');
const pwd_input = document.getElementById('password');
const confirm_password_input = document.getElementById('confirm_password');
const nickname_input = document.getElementById('nickname');
const user_name_input = document.getElementById('user_name');
const phone_number_input = document.getElementById('phone_number');
const birth_date_input = document.getElementById('birth_date');

signup_btn.addEventListener('click', async () => {
  try {
      const response = await fetch('http://localhost:3000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email_input.value,
          password: pwd_input.value,
          nickname : nickname_input.value,
          user_name : user_name_input.value,
          phone_number : phone_number_input.value,
          birth_date : birth_date_input.value,
        }),
      });

      if (response.ok) {
        // 로그인 성공시 페이지 이동
        alert('회원가입이 되었습니다.');
        window.location.href = `/`;
      } else {
        const data = await response.json();
        alert(`회원가입 실패: ${data.message}`);
      }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
});
