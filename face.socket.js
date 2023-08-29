const tutorSockets = {};

const faceSocketController = (io) => {
    io.on("connection", (socket) => {
        console.log('a user connected:', socket.id);

        socket.on("join_room", (roomName) => {
            socket.join(roomName);
            socket.to(roomName).emit("welcome");
        });

        // 튜터가 접속했을 때 해당 튜터의 ID와 소켓을 저장
        socket.on('register_tutor', (tutor_id) => {
            tutorSockets[tutor_id] = socket.id;
        });

        socket.on("invite_face_chat", (tutor_id) => {
            const tutorSocketId = tutorSockets[tutor_id];
            if (tutorSocketId) {
                io.to(tutorSocketId).emit("receive_invite", socket.id);
            }
        });

        socket.on("accept_face_chat", (user_id) => {
            io.to(user_id).emit("start_face_chat");
        });

        socket.on("offer", (offer, roomName) => {
            socket.to(roomName).emit("offer", offer);
        });

        socket.on("answer", (answer, roomName) => {
            socket.to(roomName).emit("answer", answer);
        });

        socket.on("ice", (ice, roomName) => {
            socket.to(roomName).emit("ice", ice);
        });
    });
};

module.exports = faceSocketController;