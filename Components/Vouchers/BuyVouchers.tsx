import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppContext } from '../../AppContext/AppContext';
import { Colors } from '../../Colors/Colors';
import { useDimension } from '../../Hooks/UseDimension';
import { GoBack, navigate } from '../../Services/NavigationServices';
import VoucherCardLayout from '../CustomComponents/VoucherCardLayout';
import Data from '../../Constants/VouchersDummyData'
import Layout from '../Layouts/Layout';
import { GetClientVouchers, GetVouchersToBuy, IVouchers } from '../../Services/Api/VouchersApi';
import translateService from '../../Services/translateService';

const BuyVouchers = () => {
  const { width } = useDimension();
  const { state } = useContext(AppContext);
  const { isDarkTheme } = state;
  const [selectedVaucher, setSelectedVaucher] = useState<any>();
  const [clientVouchers, setClientVouchers] = useState<IVouchers[] | []>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getVouchersToBuy();
  }, [])


  const getVouchersToBuy = () => {
    if(isLoading) return;
    setIsLoading(true);
    GetVouchersToBuy().then(res => {
      setClientVouchers(res.data);
      setIsLoading(false);
    }).catch(e => {
      setIsLoading(false);
    })
  };

  const getVaucher = (data: any) => {
    setSelectedVaucher(data);
  }

  return (
    <Layout
      hasBackArrow
      onPressBack={GoBack}
     
      pageName={state?.t('screens.buyVouchers')}
      >
      <View style={styles.mainContainer}>
        <View style={styles.cardWrapper}>
              {clientVouchers?.map((el: any, i: React.Key) => (
                  <VoucherCardLayout key={i} showRadio={true} passData={getVaucher} current={selectedVaucher}
                    item={el}
                  />
              ))}
          
        </View>
        <TouchableOpacity disabled={selectedVaucher === undefined} style={styles.btnStyle} onPress={() => navigate('SelectedVouchers', {data: selectedVaucher})} >
            <Text style={styles.btnText}>{state?.t('common.buy')}</Text>
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
  mainContainer: {
    top: 20,
    marginBottom: 70,
    flex: 1,
    alignItems: 'center',
    
  },

  cardWrapper: {
    flex: 1,
    //justifyContent: 'space-between',
    marginHorizontal: '7%',
    
    
  },

  btnStyle: {
    top: 35,
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
    color: Colors.white
  },

 
});

export default BuyVouchers;
