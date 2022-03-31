import React, {useContext} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {AppContext} from '../../AppContext/AppContext';
import {Colors} from '../../Colors/Colors';
import {useDimension} from '../../Hooks/UseDimension';
import {GoBack, navigate} from '../../Services/NavigationServices';
import MessagesInfo from '../CustomComponents/MessagesInfo';
import Layout from '../Layouts/Layout';
import translateService from "../../Services/translateService";

const EmailChanged = () => {
  const {width} = useDimension();
  const {state} = useContext(AppContext);
  const {isDarkTheme} = state;

  return (
    <Layout pageName={state?.t('screens.giftCard')} >
      <View
        style={{
          flexGrow: 1,
          backgroundColor: isDarkTheme ? Colors.black : Colors.white,
          paddingHorizontal: '7%',
        }}>
        <View style={styles.successView}>
          <MessagesInfo
            icon={require('../../assets/images/success.png')}
            bgColorProp={Colors.successGreen}
            title={state?.t('infoText.emailChange')}
            text={''}
            phone={''}
          />
        </View>

        <View style={{flex: 1}}>
          <TouchableOpacity style={styles.btnStyle} onPress={() => {navigate('HomeScreen')}}>
            <Text style={styles.btnText}>{state?.t('common.close')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  successView: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },

  btnStyle: {
    top: 25,
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
});

export default EmailChanged;
