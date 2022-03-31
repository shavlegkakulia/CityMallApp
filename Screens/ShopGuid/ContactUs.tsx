import React, {useContext, useState} from 'react';
import {Image, StyleSheet, Text, View,TouchableOpacity} from 'react-native';
import {AppContext} from '../../AppContext/AppContext';
import {Colors} from '../../Colors/Colors';
import {useDimension} from '../../Hooks/UseDimension';
import {GoBack, navigate} from '../../Services/NavigationServices';
import Layout from '../../Components/Layouts/Layout';
import {TextInput} from 'react-native-gesture-handler';
import translateService from '../../Services/translateService';

const ContactUs = () => {
  const {width} = useDimension();
  const {state} = useContext(AppContext);
  const {isDarkTheme} = state;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [textArea, setTextArea] = useState('');

  return (
    <Layout 
    pageName={state?.t('screens.contactUs')}
    hasBackArrow
    onPressBack={GoBack}>
      <View
        style={{
         flex: 1,
         
          paddingHorizontal: '7%',
          backgroundColor: isDarkTheme ? Colors.black : Colors.white 
        }}>
   
        <View >
          <Text style={[styles.title,{color: isDarkTheme ? Colors.white : Colors.black}]}>{state?.t('screens.messageUs')}</Text>
          <View style={{paddingTop: 15}}>
            <Text style={[styles.text,{color: isDarkTheme ? Colors.white : Colors.black}]}>
            {state?.t('infoText.messageUsText')}
            </Text>
          </View>
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={text => setName(text)}
            placeholder={state?.t('labels.firstName')}
            placeholderTextColor={Colors.white}
            
          />
           <TextInput
            style={styles.input}
            value={email}
            onChangeText={text => setEmail(text)}
            placeholder={state?.t('labels.email')}
            placeholderTextColor={Colors.white}
          />
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={text => setTitle(text)}
            placeholder={state?.t('screens.title')}
            placeholderTextColor={Colors.white}
          />
          <TextInput 
          style={styles.textArea}
          value={textArea}
          onChangeText={text => setTextArea(text)}
          placeholder={state?.t('screens.info')}
          placeholderTextColor={Colors.txtGrey}
          multiline
          numberOfLines={5}
          />
        </View>
        <TouchableOpacity
            style={styles.btnStyle}
            onPress={() => {}}>
            <Text style={[styles.btnText,{color: isDarkTheme ? Colors.white : Colors.black}]}>{state?.t('common.send')}</Text>
          </TouchableOpacity>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  title: {
    color: Colors.white,
    textTransform: 'uppercase',
    fontFamily: 'HMpangram-Bold',
  },
  text: {
    color: Colors.white,
    fontFamily: 'HM pangram',
    fontSize: 12,
    lineHeight: 14,
  },
  input: {
    paddingHorizontal: 10,
      paddingVertical: 15,
    color: Colors.white,
    fontFamily: 'HMpangram-Bold',
    borderBottomColor: Colors.white,
    borderBottomWidth: 1,
  },
  inputView: {
      height: 330,
      justifyContent: 'space-between',
  },
  textArea: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    color: Colors.white,
    borderColor: Colors.white,
    borderWidth: 1,
    borderRadius: 5,
    height: 80
  },
  btnStyle: {
    top: 135,
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
    
  },
});

export default ContactUs;


