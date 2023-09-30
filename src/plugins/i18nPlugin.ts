import type { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { useI18n } from '@/hooks/index.js';

interface I18nOptions {
  fallbackLocale: string;
}

const i18nPlugin: FastifyPluginCallback<I18nOptions> = async (app, { fallbackLocale }, done) => {
  const { i18n, locales } = useI18n();
  app.i18n = i18n;

  app.addHook('preParsing', (request, reply, payload, done) => {
    const lang = request.headers['accept-language']?.split(',').at(0) || fallbackLocale;
    i18n.locale(lang);
    i18n.extend(locales[lang]);
    done();
  });
  done();
};

export default fp(i18nPlugin);
