import translateList, { default_lang_key } from './../lang/index';

class TranslateService {
    [x: string]: string;
    static events: Function[] = [];
    lang: string = default_lang_key;
    //set language
    use(lang: string, callback: (trans: any) => void, errCallback?: (err: any) => void) {
        try {
        const translates = translateList[lang];
        this.lang = lang;
        callback(translates);
  
            for (const e of TranslateService.events) {
                e(lang);
            }
        }
        catch(err) {
            if (errCallback) errCallback(err);
        }
    }

    //register translation change event
    subscribe(fn: Function) {
        TranslateService.events.push(fn);

        return {
            unsubscribe: () => {
                const index = TranslateService.events.indexOf(fn);
                if (index != -1) TranslateService.events.splice(index, 1);
            }
        };
    }
}

export default new TranslateService();