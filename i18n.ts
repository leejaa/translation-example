import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translation from './translation';
// import ns1 from './ns1.json';

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

i18n.use(initReactI18next).init({
  resources,
  lng: 'ko',
  ns: ["ns1"],
  fallbackLng: 'ko',
  debug: false,
  interpolation: {
    escapeValue: false,
  },
  react: {
    transSupportBasicHtmlNodes: true,
  },
});

// export const defaultNS = "ns1";
// export const resources = {
//   en: {
//     ns1,
//   },
// } as const;

// i18n.use(initReactI18next).init({
//   lng: "en",
//   ns: ["ns1"],
//   defaultNS,
//   resources
// });

export default i18n;
