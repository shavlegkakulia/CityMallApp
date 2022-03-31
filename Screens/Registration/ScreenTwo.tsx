

import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { 
    ActivityIndicator, 
    Keyboard, 
    Image, 
    StyleSheet, 
    Switch, 
    Text, 
    TouchableOpacity, 
    View, 
    Platform,  
    ScrollView 
} from 'react-native';
import axios from 'axios';
import DatePicker from 'react-native-date-picker';
import ApiServices from '../../Services/ApiServices';
import { AppContext } from '../../AppContext/AppContext';
import { getItem } from '../../Services/StorageService';
import AuthService from '../../Services/AuthService';
import { 
    GoBack, 
    navigate 
} from '../../Services/NavigationServices';
import Layout from '../../Components/Layouts/Layout';
import DistrictPiker from '../../Components/CustomComponents/DistrictPiker';
import AppInput from '../../Components/CustomComponents/AppInput';
import AppCheckBox from '../../Components/CustomComponents/AppCheckBox';
import { Colors } from '../../Colors/Colors';
import { minusMonthFromDate } from '../../Utils/utils';
import envs from './../../config/env';
import { formatDate } from '../../Services/Utils';



// type RouteParamList = {
//     params: {
//         data: IRegistrationProps
//     }
// }



const ScreenTwo: React.FC = (props: any) => {

    const { state, setGlobalState} = useContext(AppContext);
    const { isDarkTheme, routeObject, userPhoneNumber } = state;

    // const routeObj = useRoute<RouteProp<RouteParamList, 'params'>>();


    const [hasError, setHasError] = useState<boolean>(false);
    const [errorMessages, setErrorMessages] = useState<string[] | []>([]);
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);
    const [verifyEmailLoading, setVerifyEmailLoading] = useState<boolean>(false);
    const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>();
    const [birthDateError, setBirthDateError] = useState<boolean>(false);
    const [district, setDistrict] = useState<string>('');
    const [districts, setDistricts] = useState<any>([]);
    const [selectedDistrict, setSelectedDistrict] = useState<string>();
    const [districtError, setDistrictError] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [verifyEmail, setVerifyEmail] = useState<boolean>(false);
    const [emailVerificationCode, setEmailVerificationCode] = useState<string>('');
    const [verifyEmailError, setVerifyEmailError] = useState<boolean>(false);
    const [isValidMailOtp, setIsValidMailOtp] = useState<boolean>(false);
    const [agreedTerms, setAgreedTerms] = useState<boolean>(false);
    const [generalError, setGeneralError] = useState<string>('');
    const [open, setOpen] = useState<boolean>(false);
    const [fullPath, setfullPath] = useState('');

    useEffect(() => {
        GetDistricts();

    }, []);

    useEffect(() => {
        if (errorMessages.length === 0) {
            setHasError(false);
        };
    }, [errorMessages]);

    useEffect(() => {
        if(selectedDistrict !== state?.t('screens.other')){
            let errorArray = errorMessages.filter(e => e !== 'district');
            setErrorMessages(errorArray);
        }
    }, [selectedDistrict ]);

    const validateInputs = (actionType: string, inputName: string) => {
        if (actionType === 'add') {
            let errorArray = [...errorMessages];
            errorArray.push(inputName);
            let uniqueNames = [...new Set(errorArray)];
            setErrorMessages(prevState => {
                return [...prevState, ...uniqueNames]
            });
        } else {
            let errorArray = errorMessages.filter(e => e !== inputName);
            setErrorMessages(errorArray);
        };
    };

    useEffect(() => {
        if (verifyEmail) {
            handleSendMailOtp();
        };
    }, [verifyEmail]);

    useEffect(() => {
        if (emailVerificationCode.length < 6) {
            setIsValidMailOtp(false);
        }
    }, [emailVerificationCode]);

    const GetDistricts = () => {
        ApiServices.GetDistricts()
            .then((res: any) => {
                setDistricts(res.data)
            })
            .catch((e: any) => {
                console.log(JSON.parse(JSON.stringify(e.response)));
            })
    };

    const handleDistrictSelect = (item: string) => {
        setSelectedDistrict(item);
        setDistrictError('');
    };


    const toggleSwitch = () => {
        setEmailVerificationCode('');
        setVerifyEmailError(false);
        setIsValidMailOtp(false);
        setVerifyEmail(!verifyEmail);
    };

    const handleSendMailOtp = () => {
        setButtonLoading(true);
        let data = {
            mail: email
        };
        ApiServices.SendMailOtp(data)
            .then((res:any) => {
                setButtonLoading(false);
            })
            .catch((e:any) => {
                setButtonLoading(false);
                console.log(JSON.parse(JSON.stringify(e.response)).data.error);
            });
    };

    const handleCheckMailOtp = () => {
        setVerifyEmailLoading(true);
        setVerifyEmailError(false);
        let data = {
            email: email,
            otp: emailVerificationCode
        };

        ApiServices.CheckMailOtp(data)
            .then((res: any) => {
                if (res.status === 200)
                    setVerifyEmailLoading(false);
                setVerifyEmailError(false);
                setIsValidMailOtp(true);
            })
            .catch(e => {
                setVerifyEmailLoading(false);
                setVerifyEmailError(true);
                setIsValidMailOtp(false);
                console.log(JSON.parse(JSON.stringify(e.response)).data);
            });
    };



    // const formatDate = (date: Date) => { 
    //     let dateArray: any[] = [];
    //     if(Platform.OS === 'ios') {
    //         dateArray = date.toLocaleDateString().split('.');
    //     } else {
    //         dateArray = date.toLocaleDateString().split('/');
    //     }
        
    //     return `${dateArray[1]} - ${dateArray[0]} - ${dateArray[2]}`
    // }

    const handleAddVirtualCard = () => {
        if (errorMessages.length > 0) {
            setHasError(true);
            return;
        };
        setGeneralError('');
        setButtonLoading(true);
       
        
        let data = {
            firstName: routeObject.firstName,
            lastName: routeObject.lastName,
            personCode: routeObject.personCode,
            birthDate: dateOfBirth || new Date(),
            phone: routeObject?.skip ? routeObject?.userPhoneNumber : userPhoneNumber,
            email: email,
            address: selectedDistrict === state?.t('screens.other') ? district : selectedDistrict,
            sex: routeObject?.sex?.male == true ? 1 : routeObject?.sex?.female == true ? 2 : 0,
            mailOtp: emailVerificationCode,
            isResident: routeObject.isForeignResident
        };
        ApiServices.AddVirtualCard(data)
            .then(async res => {
                
                let refreshToken = await getItem('refresh_token');
                const config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    skipRefresh: true
                }
                const refreshObj = new URLSearchParams();
                refreshObj.append('grant_type', 'refresh_token');
                refreshObj.append('client_id', envs.client_id);
                refreshObj.append('client_secret', envs.client_secret);
                refreshObj.append('refresh_token', refreshToken!);

                await axios.post(`${envs.CONNECT_URL}/connect/token`, refreshObj, config)
                    .then(async (response: any) => {
                        AuthService.setToken(response.data.access_token, response.data.refresh_token);
                        setButtonLoading(false);
                        navigate('REGSTEP_THREE', {skip: routeObject?.skip});
                    })
                    .catch((e: any) => {
                        setButtonLoading(false);
                        console.log(JSON.parse(JSON.stringify(e.response)).data);
                    });
            })
            .catch(e => {
                setButtonLoading(false);
                let error = JSON.parse(JSON.stringify(e.response)).data.DisplayText;
                setGeneralError(error)
                console.log(JSON.parse(JSON.stringify(e.response)).data);
            });
    };

    const memoized = useMemo(() => {
        return <DatePicker
        style={{backgroundColor: 'red'}}
        open={open}
        date={dateOfBirth || minusMonthFromDate(12*18)}
        onConfirm={(date) => {
            setDateOfBirth(date);
            setOpen(false)
        }}
        onCancel={() => {
            setOpen(false);
        }}
        modal={true}
        mode='date'
        title={state?.t('screens.selectDate')}
        confirmText={state?.t('common.select')}
        cancelText={state?.t('screens.cancel')}
        locale="ka-GE"
        androidVariant='nativeAndroid'
    />
    }, [open])

    useEffect(() => {
        ApiServices.GetAgerements().then(res => {
          let files = res.data;
          if(files?.length) {
            setfullPath(files[1]?.fullPath);
          }
        })
      }, [])

    return (
        <Layout pageName={state?.t('common.cityMall')} hasBackArrow={true} onPressBack={() => {
            GoBack();
        }}>
            <ScrollView keyboardShouldPersistTaps='always' contentContainerStyle={{ paddingHorizontal: '10%', position: 'relative', flexGrow: 1 }}>
                <View style={{flex: 1}}>
                    <Text style={[styles.regTitle, { color: isDarkTheme ? Colors.white : Colors.black }]}>{state?.t('common.register')}</Text>
                </View>
                <View style={{ flex: 10 }}>
                    <>
                    <TouchableOpacity style={[styles.inputWrap, {borderColor: isDarkTheme ? Colors.white : Colors.black}]} onPress={() => setOpen(true)}>
                        <Text style={[styles.input, {color: isDarkTheme ? Colors.white : Colors.black}]}>{dateOfBirth ? formatDate(dateOfBirth?.toISOString()) : state?.t('labels.birthday')}</Text>
                    </TouchableOpacity>
                        {memoized}
                    </>
                    {birthDateError ?
                        <Text style={styles.errorText}>{state?.t('infoText.validate')}</Text>
                        : null}
                    <View style={{marginTop: 10, height: 60, width: 317}}>
                        <DistrictPiker districts={districts} onSelect={handleDistrictSelect} placeholder={state?.t('screens.selectD')} />
                        
                    </View>
                    {selectedDistrict === state?.t('screens.other') &&
                             <View>
                            <AppInput
                                placeholder={state?.t('screens.livingPlace')}
                                value={district}
                                name='district'
                                hasError={hasError}
                                addValidation={validateInputs}
                                errors={errorMessages}
                                isRequired={true}
                                validationRule='phoneNumber'
                                onChangeText={(val: string) => setDistrict(val)}
                            />
                            </View>
                        }
                    <View>
                        <AppInput
                            placeholder={state?.t('labels.email')}
                            value={email}
                            name='email'
                            keyboardType='email-address'
                            hasError={hasError}
                            addValidation={validateInputs}
                            errors={errorMessages}
                            isRequired={false}
                            validationRule='email'
                            onChangeText={(val: string) => setEmail(val)}
                        />
                        <View style={styles.mailVerification}>
                            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                <Switch
                                    trackColor={{ false: "#767577", true: "#28AD25" }}
                                    thumbColor={Colors.white}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={toggleSwitch}
                                    value={verifyEmail}
                                    disabled={email.length > 0 && !emailError ? false : true} />
                                <View style={styles.mailVerificationTextWrap}>
                                    <Text style={[styles.mailVerificationText, { color: isDarkTheme ? Colors.white : Colors.black, }]}>{state?.t('infoText.emailText')}</Text>
                                    <Text style={[styles.mailVerificationSubtext, { color: isDarkTheme ? Colors.white : Colors.black, }]}>{state?.t('infoText.emailGiftText')}</Text>
                                </View>
                            </View>
                            {verifyEmail ?
                                <View style={{ position: 'relative' }}>
                                    <AppInput
                                        placeholder={state?.t('screens.veripicationCode')} 
                                        value={emailVerificationCode}
                                        name='mailOtp'
                                        hasError={hasError}
                                        addValidation={validateInputs}
                                        errors={errorMessages}
                                        isRequired={true}
                                        validationRule='required'
                                        keyboardType='number-pad'
                                        maxLength={6}
                                        onChangeText={(val: string) => setEmailVerificationCode(val)} />
                                    {verifyEmailError ?
                                        <Text style={styles.errorText}>{state?.t('infoText.codeIncorrect')}</Text>
                                        : null}
                                    <TouchableOpacity onPress={handleCheckMailOtp} style={{ position: 'absolute', right: 5, top: 25 }}>
                                        {verifyEmailLoading ?
                                            <ActivityIndicator animating={verifyEmailLoading} color={Colors.white} />
                                            :
                                            !isValidMailOtp ?
                                                <Text style={{ color: isDarkTheme ? Colors.white : Colors.black }}>{state?.t('screens.check')}</Text>
                                                :
                                                <Image source={require('../../assets/images/green-checkmark.png')} style={{ width: 20, height: 14 }} />
                                        }
                                    </TouchableOpacity>
                                </View>
                                : null}
                        </View>
                    </View>
                    <View >
                        <View style={styles.inputWithLabel}>
                            <AppCheckBox
                                name='terms'
                                checked={agreedTerms}
                                onChange={() => { setAgreedTerms(!agreedTerms); Keyboard.dismiss() }}
                                hasError={hasError}
                                addValidation={validateInputs}
                                isRequired={true}
                            />
                            <TouchableOpacity onPress={() => navigate('DocView', { docUrl: fullPath})}>
                                <Text style={[styles.labelText, { color: isDarkTheme ? Colors.white : Colors.black, }]}>{state?.t('infoText.agreement')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {generalError !== '' ?
                        <Text style={styles.errorText}>
                            {generalError}
                        </Text> : null}
                </View>
                <View style={{flex: 1}}>
                    <TouchableOpacity 
                        style={styles.authBtn} 
                        onPress={handleAddVirtualCard} 
                        disabled={buttonLoading}>
                        {buttonLoading ?
                            <ActivityIndicator animating={buttonLoading} color='#dadde1' />
                            :
                            <Text style={[styles.btnText, { color: isDarkTheme ? Colors.white : Colors.black, }]}>{state?.t('common.accept')}</Text>
                        }
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </Layout>
    );
};

export default ScreenTwo;

const styles = StyleSheet.create({
    regTitle: {
        textAlign: 'center',

        fontFamily: 'HMpangram-Bold',
        fontSize: 18,
        fontWeight: '700',
        lineHeight: 22,
        alignItems: 'center',
        textTransform: 'uppercase'
    },
    authBtn: {
        marginTop: 35,
        marginBottom: 10,
        alignSelf: 'center',
        width: 325,
        height: 66,
        maxHeight: 66,
        backgroundColor: Colors.btnGrey,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },

    btnText: {
        fontSize: 14,
        lineHeight: 17,
        fontWeight: '800',
        fontFamily: 'HMpangram-Bold',
        textTransform: 'uppercase'
    },

    labelText: {
        fontFamily: 'HMpangram-Bold',
        fontSize: 14,
        fontWeight: '700',
        lineHeight: 15,
        marginLeft: 7
    },

    inputWithLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10
    },

    mailVerification: {
        width: '100%',
        marginVertical: 20
    },

    mailVerificationTextWrap: {
        width: '80%',
        marginLeft: 5
    },

    mailVerificationText: {

        fontFamily: 'HMpangram-Medium',
        fontSize: 14,
        lineHeight: 14
    },

    mailVerificationSubtext: {
        fontFamily: 'HMpangram-Medium',
        fontSize: 10,
        lineHeight: 14
    },
    registerSuccess: {

        fontFamily: 'HMpangram-Bold',
        fontSize: 18,
        fontWeight: '700',
        lineHeight: 22,
        textAlign: 'center'
    },
    errorText: {
        color: Colors.red,
        fontSize: 11,
        fontFamily: 'HMpangram-Medium'
    },
    wraperWithShadow: {
        flex: 1,
        backgroundColor: Colors.black,
        paddingHorizontal: 12, // -margin
    },
    wraper: {
        //flex: 1,
        backgroundColor: Colors.black,

    },
    screenContainer: {
        flex: 1,
        backgroundColor: Colors.black,
    },
    shadowedCardbr15: {
        margin: 4,
        marginVertical: Platform.OS === 'ios' ? 4 : 4,
        elevation: 4,
        shadowColor: '#00000060',
        shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0.3,
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowRadius: Platform.OS === 'ios' ? 5 : 15,
        borderRadius: 15,
    },
    shadowedCardbr10: {
        margin: 4,
        elevation: 4,
        shadowColor: '#00000060',
        shadowOpacity: 0.3,
        shadowOffset: {
            width: 2,
            height: 2
        },
        shadowRadius: Platform.OS === 'ios' ? 5 : 10,
        borderRadius: 10,
    },
    datePickerContainer: {
        // marginTop: 35,
        // backgroundColor: Colors.white,
    },
    datePickerAction: {
        marginBottom: 10,
    },
    datePicker: {
        alignSelf: 'center',
        marginTop: 30,
    },
    endDatePickerActionTitle: {
        alignSelf: 'flex-end',
        fontFamily: 'FiraGO-Medium',
        fontSize: 16,
        lineHeight: 20,
        color: Colors.white,
    },

    inputWrap: {
        width: '100%',
        position: 'relative',
        borderBottomWidth: 1,
    },
    input: {
        fontFamily: 'HMpangram-Medium',
        fontWeight: '500',
        fontSize: 14,
        paddingVertical: 12,
        paddingHorizontal: 10
    },
    

});
