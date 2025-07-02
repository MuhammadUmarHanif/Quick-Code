const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const { Server } = require("socket.io");
const cors = require('cors');
const ACTIONS = require('./Actions');

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());

// Serve static files from build directory (if it exists)
app.use(express.static(path.join(__dirname, 'build')));

// Basic API health check route
app.get('/', (req, res) => {
    res.json({ message: 'Socket.IO server is running', status: 'active' });
});

// Remove the catch-all route since there's no index.html to serve

const userSocketMap = {};
const voiceParticipants = new Map(); // Track voice participants per room

function getAllConnectedClients(roomId) {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId],
            };
        }
    );
}

io.on('connection', (socket) => {
    console.log('socket connected', socket.id);

    socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
        Object.entries(userSocketMap).forEach(([socketId, name]) => {
            if (name === username) {
                delete userSocketMap[socketId];
                const existingSocket = io.sockets.sockets.get(socketId);
                if (existingSocket) {
                    existingSocket.disconnect();
                }
            }
        });

        userSocketMap[socket.id] = username;
        socket.join(roomId);

        const clients = getAllConnectedClients(roomId);

        io.to(roomId).emit(ACTIONS.JOINED, {
            clients,
            username,
            socketId: socket.id,
        });
    });

    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    socket.on(ACTIONS.INPUT_CHANGE, ({ roomId, input }) => {
        socket.in(roomId).emit(ACTIONS.INPUT_CHANGE, { input });
    });

    socket.on(ACTIONS.LANGUAGE_CHANGE, ({ roomId, languageId }) => {
        socket.in(roomId).emit(ACTIONS.LANGUAGE_CHANGE, { languageId });
    });

    socket.on(ACTIONS.CODE_OUTPUT, ({ roomId, output, executionTime, status }) => {
        socket.in(roomId).emit(ACTIONS.CODE_OUTPUT, { output, executionTime, status });
    });

    socket.on('voice-join', ({ roomId, username }) => {
        if (!voiceParticipants.has(roomId)) {
            voiceParticipants.set(roomId, new Map());
        }

        const roomVoiceParticipants = voiceParticipants.get(roomId);
        roomVoiceParticipants.set(socket.id, { username, muted: false, deafened: false });

        socket.to(roomId).emit('voice-join', {
            username,
            socketId: socket.id,
            isExistingUser: false
        });

        roomVoiceParticipants.forEach((participant, participantSocketId) => {
            if (participantSocketId !== socket.id) {
                socket.emit('voice-join', {
                    username: participant.username,
                    socketId: participantSocketId,
                    isExistingUser: true
                });
            }
        });
    });

    socket.on('voice-leave', ({ roomId, username }) => {
        const roomVoiceParticipants = voiceParticipants.get(roomId);
        if (roomVoiceParticipants) {
            roomVoiceParticipants.delete(socket.id);

            if (roomVoiceParticipants.size === 0) {
                voiceParticipants.delete(roomId);
            }
        }

        socket.to(roomId).emit('voice-leave', { username, socketId: socket.id });
    });

    socket.on('voice-offer', ({ roomId, offer, to }) => {
        io.to(to).emit('voice-offer', {
            offer,
            from: socket.id
        });
    });

    socket.on('voice-answer', ({ roomId, answer, to }) => {
        io.to(to).emit('voice-answer', {
            answer,
            from: socket.id
        });
    });

    socket.on('voice-ice-candidate', ({ roomId, candidate, to }) => {
        io.to(to).emit('voice-ice-candidate', {
            candidate,
            from: socket.id
        });
    });

    socket.on('voice-mute-status', ({ roomId, username, isMuted }) => {
        const roomVoiceParticipants = voiceParticipants.get(roomId);
        if (roomVoiceParticipants && roomVoiceParticipants.has(socket.id)) {
            roomVoiceParticipants.get(socket.id).muted = isMuted;
        }

        socket.to(roomId).emit('voice-mute-status', {
            username,
            socketId: socket.id,
            isMuted
        });
    });

    socket.on('voice-deafen-status', ({ roomId, username, isDeafened }) => {
        const roomVoiceParticipants = voiceParticipants.get(roomId);
        if (roomVoiceParticipants && roomVoiceParticipants.has(socket.id)) {
            roomVoiceParticipants.get(socket.id).deafened = isDeafened;
        }

        socket.to(roomId).emit('voice-deafen-status', {
            username,
            socketId: socket.id,
            isDeafened
        });
    });

    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            const roomVoiceParticipants = voiceParticipants.get(roomId);
            if (roomVoiceParticipants && roomVoiceParticipants.has(socket.id)) {
                const username = roomVoiceParticipants.get(socket.id).username;
                roomVoiceParticipants.delete(socket.id);

                if (roomVoiceParticipants.size === 0) {
                    voiceParticipants.delete(roomId);
                }

                socket.to(roomId).emit('voice-leave', { username, socketId: socket.id });
            }

            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            });
        });
        delete userSocketMap[socket.id];
        socket.leave();
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});