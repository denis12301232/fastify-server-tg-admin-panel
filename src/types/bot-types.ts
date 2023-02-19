import type { SessionFlavor, Context } from 'grammy'
import type { Conversation, ConversationFlavor } from '@grammyjs/conversations'
import type { AssistanceForm } from './interfaces'

export interface SendFormResponse {
   message: string;
   saved: AssistanceForm & { _id: string };
}
export interface SessionData {
   form: AssistanceForm;
}
export type MyContext = Context & SessionFlavor<SessionData> & ConversationFlavor;
export type MyConversation = Conversation<MyContext>;
export interface ConversationQuestionWithValidators {
   question: string;
   conversation: MyConversation;
   ctx: MyContext;
   validators: Function[];
}