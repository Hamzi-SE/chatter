const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const errorMiddleware = require("./middleware/error");
const { createServer } = require('http');

const socketServer = createServer(app);

socketServer.listen(8080, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Socket server listening on port 8080');
    }
});


const io = require('socket.io')(socketServer, {
    cors: {
        origin: "http://localhost:3001",
        methods: ["*"],
    },
});

let liveUsers = [];

const addUserToLiveUsers = (userId, socketId) => {
    !liveUsers.some(user => user.userId === userId) && liveUsers.push({ userId, socketId })
}

const removeUserFromLiveUsers = (socketId, userId) => {
    if (socketId) {
        liveUsers = liveUsers.filter(user => user.socketId !== socketId);

    } else if (userId) {
        liveUsers = liveUsers.filter(user => user.userId !== userId);

    }
}

const getUser = (userId) => {
    return liveUsers.find(user => user.userId === userId);
}

io.on('connection', (socket) => {
    // when connect
    console.log('A user connected');

    // take userId and socketId from user
    socket.on('addUserToLiveUsers', (userId) => {
        if (userId) {
            addUserToLiveUsers(userId, socket.id);
            io.emit('getUsers', liveUsers);
        }
    })

    // send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        const receiver = getUser(receiverId);
        io.to(receiver?.socketId).emit("getMessage", {
            senderId,
            text
        })
    })

    socket.on("typing", ({ senderId, receiverId, typing }) => {
        if (typing) {
            const receiver = getUser(receiverId);
            io.to(receiver?.socketId).emit("isTyping", { senderId, typing: true });
        } else if (receiverId && !typing) {
            const receiver = getUser(receiverId);
            receiver && io.to(receiver?.socketId).emit("isTyping", { senderId, typing: false });
        }
    })

    socket.on("removeUserFromLiveUsers", userId => {
        removeUserFromLiveUsers(null, userId);
        io.emit('getUsers', liveUsers);
    })

    // when disconnect
    socket.on('disconnect', () => {
        console.log('A user disconnected');
        removeUserFromLiveUsers(socket.id, null);
    });


});

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));


// Route Imports
const userRoutes = require('./routes/userRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { remove } = require('./models/messageModel');

app.use('/api/v1', userRoutes);
app.use('/api/v1', conversationRoutes);
app.use('/api/v1', messageRoutes);

// Middleware for Error Handling
app.use(errorMiddleware);

module.exports = app;