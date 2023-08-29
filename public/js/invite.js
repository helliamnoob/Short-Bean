const socket = io();

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
    console.log("Received an invite!");
    document.getElementById('inviteAlert').style.display = 'block';
    
    document.getElementById('acceptInvite').addEventListener('click', () => {
        socket.emit('accept_face_chat', inviterSocketId);
        document.getElementById('inviteAlert').style.display = 'none';
    });
});

// 초대가 수락되었을 때 처리하는 이벤트 핸들러
socket.on("accept_response", () => {
    console.log("Invitation accepted! Start the face chat.");
    // 화상 채팅 시작 로직 구현
});



