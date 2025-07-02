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
app.use(express.static('build'));
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const userSocketMap = {};
const voiceParticipants = new Map(); // Track voice participants per room

function getAllConnectedClients(roomId) {
    // Map
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
        // Remove any existing connection for this username
        Object.entries(userSocketMap).forEach(([socketId, name]) => {
            if (name === username) {
                delete userSocketMap[socketId];
                const existingSocket = io.sockets.sockets.get(socketId);
                if (existingSocket) {
                    existingSocket.disconnect();
                }
            }
        });

        // Add new user
        userSocketMap[socket.id] = username;
        socket.join(roomId);
        
        // Get updated client list
        const clients = getAllConnectedClients(roomId);
        
        // Broadcast to all clients in the room
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

    socket.on(ACTIONS.LANGUAGE_CHANGE, ({ roomId, language }) => {
        socket.in(roomId).emit(ACTIONS.LANGUAGE_CHANGE, { language });
    });

    socket.on(ACTIONS.CODE_OUTPUT, ({ roomId, output, executionTime, status }) => {
        socket.in(roomId).emit(ACTIONS.CODE_OUTPUT, { output, executionTime, status });
    });

    // WebRTC Voice Communication Handlers
    socket.on('voice-join', ({ roomId, username }) => {
        console.log(`User ${username} joined voice call in room ${roomId}`);
        
        // Initialize room voice participants if not exists
        if (!voiceParticipants.has(roomId)) {
            voiceParticipants.set(roomId, new Map());
        }
        
        const roomVoiceParticipants = voiceParticipants.get(roomId);
        roomVoiceParticipants.set(socket.id, { username, muted: false, deafened: false });
        
        // Notify existing voice participants about new user
        socket.to(roomId).emit('voice-join', {
            username,
            socketId: socket.id,
            isExistingUser: false
        });
        
        // Send existing voice participants to new user
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
        console.log(`User ${username} left voice call in room ${roomId}`);
        
        const roomVoiceParticipants = voiceParticipants.get(roomId);
        if (roomVoiceParticipants) {
            roomVoiceParticipants.delete(socket.id);
            
            // Clean up empty rooms
            if (roomVoiceParticipants.size === 0) {
                voiceParticipants.delete(roomId);
            }
        }
        
        // Notify other users
        socket.to(roomId).emit('voice-leave', { username, socketId: socket.id });
    });

    socket.on('voice-offer', ({ roomId, offer, to }) => {
        console.log(`Voice offer from ${socket.id} to ${to}`);
        io.to(to).emit('voice-offer', {
            offer,
            from: socket.id
        });
    });

    socket.on('voice-answer', ({ roomId, answer, to }) => {
        console.log(`Voice answer from ${socket.id} to ${to}`);
        io.to(to).emit('voice-answer', {
            answer,
            from: socket.id
        });
    });

    socket.on('voice-ice-candidate', ({ roomId, candidate, to }) => {
        console.log(`ICE candidate from ${socket.id} to ${to}`);
        io.to(to).emit('voice-ice-candidate', {
            candidate,
            from: socket.id
        });
    });

    socket.on('voice-mute-status', ({ roomId, username, isMuted }) => {
        console.log(`User ${username} ${isMuted ? 'muted' : 'unmuted'} in room ${roomId}`);
        
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
        console.log(`User ${username} ${isDeafened ? 'deafened' : 'undeafened'} in room ${roomId}`);
        
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
            // Clean up voice participants
            const roomVoiceParticipants = voiceParticipants.get(roomId);
            if (roomVoiceParticipants && roomVoiceParticipants.has(socket.id)) {
                const username = roomVoiceParticipants.get(socket.id).username;
                roomVoiceParticipants.delete(socket.id);
                
                // Clean up empty rooms
                if (roomVoiceParticipants.size === 0) {
                    voiceParticipants.delete(roomId);
                }
                
                // Notify other users about voice leave
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

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});