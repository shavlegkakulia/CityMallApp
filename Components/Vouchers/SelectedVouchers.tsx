import React, { useContext, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppContext } from '../../AppContext/AppContext';
import { Colors } from '../../Colors/Colors';
import { useDimension } from '../../Hooks/UseDimension';
import { GoBack, navigate } from '../../Services/NavigationServices';
import VoucherCardLayout from '../CustomComponents/VoucherCardLayout';
import Data from '../../Constants/VouchersDummyData'
import Layout from '../Layouts/Layout';
import { RouteProp, useRoute } from '@react-navigation/native';
import { BuyVoucher, IBuyVoucherRequest } from '../../Services/Api/VouchersApi';
import translateService from '../../Services/translateService';

let hm = require('../../assets/images/H&M.png');

type RouteParamList = {
  params: {
    data: any;
  };
};

const SelectedVouchers = () => {
  const route = useRoute<RouteProp<RouteParamList, 'params'>>();
  const { width } = useDimension();
  const { state } = useContext(AppContext);
  const { isDarkTheme, clientDetails } = state;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();


  const buy = () => {
    setError(undefined);
    if (isLoading) return;
    setIsLoading(true);
    const data: IBuyVoucherRequest = {
      voucherCode: route.params.data.voucherCode,
      card: clientDetails?.[0]?.card
    }
    BuyVoucher(data).then(res => {
      setIsLoading(false);
      navigate('VouchersDone');
    }).catch(e => {
      setIsLoading(false);
      setError(e?.response?.data?.DisplayText);
    })
  };



  return (
    <Layout hasBackArrow

      pageName={state?.t('screens.buyVoucher')}
      onPressBack={GoBack}>
      <View
        style={{
          flexGrow: 1,
          backgroundColor: isDarkTheme ? Colors.black : Colors.white,
          paddingHorizontal: '7%',
        }}>
        <View style={styles.cardWrapper}>
          <View>
            <View>
              {Data.length > 0 &&
                <VoucherCardLayout
                  item={route?.params?.data}
                />}
            </View>

            
          </View>
        </View>

      </View>
      <View style={{ alignItems: 'center', height: 100 }}>
        {error !== undefined ?
          <Text style={[styles.errorText, { color: isDarkTheme ? Colors.white : Colors.black }]}>{error}</Text>
          : null}
        <TouchableOpacity
          style={styles.btnStyle}
          onPress={() => buy()}>
          <Text style={styles.btnText}>{state?.t('common.accept')}</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={isLoading} animationType="slide" transparent={true}>
        <ActivityIndicator
          size={'small'}
          color={'#ffffff'}
          style={{
            alignSelf: 'center',
            transform: [{ translateY: Dimensions.get('screen').height / 2 }],
          }}
        />
      </Modal>
    </Layout>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    top: 20,
    alignItems: 'center'
  },
  btnStyle: {

    width: 325,
    height: 66,
    borderRadius: 50,
    backgroundColor: Colors.darkGrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    fontFamily: 'HMpangram-Bold',
    textTransform: 'uppercase',
    fontSize: 14,
    lineHeight: 17,
    color: Colors.white,
  },
  errorText: {
    color: Colors.red,
    fontSize: 11,
    fontFamily: 'HMpangram-Medium',
    alignSelf: 'flex-start',
    marginLeft: '7%',
    position: 'relative',
    top: -10,
    left: 25
  }
});

export default SelectedVouchers;
