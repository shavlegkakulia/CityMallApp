import React, {useContext, useEffect, useState} from 'react';
import {
  Keyboard,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  BackHandler,
  Platform,
  Alert,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {AppContext} from '../AppContext/AppContext';
import {Colors} from '../Colors/Colors';
import AppButton from '../Components/CustomComponents/AppButton';
// import AppButton from '../Components/CustomComponents/AppButton';
import AppCheckBox from '../Components/CustomComponents/AppCheckBox';
import AppInput from '../Components/CustomComponents/AppInput';
import Layout from '../Components/Layouts/Layout';
import {useDimension} from '../Hooks/UseDimension';
import ApiServices, {
  IServiceCenter,
  IServiceCenterResponse,
} from '../Services/ApiServices';
import {GoBack, navigate} from '../Services/NavigationServices';
import Grid from '../Styles/grid';
import translateService from '../Services/translateService';

interface IDeliveryOption {
  fromCityMall: boolean;
  curierDelivery: boolean;
}

const OrderGiftCardScreen = () => {
  const {state} = useContext(AppContext);
  const {isDarkTheme} = state;
  const {width, height} = useDimension();

  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessages, setErrorMesages] = useState<string[] | []>([]);
  const [step, setStep] = useState<number>(0);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [customer, setCustomer] = useState<string | undefined>();
  const [customerError, setCustomerError] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>();
  const [orderDetails, setOrderDetails] = useState<string | undefined>();
  const [orderDetailsError, setOrderDetailsError] = useState<string>('');
  const [address, setAddress] = useState<string | undefined>();
  const [addressError, setAddressError] = useState<string>('');
  const [deliveryOption, setDeliveryOption] = useState<IDeliveryOption>({
    fromCityMall: false,
    curierDelivery: false,
  });
  const [serviceCenters, setServiceCenters] = useState([]);
  const [checkedServiceCenter, setChekedServiceCenter] =
    useState<IServiceCenter>({id: 0, name: '', checked: false});
  const [resSuccess, setRespSuccess] = useState<boolean>(false);
  const [nameError, setNameError] = useState<string>('');
  const [phoneError, setPhoneError] = useState('');

  useEffect(() => {
    hanldeGetServiceCenters();
  }, []);

  // useEffect(() => {
  //     if (phoneNumber.length === 12 || phoneNumber.length === 3) {
  //         setPhoneNumberError('');
  //     } else {
  //         setPhoneNumberError('მობილურის ნომერი არასწორია')
  //     }
  // }, [phoneNumber]);

  useEffect(() => {
    if (errorMessages.length === 0) {
      setHasError(false);
    }
  }, [errorMessages]);

  const styles = StyleSheet.create({
    infoText: {
      color: isDarkTheme ? Colors.white : Colors.black,
      fontFamily: 'HMpangram-Medium',
      fontSize: 16,
      lineHeight: 24,
    },
    orderCardTitle: {
      color: isDarkTheme ? Colors.white : Colors.black,
      fontFamily: 'HMpangram-Bold',
      fontSize: 14,
      lineHeight: 17,
      fontWeight: '700',
      textTransform: 'uppercase',
      marginBottom: 20,
    },
    detailsText: {
      width: '100%',
      height: 80,
      borderWidth: 1,
      borderColor: isDarkTheme ? Colors.white : Colors.black,
      borderRadius: 5,
      textAlignVertical: 'top',
      color: isDarkTheme ? Colors.white : Colors.black,
      fontFamily: 'HMpangram-Medium',
      fontSize: 10,
      lineHeight: 14,
      padding: 10,
      marginBottom: '5%',
    },

    checkBoxWithLabel: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    labelText: {
      color: isDarkTheme ? Colors.white : Colors.black,
      fontFamily: 'HMpangram-Medium',
      fontSize: 16,
      lineHeight: 18,
      textTransform: 'uppercase',
      marginLeft: 5,
    },
    responseText: {
      color: isDarkTheme ? Colors.white : Colors.black,
      fontFamily: 'HMpangram-Bold',
      fontWeight: '700',
      fontSize: 18,
      lineHeight: 21,
      textAlign: 'center',
      textTransform: 'uppercase',
      width: 300,
      alignSelf: 'center',
    },
    responseImg: {
      width: 64,
      height: 64,
      alignSelf: 'center',
      marginBottom: 36,
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
    errorText: {
      color: Colors.red,
      fontSize: 11,
      fontFamily: 'HMpangram-Medium',
    },
  });

  const loaderStyle = {
    size: 'small',
    color: Colors.white,
  };

  const conditionalpadding = () => {
    if (width > 412) {
      return '8.5%';
    } else if (width < 400 && width > 369) {
      return '6%';
    } else {
      return '4%';
    }
  };

  

  const validateInputs = (actionType: string, inputName: string) => {
    if (actionType === 'add') {
      let errorArray = [...errorMessages];
      let index = errorArray.findIndex((e: string) => e === inputName);
      if (index >= 0) {
        return;
      } else {
        errorArray.push(inputName);
        setErrorMesages(errorArray);
      }
    } else {
      let errorArray = errorMessages.filter(e => e !== inputName);
      setErrorMesages(errorArray);
    }
  };

  const handlePhoneNumber = (value: string) => {
    setPhoneNumber(value);
  };

  // const handleValidateInputs = (name: string, value: string) => {
  //   if(customer?.length <= 0) {
  //     setNameError(state?.t('infoText.validate'));
     
  //   } else {
  //     setNameError('');
  //   }
  //   if(phoneNumber.length <= 0) {
  //     setPhoneError(state?.t('infoText.validate'));
    
  //   } else {
  //     setPhoneError('');
  //   }
  //   switch (value) {
  //     case 'customer':
  //       if (name === 'add') {
  //         setCustomerError(state?.t('infoText.validate'));
  //       } else {
  //         if (customerError) {
  //           setCustomerError('');
  //         }
  //       }
  //       break;
  //     case 'orderDetails':
  //       if (name === 'add') {
  //         setOrderDetailsError(state?.t('infoText.validate'));
  //       } else {
  //         if (orderDetailsError) {
  //           setOrderDetailsError('');
  //         }
  //       }
  //       break;
  //     case 'address':
  //       if (name === 'add') {
  //         setAddressError(state?.t('infoText.validate'));
  //       } else {
  //         if (addressError) {
  //           setAddressError('');
  //         }
  //       }
  //       break;
  //     default:
  //       break;
  //   }
  // };

  const toggleDeliveryOption = (option: string) => {
    if (option === 'fromMall') {
      setDeliveryOption({fromCityMall: true, curierDelivery: false});
    } else {
      setDeliveryOption({fromCityMall: false, curierDelivery: true});
    }
    Keyboard.dismiss();
  };

  const togglePickupLocation = (index: number) => {
    let tempServiceCenters: any = serviceCenters.map(
      (s: IServiceCenter, indx: number) => {
        if (indx === index) {
          s.checked = true;
          setChekedServiceCenter(s);
        } else {
          s.checked = false;
        }

        return s;
      },
    );

    setServiceCenters(tempServiceCenters);
  };

  const hanldeGetServiceCenters = () => {
    ApiServices.GetServiceCenters()
      .then(res => {
        let tempServiceCenters = res.data.map((s: any) => {
          s.checked = false;

          return s;
        });
        setServiceCenters(tempServiceCenters);
      })
      .catch(e => {
        console.log(JSON.parse(JSON.stringify(e)));
      });
  };

  const handleName = (value: string) => {
    setCustomer(value);
  }

  useEffect(() => {
    if(customer === undefined) return;
    if(customer.length <= 0) {
      setNameError(state?.t('infoText.validate'));
    } else {
      setNameError('');
    }
  }, [customer]);

  useEffect(() => {
    if(phoneNumber === undefined) return;
    if(phoneNumber.length != 9) {
      setPhoneError(state?.t('infoText.validate'));
    } else {
      setPhoneError('');
    }
  }, [phoneNumber]);

  useEffect(() => {
    if(orderDetails === undefined) return;
    if(orderDetails.length <= 0) {
      setOrderDetailsError(state?.t('infoText.validate'));
    } else {
      setOrderDetailsError('');
    }
  }, [orderDetails]);

  useEffect(() => {
    if(deliveryOption.curierDelivery) {
      if(address === undefined) return;
      if(address.length <= 0) {
        setAddressError(state?.t('infoText.validate'));
      } else {
        setAddressError('');
      }
    } else {
      if(checkedServiceCenter.checked === false) {
        setAddressError(state?.t('infoText.validate'));
      } else {
        setAddressError('');
      }
    }
  }, [deliveryOption, address]);

  const handleGiftCardOrder = () => {
    if(!customer) {
      setNameError(state?.t('infoText.validate'));
      return;
    } else {
      setNameError('');
    }
    if(!phoneNumber) {
      setPhoneError(state?.t('infoText.validate'));
      return;
    } else {
      setPhoneError('');
    }
    if(!orderDetails) {
      setOrderDetailsError(state?.t('infoText.validate'));
      return;
    } else {
      setOrderDetailsError('');
    }
    if(!deliveryOption.curierDelivery && !deliveryOption.fromCityMall) {
      setAddressError(state?.t('infoText.validate'));
        return;
    }else {
      setAddressError('');
    }
    if(deliveryOption.curierDelivery) {
      if(!address) {
        setAddressError(state?.t('infoText.validate'));
        return;
      } else {
        setAddressError('');
      }
    } else {
      if(checkedServiceCenter.checked === false) {
        setAddressError(state?.t('infoText.validate'));
        return;
      } else {
        setAddressError('');
      }
    }


    setBtnLoading(true);
    // {
    //     "name": "string",
    //     "phone": "string",
    //     "orderDetails": "string",
    //     "deliveryType": 0,
    //     "deliverystatus": 0,
    //     "deliveryServiceCenter": 0,
    //     "courierDetails": "string"
    //   }
    let data;
    data = {
      name: customer,
      phone: '995' + phoneNumber,
      orderDetails: orderDetails || '',
      deliveryType: deliveryOption.fromCityMall ? 1 : 2,
    };
    if (deliveryOption.fromCityMall) {
      data = {
        ...data,
        deliveryServiceCenter: checkedServiceCenter.id,
      };
    } else {
      data = {
        ...data,
        courierDetails: address,
      };
    }
    ApiServices.OrderGiftCard(data)
      .then(res => {
        if (res.status === 200) {
          setRespSuccess(true);
          setBtnLoading(false);
          setStep(2);
        }
      })
      .catch(e => {
        setRespSuccess(false);
        setBtnLoading(false);
        setStep(2);
        console.log(JSON.parse(JSON.stringify(e)));
      });
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      setStep(s => s-1);
      return true;
    })
    return () => backHandler.remove()
  }, [])

  const GiftCards = () => (
    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
      <Image
        source={require('../assets/images/gift-card-v1.png')}
        style={{width: 159, height: 101}}
      />
      <Image
        source={require('../assets/images/gift-card-v2.png')}
        style={{width: 159, height: 101}}
      />
    </View>
  );

  let GiftCardOrderStep;
  
  if (step === 0) {
    GiftCardOrderStep = (
      <View
        style={{
          flex: 1,
          paddingHorizontal: conditionalpadding(),
          justifyContent: 'flex-end',
        }}>
        <View
          style={{height: Grid.col_11.height, justifyContent: 'space-between'}}>
          <View>
            <GiftCards />
            <View style={{marginTop: 44}}>
              <Text style={styles.infoText}>
                {state?.t('infoText.loialtyText')}{' '}
              </Text>
            </View>
          </View>
          <View
            style={{alignItems: 'flex-end', marginTop: 30, marginBottom: 20}}>
            <AppButton
              btnStyle={styles.btnStyle}
              titleStyle={styles.btnTitleStyle}
              loaderStyle={loaderStyle}
              loading={btnLoading}
              title={state?.t('common.next')}
              onPress={() => setStep(1)}
            />
          </View>
        </View>
      </View>
    );
  } else if (step === 1) {
    GiftCardOrderStep = (
      <View
        style={{
          flexGrow: 1,
          backgroundColor: isDarkTheme ? Colors.black : Colors.white,
          paddingHorizontal: conditionalpadding(),
          paddingBottom: 10,
        }}>
        <Text style={styles.orderCardTitle}>
          {state?.t('screens.orderCards')}
        </Text>
        <GiftCards />

        <AppInput
          style={{
            marginTop: 20,
            color: isDarkTheme ? Colors.white : Colors.black,
          }}
          placeholder={state?.t('labels.nameSurname')}
          name="customer"
          validationRule=""
          addValidation={() => {}}
          value={customer || ''}
          onChangeText={handleName} 
          isRequired={false}       
           />
        {(nameError?.length > 0) && (
          <Text style={styles.errorText}>{nameError}</Text>
        )}
        <View style={[{flex: 1, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: isDarkTheme ? Colors.white: Colors.black}, Platform.OS === 'ios' && {marginTop:15}]}>
        {/* <Text style={{color: isDarkTheme ? Colors.white : Colors.black, position: 'relative', bottom: 1}}>995</Text> */}
       <View style={{width: 35}}> 
       <AppInput
          style={{color: isDarkTheme ? Colors.white : Colors.black}}
          name="code"
          validationRule="code"
          hasError={false}
          isRequired={false}
          value={'995'}
          addValidation={() => {}}
          onChangeText={()=>{}}
          keyboardType="numeric"
          ignoreBorder={true}
          maxLength={3}
          editable={false}
        />
        </View>
        <View>
        <AppInput
          style={{color: isDarkTheme ? Colors.white : Colors.black}}
          placeholder={state?.t('labels.mobile')}
          name="phoneNumber"
          validationRule=""
          isRequired={false}
          value={phoneNumber || ''}
          addValidation={validateInputs}
          onChangeText={(newValue: string) => handlePhoneNumber(newValue)}
          keyboardType="numeric"
          ignoreBorder={true}
          maxLength={9}
        />
        </View>
        </View>
        {(phoneError.length > 0) && (
          <Text style={styles.errorText}>{phoneError}</Text>
        )}

        <Text style={[styles.orderCardTitle, {marginTop: 30}]}>
          {state?.t('screens.orderDitails')}
        </Text>
        <AppInput
          style={styles.detailsText}
          name="orderDetails"
          isRequired={false}
          validationRule=""
          addValidation={() => {}}
          placeholder={state?.t('infoText.describeText')}
          placeholderTextColor={Colors.darkGrey}
          value={orderDetails || ''}
          onChangeText={(newValue: string) => setOrderDetails(newValue)}
          multiline={true}
          numberOfLines={4}
          ignoreBorder={true}
        />
        {orderDetailsError.length > 0 && (
          <Text style={[styles.errorText, {position: 'relative', top: -15}]}>{orderDetailsError}</Text>
        )}
        <TouchableOpacity
          style={styles.checkBoxWithLabel}
          onPress={() => toggleDeliveryOption('fromMall')}>
          <AppCheckBox
            checked={deliveryOption.fromCityMall}
            onChange={() => toggleDeliveryOption('fromMall')}
          />
          <Text style={styles.labelText}>{state?.t('screens.take')}</Text>
        </TouchableOpacity>
        {deliveryOption.fromCityMall && (
          <View style={{paddingLeft: 20}}>
            {serviceCenters?.map((s: IServiceCenter, i: number) => (
              <TouchableOpacity
                key={s.id}
                style={styles.checkBoxWithLabel}
                onPress={() => togglePickupLocation(i)}>
                <AppCheckBox
                  checked={s.checked}
                  onChange={() => togglePickupLocation(i)}
                />
                <Text style={styles.labelText}>{s.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <TouchableOpacity
          style={styles.checkBoxWithLabel}
          onPress={() => toggleDeliveryOption('curier')}>
          <AppCheckBox
            checked={deliveryOption.curierDelivery}
            onChange={() => toggleDeliveryOption('curier')}
          />
          <Text style={styles.labelText}>{state?.t('screens.delivery')}</Text>
        </TouchableOpacity>
        {deliveryOption.curierDelivery && (
          <View>
            <AppInput
              style={styles.detailsText}
              name="address"
              isRequired={false}
              validationRule=""
              addValidation={() => {}}
              placeholder={state?.t('infoText.addressInfoText')}
              placeholderTextColor={Colors.darkGrey}
              value={address || ''}
              onChangeText={(newValue: string) => setAddress(newValue)}
              multiline={true}
              numberOfLines={4}
              ignoreBorder={true}
            />
            
          </View>
        )}

{addressError.length > 0 && (
              <Text style={[styles.errorText, {position: 'relative', top: -15}]}>{addressError}</Text>
            )}

        <AppButton
          btnStyle={styles.btnStyle}
          titleStyle={styles.btnTitleStyle}
          loaderStyle={loaderStyle}
          loading={btnLoading}
          title={state?.t('common.next')}
          onPress={handleGiftCardOrder}
        />
      </View>
    );
  } else {
    GiftCardOrderStep = (
      <View style={{flex: 1, paddingTop: 100, height: height - 250}}>
        <View
          style={{justifyContent: 'space-between', flex: 1}}>
          {!resSuccess ? (
            <View>
              <Image
                source={require('../assets/images/error-mark.png')}
                style={styles.responseImg}
              />
              <Text style={styles.responseText}>
                {state?.t('screens.errorrMsg')}
              </Text>
            </View>
          ) : (
            <View>
              <Image
                source={require('../assets/images/success-mark.png')}
                style={styles.responseImg}
              />
              <Text style={styles.responseText}>
                {state?.t('infoText.successMsg')}
              </Text>
            </View>
          )}
          <TouchableOpacity
            onPress={() => navigate('HomeScreen')}
            style={{
              marginTop: 40,
              width: 325,
              height: 66,
              backgroundColor: Colors.darkGrey,
              borderRadius: 50,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
            }}>
            <Text style={{color: Colors.white}}>
              {state?.t('common.close')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return <Layout hasBackArrow={true} onPressBack={GoBack}>{GiftCardOrderStep}</Layout>;
};

export default OrderGiftCardScreen;
