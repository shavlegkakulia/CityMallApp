

export interface ICategories {
    id?: number,
    name?: string,
    isPremium?:boolean
}

export interface ILocation {
    name?: string,
    id?: number,
    isPremium?: boolean
    to?:string;
}

export interface IDrawerItem {
    id?: number,
    name?: string,
    location?: ILocation[],
    categories?: ICategories[] | [],
    routeName?: string,
    objectTypeId: number | undefined 

}

export default [
    {
        name: 'screens.home',
        icon: require('../assets/images/arrow-sm.png'),
        location: [],
        categories: [],
        id: 1,
        routeName: 'HomeScreen',
        objectTypeId: undefined,
    },
    {
        name: 'common.offers',
        icon: require('../assets/images/arrow-sm.png'),
        location: [
            {
                name: 'screens.cityMallSaburtalo',
                id:1

            },
            {
                name: 'screens.cityMallGldani',
                id: 2
            },

        ],
        categories: [
            {
                id: 0,
                name: 'common.sales'
            },
            {
                id: 1,
                name: 'common.news'
            },
            
        ],
        routeName: 'OffersScreen',
        id: 2,
        objectTypeId: undefined,
    },
    {
        name: 'common.shops',
        icon: require('../assets/images/arrow-sm.png'),
        location: [
            {
                name: 'screens.cityMallSaburtalo',
                id: 1
            },
            {
                name: 'screens.cityMallGldani',
                id: 2
            }
        ],
        categories: [
            {
                id: 1,
                name: 'common.shops'
            },
            {
                id: 2,
                name: 'screens.premumSpace',
                isPremium: true
            },
        ],
        routeName: 'Stores',
        id:3,
        objectTypeId: 100013,
    },
    {
        name: 'common.fun',
        icon: require('../assets/images/arrow-sm.png'),
        location: [
            {
                name: 'screens.cityMallSaburtalo',
                id: 1
            },
            {
                name: 'screens.cityMallGldani',
                id: 2
            }
        ],
        categories: [],
        routeName: 'Fun',
        objectTypeId: 100020,
        id:4
    },
    {
        name: 'common.feed',
        icon: require('../assets/images/arrow-sm.png'),
        location: [
            {
                name: 'screens.cityMallSaburtalo',
                id: 1
            },
            {
                name: 'screens.cityMallGldani',
                id: 2
            } 
        ],
        categories: [],
        routeName: 'Feed',
        objectTypeId: 100018,
        id:5
    },
    {
        name: 'common.services',
         icon: require('../assets/images/arrow-sm.png'),
         location: [
            {
                name: 'screens.cityMallSaburtalo',
                id: 1
            },
            {
                name: 'screens.cityMallGldani',
                id: 2
            } 
        ],
        categories: [],
        routeName: 'TServices',
        objectTypeId: 100015,
         id:6,
    },
    {
        name: 'screens.giftCards',
         icon: require('../assets/images/arrow-sm.png'),
        location: [
            {
                name: 'infoText.orderGidtCard',
                
            },
            {
                name: 'infoText.checkBalance',
                to: 'CheckGiftCardBalanceScreen'
            }
        ],
        routeName: 'OrderGiftCardScreen',
        categories: [],
        id:7,
    },
    {
        name: 'screens.roadMap',
         icon: require('../assets/images/arrow-sm.png'),
        location: [
            {
                name: 'screens.cityMallSaburtalo',
                id: 1
            },
            {
                name: 'screens.cityMallGldani',
                id: 2
            }
        ],
        categories: [
            {
                id: 1,
                name: 'screens.planVisit'
            },
            {
                id: 2,
                name: 'screens.contactUs'
            },
        ],
        routeName: 'ShopGuid',
        id:8,
    },
    {
        name: 'screens.aboutUs',
        icon: require('../assets/images/arrow-sm.png'),
        location: [
            {
                name: 'screens.aboutUs',
                id: 1
                
            },
            {
                name: 'screens.aboutLoialty',
                id: 2
            },
            
        ],
        categories: [],
        id:9,
        routeName: 'AboutUs',
    },
    {
        name: '_blank',
    },
    {
        name: 'screens.myProfile',
        icon: require('../assets/images/arrow-sm.png'),
        location: [],
        categories: [],
        id:10,
        routeName: 'ProfileScreen'
    },
    {
        name: 'screens.parameters',
        icon: require('../assets/images/arrow-sm.png'),
        location: [],
        categories: [],
        id:11,
        routeName: 'Parameters'
    },
    // {
    //     name: 'ფიზიკური ბარათის შეკვეთა',
    //      icon: require('../assets/images/arrow-sm.png'),
    //     location: [
    //         {
    //             location: 'სითმოლი საბურთალო'
    //         },
    //         {
    //             location: 'სითმოლი გლდანი'
    //         }
    //     ],
    //     id:11,
    // },


]