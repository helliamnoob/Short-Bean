const socket = io();

// 화상 채팅 초대 버튼 이벤트 리스너
document.body.addEventListener('click', (event) => {
    // 이벤트 위임을 사용하여 facechatBtn이 클릭되었는지 확인
    if (event.target.classList.contains('facechatBtn')) {
        const userId = event.target.getAttribute('data-user-id'); // 'value' 대신 'data-user-id' 속성을 사용합니다.
        socket.emit('invite_face_chat', userId);
        console.log(userId);
    }
});

// 초대 수신 시의 이벤트 처리
socket.on("receive_invite", (userSocketId) => {
    document.getElementById('inviteAlert').style.display = 'block';
    document.getElementById('acceptInvite').addEventListener('click', () => {
        socket.emit('accept_face_chat', userSocketId);
        document.getElementById('inviteAlert').style.display = 'none';
    });
});

