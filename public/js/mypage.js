const editFormModal = document.getElementById('editFormModal');
const showEditModal = document.getElementById('showEditModal');

const editButton = document.getElementById('editButton');

const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const checkPasswordInput = document.getElementById('checkPasswordInput');
const nicknameInput = document.getElementById('nicknameInput');
const phoneNumberInput = document.getElementById('phoneNumberInput');

showEditModal.addEventListener('click', showEditForm);
editButton.addEventListener('click', verifyEdit);
async function verifyEdit() {
  if (passwordInput.value !== checkPasswordInput.value) {
    alert('비밀번호를 확인해주세요');
    location.reload();
  }
  try {
    const response = await fetch('/api/userInfo', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: emailInput.value,
        password: passwordInput.value,
        nickname: nicknameInput.value,
        phone_number: phoneNumberInput.value,
      }),
    });

    if (response.ok) {
      alert('수정이 완료되었습니다.');
    } else {
      const data = await response.json();
      console.log(data);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function getMyInfo() {
  try {
    const response = await fetch('/api/userInfo', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.user;
    } else {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}
async function showEditForm() {
  const user = await getMyInfo();

  emailInput.value = user.email;
  passwordInput.value = user.password;
  nicknameInput.value = user.nickname;
  phoneNumberInput.value = user.phone_number;
  editFormModal.style.display = 'block';
}
function closeModal() {
  editFormModal.style.display = 'none';
}
