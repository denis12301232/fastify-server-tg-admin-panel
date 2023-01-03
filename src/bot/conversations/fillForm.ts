import type { MyContext, MyConversation } from '@/types/bot-types'
import type { InlineKeyboard } from 'grammy'
import Validate from '@/util/Validate'
import Constants from '@/util/Constants'
import BotApi from '~/api/BotApi'
import ApiCalls from '~/api/ApiCalls'
import Keyboards from '~/keyboards/Keyboards'
import { showForm } from '~/util/showForm'
import { deepCopy } from '~/util/deepCopy'


export async function fillForm(conversation: MyConversation, ctx: MyContext) {
   try {
      // ФАМИЛИЯ
      const surname = await BotApi.askConversationQuestion('<b>Введите фамилию:</b>', conversation, ctx);
      conversation.session.form.surname = surname;
      // ИМЯ
      const name = await BotApi.askConversationQuestion('<b>Введите имя:</b>', conversation, ctx);
      conversation.session.form.name = name;
      // ОТЧЕСТВО
      const patronymic = await BotApi.askConversationQuestion('<b>Введите отчество:</b>', conversation, ctx);
      conversation.session.form.patronymic = patronymic;
      // НОМЕР ТЕЛЕФОНА
      const phone = await BotApi.askConversationQuestionWithValidators({
         ctx, conversation, question: '<b>Введите номер телефона (10 цифр, начиная с нуля):</b>', validators: [Validate.is10NumbersPhone]
      });
      conversation.session.form.phone = '+38' + phone;
      // ДАТА РОЖДЕНИЯ
      const birth = await BotApi.askConversationQuestionWithValidators({
         ctx, conversation, question: '<b>Введите дату рождения (гггг.мм.дд):</b>', validators: [Validate.isYYYYMMDD]
      });
      conversation.session.form.birth = birth;
      // АДРЕС
      await ctx.reply('<b>Aдрес:</b>', { parse_mode: 'HTML' });
      // РАЙОН
      await ctx.reply('Выберите район:', { reply_markup: Keyboards.district_keyboard });
      const district = await conversation.waitForHears(Constants.districts);
      conversation.session.form.district = district.match as string;
      // УЛИЦА
      const street = await BotApi.askConversationQuestion('Введите улицу:', conversation, ctx);
      conversation.session.form.street = street;
      // ДОМ
      const house = await BotApi.askConversationQuestion('Введите номер дома:', conversation, ctx);
      conversation.session.form.house = house;
      // КВАРТИРА
      const flat = await BotApi.askConversationQuestion('Введите номер квартиры:', conversation, ctx);
      conversation.session.form.flat = flat;
      // ЧИСЛО ПРОЖИВАЮЩИХ
      const people_num = +await BotApi.askConversationQuestionWithValidators({
         ctx, conversation, question: 'Число проживающих:', validators: [(value: string) => Number.isInteger(+value)]
      });
      conversation.session.form.people_num = people_num;
      // ФИО И ВОЗРАСТ ПРОЖИВАЮЩИХ
      if (conversation.session.form.people_num > 1) {
         for (let i = 0; i < conversation.session.form.people_num - 1; i++) {
            const human = await BotApi.askConversationQuestion(`<b>Введите ФИО и возраст ${i + 1}:</b>`, conversation, ctx);
            conversation.session.form.people_fio = [...conversation.session.form.people_fio, human];
         }
      }
      // ИНВАЛИДЫ
      await ctx.reply('<b>Есть ли среди проживающих инвалиды?</b>', { reply_markup: Keyboards.yes_no_keyboard, parse_mode: 'HTML' });
      const invalids = await conversation.waitForHears(['Да', 'Нет']);
      conversation.session.form.invalids = invalids.match as string;
      // ДЕТИ
      await ctx.reply('<b>Есть ли дети?</b>', { reply_markup: Keyboards.yes_no_keyboard, parse_mode: 'HTML' });
      const children = await conversation.waitForHears(['Да', 'Нет']);
      conversation.session.form.children = children.match as string;
      // ВОЗРАСТ ДЕТЕЙ
      if (conversation.session.form.children === 'Да') {
         conversation.session.form.children_age = [];
         let markup = deepCopy<InlineKeyboard>(Keyboards.children_age_markup);
         await ctx.reply('<b>Укажите возраст детей:</b>', { reply_markup: markup, parse_mode: 'HTML' });
         while (true) {
            const children_age = await conversation.waitFor('callback_query:data');
            if (children_age.update.callback_query.data === 'Ok') {
               await children_age.editMessageReplyMarkup();
               break;
            }
            const age = children_age.update.callback_query.data;
            if (conversation.session.form.children_age.includes(age)) {
               const index = conversation.session.form.children_age.indexOf(age);
               conversation.session.form.children_age.splice(index, 1);
               switch (age) {
                  case '0-1':
                     markup.inline_keyboard[0][0].text = `от ${age.split('-')[0]} до ${age.split('-')[1]}`;
                     break;
                  case '1-3':
                     markup.inline_keyboard[0][1].text = `от ${age.split('-')[0]} до ${age.split('-')[1]}`;
                     break;
                  case '3-9':
                     markup.inline_keyboard[1][0].text = `от ${age.split('-')[0]} до ${age.split('-')[1]}`;
                     break;
                  case '9-18':
                     markup.inline_keyboard[1][1].text = `от ${age.split('-')[0]} до ${age.split('-')[1]}`;
                     break;
               }
            } else {
               conversation.session.form.children_age = [...conversation.session.form.children_age, age];
               switch (age) {
                  case '0-1':
                     markup.inline_keyboard[0][0].text = '\u2705 ' + age;
                     break;
                  case '1-3':
                     markup.inline_keyboard[0][1].text = '\u2705 ' + age;
                     break;
                  case '3-9':
                     markup.inline_keyboard[1][0].text = '\u2705 ' + age;
                     break;
                  case '9-18':
                     markup.inline_keyboard[1][1].text = '\u2705 ' + age;
                     break;
               }
            }
            const newMarkup = await children_age.editMessageReplyMarkup({ reply_markup: markup });
            markup = (newMarkup as any).reply_markup;
            await children_age.answerCallbackQuery();
         }
         await ctx.reply(`Выбрано: ${conversation.session.form.children_age.join(', ')}`);
      }
      // ПРОДУКТЫ ПИТАНИЯ
      await ctx.reply('<b>Нужны ли продукты питания?</b>', { reply_markup: Keyboards.yes_no_keyboard, parse_mode: 'HTML' });
      const food = await conversation.waitForHears(['Да', 'Нет']);
      conversation.session.form.food = food.match as string;
      // ВОДА
      await ctx.reply('<b>Нужна ли вода?</b>', { reply_markup: Keyboards.yes_no_keyboard, parse_mode: 'HTML' });
      const water = await conversation.waitForHears(['Да', 'Нет']);
      conversation.session.form.water = water.match as string;
      // ЛЕКАРСТВА
      await ctx.reply('<b>Нужны ли лекарства?</b>', { reply_markup: Keyboards.yes_no_keyboard, parse_mode: 'HTML' });
      const drugs = await conversation.waitForHears(['Да', 'Нет']);
      conversation.session.form.drugs = drugs.match as string;
      // О ЛЕКАРСТВАХ 
      if (conversation.session.form.drugs === 'Да') {
         const products_detail = await BotApi.askConversationQuestion('<b>Укажите какие именно, кол-во, дозу:</b>', conversation, ctx);
         conversation.session.form.products_detail = products_detail;
      }
      // СРЕДСТВА ЛИЧНОЙ ГИГИЕНЫ
      await ctx.reply('<b>Нужны ли средства личной гигиены?</b>', { reply_markup: Keyboards.yes_no_keyboard, parse_mode: 'HTML' });
      const gigien = await conversation.waitForHears(['Да', 'Нет']);
      conversation.session.form.gigien = gigien.match as string;
      // О СРЕДСТВАХ ЛИЧНОЙ ГИГИЕНЫ
      if (conversation.session.form.gigien === 'Да') {
         const gigien_num = await BotApi.askConversationQuestion('<b>Укажите какие именно:</b>', conversation, ctx);
         conversation.session.form.gigien_num = gigien_num;
      }
      // ПАМПЕРСЫ
      const pampers = await BotApi.askConversationQuestion('<b>Памперсы? Если нужны, укажите какие (детские/взрослые, размер):</b>', conversation, ctx);
      conversation.session.form.pampers = pampers;
      // ОСОБЕННОСТИ ДИЕТЫ
      const diet = await BotApi.askConversationQuestion('<b>Особенности диеты, алергии, диабет и т.д.</b>', conversation, ctx);
      conversation.session.form.diet = diet;
      // СОГЛАСИЕ НА ОБРАБОТКУ ПЕРСОНАЛЬНЫХ ДАННЫХ
      await ctx.reply('<b>Даю согласие на обработку персональных данных</b>', {
         reply_markup: { keyboard: [[{ text: 'Да' }]], resize_keyboard: true, one_time_keyboard: true },
         parse_mode: 'HTML'
      });
      const pers_data_agreement = await conversation.waitForHears(['Да']);
      conversation.session.form.pers_data_agreement = true;
      // СОГЛАСИЕ НА ФОТО.ВИДЕО
      await ctx.reply('<b>Даю согласие на фото/видео</b>', {
         reply_markup: { keyboard: [[{ text: 'Да' }]], resize_keyboard: true, one_time_keyboard: true },
         parse_mode: 'HTML'
      });
      const photo_agreement = await conversation.waitForHears(['Да']);
      conversation.session.form.pers_data_agreement = true;

      await ctx.reply(`Вы ввели:\n${showForm(conversation.session.form)}\nЕсли все верно - нажмите "Сохранить"`,
         { reply_markup: Keyboards.save_keyboard });
      const next = await conversation.waitForHears(['Сохранить', 'Вернутся назад']);
      switch (next.match as string) {
         case 'Сохранить':
            await conversation.external(() => ApiCalls.saveForm(conversation.session.form))
               .then(
                  () => { ctx.reply('Сохранено', { reply_markup: Keyboards.start_keyboard }) },
                  (e) => {
                     ctx.reply(e.message);
                     ctx.reply('Ошибка! Заявка не сохранена. Попробуйте снова.', { reply_markup: Keyboards.start_keyboard });
                  }
               );
            return;
         case 'Вернутся назад':
            await ctx.reply('Вы вернулись назад', { reply_markup: Keyboards.start_keyboard });
            return;
      }
   } catch (e) {
      if (e instanceof Error) {
         ctx.reply(e.message);
         ctx.reply('Произошла ошибка', { reply_markup: Keyboards.start_keyboard })
      }
      return;
   }
}