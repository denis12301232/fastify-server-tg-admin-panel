import { createRequire } from 'node:module';
// import en from './locales/en.json'
// import ru from './locales/ru.json'
// import uk from './locales/uk.json'
const require = createRequire(import.meta.url);
const en = require('./locales/en.json');
const ru = require('./locales/ru.json');
const uk = require('./locales/uk.json');

export const locales = { ru, en, uk };
