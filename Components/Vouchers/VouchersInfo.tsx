import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppContext } from '../../AppContext/AppContext';
import { useDimension } from '../../Hooks/UseDimension';
import { GoBack, navigate } from '../../Services/NavigationServices';
import VoucherCardLayout from '../CustomComponents/VoucherCardLayout';
import VouchersButton from '../CustomComponents/VouchersButton';
import Data from '../../Constants/VouchersDummyData';
import Layout from '../Layouts/Layout';
import { GetClientVouchers, IVouchers } from '../../Services/Api/VouchersApi';
import translateService from '../../Services/translateService';

const VouchersInfo = () => {
  const { width } = useDimension();
  const { state } = useContext(AppContext);
  const { isDarkTheme } = state;

  const [clientVouchers, setClientVouchers] = useState<IVouchers[] | []>([]);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    getClientVouchers();
  }, [translateService.lang])


  const getClientVouchers = () => {
    if(isLoading) return;
    setIsLoading(true);
    GetClientVouchers().then(res => {
      setClientVouchers(res.data);
      setIsLoading(false);
    }).catch(e => {
      setIsLoading(false);
    })
  };



  return (
    <Layout
      hasBackArrow
      hideArrows
      pageName={state?.t('screens.myVouchers')}
      onPressBack={GoBack}>
      <View style={styles.main}>
        <VouchersButton
          title={state?.t('screens.buyVoucher')}
          onPress={() => navigate('BuyVouchers')}
        />
      </View>
      <View style={styles.cardWrapper}>
        {clientVouchers?.map((el: any, i: React.Key) => (
          <VoucherCardLayout item={el} key={i} shorCount={true} />
        ))}
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
  main: {
    marginTop: 66,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  cardWrapper: {
    flex: 1,
    alignItems: 'center',
    padding: 15
  },
});

export default VouchersInfo;
