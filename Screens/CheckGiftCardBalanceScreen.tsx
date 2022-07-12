import React, {useContext, createRef, useState} from 'react';
import {useEffect} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  TextInputKeyPressEventData,
  TouchableOpacity,
  Modal,
  Dimensions,
  ScrollView,
} from 'react-native';
import {AppContext} from '../AppContext/AppContext';
import {Colors} from '../Colors/Colors';
import AppButton from '../Components/CustomComponents/AppButton';
import Layout from '../Components/Layouts/Layout';
import ApiServices from '../Services/ApiServices';
import {GoBack} from '../Services/NavigationServices';
import translateService from '../Services/translateService';
import { formatNumber } from '../Services/Utils';

const CheckGiftCardBalanceScreen = () => {
  const {state} = useContext(AppContext);
  const {isDarkTheme} = state;

  const [{v1, v2, v3, v4}, setvalues] = useState({
    v1: '',
    v2: '',
    v3: '',
    v4: '',
  });

  const styles = StyleSheet.create({
    screenContainer: {
      flex: 1,
      backgroundColor: isDarkTheme ? Colors.black : Colors.white,
      justifyContent: 'center',
      alignItems: 'center',
    },

    cardContainer: {
      borderWidth: 1,
      borderColor: isDarkTheme ? Colors.white : Colors.black,
      borderRadius: 5,
      width: 315,
      height: 200,
    },
    wall: {
      flex: 1,
      paddingHorizontal: 12,
      paddingBottom: 15,
    },
    pad: {
      flex: 1,
      position: 'relative',
    },

    cardNumberContainer: {},

    cardExpireDateContainer: {},

    titleText: {
      color: isDarkTheme ? Colors.white : Colors.black,
      fontFamily: 'HMpangram-Bold',
      fontSize: 12,
      lineHeight: 14,
      marginBottom: 4,
    },
    absolute: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    },
    inputs: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
      alignItems: 'center'
    },
    input: {
      borderWidth: 1,
      borderColor: isDarkTheme ? Colors.white : Colors.black,
      color: isDarkTheme ? Colors.white : Colors.black,
      borderRadius: 10,
      flex: 1,
      height: 30,
      lineHeight: 16,
      paddingVertical: 0,
      textAlign: 'center',
    },
    middle: {
      marginHorizontal: 10,
    },
    m2: {
      marginRight: 10,
    },
    date: {
      flexDirection: 'row',
      marginBottom: 15,
    },
    dateitem: {
      borderColor: isDarkTheme ? Colors.white : Colors.black,
      borderWidth: 1,
      borderRadius: 10,
      height: 30,
      width: 65,
      justifyContent: 'center',
      alignItems: 'center',
    },
    item1: {
      marginRight: 10,
    },
    dateValue: {
      color: isDarkTheme ? Colors.white : Colors.black,
      fontFamily: 'HMpangram-Bold',
      fontSize: 12,
      textAlign: 'center',
    },
    btnStyle: {
      width: '100%',
      maxWidth: 325,

      height: 66,
      backgroundColor: Colors.darkGrey,
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
    },
    btnTitleStyle: {
      color: Colors.white,
      fontFamily: 'HMpangram-Bold',
      textAlign: 'center',
      fontSize: 14,
      lineHeight: 17,
      textTransform: 'uppercase',
    },
    deposite: {
      fontFamily: 'HMpangram-Bold',
      fontSize: 16,
      position: 'absolute',
      color: isDarkTheme ? Colors.white : Colors.black,
      marginTop: 10,
      textAlign: 'right',
      right: -10,
    },
    arrowImgStyle: {
      width: 5,
      height: 5,
      position: 'absolute',
      top: 7,
      right: 7,
    },
  });

  const ref_input1 = createRef<TextInput>();
  const ref_input2 = createRef<TextInput>();
  const ref_input3 = createRef<TextInput>();
  const ref_input4 = createRef<TextInput>();
  const [btnLoading, setbtnLoading] = useState<boolean>(false);
  const [choosedays, setchoosedays] = useState<boolean>(false);
  const [choosemonths, setchoosemonths] = useState<boolean>(false);
  const [expireDay, setExpireDay] = useState<string>('');
  const [expireMonth, setExpireMonth] = useState<string>('');
  const [days, setdays] = useState<any[]>([]);
  const [months, setmonths] = useState([]);
  const [balance, setbalance] = useState<string | undefined>();

  useEffect(() => {
    const _months: any = [];
    const currentYear = new Date().getFullYear();
    const range = (start: number, stop: number, step: number) =>
      Array.from(
        {length: (stop - start) / step + 1},
        (_, i) => start + i * step,
      );

    for (let m = 1; m <= 12; m++) {
      _months.push(('0' + m).slice(-2));
    }

    setdays(range(currentYear, currentYear + 50, 1));
    setmonths(_months);
  }, []);

  const onInput = (ref: TextInput | null, value: string) => {
    if (value.length >= 4) ref?.focus();
  };

  const goBack = (
    ref: TextInput | null,
    t: TextInputKeyPressEventData,
    length: number,
  ) => {
    if (t.key === 'Backspace' && length <= 0) {
      ref?.focus();
    }
  };

  const loaderStyle = {
    size: 'small',
    color: Colors.white,
  };

  const check = () => {
    if (!v1 || !v2 || !v3 || !v4 || !expireDay || !expireMonth || btnLoading) {
      return;
    }
    setbtnLoading(true);
    const data = {
      CardLastNumber: v1 + v2 + v3 + v4,
      ExpireYear: parseInt(expireDay),
      ExpireMonth: parseInt(expireMonth),
    };
    ApiServices.GetGiftBallance(data)
      .then(res => {
        if (res.status === 200) {
          setbalance(res.data.ballance);
        }
        setbtnLoading(false);
      })
      .catch((e) => {
        console.log(e.response)
        setbtnLoading(false);
      });
  };

  return (
    <Layout hasBackArrow={true} onPressBack={GoBack} pageName={state.t('common.checkbalance')}>
      <Modal
        visible={choosedays}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setchoosedays(false)}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() => setchoosedays(false)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#000000',
              opacity: 0.8,
            }}
          />

          <ScrollView
            contentContainerStyle={{paddingVertical: 20}}
            style={{
              borderRadius: 14,
              maxHeight: Dimensions.get('window').height / 2,
              minWidth: '50%',
              backgroundColor: isDarkTheme ? Colors.black : Colors.white,
            }}>
            {days.map((d, i) => (
              <TouchableOpacity
                key={i}
                style={{paddingVertical: 15}}
                onPress={() => {
                  setExpireDay(d);
                  setchoosedays(false);
                }}>
                <Text
                  style={{
                    color: isDarkTheme ? Colors.white : Colors.black,
                    textAlign: 'center',
                    fontWeight: '500',
                  }}>
                  {`${d}`}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>

      <Modal
        visible={choosemonths}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setchoosemonths(false)}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() => setchoosemonths(false)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#000000',
              opacity: 0.8,
            }}
          />

          <ScrollView
            contentContainerStyle={{paddingVertical: 20}}
            style={{
              borderRadius: 14,
              maxHeight: Dimensions.get('window').height / 2,
              minWidth: '50%',
              backgroundColor: isDarkTheme ? Colors.black : Colors.white,
            }}>
            {months.map((m, i) => (
              <TouchableOpacity
                key={i}
                style={{paddingVertical: 15}}
                onPress={() => {
                  setExpireMonth(m);
                  setchoosemonths(false);
                }}>
                <Text
                  style={{
                    color: isDarkTheme ? Colors.white : Colors.black,
                    textAlign: 'center',
                    fontWeight: '500',
                  }}>
                  {`${m}`}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
      <View style={styles.screenContainer}>
        <View style={styles.cardContainer}>
          <Image
            style={{width: '100%', height: '100%'}}
            source={require('../assets/images/gift-card-balance.png')}
          />
          <View style={styles.wall}>
            <View style={styles.pad}>
              <View style={styles.absolute}>
                <View>
                  <Text style={styles.titleText}>
                    {state?.t('infoText.cardNumber')}
                  </Text>
                  <View style={styles.inputs}>
                    <TextInput
                      onChangeText={e => {
                        onInput(ref_input2.current, e);
                        setvalues({v1: e, v2: v2, v3: v3, v4: v4});
                      }}
                      onSubmitEditing={() => ref_input2.current?.focus()}
                      ref={ref_input1}
                      autoFocus={true}
                      returnKeyType="next"
                      maxLength={4}
                      keyboardType={'number-pad'}
                      style={styles.input}
                    />
                    <TextInput
                      onKeyPress={({nativeEvent}) =>
                        goBack(ref_input1.current, nativeEvent, v2.length)
                      }
                      onChangeText={e => {
                        onInput(ref_input3.current, e);
                        setvalues({v1: v1, v2: e, v3: v3, v4: v4});
                      }}
                      onSubmitEditing={() => ref_input3.current?.focus()}
                      ref={ref_input2}
                      returnKeyType="next"
                      maxLength={4}
                      keyboardType={'number-pad'}
                      style={[styles.input, styles.middle]}
                    />
                    <TextInput
                      onKeyPress={({nativeEvent}) =>
                        goBack(ref_input2.current, nativeEvent, v3.length)
                      }
                      onChangeText={e => {
                        onInput(ref_input4.current, e);
                        setvalues({v1: v1, v2: v2, v3: e, v4: v4});
                      }}
                      onSubmitEditing={() => ref_input4.current?.focus()}
                      ref={ref_input3}
                      returnKeyType="next"
                      maxLength={4}
                      keyboardType={'number-pad'}
                      style={[styles.input, styles.m2]}
                    />
                    <TextInput
                      onKeyPress={({nativeEvent}) =>
                        goBack(ref_input3.current, nativeEvent, v4.length)
                      }
                      onChangeText={e => {
                        setvalues({v1: v1, v2: v2, v3: v3, v4: e});
                      }}
                      ref={ref_input4}
                      returnKeyType="next"
                      maxLength={4}
                      keyboardType={'number-pad'}
                      style={styles.input}
                    />
                  </View>
                </View>
                <View>
                  <Text style={styles.titleText}>
                    {state?.t('infoText.cardDate')}
                  </Text>

                  <View style={styles.date}>
                  <TouchableOpacity
                      onPress={() => setchoosemonths(true)}
                      style={[styles.dateitem, styles.item1]}>
                      <Image
                        style={[
                          styles.arrowImgStyle,
                          {transform: [{rotate: '90deg'}]},
                        ]}
                        source={
                          isDarkTheme
                            ? require('./../assets/images/arrow-sm.png')
                            : require('./../assets/images/arrow-black.png')
                        }
                      />
                      <Text style={styles.dateValue}>{expireMonth}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setchoosedays(true)}
                      style={styles.dateitem}>
                      <Image
                        style={[
                          styles.arrowImgStyle,
                          {transform: [{rotate: '90deg'}]},
                        ]}
                        source={
                          isDarkTheme
                            ? require('./../assets/images/arrow-sm.png')
                            : require('./../assets/images/arrow-black.png')
                        }
                      />
                      <Text style={styles.dateValue}>{expireDay}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              {balance !== undefined && (
                <Text style={styles.deposite}>
                  {state.t('screens.deposit')}: {formatNumber(balance) || 0}
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>
      <AppButton
        btnStyle={styles.btnStyle}
        titleStyle={styles.btnTitleStyle}
        loaderStyle={loaderStyle}
        loading={btnLoading}
        title={state?.t('infoText.checkBalance')}
        onPress={check}
      />
    </Layout>
  );
};

export default CheckGiftCardBalanceScreen;
