
import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, Platform } from 'react-native';
import { AppContext } from '../AppContext/AppContext';
import { Colors } from '../Colors/Colors';
import { navigate } from '../Services/NavigationServices';
import translateService from '../Services/translateService';

const ShopDetailBox = (props: any) => {
    const { state, setGlobalState } = useContext(AppContext);
    const { isDarkTheme } = state;

    const handlePromotionBoxClick = () => {
        setGlobalState({ singleMerchant: props.data })
        navigate('ShopDetailsScreen');
    };
    // <Image resizeMode={'contain'} style={styles.promotionImg} source={{ uri: props.data.logo || props.data.imageUrl }} />
{/* <Image style={styles.promotionImg} source={{ uri: props.data.imgUrl || props.data.imageUrl }} /> */}
    return (
        <TouchableOpacity onPress={handlePromotionBoxClick} style={props.style}>
            <View style={styles.promotionBox}>
            <Image resizeMode={'contain'} style={styles.promotionImg} source={{ uri: props.data.logo || props.data.imageUrl }} />
                <Text style={[styles.promotionTitle, { color: isDarkTheme ? Colors.white : Colors.black }]}>
                    {props.data.name}
                </Text>
                <Text style={[styles.promotionBodyText, { color: isDarkTheme ? Colors.white : Colors.black }]} numberOfLines={1}>
                    {props.data.categoryNames}
                </Text>
                <View style={styles.promotionBottom}>
                    
                    <View>
                        <Text  style={[styles.promotionBottomText, { color: isDarkTheme ? Colors.white : Colors.black }]}>
                            {`${state?.t('common.floor')}: ${props.data.floor}`}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={[ styles.promotionBottomText, Platform.OS === 'ios' && {fontSize: 9}, { color: isDarkTheme ? Colors.white : Colors.black }]}>
                        {state?.t('common.seeMore')}
                        </Text>
                        <Image style={styles.promotionBottomImg} source={isDarkTheme? require('../assets/images/arrow-sm.png') : require('../assets/images/arrow-black.png')} />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};



export default ShopDetailBox;

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
        width: 46,
        height: 12,
        borderRadius: 10,
        position: 'absolute',
        top: 9,
        left: 9,
        zIndex: 1,

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
        fontSize: 8,
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