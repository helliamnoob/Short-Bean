document.addEventListener('DOMContentLoaded', () => {
    const jwtToken = getCookieValue('authorization');
    if (!jwtToken) {
        alert('로그인 후 이용가능한 서비스입니다.');
        window.location.href = `/public/views/login.html`;
    } else {
        const socket = io({
            auth: {
                token: jwtToken,
            },
        });
        // JWT 토큰에서 사용자 ID 추출
        const base64Url = jwtToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        
         console.log("base64:", base64);  // 콘솔
         const payloadObj = JSON.parse(window.atob(base64));
         
         console.log("payloadObj:", payloadObj);  // 콘솔
         const currentUserId = payloadObj.user_id;  // 현재 로그인한 사용자의 ID
         
         console.log("userId:", currentUserId);  // 콘솔
          socket.emit('register', currentUserId);
          // 화상 채팅 초대 버튼 이벤트 리스너
          document.body.addEventListener('click', (event) => {
              if (event.target.classList.contains('facechatBtn')) {
                  const inviteeId = event.target.getAttribute('data-user-id');
                  // 로그인한 사용자가 자기 자신에게 화상채팅을 걸 수 없도록 체크
                  if (inviteeId === String(currentUserId)) { 
                      alert("자기 자신에게는 화상채팅을 할 수 없습니다.");
                      return;
                  }
                  socket.emit('invite_face_chat', inviteeId);
                  console.log(`Invitation sent to user with ID: ${inviteeId}`);
              }
          });

        // 초대 수신 시의 이벤트 처리
        socket.on("receive_invite", (inviteeId) => {
            const accept = confirm("화상 채팅 초대가 도착했습니다! 수락하시겠습니까?");
            if (accept) {
                socket.emit('accept_face_chat', inviteeId);
            }
        });
        
        socket.on("start_face_chat", (roomName) => {
            console.log("Invitation accepted! Joining room: ", roomName);
            window.location.href = `/facechat?room=${roomName}`;
        });

     }
});
function getCookieValue(cookieName) {
     const cookieParts = document.cookie.split('; ');
     for (const part of cookieParts) {
       const [name, value] = part.split('=');
       if (name === cookieName) { return value; }
    }
}