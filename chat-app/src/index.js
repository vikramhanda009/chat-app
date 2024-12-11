const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { generateMessage,generateLocationMessage }= require('./utils/messages')

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

// Serve static files (like index.html)
app.use(express.static(publicDirectoryPath));

let count = 0;

io.on('connection', (socket) => {
    console.log("New socket connected!");
    socket.emit('message', generateMessage("Welcome"));
    socket.broadcast.emit("message", generateMessage("A new user has joined"));

    // Increment count
    socket.on('increment', () => {
        count++;
        io.emit('countUpdated', count);
    });

    // Handle message sending
    socket.on('sendMessage', (clientmsg, callback) => {
        const filter = new Filter();
        if (filter.isProfane(clientmsg)) {
            return callback('Profanity is not allowed');
        }
        io.emit("message", generateMessage(clientmsg));
        callback();
    });

    // Handle sending location
    socket.on('sendLocation', (location, callback) => {
        io.emit("locationMessage", generateLocationMessage(location));
        console.log("User location", generateLocationMessage(location));
        callback(); // Acknowledge location was sent
    });

    // Handle disconnect
    socket.on("disconnect", () => {
        io.emit("message", generateMessage("A user has left"));
    });
});

// Start the server
server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
