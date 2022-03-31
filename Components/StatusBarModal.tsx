import {Portal} from '@gorhom/portal';
import React, {useContext, useState} from 'react';
import {Image, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {AppContext} from '../AppContext/AppContext';
import {Colors} from '../Colors/Colors';
import {useDimension} from '../Hooks/UseDimension';
import {navigate} from '../Services/NavigationServices';
import { mallIds } from './ToggleDropdown/LocationDropdown';

const StatusBarModal: React.FC<any> = (props) => {
  const {width, height} = useDimension();
  const {state} = useContext(AppContext);
  const {isDarkTheme} = state;
 

  
  

  return (
    <Portal hostName="StatusBar">
      <TouchableOpacity
              style={[styles.dropDown, {height: height, width: width}]}
             >
              <View
                style={{
                  backgroundColor: Colors.black,
                
                  width: 113,
                  height: 89,
                  borderRadius: 10,
                }}
                onStartShouldSetResponder={event => true}>
                <Text
                  style={[
                    Platform.OS === 'ios' && {fontSize: 10},
                    {color: Colors.white, padding: 10},
                  ]}>
                  "სილვერის" სტატუსამდე დაგრჩათ 100 ქულა
                </Text>
              </View>
            </TouchableOpacity>
    </Portal>
  );
};

const styles = StyleSheet.create({
    dropDown: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 400,
        backgroundColor: '#a8a7a761',
      },
});

export default StatusBarModal;
