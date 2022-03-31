import React, { useContext } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  RefreshControlBase,
  Platform,
} from 'react-native';
import {AppContext} from '../AppContext/AppContext';
import {Colors} from '../Colors/Colors';
import {navigate} from '../Services/NavigationServices';
import {IOffer} from '../Services/Api/OffersApi';
import translateService from '../Services/translateService';

const VaucherPromptBox: React.FC<any> = data => {
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
    navigate('SelectedVouchers', { data: data.data });
  };


  function extractor(obj: any, key: string) {
    if (!obj || obj === null || typeof obj === null) {
      return undefined;
    }

    try {
      return obj[key];
    } catch (_) {
      return undefined;
    }
  }

  return (
    <TouchableOpacity onPress={handlePromotionBoxClick} >
      <View style={styles.promotionBox}>

        <Image style={styles.promotionImg} source={{ uri: data.data.imgUrl }} />
        {/* <Image
          style={styles.promotionImg}
          source={require('./../assets/images/gift-card.png')}
        /> */}

        <Text
          numberOfLines={2}
          style={[styles.promotionTitle,{ color: isDarkTheme ? Colors.white : Colors.black }]}>
          {data.data.voucherDescription}
        </Text>
        <View
          style={{
           // flexDirection: 'row',
            paddingVertical: 7,
            paddingBottom: 16,
          }}>
          {/* <Text
            style={[
              { fontFamily: 'HMpangram-Bold' },
              { color: isDarkTheme ? Colors.white : Colors.black },
            ]}>
            ფასი: {data?.data?.voucherPurchasePoints}{' '}
          </Text> */}
          <View
            style={{
              flexDirection: 'row',
              paddingVertical: 7,
              paddingBottom: 10,
            }}>
            <Text
              style={[
                {fontFamily: 'HMpangram-Bold'},
                {color: isDarkTheme ? Colors.white : Colors.black},
              ]}>
              {state?.t('common.price')}: {data?.data?.voucherPurchasePoints}{' '}
            </Text>

          <Image source={require('./../assets/images/Star.png')} />
        </View>

        <View style={styles.promotionBottom}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={[
                styles.promotionBottomText,
                { color: isDarkTheme ? Colors.white : Colors.black },
              ]}>
              {state?.t('common.pay')}
            </Text>
            <Image
              style={styles.promotionBottomImg}
              source={
                isDarkTheme
                  ? require('../assets/images/arrow-sm.png')
                  : require('../assets/images/arrow-black.png')
              }
            />
          </View>
        </View>
      </View>
      </View>
    </TouchableOpacity>
  );
};

export default VaucherPromptBox;

const styles = StyleSheet.create({
  promotionBox: {
    width: 159,
    height: 190,
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

  promotionRed: {
    backgroundColor: Colors.red,
  },

  promotionBlue: {
    backgroundColor: Colors.blue,
  },

  promotionLightBlue: {
    backgroundColor: Colors.lightBlue,
  },

  promotionYellow: {
    backgroundColor: Colors.yellow,
  },

  promotionImg: {
    position: 'relative',
    width: 159,
    height: 113,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },

  promotionTitle: {
    height: 24,
    fontFamily: 'HMpangram-Medium',
    textTransform: 'uppercase',
    fontWeight: '500',
    fontSize: 10,
    lineHeight: 12,

    marginTop: 6,
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
    marginLeft: 2,
  },

  promotionBottomImg: {
    width: 4,
    height: 4,
  },
});
