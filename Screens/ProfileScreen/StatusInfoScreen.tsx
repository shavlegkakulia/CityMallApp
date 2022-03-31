import axios from 'axios';
import React, {useContext, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {AppContext} from '../../AppContext/AppContext';
import {Colors} from '../../Colors/Colors';
import AppLayout from '../../Components/AppLayout';
import StatusBar from '../../Components/StatusBar';
import envs from './../../config/env';

const StatusInfoScreen = () => {
  const {state} = useContext(AppContext);
  const {isDarkTheme} = state;

  const [strings, setStrings] = useState<any>();

  useEffect(() => {
      axios.get(`${envs.API_URL}/api/Mobile/GetGeneralTxt`).then(res => {
        if (res.data) {
          setStrings(res.data);
        
        }
      });
    }, [state.lang]);

    let looiality: any = {}, about: any = {};
  
    try {
      if (strings?.length) {
        const index = strings.findIndex((s: any) => s.type == 3);
        if (index >= 0) {
          looiality = strings[index];
        }
      }
    } catch (_) {}
   
    try {
      if (strings?.length) {
        const index = strings.findIndex((s: any) => s.type == 4);
        if (index >= 0) {
          about = strings[index];
        }
      }
    } catch (_) {}


  const textThemeColor = {
    color: isDarkTheme ? Colors.white : Colors.black,
  };

  const bgThemeColor = {
    backgroundColor: isDarkTheme ? Colors.black : Colors.white,
  };

  return (
    <AppLayout>
      <ScrollView style={{backgroundColor: isDarkTheme ? Colors.black : Colors.white}}>
        <View style={[bgThemeColor, styles.main]}>
          <View style={{marginBottom: 40}}>
            <Text style={[styles.titleText, textThemeColor]}>{state?.t('screens.statusbar')}</Text>
            <StatusBar hide={true} />
          </View>
          <View style={{marginBottom: 40}}>
            <Text style={[styles.titleText, textThemeColor]}>
            {/* {state?.t('infoText.aboutStatus')} */}
            {about !== undefined && about?.title}
            </Text>
            <Text style={[styles.descriptionText, textThemeColor]}>
            {about !== undefined && about?.text}
            </Text>
          </View>
          <View>
            <Text style={[styles.titleText, textThemeColor]}>
            {/* {state?.t('infoText.statusGift')} */}
            {looiality !== undefined && looiality?.title}
            </Text>
            <Text style={[styles.descriptionText, textThemeColor]}>
            {looiality !== undefined && looiality?.text}
            </Text>
          </View>
        </View>
      </ScrollView>
    </AppLayout>
  );
};

export default StatusInfoScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingHorizontal: '7%',
    paddingVertical: 50,
  },
  titleText: {
    fontFamily: 'HMpangram-Bold',
    fontSize: 16,
    lineHeight: 17,
    marginBottom: 16,
  },
  descriptionText: {
    fontFamily: 'HMpangram-Light',
    fontSize: 14,
    lineHeight: 24,
    fontWeight: '400',
  },
});
