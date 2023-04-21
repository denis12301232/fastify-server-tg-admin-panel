import type { Server, Socket, DisconnectReason } from 'socket.io'
import type { UserDto, ChatDto } from '@/dto'
import type { IMessage } from './index'


export type ServerTyped = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
export type SocketTyped = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

interface ServerToClientEvents {
   'chat:typing': (chat_id: string, user_name: string, user_id: string) => void;
   'chat:user-status': (socketId: string, status: 'online' | 'offline') => void;
   'chat:message': (msg: IMessage) => void;
   'chat:invite-to-group': (chat: ChatDto) => void;
   'chat:kick-from-group': (chat_id: string) => void;
   'chat:read-message': (chat_id: string, user_id: string) => void;
   'chat:call': (chatId: string) => void;
   'chat:call-answer': (chatId: string, answer: boolean) => void;
   'chat:call-cancel': () => void;
   'webrtc:add-peer': (peerId: string, offer: boolean, user?: UserDto) => void;
   'webrtc:remove-peer': (peer_id: string) => void;
   'webrtc:sdp': (peerId: string, sdp: RTCSessionDescriptionInit) => void;
   'webrtc:ice': (peerId: string, ice: RTCIceCandidate) => void;
   'webrtc:identify-stream': (type: 'screen' | 'camera', id: string) => void;
   'webrtc:negotiate': (peerId: string) => void;
   'rtc:call': (peer_id: string, chat_id: string) => void;
   'rtc:add-peer': (peer_id: string, offer: boolean, user?: UserDto) => void;
   'rtc:session-description': (peer_id: string, sessionDescription: RTCSessionDescriptionInit) => void;
   'rtc:ice-candidate': (peer_id: string, iceCandidate: RTCIceCandidate) => void;
   'rtc:remove-peer': (peer_id: string) => void;
   'rtc:call-cancel': () => void;
   'meet:create': (meetId: string) => void;
}

interface ClientToServerEvents {
   'chat:typing': (this: SocketTyped, chat_id: string, user_name: string, user_id: string) => void;
   'chat:call': (this: SocketTyped, chatId: string) => void;
   'chat:call-answer': (this: SocketTyped, chatId: string, answer: boolean) => void;
   'chat:call-cancel': (this: SocketTyped, chatId: string) => void;
   'webrtc:add-peer': (this: SocketTyped, chatId: string) => void;
   'webrtc:remove-peer': (this: SocketTyped) => void;
   'webrtc:sdp': (this: SocketTyped, peerId: string, sdp: RTCSessionDescriptionInit) => void;
   'webrtc:ice': (this: SocketTyped, peerId: string, ice: RTCIceCandidate) => void;
   'webrtc:identify-stream': (this: SocketTyped, chatId: string, type: 'screen' | 'camera', id: string) => void;
   'webrtc:negotiate': (this: SocketTyped, peerId: string) => void;
   'rtc:call': (chat_id: string) => void;
   'rtc:answer': (answer: boolean, chat_id: string) => void;
   'rtc:relay-sdp': (this: SocketTyped, peer_id: string, sessionDescription: RTCSessionDescriptionInit) => void;
   'rtc:relay-ice': (this: SocketTyped, peer_id: string, iceCandidate: RTCIceCandidate) => void;
   'rtc:remove-peer': (this: SocketTyped) => void;
   'rtc:call-cancel': (this: SocketTyped, chat_id: string) => void;
   'meet:create': (this: SocketTyped, title: string) => void;
   'meet:leave': (this: SocketTyped, meetId: string) => void;
   'meet:join': (this: SocketTyped, meetId: string) => void;
}

interface InterServerEvents {
   ping: () => void;
   disconnect: (this: SocketTyped, reason: DisconnectReason, description?: any) => void;
}

interface SocketData {
   user: UserDto;
}