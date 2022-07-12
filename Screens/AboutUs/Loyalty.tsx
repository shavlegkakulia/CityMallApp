import React, { useContext, useState } from 'react';
import { Image, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { AppContext } from '../../AppContext/AppContext';
import { Colors } from '../../Colors/Colors';
import { useDimension } from '../../Hooks/UseDimension';
import { GoBack, navigate } from '../../Services/NavigationServices';
import Layout from '../../Components/Layouts/Layout';
import AppButton from '../../Components/CustomComponents/AppButton';
import translateService from '../../Services/translateService';

const Loyalty = ({ strings, userPhoneNumber, skip, pageLoading }: { strings: any[], userPhoneNumber?: string, skip?: boolean, pageLoading: boolean }) => {
  const { width } = useDimension();
  const { state } = useContext(AppContext);
  const { isDarkTheme, clientDetails } = state;

  let loyaltyText = '';

  try {
    if (strings?.length) {
      const index = strings?.findIndex((s: any) => s?.type == 1);
      if (index >= 0) {
        loyaltyText = strings[index].text;
      }
    }
  } catch (_) { }

  return (
    <Layout hasBackArrow pageName={state?.t('screens.aboutLoialty')} onPressBack={GoBack}>
      <View style={styles.mainView}>
        <View style={{ alignItems: 'center' }}>
          <View style={styles.imageView}>
            <Image
              style={styles.giftCardImg}
              source={require('../../assets/images/loyalty-card.png')}
            />
          </View>
          <View>
            {
              pageLoading ?
                <ActivityIndicator animating={true} color={isDarkTheme ? Colors.white : Colors.black} />
                :
                <Text
                  style={[
                    styles.text,
                    { color: isDarkTheme ? Colors.white : Colors.black },
                  ]}>
                  {loyaltyText}
                </Text>
            }

          </View>
        </View>
        {
          clientDetails?.length > 0 ?
            null
            :
            <View>
              <AppButton onPress={() => navigate('REGSTEP_ONE', { userPhoneNumber, skip })} title={state?.t('common.register')} btnStyle={styles.authBtn} titleStyle={[styles.btnText, { color: Colors.white }]} />
            </View>
        }
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flexGrow: 1,
    paddingHorizontal: '7%',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 20,
  },

  imageView: {
    height: 150,
    width: 240,
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
    marginBottom: 32,
  },
  giftCardImg: {
    resizeMode: 'cover',
    height: '100%',
    width: '100%',
  },
  text: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: 'HM pangram',
    lineHeight: 24,
  },

  authBtn: {
    alignSelf: 'center',
    width: 325,
    height: '100%',
    maxHeight: 66,
    backgroundColor: Colors.darkGrey,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    marginTop: 40,
  },

  btnText: {
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '800',
    fontFamily: 'HMpangram-Bold',
    textTransform: 'uppercase',
  },
});

export default Loyalty;
