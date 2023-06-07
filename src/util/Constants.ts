export default class Constants {
  static readonly assistanceFields = {
    surname: 'Фамилия',
    name: 'Имя',
    patronymic: 'Отчество',
    phone: 'Телефон',
    birth: 'Дата рождения',
    district: 'Район',
    street: 'Улица/Проспект/Переулок',
    house: 'Дом',
    flat: 'Квартира',
    people_num: 'Число проживающих',
    people_fio: 'ФИО и возраст проживающих',
    invalids: 'Есть ли среди проживающих инвалиды?',
    kids: 'Есть ли дети?',
    kids_age: 'Возраст детей',
    food: 'Нужны ли продукты питания?',
    water: 'Нужна ли вода?',
    medicines: 'Лекарства?',
    medicines_info: 'Укажите кол-во (лекарств)',
    hygiene: 'Средства личной гигиены',
    hygiene_info: 'Укажите кол-во (средств)',
    pampers: 'Памперсы?',
    pampers_info: 'Укажите какие?',
    diet: 'Особенности диеты и т.п.',
    pers_data_agreement: 'Согласие на обработку перс данных',
    photo_agreement: 'Согласие на фото',
  };

  static readonly districts = [
    "Индустриальный",
    "Киевский",
    "Салтовский",
    "Немышлянский",
    "Новобаварский",
    "Основянский",
    "Слободской",
    "Холодногорский",
    "Шевченковский"
  ];

  static readonly roles = ['user', 'admin'];
}
