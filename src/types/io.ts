import type { Server, Socket, DisconnectReason } from 'socket.io';
import type { UserDto, ChatDto } from '@/dto/index.js';
import type { ChatTypes } from './index.js';

export type ServerTyped = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
export type SocketTyped = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

interface ServerToClientEvents {
  'chat:typing': (chat_id: string, user_name: string, user_id: string) => void;
  'chat:user-status': (socketId: string, status: 'online' | 'offline') => void;
  'chat:message': (msg: unknown) => void;
  'chat:invite-to-group': (chat: ChatDto) => void;
  'chat:kick-from-group': (chat_id: string) => void;
  'chat:read-message': (chat_id: string, user_id: string) => void;
  'chat:call': (chatId: string) => void;
  'chat:call-answer': (chatId: string, answer: boolean) => void;
  'chat:call-cancel': () => void;
  'chat:create': (chat: ChatDto) => void;
  'chat:create-group': (chat: ChatDto) => void;
  'webrtc:add-peer': (peerId: string, offer: boolean, user?: UserDto) => void;
  'webrtc:remove-peer': (peer_id: string) => void;
  'webrtc:sdp': (peerId: string, sdp: RTCSessionDescriptionInit) => void;
  'webrtc:ice': (peerId: string, ice: RTCIceCandidate) => void;
  'rtc:call': (peer_id: string, chat_id: string) => void;
  'rtc:add-peer': (peer_id: string, offer: boolean, user?: UserDto) => void;
  'rtc:session-description': (peer_id: string, sessionDescription: RTCSessionDescriptionInit) => void;
  'rtc:ice-candidate': (peer_id: string, iceCandidate: RTCIceCandidate) => void;
  'rtc:remove-peer': (peer_id: string) => void;
  'rtc:call-cancel': () => void;
  'meet:create': (meetId: string) => void;
  'error:meet-join': (code: number, message: string) => void;
}

interface ClientToServerEvents {
  'chat:typing': (this: SocketTyped, chat_id: string, user_name: string, user_id: string) => void;
  'chat:message': (this: SocketTyped, data: ChatTypes.Message) => void;
  'chat:call': (this: SocketTyped, chatId: string) => void;
  'chat:call-answer': (this: SocketTyped, chatId: string, answer: boolean) => void;
  'chat:call-cancel': (this: SocketTyped, chatId: string) => void;
  'chat:create': (this: SocketTyped, userId: string, users: string[]) => void;
  'chat:create-group': (this: SocketTyped, data: ChatTypes.CreateGroup) => void;
  'webrtc:add-peer': (this: SocketTyped, chatId: string) => void;
  'webrtc:remove-peer': (this: SocketTyped) => void;
  'webrtc:sdp': (this: SocketTyped, peerId: string, sdp: RTCSessionDescriptionInit) => void;
  'webrtc:ice': (this: SocketTyped, peerId: string, ice: RTCIceCandidate) => void;
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
  disconnect: (this: SocketTyped, reason: DisconnectReason, description?: unknown) => void;
}

interface SocketData {
  user: UserDto;
}
