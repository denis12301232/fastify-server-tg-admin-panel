import ru from '@/i18n/locales/ru.json' assert { type: 'json' };
import uk from '@/i18n/locales/uk.json' assert { type: 'json' };
import en from '@/i18n/locales/en.json' assert { type: 'json' };
import Polyglot from 'node-polyglot';

const i18n = new Polyglot({ locale: 'ru' });
const locales = { ru, uk, en };

export default function useI18n() {
  return { i18n, locales };
}
