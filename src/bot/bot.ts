import type { MyContext } from '@/types/bot-types'
import { Bot, session } from 'grammy'
import { conversations, createConversation } from '@grammyjs/conversations'
import { fillForm } from '~/conversations/fillForm'
import Commands from '~/commands/Commands'
import BotApi from '~/api/BotApi'


export const bot = new Bot<MyContext>(process.env.BOT_TOKEN);

async function initBot() {
   try {
      await bot.api.setMyCommands([
         { command: 'start', description: 'Начать сначала' },
      ]);
      bot.use(session({ initial: BotApi.initial, getSessionKey: BotApi.getSessionKey }))
      bot.use(conversations());

      bot.command('start', Commands.start);
      bot.hears('Как пользоваться', Commands.howToUse);
      bot.use(createConversation(fillForm));

      bot.hears('Внести данные', Commands.enterData);
      bot.hears('Изменить', Commands.renterForm);
      bot.on('message:web_app_data', Commands.saveWebAppForm);

   } catch (e) {
      if (e instanceof Error) console.log(e.message);
   }
}

initBot();



