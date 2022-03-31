import { RouteProp, useRoute } from '@react-navigation/native';
import React, {
    useState,
    useEffect,
    useContext
} from 'react';
import {
    Keyboard,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ScrollView,
} from 'react-native';
import { AppContext } from '../../AppContext/AppContext';
import { Colors } from '../../Colors/Colors';
import AppCheckBox from '../../Components/CustomComponents/AppCheckBox';
import AppInput from '../../Components/CustomComponents/AppInput';
import Layout from '../../Components/Layouts/Layout';
import {
    GoBack,
    navigate
} from '../../Services/NavigationServices';

type RouteParamList = {
    params: {
        userPhoneNumber?: string;
        skip?: boolean;
    }
}

export interface IRegistrationProps {
    firstName?: string;
    lastName?: string;
    personCode?: string;
    gender?: boolean;
    birthDate?: string;
    district?: string;
    email?: string;
    phone?: string;
    address?: string;
    sex?: Object;
    mailOtp?: string;
    isResident: boolean;
    userPhoneNumber?:string;
    skip?:boolean;
}

export interface IGenderTypes {
    male: boolean;
    female: boolean;
}

const ScreenOne: React.FC = () => {
    const routeParams = useRoute<RouteProp<RouteParamList, 'params'>>();
    const { state, setGlobalState } = useContext(AppContext);
    const { isDarkTheme } = state;

    const [hasError, setHasError] = useState<boolean>(false);
    const [errorMessages, setErrorMessages] = useState<string[] | []>([]);
    const [name, setName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [idNumber, setIdNumber] = useState<string>('');
    const [isForeignResident, setIsForeignResident] = useState<boolean>(false);
    const [gender, setGender] = useState<IGenderTypes>({
        male: false,
        female: false,
    });

    useEffect(() => {
        if (errorMessages.length === 0) {
            setHasError(false);
        }
    }, [errorMessages]);

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

    const handleGenderChange = (type: string) => {
        Keyboard.dismiss();
        if (type === 'male') {
            setGender({
                male: true,
                female: false,
            });
        } else {
            setGender({
                male: false,
                female: true,
            });
        }
    };

    const handleStep = () => {
        if (errorMessages.length > 0) {
            setHasError(true);
            return
        }; //სანახავია პიდარობის მოწმობის ვალიდაცია
        
        const data: IRegistrationProps = {
            firstName: name,
            lastName: lastName,
            personCode: idNumber,
            sex: gender,
            isResident: isForeignResident,
            userPhoneNumber: routeParams?.params?.userPhoneNumber,
            skip: routeParams?.params?.skip,
        };
        setGlobalState({ routeObject: data });
        navigate('REGSTEP_TWO');
    };

    return (
        <Layout 
        hasBackArrow={true} 
        onPressBack={() => GoBack()}
        pageName={state?.t('common.cityMall')}>
            <ScrollView
                keyboardShouldPersistTaps="always"
                contentContainerStyle={{
                    paddingHorizontal: '10%',
                    position: 'relative',
                    flexGrow: 1,
                }}>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.regTitle, { color: isDarkTheme ? Colors.white : Colors.black }]}>
                       {state?.t('common.register')}
                    </Text>
                </View>
                <ScrollView style={{ flex: 9 }}>
                    <AppInput
                        placeholder={state?.t('labels.firstName')}
                        name="name"
                        value={name}
                        hasError={hasError}
                        addValidation={validateInputs}
                        errors={errorMessages}
                        isRequired={true}
                        validationRule="required"
                        onChangeText={(val: string) => setName(val)}
                    />
                    <AppInput
                        placeholder={state?.t('labels.lastName')}
                        name="lastName"
                        value={lastName}
                        hasError={hasError}
                        addValidation={validateInputs}
                        errors={errorMessages}
                        isRequired={true}
                        validationRule="required"
                        onChangeText={(val: string) => setLastName(val)}
                    />
                    <View>
                        <AppInput
                            placeholder={state?.t('labels.idNumber')}
                            name="idNumber"
                            value={idNumber}
                            hasError={hasError}
                            addValidation={validateInputs}
                            errors={errorMessages}
                            isRequired={true}
                            validationRule="idNumber"
                            maxLength={isForeignResident ? undefined : 11}
                            keyboardType={isForeignResident ? 'default' : 'number-pad'}
                            onChangeText={(val: string) => setIdNumber(val)}
                        />
                        <TouchableOpacity
                            style={styles.inputWithLabel}
                            onPress={() => setIsForeignResident(!isForeignResident)}>
                            <AppCheckBox
                                name="isForeign"
                                checked={isForeignResident}
                                onChange={() => setIsForeignResident(!isForeignResident)}
                                isRequired={false}
                            />
                            <Text style={[styles.labelText, { color: isDarkTheme ? Colors.white : Colors.black }]}>
                            {state?.t('infoText.citizenText')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={[
                            styles.genderCheck,
                            { borderBottomColor: isDarkTheme ? Colors.white : Colors.black },
                        ]}>
                        <Text style={{ color: isDarkTheme ? Colors.white : Colors.black, fontFamily: 'HMpangram-Medium', fontWeight: '500', paddingLeft: 12 }}>
                        {state?.t('labels.gender')}
                        </Text>
                        <TouchableOpacity
                            style={styles.inputWithLabel}
                            onPress={() => handleGenderChange('female')}>
                            <AppCheckBox
                                name="gender"
                                checked={gender.female}
                                onChange={() => handleGenderChange('female')}
                                hasError={hasError}
                                addValidation={validateInputs}
                                isRequired={true}
                            />
                            <Text style={[styles.labelText, { color: isDarkTheme ? Colors.white : Colors.black }]}>
                            {state?.t('labels.female')}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.inputWithLabel}
                            onPress={() => handleGenderChange('male')}>
                            <AppCheckBox
                                name="gender"
                                checked={gender.male}
                                onChange={() => handleGenderChange('male')}
                                hasError={hasError}
                                addValidation={validateInputs}
                                isRequired={true}
                            />
                            <Text style={[styles.labelText, { color: isDarkTheme ? Colors.white : Colors.black }]}>
                            {state?.t('labels.male')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <View style={{ flex: 2, alignItems: 'flex-end', marginVertical: 20 }}>
                    <TouchableOpacity style={styles.authBtn} onPress={handleStep}>
                        <Text style={[styles.btnText, { color: Colors.white }]}>
                        {state?.t('common.next')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </Layout>
    );
};

export default ScreenOne;

const styles = StyleSheet.create({
    regTitle: {
        textAlign: 'center',
        fontFamily: 'HMpangram-Bold',
        fontSize: 18,
        fontWeight: '700',
        lineHeight: 22,
        alignItems: 'center',
        textTransform: 'uppercase',
    },

    authBtn: {
        alignSelf: 'center',
        width: 325,
        height: 66,
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
    },

    btnText: {
        fontSize: 14,
        lineHeight: 17,
        fontWeight: '800',
        fontFamily: 'HMpangram-Bold',
        textTransform: 'uppercase',
    },

    labelText: {
        fontFamily: 'HMpangram-Bold',
        fontSize: 14,
        fontWeight: '700',
        lineHeight: 15,
        marginLeft: 7,
    },

    inputWithLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
    },

    genderCheck: {
        marginTop: '6%',
        borderBottomWidth: 1,
        paddingBottom: 17,
    },

    errorText: {
        color: Colors.red,
        fontSize: 11,
        fontFamily: 'HMpangram-Medium',
    },
});
