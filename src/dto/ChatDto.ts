import type { IMessage, IUser, IGroup } from '@/types/interfaces'


export class ChatDto {
   readonly _id: string;
   readonly messages: IMessage[];
   readonly users: IUser[];
   readonly total: number;
   readonly updatedAt: NativeDate;
   readonly createdAt: NativeDate;
   readonly type: 'group' | 'dialog';
   readonly companion: IUser;
   readonly unread: number;
   readonly members_count: number | undefined;
   readonly group: IGroup | undefined;

   constructor(model: any, user_id: string) {
      this._id = model._id;
      this.messages = model.messages.length ? [model.messages.at(-1)] : [];
      this.users = model.users;
      this.total = model.messages.length;
      this.updatedAt = model.updatedAt;
      this.createdAt = model.createdAt;
      this.type = model.type;
      this.companion = this.type === 'dialog' ? model.users.find((user: IUser) => user._id.toString() !== user_id) : undefined;
      this.unread = model.messages.reduce((sum: number, msg: IMessage) => !msg.read.includes(user_id) ? sum++ : sum, 0);
      this.members_count = this.type === 'group' ? model.users.length - model.deleted.length : undefined;
      this.group = model.group;
   }
}