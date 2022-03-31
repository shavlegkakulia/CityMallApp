import React, {useState, useContext, useEffect} from 'react';
import {Image, StyleSheet, Text, View, Switch, Platform} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {AppContext} from '../../AppContext/AppContext';
import {Colors} from '../../Colors/Colors';
import {useDimension} from '../../Hooks/UseDimension';
import {GoBack, navigate} from '../../Services/NavigationServices';
import Layout from '../Layouts/Layout';
import AsyncStorage from '../../Services/StorageService';
import { subscriptionService } from '../../Services/SubscriptionServive';

const Parameters = () => {
  const {state, setGlobalState} = useContext(AppContext);
  const {isDarkTheme, clientDetails} = state;
  const [isEnabled, setIsEnabled] = useState(false);
  const [isSkip, setIsSkip] = useState<boolean>(false);

  const lightMoonIcon = require('../../assets/images/moon.png');
  const darkMoonIcon = require('../../assets/images/darkMoon.png');
  const lightUserIcon = require('../../assets/images/user.png');
  const darkUserIcon = require('../../assets/images/darkAvatar.png');

  const SwitchDarkTheme = () => {
    AsyncStorage.setItem('isDarkTheme', isDarkTheme ? '0' : '1').then(_ => {
      setGlobalState({isDarkTheme: !isDarkTheme});
      subscriptionService?.sendData(
        'theme_changed',
        true,
      );
    });
  };
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  useEffect(() => {
    AsyncStorage.getItem('skip_token').then(res => {
        if(res === null) {
            setIsSkip(false);
        } else {
            setIsSkip(true);
        }
    }).catch(() => setIsSkip(false));
}, [clientDetails]);

  return (
    <Layout pageName={state?.t('screens.parameters')} onPressBack={GoBack} hasBackArrow={true} >
      <View
        style={{
          flexGrow: 1,
          backgroundColor: isDarkTheme ? Colors.black : Colors.white,
          paddingHorizontal: '7%',
        }}>
        <View style={styles.nameWrapper}> 
          {!isSkip && <Text selectable={true} style={[styles.name,{ color: isDarkTheme ? Colors.white : Colors.black }]}>
            {clientDetails?.[0]?.firstName + ' ' + clientDetails?.[0]?.lastName}
          </Text>}
        </View>
        <View style={{top: 83, height: 80, justifyContent: 'space-between'}}>
          <View style={styles.desighnView}>
            <View style={styles.iconView}>
              <View style={{width: 30}}>
                <Image source={isDarkTheme ? lightMoonIcon : darkMoonIcon} />
              </View>
              <View>
                <Text
                  style={[
                    styles.name,
                    {color: isDarkTheme ? Colors.white : Colors.black},
                  ]}>
                  {state?.t('screens.darkMode')}
                </Text>
              </View>
            </View>

            <TouchableOpacity onPress={SwitchDarkTheme}>
              <Switch
                trackColor={{false: Colors.btnGrey, true: Colors.successGreen}}
                ios_backgroundColor="#3e3e3e"
                onValueChange={SwitchDarkTheme}
                value={isDarkTheme}
                style={{transform: [{scaleX: 1}, {scaleY: 0.9}]}}
              />
            </TouchableOpacity>
          </View>
          {clientDetails?.length && <TouchableOpacity
            style={styles.iconView}
            onPress={() => {
              navigate('ProfileInfo');
              }}>
            <View style={{width: 30}}>
              <Image source={isDarkTheme ? lightUserIcon : darkUserIcon} />
            </View>
            <View>
              <Text 
                style={[
                  styles.name,
                  {color: isDarkTheme ? Colors.white : Colors.black},
                ]}>
                {state?.t('screens.profile')} 
              </Text>
            </View>
          </TouchableOpacity>}
         
          {/* <TouchableOpacity style={styles.iconView}>
            <View style={{width: 30}}>
            <Image source={require('../../assets/images/lock.png')} />
            </View>
            <View>
                <Text style={styles.name}>პაროლის ცვლილება</Text>
            </View>
          </TouchableOpacity> */}
        </View>
       
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  nameWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: 'HMpangram-Bold',
    // textTransform: 'uppercase',
  },
  desighnView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Parameters;
