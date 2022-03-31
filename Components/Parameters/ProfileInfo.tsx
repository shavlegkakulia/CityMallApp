import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {AppContext} from '../../AppContext/AppContext';
import {Colors} from '../../Colors/Colors';
import {useDimension} from '../../Hooks/UseDimension';
import ApiServices from '../../Services/ApiServices';
import {GoBack, navigate} from '../../Services/NavigationServices';
import {formatDate} from '../../Services/Utils';
import AppLayout from '../AppLayout';

import UserInfoView from '../CustomComponents/UserInfoView';
import Layout from '../Layouts/Layout';
import translateService from '../../Services/translateService';
import AppInput from '../CustomComponents/AppInput';

const ProfileInfo = () => {
  const {width} = useDimension();
  const {state, setGlobalState} = useContext(AppContext);
  const {isDarkTheme, clientDetails} = state;

  const handleGetClientCards = () => {
    ApiServices.GetClientCards()
      .then(res => {
        setGlobalState({cardDetails: res.data});
        setGlobalState({ clientDetails: res.data });
      })
      .catch(_ => {});
  };

  useEffect(() => {
    handleGetClientCards();
  }, []);

  const [verifyEmail, setVerifyEmail] = useState<boolean>(false);
  const [email, setEmail] = useState<string>(clientDetails?.[0]?.email || '');
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessages, setErrorMessages] = useState<string[] | []>([]);
  const [emailVerificationCode, setEmailVerificationCode] =
    useState<string>('');
  const [verifyEmailError, setVerifyEmailError] = useState<boolean>(false);
  const [isValidMailOtp, setIsValidMailOtp] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>('');
  const [verifyEmailLoading, setVerifyEmailLoading] = useState<boolean>(false);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const [isloading, setIsloading] = useState<boolean>(false);
  const [resError, setResError] = useState<string>('');

  const toggleSwitch = () => {
    setEmailVerificationCode('');
    setVerifyEmailError(false);
    setIsValidMailOtp(false);
    setVerifyEmail(!verifyEmail);
  };

  const validateInputs = (actionType: string, inputName: string) => {
    if (actionType === 'add') {
      let errorArray = [...errorMessages];
      errorArray.push(inputName);
      let uniqueNames = [...new Set(errorArray)];
      setErrorMessages(prevState => {
        return [...prevState, ...uniqueNames];
      });
    } else {
      let errorArray = errorMessages.filter(e => e !== inputName);
      setErrorMessages(errorArray);
    }
  };

  const handleCheckMailOtp = () => {
    setVerifyEmailLoading(true);
    setVerifyEmailError(false);
    let data = {
      email: email,
      otp: emailVerificationCode,
    };
    ApiServices.CheckMailOtp(data)
      .then((res: any) => {
        if (res.status === 200) setVerifyEmailLoading(false);
        setVerifyEmailError(false);
        setIsValidMailOtp(true);
      })
      .catch(e => {
        setVerifyEmailLoading(false);
        setVerifyEmailError(true);
        setIsValidMailOtp(false);
      });
  };

  const submitMailOtp = () => {
    if (isloading || !emailVerificationCode) return;
    setResError('');
    setIsloading(true);
    let data = {
      email: email,
      otp: emailVerificationCode,
      personCode: clientDetails![0]?.personCode,
    };
    ApiServices.SubmitMailOtp(data)
      .then((res: any) => {
        setIsloading(false);
        navigate('EmailChanged');
      })
      .catch(e => { 
        let error = '';
        try {
          error = JSON.parse(JSON.stringify(e.response))?.data?.DisplayText;
          setResError(error);
        } catch(_) {
          
        }
        setIsloading(false);
      });
  };

  const handleSendMailOtp = () => {
    setButtonLoading(true);
    setResError('');
    let data = {
      mail: email,
    };
    ApiServices.SendMailOtp(data)
      .then((res: any) => {
        setButtonLoading(false);
      })
      .catch((e: any) => {
        setButtonLoading(false);
      });
  };

  useEffect(() => {
    if (verifyEmail) {
      handleSendMailOtp();
    }
  }, [verifyEmail]);


  return (
    <Layout
      hasBackArrow
      pageName={state?.t('screens.profile')}
      onPressBack={GoBack}>
      <ScrollView contentContainerStyle={{flex: 1}} style={{flexGrow: 1}}>
        <View
          style={{
            flexGrow: 1,
            backgroundColor: isDarkTheme ? Colors.black : Colors.white,
            paddingHorizontal: '7%',
            marginBottom: 50,
          }}>
          <View>
            <UserInfoView
              label={state?.t('labels.firstName')}
              identification={clientDetails?.[0]?.firstName}
            />
            <UserInfoView
              label={state?.t('labels.lastName')}
              identification={clientDetails?.[0]?.lastName}
            />
            <UserInfoView
              label={state?.t('labels.idNumber')}
              identification={clientDetails?.[0]?.personCode}
            />
            <UserInfoView
              label={state?.t('labels.gender')}
              identification={
                clientDetails?.[0]?.sex === 2
                  ? state?.t('labels.female')
                  : state?.t('labels.male')
              }
            />
            <UserInfoView
              label={state?.t('labels.mobile')}
              identification={
                '+' +
                clientDetails?.[0]?.phone.replace(
                  /\b(\d{3})(\d{3})(\d{3})(\d{3})\b/,
                  '$1  $2  $3  $4',
                )
              }
            />
            <UserInfoView
              label={state?.t('labels.birthday')}
              identification={formatDate(clientDetails?.[0]?.birthDate)}
            />

            {
            clientDetails !== undefined &&
            clientDetails![0]?.emailConfirmed
             ? (
              <UserInfoView
                label={state?.t('labels.email')}
                identification={clientDetails?.[0]?.email}
              />
            ) : (clientDetails![0]?.email &&
              <>
                <View style={{top: 17, padding: 15, paddingHorizontal: 10}}>
                  <View style={{paddingHorizontal: 15}}>
                    <Text style={styles.label}>{state?.t('labels.email')}</Text>
                  </View>
                  <AppInput
                    style={{
                      color: isDarkTheme ? Colors.white : Colors.black,
                      paddingHorizontal: 15,
                    }}
                    editable={true}
                    placeholder={state?.t('labels.email')}
                    value={email}
                    name="email"
                    keyboardType="email-address"
                    hasError={hasError}
                    addValidation={validateInputs}
                    errors={errorMessages}
                    isRequired={false}
                    validationRule="email"
                    onChangeText={(val: string) => setEmail(val)}
                  />
                </View>
                <View style={styles.mailVerification}>
                  <View
                    style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                    <Switch
                      trackColor={{false: '#767577', true: '#28AD25'}}
                      thumbColor={Colors.white}
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={toggleSwitch}
                      value={verifyEmail}
                      disabled={email !== null && email.length > 0 && !emailError ? false : true}
                    />
                    <View style={styles.mailVerificationTextWrap}>
                      <Text
                        style={[
                          styles.mailVerificationText,
                          {color: isDarkTheme ? Colors.white : Colors.black},
                        ]}>
                        {state?.t('infoText.emailText')}
                      </Text>
                      <Text
                        style={[
                          styles.mailVerificationSubtext,
                          {color: isDarkTheme ? Colors.white : Colors.black},
                        ]}>
                        {state?.t('infoText.emailGiftText')}{' '}
                      </Text>
                    </View>
                  </View>
                  {verifyEmail ? (
                    <View style={{position: 'relative', marginTop: 20}}>
                      <AppInput
                        placeholder={state?.t('screens.veripicationCode')}
                        value={emailVerificationCode}
                        name="mailOtp"
                        hasError={hasError}
                        addValidation={validateInputs}
                        errors={errorMessages}
                        isRequired={true}
                        validationRule="required"
                        keyboardType="number-pad"
                        maxLength={6}
                        onChangeText={(val: string) =>
                          setEmailVerificationCode(val)
                        }
                      />
                      {verifyEmailError ? (
                        <Text style={styles.errorText}>
                          {state?.t('infoText.codeIncorrect')}
                        </Text>
                      ) : null}
                      <TouchableOpacity
                        onPress={handleCheckMailOtp}
                        style={{position: 'absolute', right: 5, top: 25}}>
                        {verifyEmailLoading ? (
                          <ActivityIndicator
                            animating={verifyEmailLoading}
                            color={Colors.white}
                          />
                        ) : !isValidMailOtp ? (
                          <Text
                            style={{
                              color: isDarkTheme ? Colors.white : Colors.black,
                            }}>
                            {state?.t('screens.check')}
                          </Text>
                        ) : (
                          <Image
                            source={require('./../../assets/images/green-checkmark.png')}
                            style={{width: 20, height: 14}}
                          />
                        )}
                      </TouchableOpacity>
                    </View>
                  ) : null}
                </View>
              </>
            )}
          </View>
       
          {
          clientDetails !== undefined &&
            !clientDetails![0]?.emailConfirmed &&
            clientDetails![0]?.email &&
          <View style={styles.btnView}>
            {resError?.length > 0 && <Text style={{color: Colors.red, fontSize: 10, marginLeft: 25, top: -5}}>{resError}</Text>}
            <TouchableOpacity
              style={styles.btnStyle}
              onPress={() => {
                if (!isloading) submitMailOtp();
              }}>
              {!isloading ? (
                <Text style={styles.btnText}>{state?.t('screens.change')}</Text>
              ) : (
                <ActivityIndicator size={'small'} color={'#fff'} />
              )}
            </TouchableOpacity>
          </View>}
        </View>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  btnStyle: {
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
    color: Colors.white,
  },
  btnView: {
    marginTop: 50,
  },
  mailVerification: {
    width: '100%',
    marginVertical: 20,
  },

  mailVerificationTextWrap: {
    width: '80%',
    marginLeft: 5,
  },

  mailVerificationText: {
    fontFamily: 'HMpangram-Medium',
    fontSize: 14,
    lineHeight: 14,
  },

  mailVerificationSubtext: {
    fontFamily: 'HMpangram-Medium',
    fontSize: 10,
    lineHeight: 14,
  },
  errorText: {
    color: Colors.red,
    fontSize: 11,
    fontFamily: 'HMpangram-Medium',
  },
  label: {
    color: Colors.txtGrey,
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'HM pangram',
    lineHeight: 17,
  },
});

export default ProfileInfo;
