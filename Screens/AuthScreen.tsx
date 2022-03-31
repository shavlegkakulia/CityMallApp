import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Keyboard,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import {Colors} from '../Colors/Colors';
import OneTimeCode from '../Components/OneTimeCode';
import AppCheckBox from '../Components/CustomComponents/AppCheckBox';
import Layout from '../Components/Layouts/Layout';
import {AppContext} from '../AppContext/AppContext';
import AuthService from '../Services/AuthService';
import AsyncStorage, {setItem, getItem} from '../Services/StorageService';
import AppInput from '../Components/CustomComponents/AppInput';
import DialCodePicker from '../Components/CustomComponents/DialCodePicker';
import {GoBack, navigate} from '../Services/NavigationServices';
import ApiServices from '../Services/ApiServices';
import {RouteProp, useRoute} from '@react-navigation/native';

type RouteParamList = {
  params: {
    skip?: boolean;
  };
};

const AuthScreen = () => {
  const route = useRoute<RouteProp<RouteParamList, 'params'>>();
  const {state, setGlobalState} = useContext(AppContext);
  const {isDarkTheme} = state;

  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessages, setErrorMessages] = useState<string[] | []>([]);
  const [step, setStep] = useState<number>(0);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const [selectedDialCode, setSelectedDialCode] = useState<string>('');
  const [userPhoneNumber, setUserPhoneNumber] = useState<string>('');
  const [sameUser, setSameUser] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [otpError, setOtpError] = useState<boolean>(false);
  const [agreedTerms, setAgreedTerms] = useState<boolean>(false);
  const [agreedTermsError, setAgreedTermsError] = useState<boolean>(false);
  const [fullPath, setfullPath] = useState('');

  useEffect(() => {
    getItem('hasAgreedTerms').then(value => {
      if (!value) {
        setSameUser('');
      } else {
        setSameUser(value);
      }
    });
  }, []);

  useEffect(() => {
    if (sameUser === userPhoneNumber && step === 2) {
      setAgreedTerms(true);
    } else {
      setAgreedTerms(false);
    }
  }, [step, userPhoneNumber]);

  useEffect(() => {
    getItem('hasAgreedTerms').then(value => {
      if (!value) {
        setSameUser('');
      } else {
        setSameUser(value);
      }
    });
  }, []);

  useEffect(() => {
    if (sameUser === userPhoneNumber && step === 2) {
      setAgreedTerms(true);
    } else {
      setAgreedTerms(false);
    }
  }, [step, userPhoneNumber]);

  useEffect(() => {
    if (errorMessages.length === 0) {
      setHasError(false);
    }
  }, [errorMessages]);

  useEffect(() => {
    if (errorMessages.length === 0) {
      setHasError(false);
    }
  }, [errorMessages]);

  const validateInputs = (actionType: string, inputName: string) => {
    if (actionType === 'add') {
      let errorArray = [...errorMessages];
      let index = errorArray.findIndex((e: string) => e === inputName);
      if (index >= 0) {
        return;
      } else {
        errorArray.push(inputName);
        setErrorMessages(errorArray);
      }
    } else {
      let errorArray = errorMessages.filter(e => e !== inputName);
      setErrorMessages(errorArray);
    }
  };

  const handleSelectedValue = (data: string) => {
    setSelectedDialCode(data);
  };

  const getOtpValue = (value: string) => {
    setOtp(value);
  };

  const toggleAgreedTerms = () => {
    setItem('hasAgreedTerms', userPhoneNumber);
    if (!otpError && otp !== '') {
      Keyboard.dismiss();
    }
    setAgreedTerms(!agreedTerms);
    setAgreedTermsError(false);
  };

  const signIn = async (type: string) => {
    if (errorMessages.length > 0) {
      setHasError(true);
      return;
    }
    if (passwordError) {
      setPasswordError('');
    }
    let data;
    if (type === 'new' || type === 'resend') {
      setOtp('');
      data = {
        username: selectedDialCode.slice(1) + userPhoneNumber,
        otp: '',
        password: '',
      };
    } else {
      if (step === 2 && !agreedTerms) {
        setAgreedTermsError(true);
        return;
      }
      data = {
        username: selectedDialCode.slice(1) + userPhoneNumber,
        otp: otp,
        password: password,
      };
    }
    setButtonLoading(true);
    AuthService.SignIn(data)
      .then(res => {
        AuthService.setToken(res.data.access_token, res.data.refresh_token);
        if (route?.params?.skip) {
          setTimeout(() => {
            ApiServices.GetClientInfo()
              .then(res => {
                if (res.data?.isRegisterd) {
                  AsyncStorage.removeItem('skip_token')
                    .then(_ => {
                      setGlobalState({
                        userPhoneNumber,
                        isAuthenticated: true,
                      });
                      ApiServices.GetClientCards()
                        .then(res => {
                          setGlobalState({cardDetails: res.data});
                          setGlobalState({clientDetails: res.data});
                          setButtonLoading(false);
                          navigate('HomeScreen');
                        })
                        .catch(_ => {
                          setButtonLoading(false);
                        });
                    })
                    .catch(() => {
                      setGlobalState({
                        userPhoneNumber,
                        isAuthenticated: true,
                      });
                      ApiServices.GetClientCards()
                        .then(res => {
                          setGlobalState({cardDetails: res.data});
                          setGlobalState({clientDetails: res.data});
                          navigate('HomeScreen');
                        })
                        .catch(_ => {});
                      setButtonLoading(false);
                    });
                } else {
                  setButtonLoading(false);
                  navigate('AboutUs', {
                    routeId: 2,
                    userPhoneNumber,
                    skip: route?.params?.skip,
                  });
                  return;
                }
              })
              .catch(e => {
                console.log(e);
                setButtonLoading(false);
                navigate('AboutUs', {
                  routeId: 2,
                  userPhoneNumber,
                  skip: route?.params?.skip,
                });
                return;
              });
          }, 100);
        } else {
          setButtonLoading(false);
          setGlobalState({
            userPhoneNumber,
            isAuthenticated: true,
          });
        }
        // setPhoneNumber(userPhoneNumber);
        // setIsAuth(true);
      })
      .catch(e => {
        setButtonLoading(false);
        let error = JSON.parse(JSON.stringify(e.response)).data.error;
        switch (error) {
          case 'require_otp':
            setStep(2);
            setButtonLoading(false);
            break;
          case 'require_password':
            setStep(1);
            setButtonLoading(false);
            break;
          case 'invalid_password':
            setButtonLoading(false);
            setPasswordError(state?.t('infoText.passwordError'));
            break;
          case 'invalid_otp':
            setOtpError(true);
            setButtonLoading(false);
            break;

          default:
            break;
        }
      });
  };

  useEffect(() => {
    ApiServices.GetAgerements().then(res => {
      let files = res.data;
      if (files?.length) {
        setfullPath(files[0]?.fullPath);
      }
    });
  }, []);

  const skip = () => {
    if (route?.params?.skip) {
      GoBack();
      return;
    }
    AsyncStorage.setItem('skip_token', '1').then(_ => {
      setGlobalState({
        userPhoneNumber,
        isAuthenticated: true,
      });
    });
  };

  useEffect(() => {
    (async () => {
      await AsyncStorage.removeItem('skip_token');
    })();
  }, []);

  return (
    <Layout pageName={state.t('common.cityMall')}>
      <View style={{flex: 1, paddingHorizontal: '10%'}}>
        <View style={{flex: 4, justifyContent: 'center'}}>
          <Text
            style={[
              styles.authTitle,
              {color: isDarkTheme ? Colors.white : Colors.black},
            ]}>
            {state?.t('screens.firstAuthorization')}
          </Text>
        </View>
        <View style={{flex: 6}}>
          <View style={{flexDirection: 'row', position: 'relative'}}>
            <View
              style={[
                {borderBottomColor: isDarkTheme ? Colors.white : Colors.black},
                {
                  borderBottomWidth: 1,
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 52,
                },
              ]}></View>
            <View>
              <DialCodePicker
                onSelect={handleSelectedValue}
                ignoreBorder={true}
              />
            </View>
            <View style={{width: '80%'}}>
              <AppInput
                ignoreBorder={true}
                name="phoneNumber"
                hasError={hasError}
                addValidation={validateInputs}
                errors={errorMessages}
                isRequired={true}
                validationRule="phoneNumber"
                keyboardType="numeric"
                value={userPhoneNumber}
                maxLength={selectedDialCode == '+995' ? 9 : undefined}
                onChangeText={(val: string) => setUserPhoneNumber(val)}
              />
            </View>
          </View>
          {step == 1 && (
            <View>
              <AppInput
                name="password"
                hasError={hasError}
                addValidation={validateInputs}
                errors={errorMessages}
                errorMessage={passwordError}
                isRequired={true}
                validationRule="required"
                value={password}
                autoFocus={true}
                onChangeText={(val: string) => setPassword(val)}
              />
            </View>
          )}
          {step === 2 && (
            <View style={{marginTop: 30}}>
              <OneTimeCode
                getValue={getOtpValue}
                resend={() => signIn('resend')}
                hasError={otpError}
              />

              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginTop: 30,
                }}>
                <AppCheckBox
                  checked={agreedTerms}
                  onChange={toggleAgreedTerms}
                  hasError={agreedTermsError}
                />
                <TouchableOpacity
                  onPress={() => navigate('DocView', {docUrl: fullPath})}>
                  <Text
                    style={[
                      styles.agreeTermsText,
                      {color: isDarkTheme ? Colors.white : Colors.black},
                    ]}>
                    {state?.t('infoText.agreement')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={styles.authBtn}
          onPress={() => signIn(step === 0 ? 'new' : 'signIn')}
          disabled={buttonLoading}>
          {buttonLoading ? (
            <ActivityIndicator animating={buttonLoading} color="#dadde1" />
          ) : (
            <Text style={styles.btnText}>
              {step === 0
                ? state?.t('screens.giveCode')
                : state?.t('screens.authorization')}
            </Text>
          )}
        </TouchableOpacity>

        {step === 0 && (
          <TouchableOpacity
            style={styles.authSkip}
            onPress={skip}
            disabled={buttonLoading}>
            <Text style={[styles.btnText, {color: isDarkTheme ? Colors.white: Colors.black}]}>{state?.t('common.skip')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  authContainer: {
    paddingHorizontal: 30,
    justifyContent: 'space-between',
  },

  authTitle: {
    textAlign: 'center',
    color: Colors.white,
    fontFamily: 'HMpangram-Bold',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 22,
    alignItems: 'center',
    textTransform: 'uppercase',
  },

  agreeTermsText: {
    color: Colors.white,
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'HMpangram-Bold',
    textTransform: 'uppercase',
  },

  authBtn: {
    alignSelf: 'center',
    width: 325,
    height: '100%',
    maxHeight: 66,
    backgroundColor: Colors.darkGrey,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    marginBottom: 30,
  },

  authSkip: {
    alignSelf: 'center',
    width: 325,
    height: '100%',
    maxHeight: 66,
    borderWidth: 1,
    borderColor: Colors.darkGrey,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    marginBottom: 30,
  },

  btnText: {
    color: Colors.white,
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '800',
    textTransform: 'uppercase',
    fontFamily: 'HMpangram-bold',
  },
  errorText: {
    position: 'absolute',
    bottom: -20,
    color: Colors.red,
    fontSize: 11,
    fontFamily: 'HMpangram-Medium',
  },
});

export default AuthScreen;
