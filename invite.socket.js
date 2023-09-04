const inviteSocketController = (io) => {
    let userSockets = {}; // { userId: socketId }
    
    io.on("connection", (socket) => {
        console.log('a user connected:', socket.id);
        socket.on("register", (userId) => {
            userSockets[userId] = socket.id;
            console.log("Registered:", userId, "with socket ID:", socket.id);
            console.log(userSockets);  
        });
        
        socket.on('invite_face_chat', (inviteeId, inviterId, roomId) => {
            console.log("Invitation for user ID:", inviteeId, "from user ID:", inviterId);
            const invitedUserSocketId = userSockets[inviteeId];
            if (invitedUserSocketId) {
                io.to(invitedUserSocketId).emit('receive_invite', inviterId, roomId); 
            } else {
                console.log("No socket ID found for user ID:", inviteeId);
            }
        });
        
        socket.on('accept_face_chat', (inviterId, inviteeId, roomId) => {
            console.log("Room ID:", roomId);
            const inviterSocketId = userSockets[inviterId];
            const inviteeSocketId = userSockets[inviteeId];
        
            if(inviterSocketId && inviteeSocketId) {
                try {
                    socket.join(roomId); 
                    // io.sockets.sockets.get(inviterSocketId).join(roomId); 
                    io.to(inviteeSocketId).emit('start_face_chat', roomId);
                } catch (error) {
                    console.error("Error while joining the room:", error);
                    socket.emit('error_notification', 'Failed to join the chat room.');  // Error notification
                }
            } else {
                console.log("Socket ID not found.");
                socket.emit('error_notification', 'An error occurred while connecting. Please try again.');  // Error notification
            }
        
        });
        
    });

    


};
module.exports = inviteSocketController;
