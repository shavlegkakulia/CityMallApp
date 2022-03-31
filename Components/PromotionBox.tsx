import React, { useContext } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    RefreshControlBase,
    Platform
} from 'react-native';
import { AppContext } from '../AppContext/AppContext';
import { Colors } from '../Colors/Colors';
import { navigate } from '../Services/NavigationServices';
import { IOffer } from '../Services/Api/OffersApi';
import translateService from '../Services/translateService';


interface IPromotionData {
    data: IOffer
    index?: number
    style?: any
}

const PromotionBox: React.FC<IPromotionData> = ({ data, index, style }) => {
    const { state, setGlobalState } = useContext(AppContext);
    const { isDarkTheme } = state;


    // const BoxColor = (i: number) => {
    //     if (i % 4 === 1) {
    //         return styles.promotionRed;
    //     } else if (i % 4 === 2) {
    //         return styles.promotionBlue;
    //     } if (i % 4 === 3) {
    //         return styles.promotionLightBlue;
    //     } else {
    //         return styles.promotionYellow;
    //     }
    // };

    const handlePromotionBoxClick = () => {
        setGlobalState({ singleOffer: data })
        navigate('SingleOfferScreen');

    };

function extractor(obj: any, key: string) {
    if(!obj || obj === null || typeof obj === null) {
        return undefined;
    }

    try{
        return obj[key]
    } catch(_) {
        return undefined;
    }
}
    return (
        <TouchableOpacity onPress={handlePromotionBoxClick} style={style}>
            <View style={styles.promotionBox}>
                <View style={[styles.container, {backgroundColor: extractor(data.offerType, 'color')}]}>
                    <Text style={{ fontSize: 5, color: Colors.white}}> {extractor(data.offerType, 'name')}</Text>
                </View>
                <Image style={styles.promotionImg} source={{ uri: data.imgUrl }} />
                <Text style={[styles.promotionTitle, { color: isDarkTheme ? Colors.white : Colors.black }]}>
                    {data.name}
                </Text>
                <Text style={[styles.promotionBodyText, { color: isDarkTheme ? Colors.white : Colors.black }]} numberOfLines={1}>
                    {data.subtitle}
                </Text>
                <View style={styles.promotionBottom}>
                    {
                        data.floor ?
                            <View>
                                <Text style={[Platform.OS === 'ios' && { fontSize: 9}, styles.promotionBottomText, { color: isDarkTheme ? Colors.white : Colors.black }]}>
                                    {`${state?.t('common.floor')}: ${data.floor[0]}`}
                                </Text>
                            </View>
                            : null
                    }
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={[styles.promotionBottomText, { color: isDarkTheme ? Colors.white : Colors.black }]}>
                        {state?.t('common.seeMore')}
                        </Text>
                        <Image style={styles.promotionBottomImg} source={isDarkTheme? require('../assets/images/arrow-sm.png') : require('../assets/images/arrow-black.png')} />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default PromotionBox;

const styles = StyleSheet.create({
    promotionBox: {
        width: 159,
        height: 180,
        borderRadius: 10,
        margin: 10,
    },
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 46,
        height: 12,
        borderRadius: 10,
        position: 'absolute',
        top: 9,
        left: 9,
        zIndex: 1,
        paddingHorizontal: 10
    },

    promotionRed: {
        backgroundColor: Colors.red
    },

    promotionBlue: {
        backgroundColor: Colors.blue
    },

    promotionLightBlue: {
        backgroundColor: Colors.lightBlue
    },

    promotionYellow: {
        backgroundColor: Colors.yellow
    },


    promotionImg: {
        position: 'relative',
        width: 159,
        height: 113,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10
    },

    promotionTitle: {
        height: 24,
        fontFamily: 'HMpangram-Medium',
        textTransform: 'uppercase',
        fontWeight: '500',
        fontSize: 10,
        lineHeight: 12,

        margin: 6
    },

    promotionBodyText: {
        fontFamily: 'HMpangram-Medium',
        textTransform: 'uppercase',
        fontWeight: '500',
        fontSize: 9,
        lineHeight: 11,

        marginLeft: 6,
        marginBottom: 9,

    },

    promotionBottom: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    promotionBottomText: {
        fontSize: 9,
        fontFamily: 'HMpangram-Bold',
        lineHeight: 9,
        marginRight: 2,
        marginLeft: 6,

    },

    promotionBottomImg: {
        width: 4,
        height: 4
    }


})