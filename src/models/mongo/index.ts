import AssistanceModel from './AssistanceModel.js';
import RestoreModel from './RestoreModel.js';
import TokenModel from './TokenModel.js';
import ToolsModel from './ToolsModel.js';
import UserModel from './UserModel.js';
import ChatModel from './ChatModel.js';
import MessageModel from './MessageModel.js';
import GroupModel from './GroupModel.js';
import AttachmentModel from './AttachmentModel.js';
import TaskModel from './TaskModel.js';
import SubtaskModel from './SubtaskModel.js';

export default class Models {
  static readonly Assistance = AssistanceModel;
  static readonly Restore = RestoreModel;
  static readonly Token = TokenModel;
  static readonly Tools = ToolsModel;
  static readonly User = UserModel;
  static readonly Chat = ChatModel;
  static readonly Message = MessageModel;
  static readonly Group = GroupModel;
  static readonly Attachment = AttachmentModel;
  static readonly Task = TaskModel;
  static readonly Subtask = SubtaskModel;
}
