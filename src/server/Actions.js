const ACTIONS = {
    JOIN: 'join',
    JOINED: 'joined',
    DISCONNECTED: 'disconnected',
    CODE_CHANGE: 'code-change',
    SYNC_CODE: 'sync-code',
    LEAVE: 'leave',
    EXECUTE_CODE: 'execute-code',
    CODE_OUTPUT: 'code-output',
    INPUT_CHANGE: 'input-change',
    LANGUAGE_CHANGE: 'language-change',
    // WebRTC Voice Communication Actions
    VOICE_JOIN: 'voice-join',
    VOICE_LEAVE: 'voice-leave',
    VOICE_OFFER: 'voice-offer',
    VOICE_ANSWER: 'voice-answer',
    VOICE_ICE_CANDIDATE: 'voice-ice-candidate',
    VOICE_MUTE_STATUS: 'voice-mute-status',
    VOICE_DEAFEN_STATUS: 'voice-deafen-status',
    VOICE_PEER_CONNECTED: 'voice-peer-connected',
    VOICE_PEER_DISCONNECTED: 'voice-peer-disconnected',
};

module.exports = ACTIONS; 