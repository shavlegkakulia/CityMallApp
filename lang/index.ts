import ka from './ka';
import en from './en';

interface IKey {
    [key: string]: any;
}

export const KA = 'ka-GE';
export const EN = 'en-US';

export const default_lang_key = 'ka';
export const en_key = 'en';
export const locale_key = 'locale_key';

export const LANG_KEYS: IKey = {
    ka: KA, en: EN
}

const translateList: IKey = {
     ka, en
}

export default translateList