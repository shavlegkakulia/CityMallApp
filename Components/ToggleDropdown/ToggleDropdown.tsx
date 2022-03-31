import React, {useContext, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {AppContext} from '../../AppContext/AppContext';
import {Colors} from '../../Colors/Colors';
import {useDimension} from '../../Hooks/UseDimension';
import data from '../../Constants/ToggleData';
import ToggleDropdownLayout from '../CustomComponents/ToggleDropdownLayout';

const ToggleDropdown = () => {
  const {width} = useDimension();
  const {state} = useContext(AppContext);
  const {isDarkTheme} = state;
  

  

  return (
    <View
      style={[styles.main, {backgroundColor: isDarkTheme ? Colors.black : Colors.white}]}
      onStartShouldSetResponder={event => true}>
          {data.map((el: any, i: React.Key) =>(
             <ToggleDropdownLayout key={i} name={el.name} icon={isDarkTheme? el.iconLight : el.iconDark} Content={el.content} routeName={el.routeName}
                   
           
            />
          ))}


     
     
      
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    
    backgroundColor: Colors.black,
    top: 80,
    width: 170,
    height: 'auto',
    borderRadius: 10,
    justifyContent: 'space-between',
    padding: 10,
    

  },
  
});

export default ToggleDropdown;
