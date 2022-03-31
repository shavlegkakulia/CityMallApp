import React, {useContext} from 'react';
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
import Layout from './Layouts/Layout';
import translateService from '../Services/translateService';

const NotFound: React.FC<any> = data => {
  const {state} = useContext(AppContext);
  const {isDarkTheme} = state;

  return (
    <View style={styles.wrapper}>
      <Image
     
        source={
          isDarkTheme
            ? require('../assets/images/smile-light.png')
            : require('../assets/images/smile-dark.png')
        }
      />
      <Text style={[styles.text,{color: isDarkTheme ? Colors.white : Colors.black}]}>
      {state?.t('infoText.notFound')}
      </Text>
    </View>
  );
};

export default NotFound;

const styles = StyleSheet.create({
  wrapper: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
      textTransform: 'uppercase',
      fontWeight: '600'
  }
  
});
