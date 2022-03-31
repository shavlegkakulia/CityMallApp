import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {AppContext} from '../AppContext/AppContext';
import {Colors} from '../Colors/Colors';
import RNOtpVerify from 'react-native-otp-verify';

interface IOtpProps {
  getValue: (val: string) => void;
  resend: () => void;
  hasError?: boolean;
}
const OneTimeCode: React.FC<IOtpProps> = props => {
  const {state} = useContext(AppContext);
  const {isDarkTheme} = state;

  const {getValue, resend, hasError} = props;

  const [oneTimeCode, setOneTimeCode] = useState<string>('');

  useEffect(() => {
    getValue(oneTimeCode);
  }, [oneTimeCode]);

  const handleOneTimePasscode = (value: any) => {
    if (isNaN(value)) {
      return;
    } else {
      setOneTimeCode(value);
    }
  };

  const startListeningForOtp = () =>
    RNOtpVerify.getOtp()
      .then(p => RNOtpVerify.addListener(otpHandler))
      .catch(p => console.log(p));

  const otpHandler = (message: string) => {
    try {
      //@ts-ignore
      const otp = /(\d{4})/g.exec(message || '');
      if (otp) {
        setOneTimeCode(otp[1]);
      }
    } catch (_) {}
  };

  useEffect(() => {
    (async () => {
      await startListeningForOtp();
    })();

    return () => RNOtpVerify.removeListener();
  }, []);

  return (
    <View
      style={[
        styles.otpContainer,
        {borderColor: isDarkTheme ? Colors.white : Colors.black},
      ]}>
      <Text
        style={[
          styles.otpTitle,
          {color: isDarkTheme ? Colors.white : Colors.black},
        ]}>
        {state?.t('infoText.enterCode')}
      </Text>
      <TextInput
        style={[
          styles.otpInput,
          {color: isDarkTheme ? Colors.white : Colors.black},
        ]}
        value={oneTimeCode}
        placeholder={state?.t('common.smsCode')}
        placeholderTextColor={isDarkTheme ? Colors.white : Colors.black}
        onChangeText={(val: string) => handleOneTimePasscode(val)}
        maxLength={4}
        keyboardType="numeric"
        textContentType="oneTimeCode"
        autoFocus={true}
      />
      <TouchableOpacity
        style={styles.otpResend}
        onPress={() => {
          resend();
          setOneTimeCode('');
        }}>
        <Text
          style={[
            styles.otpResendText,
            {color: isDarkTheme ? Colors.white : Colors.black},
          ]}>
          {state?.t('common.again')}
        </Text>
      </TouchableOpacity>
      {hasError ? (
        <Text style={styles.errorText}>
          {state?.t('infoText.codeIncorrect')}
        </Text>
      ) : null}
    </View>
  );
};

export default OneTimeCode;

const styles = StyleSheet.create({
  otpContainer: {
    position: 'relative',
    width: '100%',
    borderBottomWidth: 1,
  },
  otpTitle: {
    fontFamily: 'HMpangram-Medium',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 17,
  },
  otpInput: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 16,
  },

  otpResend: {
    position: 'absolute',
    top: 28,
    right: 5,
  },
  otpResendText: {
    fontFamily: 'HMpangram-Medium',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 17,
  },
  errorText: {
    position: 'absolute',
    bottom: -20,
    color: Colors.red,
    fontSize: 11,
    fontFamily: 'HMpangram-Medium',
  },
});
