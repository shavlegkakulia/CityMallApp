import React, {useContext, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {AppContext} from '../../AppContext/AppContext';
import {Colors} from '../../Colors/Colors';
import {useDimension} from '../../Hooks/UseDimension';
import { navigate } from '../../Services/NavigationServices';
import translateService from '../../Services/translateService';
export enum mallIds {
  citiMallGldan = 2,
  cityMallSaburtalo = 1,
}

const LocationDropdown = () => {
  const {state} = useContext(AppContext);
  const {isDarkTheme} = state;

  return (
    <View style={[styles.main,{backgroundColor: isDarkTheme ? Colors.black : Colors.white}]}>
        <TouchableOpacity onPress={() => navigate('GoogleMap', {mallId: mallIds.citiMallGldan})}>
            <Text style={[styles.text,{ color: isDarkTheme ? Colors.white : Colors.black, }]}>{state?.t('screens.cityGldani')}</Text>
        </TouchableOpacity>
        <TouchableOpacity  onPress={() => navigate('GoogleMap', {mallId: mallIds.cityMallSaburtalo})}>
            <Text style={[styles.text,{ color: isDarkTheme ? Colors.white : Colors.black, }]}>{state?.t('screens.citySaburtalo')}</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    main: {
      height: 60,
      paddingVertical: 10,
      justifyContent: 'space-between',
      left: 9,
    },
    text: {
        color: Colors.white,
        fontSize: 10,
       
    }
  
});

export default LocationDropdown;
