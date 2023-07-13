export * from './models.js';
export * from './io.js';
export * from './queries.js';
export * from './socket.js';

export type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

export type ValuesOf<T extends unknown[]> = T[number];

export type Langs = 'ru' | 'uk' | 'en';
