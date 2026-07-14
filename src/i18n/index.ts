import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';

const savedLang = localStorage.getItem('qyvora-lang') || navigator.language.split('-')[0] || 'en';

i18n.use(initReactI18next).init({
  resources: { en: { translation: en } },
  lng: savedLang,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

const localeModules: Record<string, () => Promise<{ default: any }>> = {
  fr: () => import('./locales/fr.json'),
  ar: () => import('./locales/ar.json'),
  es: () => import('./locales/es.json'),
  pt: () => import('./locales/pt.json'),
  hi: () => import('./locales/hi.json'),
  zh: () => import('./locales/zh.json'),
  de: () => import('./locales/de.json'),
  ja: () => import('./locales/ja.json'),
  ru: () => import('./locales/ru.json'),
  ha: () => import('./locales/ha.json'),
  yo: () => import('./locales/yo.json'),
  ig: () => import('./locales/ig.json'),
  ak: () => import('./locales/ak.json'),
  ee: () => import('./locales/ee.json'),
  ff: () => import('./locales/ff.json'),
  wo: () => import('./locales/wo.json'),
  bm: () => import('./locales/bm.json'),
  gaa: () => import('./locales/gaa.json'),
  sw: () => import('./locales/sw.json'),
  am: () => import('./locales/am.json'),
  so: () => import('./locales/so.json'),
  ti: () => import('./locales/ti.json'),
  zu: () => import('./locales/zu.json'),
  xh: () => import('./locales/xh.json'),
  sn: () => import('./locales/sn.json'),
  ln: () => import('./locales/ln.json'),
};

i18n.on('languageChanged', async (lng: string) => {
  if (lng === 'en') return;
  if (!i18n.hasResourceBundle(lng, 'translation')) {
    const loader = localeModules[lng];
    if (loader) {
      const mod = await loader();
      i18n.addResourceBundle(lng, 'translation', mod.default, true, true);
    }
  }
});

if (savedLang !== 'en') {
  const loader = localeModules[savedLang];
  if (loader) {
    loader().then((mod) => {
      i18n.addResourceBundle(savedLang, 'translation', mod.default, true, true);
    });
  }
}

export default i18n;

export const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', region: 'Global' },
  { code: 'fr', name: 'French', native: 'Français', region: 'Global' },
  { code: 'ar', name: 'Arabic', native: 'العربية', region: 'Global', dir: 'rtl' as const },
  { code: 'es', name: 'Spanish', native: 'Español', region: 'Global' },
  { code: 'pt', name: 'Portuguese', native: 'Português', region: 'Global' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', region: 'Global' },
  { code: 'zh', name: 'Chinese', native: '中文', region: 'Global' },
  { code: 'de', name: 'German', native: 'Deutsch', region: 'Global' },
  { code: 'ja', name: 'Japanese', native: '日本語', region: 'Global' },
  { code: 'ru', name: 'Russian', native: 'Русский', region: 'Global' },
  { code: 'ha', name: 'Hausa', native: 'Hausa', region: 'West Africa' },
  { code: 'yo', name: 'Yoruba', native: 'Yorùbá', region: 'West Africa' },
  { code: 'ig', name: 'Igbo', native: 'Igbo', region: 'West Africa' },
  { code: 'ak', name: 'Akan', native: 'Akan', region: 'West Africa' },
  { code: 'ee', name: 'Ewe', native: 'Eʋegbe', region: 'West Africa' },
  { code: 'ff', name: 'Fulfulde', native: 'Fulfulde', region: 'West Africa' },
  { code: 'wo', name: 'Wolof', native: 'Wolof', region: 'West Africa' },
  { code: 'bm', name: 'Bambara', native: 'Bamanankan', region: 'West Africa' },
  { code: 'gaa', name: 'Ga', native: 'Gã', region: 'West Africa' },
  { code: 'sw', name: 'Swahili', native: 'Kiswahili', region: 'East Africa' },
  { code: 'am', name: 'Amharic', native: 'አማርኛ', region: 'East Africa' },
  { code: 'so', name: 'Somali', native: 'Soomaali', region: 'East Africa' },
  { code: 'ti', name: 'Tigrinya', native: 'ትግርኛ', region: 'East Africa' },
  { code: 'zu', name: 'Zulu', native: 'isiZulu', region: 'Southern Africa' },
  { code: 'xh', name: 'Xhosa', native: 'isiXhosa', region: 'Southern Africa' },
  { code: 'sn', name: 'Shona', native: 'chiShona', region: 'Southern Africa' },
  { code: 'ln', name: 'Lingala', native: 'Lingála', region: 'Central Africa' },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]['code'];
