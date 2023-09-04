const faceSocketController = (io) => {
    let userSockets = {}; // { userId: socketId }
    
    io.on("connection", (socket) => {
        console.log('a user connected:', socket.id);
    
        socket.on("join_room", (roomName) => {
            socket.join(roomName);
            socket.to(roomName).emit("user_joined", { userId: socket.id, roomName });
        });
      
        socket.on("offer", (offer, roomName) => {
            console.log(`[SERVER] Received an 'offer' from ${socket.id} for room ${roomName}`);
            socket.to(roomName).emit("offer", offer);
            console.log(`[SERVER] 'offer' event emitted to room ${roomName}`);
        });
        
        socket.on("answer", (answer, roomName) => {
            console.log(`[SERVER] Received an 'answer' from ${socket.id} for room ${roomName}`);
            socket.to(roomName).emit("answer", answer);
            console.log(`[SERVER] 'answer' event emitted to room ${roomName}`);
        });
        
        socket.on("ice", (ice, roomName) => {
            console.log(`[SERVER] Received an 'ice' candidate from ${socket.id} for room ${roomName}`);
            socket.to(roomName).emit("ice", ice);
            console.log(`[SERVER] 'ice' event emitted to room ${roomName}`);
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
