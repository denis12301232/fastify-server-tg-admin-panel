export enum ACTIONS {
   NEW_MESSAGE = 'new-message',
   READ_MESSAGE = 'read-message',
   UPDATE_STATUS = 'update-status',
   INVITE_TO_GROUP = 'invite-to-group',
   KICK_FROM_GROUP = 'kick-from-group',
   TYPING = 'typing',
   PEER_JOIN = 'peer:join',
   PEER_LEAVE = 'peer:leave',
   PEER_ADD = 'peer:add',
   PEER_REMOVE = 'peer:remove',
   PEER_RELAY_SDP = 'peer:relay-sdp',
   PEER_RELAY_ICE = 'peer:relay-ice',
   PEER_ICE_CANDIDATE = 'peer:ice-candidate',
   PEER_CALL = 'peer:call',
   PEER_ANSWER = 'peer:answer'
}