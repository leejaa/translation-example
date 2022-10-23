import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import detector from "i18next-browser-languagedetector";
import translation from './translation';

type Property = keyof typeof translation;

const properties = Object.keys(translation) as Property[];

type Language = {
  [key in Property]?: string;
};

const korean: Language = {};
const english: Language = {};
const taiwan: Language = {};

properties.forEach((property) => {
  korean[property] = translation[property].ko;
  english[property] = translation[property].en;
  taiwan[property] = translation[property].tw;
});

export const resources = {
  ko: {
    ns1: korean,
  },
  en: {
    ns1: english,
  },
  tw: {
    ns1: taiwan,
  },
};

export const defaultNS = 'ns1'

i18n.use(initReactI18next).use(detector).init({
  resources,
  lng: 'ko',
  ns: ["ns1"],
  fallbackLng: 'ko',
  debug: true,
  interpolation: {
    escapeValue: false,
  },
  react: {
    transSupportBasicHtmlNodes: true,
  },
});

export default i18n;
