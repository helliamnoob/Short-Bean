const socket = io();

const currentUserId = 1; 

socket.emit('register', currentUserId);


// 화상 채팅 초대 버튼 이벤트 리스너
document.body.addEventListener('click', (event) => {
    if (event.target.classList.contains('facechatBtn')) {
        const userId = event.target.getAttribute('data-user-id');
        socket.emit('invite_face_chat', userId);
        console.log(`Invitation sent to user with ID: ${userId}`);
    }
});

// 초대 수신 시의 이벤트 처리
socket.on("receive_invite", (inviterSocketId) => {
    const accept = confirm("화상 채팅 초대가 도착했습니다! 수락하시겠습니까?"); 
    if (accept) {
        socket.emit('accept_face_chat', inviterSocketId);
    }
});

// 초대가 수락되었을 때 처리하는 이벤트 핸들러
socket.on("start_face_chat", () => {
    console.log("Invitation accepted! Start the face chat.");
    window.location.href = "/facechat";  // 화상 채팅 페이지 URL을 가정한 것입니다.
});



