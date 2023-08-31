function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

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
                if (inviteeId === String(currentUserId)) { 
                    alert("자기 자신에게는 화상채팅을 할 수 없습니다.");
                    return;
                }
    
                // UUID를 사용하여 룸 아이디 생성
                const roomId = uuidv4();
                console.log(`Generated room ID using UUID: ${roomId}`);
    
                socket.emit('invite_face_chat', inviteeId, currentUserId, roomId);
                console.log(`Invitation sent to user with ID: ${inviteeId}`);
                window.open(`/facechat?room=${roomId}`, '_blank', 'width=800,height=600');
            }
        });
    
        socket.on("receive_invite", (inviterId, roomId) => {
            const accept = confirm("화상 채팅 초대가 도착했습니다! 수락하시겠습니까?");
            if (accept) {
                socket.emit('accept_face_chat', inviterId, currentUserId, roomId);
            }
        });
    
        socket.on("start_face_chat", (roomId) => {
            console.log("Invitation accepted! Attempting to open chat window for room:", roomId);
            window.open(`/facechat?room=${roomId}`, '_blank', 'width=800,height=600');
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