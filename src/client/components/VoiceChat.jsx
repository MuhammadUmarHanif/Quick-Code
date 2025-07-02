import React, { useEffect, useRef, useState, useCallback } from 'react';
import './VoiceChat.css';

const VoiceChat = ({ socketRef, roomId, username }) => {
    const [isCallActive, setIsCallActive] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isDeafened, setIsDeafened] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [connectedPeers, setConnectedPeers] = useState(new Map());
    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    
    const localStreamRef = useRef(null);
    const peerConnectionsRef = useRef(new Map());
    const audioElementsRef = useRef(new Map());

    // WebRTC configuration
    const rtcConfig = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
        ]
    };

    // Create peer connection
    const createPeerConnection = useCallback((peerId) => {
        console.log(`Creating peer connection for ${peerId}`);
        
        const peerConnection = new RTCPeerConnection(rtcConfig);
        
        // Add local stream tracks
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => {
                peerConnection.addTrack(track, localStreamRef.current);
            });
        }

        // Handle incoming stream
        peerConnection.ontrack = (event) => {
            console.log(`Received remote stream from ${peerId}`);
            const [remoteStream] = event.streams;
            
            setConnectedPeers(prev => {
                const newPeers = new Map(prev);
                newPeers.set(peerId, {
                    ...newPeers.get(peerId),
                    stream: remoteStream,
                    connected: true
                });
                return newPeers;
            });

            // Create audio element for remote stream
            const audioElement = document.createElement('audio');
            audioElement.className = 'remote-audio';
            audioElement.autoplay = true;
            audioElement.muted = isDeafened;
            audioElement.srcObject = remoteStream;
            document.body.appendChild(audioElement);
            
            audioElementsRef.current.set(peerId, audioElement);
        };

        // Handle ICE candidates
        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                socketRef.current.emit('voice-ice-candidate', {
                    roomId,
                    candidate: event.candidate,
                    to: peerId
                });
            }
        };

        // Handle connection state changes
        peerConnection.onconnectionstatechange = () => {
            if (peerConnection.connectionState === 'connected') {
                setConnectedPeers(prev => {
                    const newPeers = new Map(prev);
                    newPeers.set(peerId, {
                        ...newPeers.get(peerId),
                        connected: true
                    });
                    return newPeers;
                });
                setConnectionStatus('connected');
            } else if (peerConnection.connectionState === 'connecting') {
                setConnectionStatus('connecting');
            } else if (peerConnection.connectionState === 'disconnected' || 
                       peerConnection.connectionState === 'failed') {
                setConnectedPeers(prev => {
                    const newPeers = new Map(prev);
                    newPeers.delete(peerId);
                    return newPeers;
                });
                
                // Remove audio element
                const audioElement = audioElementsRef.current.get(peerId);
                if (audioElement) {
                    audioElement.remove();
                    audioElementsRef.current.delete(peerId);
                }
            }
        };

        peerConnectionsRef.current.set(peerId, peerConnection);
        return peerConnection;
    }, [roomId, socketRef, isDeafened]);

    // Start voice call
    const startVoiceCall = async () => {
        try {
            setIsConnecting(true);
            setConnectionStatus('connecting');
            
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });
            
            localStreamRef.current = stream;
            setIsCallActive(true);
            setIsConnecting(false);
            
            // Notify other users that we joined the voice call
            socketRef.current.emit('voice-join', {
                roomId,
                username
            });
            
        } catch (error) {
            console.error('Error starting voice call:', error);
            setIsConnecting(false);
            setConnectionStatus('error');
            alert('Could not access microphone. Please check your permissions.');
        }
    };

    // End voice call
    const endVoiceCall = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
            localStreamRef.current = null;
        }

        peerConnectionsRef.current.forEach(pc => pc.close());
        peerConnectionsRef.current.clear();

        audioElementsRef.current.forEach(audio => audio.remove());
        audioElementsRef.current.clear();

        setIsCallActive(false);
        setConnectedPeers(new Map());
        setConnectionStatus('disconnected');
        
        // Notify other users that we left the voice call
        socketRef.current.emit('voice-leave', {
            roomId,
            username
        });
    };

    // Toggle mute
    const toggleMute = () => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsMuted(!audioTrack.enabled);
                
                socketRef.current.emit('voice-mute-status', {
                    roomId,
                    username,
                    isMuted: !audioTrack.enabled
                });
            }
        }
    };

    // Toggle deafen
    const toggleDeafen = () => {
        setIsDeafened(!isDeafened);
        
        audioElementsRef.current.forEach(audio => {
            audio.muted = !isDeafened;
        });
        
        socketRef.current.emit('voice-deafen-status', {
            roomId,
            username,
            isDeafened: !isDeafened
        });
    };

    // Handle socket events
    useEffect(() => {
        if (!socketRef.current) return;

        // Handle user joining voice call
        socketRef.current.on('voice-join', async ({ username: joiningUser, socketId: joiningSocketId, isExistingUser }) => {
            console.log(`Voice join event: ${joiningUser} (${joiningSocketId}) - existing: ${isExistingUser}`);
            
            if (joiningUser !== username && isCallActive) {
                if (!isExistingUser) {
                    // New user joined, create peer connection
                    const peerConnection = createPeerConnection(joiningSocketId);
                    
                    // Create offer
                    try {
                        const offer = await peerConnection.createOffer();
                        await peerConnection.setLocalDescription(offer);
                        
                        socketRef.current.emit('voice-offer', {
                            roomId,
                            offer,
                            to: joiningSocketId
                        });
                    } catch (error) {
                        console.error('Error creating offer:', error);
                    }
                }
                
                setConnectedPeers(prev => {
                    const newPeers = new Map(prev);
                    newPeers.set(joiningSocketId, { 
                        username: joiningUser,
                        connected: false, 
                        muted: false,
                        deafened: false
                    });
                    return newPeers;
                });
            }
        });

        // Handle voice offer
        socketRef.current.on('voice-offer', async ({ offer, from }) => {
            console.log(`Received voice offer from ${from}`);
            if (isCallActive) {
                try {
                    const peerConnection = createPeerConnection(from);
                    
                    await peerConnection.setRemoteDescription(offer);
                    const answer = await peerConnection.createAnswer();
                    await peerConnection.setLocalDescription(answer);
                    
                    socketRef.current.emit('voice-answer', {
                        roomId,
                        answer,
                        to: from
                    });
                } catch (error) {
                    console.error('Error handling voice offer:', error);
                }
            }
        });

        // Handle voice answer
        socketRef.current.on('voice-answer', async ({ answer, from }) => {
            console.log(`Received voice answer from ${from}`);
            try {
                const peerConnection = peerConnectionsRef.current.get(from);
                if (peerConnection) {
                    await peerConnection.setRemoteDescription(answer);
                }
            } catch (error) {
                console.error('Error handling voice answer:', error);
            }
        });

        // Handle ICE candidate
        socketRef.current.on('voice-ice-candidate', async ({ candidate, from }) => {
            console.log(`Received ICE candidate from ${from}`);
            try {
                const peerConnection = peerConnectionsRef.current.get(from);
                if (peerConnection) {
                    await peerConnection.addIceCandidate(candidate);
                }
            } catch (error) {
                console.error('Error adding ICE candidate:', error);
            }
        });

        // Handle user leaving voice call
        socketRef.current.on('voice-leave', ({ username: leavingUser, socketId: leavingSocketId }) => {
            console.log(`User ${leavingUser} left voice call`);
            
            const peerConnection = peerConnectionsRef.current.get(leavingSocketId);
            if (peerConnection) {
                peerConnection.close();
                peerConnectionsRef.current.delete(leavingSocketId);
            }
            
            // Remove audio element
            const audioElement = audioElementsRef.current.get(leavingSocketId);
            if (audioElement) {
                audioElement.remove();
                audioElementsRef.current.delete(leavingSocketId);
            }
            
            setConnectedPeers(prev => {
                const newPeers = new Map(prev);
                newPeers.delete(leavingSocketId);
                return newPeers;
            });
        });

        // Handle mute status updates
        socketRef.current.on('voice-mute-status', ({ username: mutingUser, socketId: mutingSocketId, isMuted }) => {
            setConnectedPeers(prev => {
                const newPeers = new Map(prev);
                if (newPeers.has(mutingSocketId)) {
                    newPeers.set(mutingSocketId, {
                        ...newPeers.get(mutingSocketId),
                        muted: isMuted
                    });
                }
                return newPeers;
            });
        });

        // Handle deafen status updates
        socketRef.current.on('voice-deafen-status', ({ username: deafeningUser, socketId: deafeningSocketId, isDeafened }) => {
            setConnectedPeers(prev => {
                const newPeers = new Map(prev);
                if (newPeers.has(deafeningSocketId)) {
                    newPeers.set(deafeningSocketId, {
                        ...newPeers.get(deafeningSocketId),
                        deafened: isDeafened
                    });
                }
                return newPeers;
            });
        });

        return () => {
            socketRef.current.off('voice-join');
            socketRef.current.off('voice-offer');
            socketRef.current.off('voice-answer');
            socketRef.current.off('voice-ice-candidate');
            socketRef.current.off('voice-leave');
            socketRef.current.off('voice-mute-status');
            socketRef.current.off('voice-deafen-status');
        };
    }, [socketRef, roomId, username, isCallActive, createPeerConnection]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (isCallActive) {
                endVoiceCall();
            }
        };
    }, []);

    return (
        <div className="voice-chat-container">
            <div className="voice-header">
                <h3>Voice Chat</h3>
                <div className="connection-status">
                    <span className={`status-text ${connectionStatus}`}>
                        {connectionStatus === 'connected' && '✓'}
                        {connectionStatus === 'connecting' && '⟳'}
                        {connectionStatus === 'disconnected' && '○'}
                        {connectionStatus === 'error' && '✗'}
                    </span>
                </div>
            </div>

            <div className="voice-controls">
                {!isCallActive ? (
                    <button 
                        className="voice-button join-call"
                        onClick={startVoiceCall}
                        disabled={isConnecting}
                    >
                        {isConnecting ? 'Connecting...' : 'Join Voice'}
                    </button>
                ) : (
                    <div className="call-controls">
                        <button 
                            className={`voice-button ${isMuted ? 'muted' : ''}`}
                            onClick={toggleMute}
                            title={isMuted ? 'Unmute' : 'Mute'}
                        >
                            {isMuted ? '🔇' : '🎤'}
                        </button>
                        
                        <button 
                            className={`voice-button ${isDeafened ? 'deafened' : ''}`}
                            onClick={toggleDeafen}
                            title={isDeafened ? 'Undeafen' : 'Deafen'}
                        >
                            {isDeafened ? '🔈' : '🔊'}
                        </button>
                        
                        <button 
                            className="voice-button leave-call"
                            onClick={endVoiceCall}
                            title="Leave Call"
                            
                        >
                            📞
                        </button>
                    </div>
                )}
            </div>
            
            {isCallActive && connectedPeers.size > 0 && (
                <div className="voice-participants">
                    <div className="participants-header">
                        <span>Participants ({connectedPeers.size + 1})</span>
                    </div>
                    
                    <div className="participant local-participant">
                        <div className="participant-info">
                            <span className="participant-name">You</span>
                            {isMuted && <span className="mute-indicator">🔇</span>}
                            {isDeafened && <span className="deafen-indicator">🔈</span>}
                        </div>
                    </div>
                    
                    {Array.from(connectedPeers.entries()).map(([peerId, peerInfo]) => (
                        <div key={peerId} className="participant remote-participant">
                            <div className="participant-info">
                                <span className="participant-name">{peerInfo.username}</span>
                                {peerInfo.muted && <span className="mute-indicator">🔇</span>}
                                {peerInfo.deafened && <span className="deafen-indicator">🔈</span>}
                                {!peerInfo.connected && <span className="connecting-indicator">...</span>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VoiceChat;
