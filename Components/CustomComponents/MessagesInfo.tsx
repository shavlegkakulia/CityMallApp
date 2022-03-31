import React, { useContext } from 'react';
import {Text, Image, View, StyleSheet, ImageSourcePropType} from 'react-native';
import { AppContext } from '../../AppContext/AppContext';
import {Colors} from '../../Colors/Colors';

export interface MessageInfoProps {
  icon: ImageSourcePropType;
  bgColorProp: string;
  title: string;
  text: string;
  phone: string;
}

const MessagesInfo: React.FC<MessageInfoProps> = props => {
  const {icon, bgColorProp, title, text, phone} = props;
  const { state } = useContext(AppContext);
  const { isDarkTheme } = state;

  return (
    <>
      <View style={[styles.done,{ backgroundColor: bgColorProp }]}>
        <Image source={icon} />
      </View>
      <View style={{width: 250, top: 36}}>
        <Text style={[styles.successText,{color: isDarkTheme ? Colors.white : Colors.black}]}>{title}</Text>
      </View>
      <View style={{width: 330}}>
        <Text
          style={[{
            textAlign: 'center',
            top: 50,
            fontFamily: 'HM pangram',
            fontSize: 12,
          },{color: isDarkTheme ? Colors.white : Colors.black}]}>
          {text}
          <Text style={[{fontFamily: 'HMpangram-Bold'},{color: isDarkTheme ? Colors.white : Colors.black}]}> {phone}</Text>
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  done: {
    width: 64,
    height: 64,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successText: {
    color: Colors.white,
    fontFamily: 'HMpangram-Bold',
    textTransform: 'uppercase',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default MessagesInfo;
