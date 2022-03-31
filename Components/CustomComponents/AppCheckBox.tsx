import React, {useContext, useEffect, useState} from 'react';
import {Image, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {AppContext} from '../../AppContext/AppContext';
import {Colors} from '../../Colors/Colors';
import translateService from '../../Services/translateService';

interface IAppCheckBox {
  checked: boolean;
  onChange?: () => void;
  hasError?: boolean;
  isRequired?: boolean;
  name?: string;
  addValidation?: (actionTpe: string, inputName: string) => void;
}

const AppCheckBox: React.FC<IAppCheckBox> = props => {
  const {state} = useContext(AppContext);
  const {isDarkTheme} = state;

  const validations: any = {
    gender: state?.t('infoText.selectGender'),
    terms: state?.t('infoText.terms'),
  };

  const {checked, onChange, hasError, isRequired, name, addValidation} = props;

  const [isChecked, setIsChecked] = useState<boolean>(checked);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  useEffect(() => {
    if (isRequired) {
      if (!checked) {
        addValidation!('add', name!);
      } else {
        addValidation!('remove', name!);
      }
    }
  }, [checked, isRequired]);

  const activeColor = {
    backgroundColor: isDarkTheme ? Colors.white : Colors.black,
  };
  const inactiveColor = {
    backgroundColor: isDarkTheme ? Colors.black : Colors.white,
  };

  let checkBox = <Image style={styles.check} resizeMode={'contain'} source={require('./../../assets/images/not-fill-radio-in-dark.png')} />

  if(isChecked) {
      if(isDarkTheme) {
        checkBox = <Image style={styles.check} resizeMode={'contain'} source={require('./../../assets/images/fill-radio-in-dark.png')} />
      } else {
        checkBox = <Image style={styles.check} resizeMode={'contain'} source={require('./../../assets/images/fill-radio-in-light.png')} />
      }
  } else {
    if(isDarkTheme) {
        checkBox = <Image style={styles.check} resizeMode={'contain'} source={require('./../../assets/images/not-fill-radio-in-dark.png')} />
      } else {
        checkBox = <Image style={styles.check} resizeMode={'contain'} source={require('./../../assets/images/not-fill-radio-in-light.png')} />
      }
}

  return (
    <>
      <TouchableOpacity
        style={[
          styles.roundCheck,
        ]}
        onPress={onChange}>
        {checkBox}
      </TouchableOpacity>
      {hasError && (
        <Text style={[styles.errorText, Platform.OS === 'ios' && {top: 23}]}>
          {name !== undefined && validations[name]}
        </Text>
      )}
    </>
  );
};

export default AppCheckBox;

const styles = StyleSheet.create({
  roundCheck: {
    position: 'relative',
    marginVertical: 5,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  check: {
    width: 16,
    height: 16,
  },
  errorText: {
    position: 'absolute',
    top: 25,
    color: Colors.red,
    fontSize: 11,
    fontFamily: 'HMpangram-Medium',
  },
});
