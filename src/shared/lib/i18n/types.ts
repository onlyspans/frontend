import enTranslations from './locales/en.json';

export type TranslationKeys = typeof enTranslations;

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

export type TranslationKey = NestedKeyOf<TranslationKeys>;

type Params = Record<string, string | number>;

export interface TypedTFunction {
  (key: TranslationKey): string;
  (key: TranslationKey, params: Params): string;
}

export type SupportedLanguage = 'en' | 'ru';