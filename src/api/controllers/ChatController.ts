import type { FastifyRequest, FastifyInstance, FastifyReply } from 'fastify';
import type { ChatTypes } from '@/types/index.js';
import { ChatService, S3Service } from '@/api/services/index.js';

export default class ChatController {
  static async index(request: FastifyRequest) {
    const chats = await ChatService.index(request.user._id);
    return chats;
  }

  static async show(request: FastifyRequest<ChatTypes.Show>) {
    const chat = await ChatService.show(request.user._id, request.params.id);
    return chat;
  }

  static async destroy(request: FastifyRequest<ChatTypes.Destroy>) {
    const result = await ChatService.destroy(request.user._id, request.params.id);
    return result;
  }

  static async chatMessages(request: FastifyRequest<ChatTypes.GetMessages>) {
    const messages = await ChatService.chatMessages(request.user._id, request.params.id, request.query);
    return messages;
  }

  static async chatMembers(request: FastifyRequest<ChatTypes.GetMembers>) {
    const response = await ChatService.getUsersListInChat(request.params.id);
    return response;
  }

  static async chatAttachment(request: FastifyRequest<ChatTypes.GetAttachment>, reply: FastifyReply) {
    const result = await S3Service.getFile(S3Service.MEDIA_FOLDER, request.query.filename);
    const stream = result.Body;
    return reply.header('Content-Type', 'application/octet-stream').send(stream);
  }

  static async updateRead(this: FastifyInstance, request: FastifyRequest<ChatTypes.UpdateRead>) {
    const updated = await ChatService.updateRead(request.params.id, request.user._id);

    if (updated.modifiedCount) {
      this.io.to(request.params.id).emit('chat:read-message', request.params.id, request.user._id);
    }

    return updated;
  }

  static async updateGroup(request: FastifyRequest<ChatTypes.UpdateGroup>) {
    const file = await request.file();
    const result = await ChatService.updateGroup(request.params.id, request.user._id, request.query, file);
    return result;
  }

  static async updateGroupMembers(this: FastifyInstance, request: FastifyRequest<ChatTypes.UpdateGroupMembers>) {
    const chat = await ChatService.updateGroupMembers(request.params.id, request.user._id, request.body);

    if (request.body.action === 'add') {
      Array.from(this.io.sockets.sockets.values())
        .find((socket) => socket.data.user?._id === request.body.userId)
        ?.join(chat._id);
    } else {
      this.io.to(request.body.userId).emit('chat:kick-from-group', request.params.id);
      this.io.sockets.adapter.rooms.get(request.params.id)?.delete(request.body.userId);
    }

    return chat;
  }

  static async updateGroupRoles(request: FastifyRequest<ChatTypes.UpdateGroupRoles>) {
    const result = await ChatService.updateGroupRoles(request.params.id, request.user._id, request.body);
    return result;
  }
}
