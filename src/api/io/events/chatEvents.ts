import type { SocketTyped, ServerTyped, ChatTypes } from '@/types/index.js';
import ChatSchemas from '@/api/schemas/ChatSchemas.js';
import { ChatService } from '@/api/services/index.js';

export default function useChatEvents(io: ServerTyped) {
  const events = {
    'chat:typing': onChatTyping,
    'chat:call': onChatCall,
    'chat:call-answer': onChatCallAnswer,
    'chat:call-cancel': onChatCallCancel,
    'chat:create': onChatCreate,
    'chat:create-group': onChatCreateGroup,
    'chat:message': onChatMessage,
    'chat:messages-delete': onChatMessagesDelete,
    'chat:message-reactions': onChatMessageReactions
  };

  function onChatTyping(this: SocketTyped, chatId: string, userName: string, userId: string) {
    const { error } = ChatSchemas.typing.validate({ chatId, userName, userId });
    if (error) {
      return this.disconnect(true);
    }
    this.broadcast.to(chatId).emit('chat:typing', chatId, userName, userId);
  }

  function onChatCall(this: SocketTyped, chatId: string) {
    const { error } = ChatSchemas.call.validate({ chatId });
    if (error) {
      return this.disconnect(true);
    }
    this.broadcast.to(chatId).emit('chat:call', chatId);
  }

  function onChatCallAnswer(this: SocketTyped, chatId: string, answer: boolean) {
    const { error } = ChatSchemas.callAnswer.validate({ chatId, answer });
    if (error) {
      return this.disconnect(true);
    }
    answer
      ? this.broadcast.to(chatId).emit('chat:call-answer', chatId, true)
      : this.broadcast.to(chatId).emit('chat:call-answer', chatId, false);
  }

  function onChatCallCancel(this: SocketTyped, chatId: string) {
    const { error } = ChatSchemas.callCancel.validate({ chatId });
    if (error) {
      return this.disconnect(true);
    }

    const clientsIds = io.sockets.adapter.rooms.get(chatId);
    for (const id of clientsIds || []) {
      const userId = io.sockets.sockets.get(id)?.data.user?._id;
      if (userId !== this.data.user?._id) {
        this.to(id).emit('chat:call-cancel');
      }
    }
  }

  async function onChatCreate(this: SocketTyped, userId: string, users: string[]) {
    try {
      const { error } = ChatSchemas.create.validate({ userId, users });
      if (error) {
        throw error;
      }
      const chatId = await ChatService.createChat(this, userId, users).catch((e) => console.log(e));

      if (chatId) {
        users
          .filter((user) => user !== userId)
          .forEach((user) => {
            const socket = Array.from(io.sockets.sockets.values()).find(
              (socket: SocketTyped) => socket.data.user?._id === user
            );
            socket?.join(chatId.toString());
          });
      }
    } catch (e) {
      return this.disconnect(true);
    }
  }

  async function onChatCreateGroup(this: SocketTyped, data: ChatTypes.CreateGroup) {
    try {
      const { error } = ChatSchemas.createGroup.validate(data);
      if (error) {
        throw error;
      }
      await ChatService.createGroup(this, data);
    } catch (e) {
      return this.disconnect(true);
    }
  }

  async function onChatMessage(this: SocketTyped, data: ChatTypes.Message) {
    try {
      const { error } = ChatSchemas.message.validate(data);

      if (error) {
        throw error;
      }

      await ChatService.saveMessage(this, data);
    } catch (e) {
      return this.disconnect();
    }
  }

  async function onChatMessagesDelete(this: SocketTyped, data: ChatTypes.DeleteMessages) {
    try {
      const { error } = ChatSchemas.deleteMessages.validate(data);
      console.log(error);

      if (error) {
        throw error;
      }

      await ChatService.deleteMessages(this.data.user?._id || '', data);
      this.emit('chat:messages-delete', data.chatId, data.msgIds);
      this.to(data.chatId).emit('chat:messages-delete', data.chatId, data.msgIds);
    } catch (e) {
      return this.disconnect();
    }
  }

  async function onChatMessageReactions(this: SocketTyped, data: ChatTypes.MessageReaction) {
    try {
      const { reactions, chatId } = await ChatService.messageReaction(this.data.user?._id || '', data);

      this.emit('chat:message-reactions', chatId, data.msgId, reactions);
      this.to(chatId).emit('chat:message-reactions', chatId, data.msgId, reactions);
    } catch (e) {
      return this.disconnect();
    }
  }

  return events;
}
