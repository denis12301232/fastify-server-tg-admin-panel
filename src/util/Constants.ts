export default class Constants {
   static readonly assistance = {
      surname: {
         display: 'Фамилия',
      },
      name: {
         display: 'Имя',
      },
      patronymic: {
         display: 'Отчество',
      },
      phone: {
         display: 'Телефон',
      },
      birth: {
         display: 'Дата рождения',
      },
      district: {
         display: 'Район',
      },
      street: {
         display: 'Улица/Проспект/Переулок',
      },
      house: {
         display: 'Дом',
      },
      flat: {
         display: 'Квартира',
      },
      people_num: {
         display: 'Число проживающих',
      },
      people_fio: {
         display: 'ФИО и возраст проживающих',
      },
      invalids: {
         display: 'Есть ли среди проживающих инвалиды?',
      },
      children: {
         display: 'Есть ли дети?',
      },
      children_age: {
         display: 'Возраст детей',
      },
      food: {
         display: 'Нужны ли продукты питания?',
      },
      water: {
         display: 'Нужна ли вода?',
      },
      drugs: {
         display: 'Лекарства?',
      },
      products_detail: {
         display: 'Укажите кол-во (лекарств)',
      },
      gigien: {
         display: 'Средства личной гигиены',
      },
      gigien_num: {
         display: 'Укажите кол-во (средств)',
      },
      pampers: {
         display: 'Памперсы?',
      },
      diet: {
         display: 'Особенности диеты и т.п.',
      },
      pers_data_agreement: {
         display: 'Согласие на обработку перс данных',
      },
      photo_agreement: {
         display: 'Согласие на фото',
      },
   };

   static readonly districts = [
      'Индустриальный', 'Киевский', 'Московский', 'Немышлянский', 'Новобаварский',
      'Основянский', 'Слободской', 'Холодногорский', 'Шевченковский'
   ];

   static readonly roles = ['user', 'admin'];
}

