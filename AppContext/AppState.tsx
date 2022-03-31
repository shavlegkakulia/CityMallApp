import { default_lang_key } from '../lang';
import {IOffer} from '../Services/Api/OffersApi';
import { IMerchant } from '../Services/Api/ShopsApi';
import { IClientInfo } from '../Services/ApiServices';


export interface IAppState {
    clientInfo: IClientInfo,
    isAuthenticated: boolean,
    isDarkTheme: boolean,
    clientDetails: any,
    userCardDetails: any,
    userPhoneNumber: string,
    cardDetails: any,
    routeObject: any,
    offersArray: IOffer[] | [],
    singleOffer: IOffer | {},
    singleMerchant: IMerchant | {},
    categoryArray: number[] | [],
    subCategoryArray: number[] | [],
    objectTypeId: number | undefined,
    translates: any,
    t: (key: string) => string,
    lang: string | undefined
}


export const AppState: IAppState = {
    clientInfo: {},
    isAuthenticated: false,
    isDarkTheme: true,
    clientDetails: {},
    userCardDetails: {},
    userPhoneNumber: '',
    cardDetails: {},
    routeObject: {},
    offersArray: [],
    singleOffer: {},
    singleMerchant: {},
    categoryArray: [],
    subCategoryArray: [],
    objectTypeId: undefined,
    translates: {},
    lang: 'ka-GE',
    t: function(key: string) {
        let keys = key.split('.');
        let store = null;
        for (let t of keys) {
          if (!store) store = this.translates[t];
          else store = store[t];
        }
        return store || '';
    }
}