const faceSocketController = (io) => {
    let userSockets = {}; // { userId: socketId }
    
    io.on("connection", (socket) => {
        console.log('a user connected:', socket.id);
    
        socket.on("join_room", (roomId) => {
            socket.join(roomId);
            socket.to(roomId).emit("user_joined", { userId: socket.id, roomId });
        });
      
        socket.on("offer", (offer, roomId) => {
            console.log(`[SERVER] Received an 'offer' from ${socket.id} for room ${roomId}`);
            socket.to(roomId).emit("offer", offer);
            console.log(`[SERVER] 'offer' event emitted to room ${roomId}`);
        });
        
        socket.on("answer", (answer, roomId) => {
            console.log(`[SERVER] Received an 'answer' from ${socket.id} for room ${roomId}`);
            socket.to(roomId).emit("answer", answer);
            console.log(`[SERVER] 'answer' event emitted to room ${roomId}`);
        });
        
        socket.on("ice", (ice, roomId) => {
            console.log(`[SERVER] Received an 'ice' candidate from ${socket.id} for room ${roomId}`);
            socket.to(roomId).emit("ice", ice);
            console.log(`[SERVER] 'ice' event emitted to room ${roomId}`);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);

            // Find the disconnected user and remove from the tracking object
            for(let userId in userSockets){
                if(userSockets[userId] === socket.id){
                    delete userSockets[userId];
                    break;
                }
            }

        });      
        
    });

};
module.exports = faceSocketController;
