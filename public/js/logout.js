
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