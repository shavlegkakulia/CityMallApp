import React, { useContext, useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AppContext } from '../../AppContext/AppContext';
import { Colors } from '../../Colors/Colors';
import AppCheckBox from './AppCheckBox';
import translateService from '../../Services/translateService';

export interface IAppBtnProps {
  text: string;
  amountText: string;
  amount: number;
  percent: string;
  imgUrl: string;
  more: string;
  icon: ImageSourcePropType;
  discountPercentage: string;
  voucherPurchasePoints: string;
  voucherStartDate: string;
  voucherEndDate: string;
  voucherID: string;
  value: string;
  sign: string;
  numberOfVouchers: string;
  voucherDescription: string
}

interface IIAppBtnProps {
  item: IAppBtnProps;
  showRadio?: boolean;
  passData?: (data: any) => void;
  current?: any;
  shorCount?: boolean;
}

const VoucherCardLayout: React.FC<IIAppBtnProps> = props => {
  const {
    voucherStartDate,
    imgUrl,
    voucherEndDate,
    value,
    sign,
    numberOfVouchers,
    voucherDescription
  } = props.item;
  const [isMore, setIsMore] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [currentVaucher, setCurrenVaucher] = useState<any>();
  const { state } = useContext(AppContext);
  const { isDarkTheme } = state;

  let startDate, endDate;
  try {
    let date = voucherStartDate.split('T');
    if (date.length) {
      const ydm = date[0].split('-');
      if (ydm.length) {
        startDate = `${ydm[2]}/${ydm[1]}`;
      }
    }
    let date2 = voucherEndDate.split('T');
    if (date2.length) {
      const ydm = date2[0].split('-');
      if (ydm.length) {
        endDate = `${ydm[2]}/${ydm[1]}`;
      }
    }
  } catch (_) {

  }


  const fullDate = endDate
  return (
    <>
      <TouchableOpacity
        style={styles.mainWrap}
        activeOpacity={0.8}
        onPress={() => props.passData && props.passData(props.item)}>
        <View style={[styles.main, { borderColor: isDarkTheme ? Colors.white : Colors.black }]}>
          <View style={styles.cardWrapper}>
            <View style={styles.cardView}>

              <Text style={[styles.amountText, { color: isDarkTheme ? Colors.white : Colors.black }]}>{value}</Text>
              <View>
                <Text style={[styles.percentStyle, { color: isDarkTheme ? Colors.white : Colors.black }]}>{sign}</Text>
                {imgUrl !== undefined && (
                  <Image
                    source={{ uri: imgUrl }}
                    style={{ width: 29.23, height: 29.23, marginLeft: 10 }}
                  />
                )}
              </View>
            </View>
            <View style={{ width: '40%' }}>
              <Text numberOfLines={2} style={[styles.moreBtnTitle, { color: isDarkTheme ? Colors.white : Colors.black, marginBottom: 5 }]} >
                {voucherDescription}
              </Text>
              {voucherEndDate === undefined ? 
                null 
                :
               <Text style={styles.textStyle}>
                {`${state?.t('screens.date')}: ${fullDate}`}
              </Text>}
              <Text style={styles.amountTextStyle}>
                {`${state?.t('screens.quantity')}: ${props.shorCount ? numberOfVouchers : '1'}`}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setIsMore(!isMore);
                  setCurrenVaucher(props.item);
                }}
                style={{ top: 20, flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[styles.moreBtnTitle, { color: isDarkTheme ? Colors.white : Colors.black }]}>{state?.t('common.seeMore')}</Text>
                <Image
                  source={isDarkTheme ? require('./../../assets/images/Polygon.png') : require('./../../assets/images/arrow-black.png')}
                  style={[
                    styles.isMoreImgStyle,
                    { transform: [{ rotate: isMore ? '90deg' : '0deg' }] },
                  ]}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {props.showRadio && (
          <View style={styles.checkboxCont}>
            <AppCheckBox
              checked={props?.current?.voucherID === props.item.voucherID}
              isRequired={false}
              name={''}
              onChange={() => props.passData && props.passData(props.item)}
            />
          </View>
        )}
      </TouchableOpacity>
      {isMore &&
        currentVaucher?.merchants?.map((el: any, i: React.Key) => (
          <View
            key={i}
            style={{
              justifyContent: 'space-between',
              paddingVertical: 5,
              width: '100%',
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={{ uri: el?.logo }} style={{ width: 60, height: 43 }} />
              <Text style={[styles.nameAddressTextStyle, { color: isDarkTheme ? Colors.white : Colors.black }]}>
                -  {el?.merchantName} | {el?.address === 1 ? state?.t('screens.cityMallSaburtalo') : state?.t('screens.cityMallGldani')}
              </Text>
            </View>
          </View>

        ))}
    </>
  );
};

const styles = StyleSheet.create({
  mainWrap: {
    flexDirection: 'row',
    width: '100%',
  },

  main: {
    width: '100%',
    //maxWidth: 342,
    height: 125,
    borderRadius: 5,
    borderColor: Colors.white,
    borderWidth: 1,
    marginVertical: 10,
    justifyContent: 'center',
  },

  checkboxCont: {
    justifyContent: 'center',
    width: 30,
    alignItems: 'flex-end',
  },

  cardWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardView: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  amountText: {
    color: Colors.white,
    fontSize: 90,
    fontFamily: 'HMpangram-Bold',
    marginLeft: 10
  },

  percentStyle: {
    color: Colors.white,
    fontSize: 35,
    fontFamily: 'HMpangram-Bold',
  },

  voucherPriceText: {
    flexDirection: 'row',
    paddingVertical: 7,
    paddingBottom: 26,
  },

  textStyle: {
    color: Colors.btnGrey,
    fontSize: 10,
    fontFamily: 'HMpangram-Bold',
    textTransform: 'uppercase',
  },

  amountTextStyle: {
    color: Colors.btnGrey,
    fontSize: 10,
    fontFamily: 'HMpangram-Bold',
    textTransform: 'uppercase',
  },

  moreBtnTitle: {
    color: Colors.white,
    fontSize: 10,
    fontFamily: 'HMpangram-Bold',
    textTransform: 'uppercase',
  },

  nameAddressTextStyle: {
    color: Colors.white,
    fontFamily: 'HMpangram-Bold',
    textTransform: 'uppercase',
    fontSize: 11,
    paddingHorizontal: 10,
  },

  isMoreImgStyle: {
    width: 5,
    height: 5,
    left: 5,
  },
});
export default VoucherCardLayout;
