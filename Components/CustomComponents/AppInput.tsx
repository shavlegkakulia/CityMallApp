import React, { useContext, useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, Text, KeyboardType, Platform, Dimensions } from 'react-native';
import { AppContext } from '../../AppContext/AppContext';
import { Colors } from '../../Colors/Colors';
import { useDimension } from '../../Hooks/UseDimension';
import translateService from '../../Services/translateService';


interface IAppInput {
    name: string,
    placeholder?: string,
    isRequired: boolean,
    validationRule: string,
    addValidation?: (actionTpe: string, inputName: string) => void;
    hasError?: boolean,
    errors?: string[] | [],
    value: string,
    onChangeText: (value: string) => void,
    onBlur?: () => void,
    keyboardType?: KeyboardType,
    maxLength?: number
    selectionColor?: string
    placeholderTextColor?: string,
    style?: any,
    multiline?: boolean,
    numberOfLines?: number,
    autoFocus?: boolean,
    errorMessage?: string,
    keyboardTpe?: string
    ignoreBorder?:boolean
    editable?: boolean
}



const AppInput: React.FC<IAppInput> = (props) => {
    const { isRequired, validationRule, addValidation, hasError, errors, name, value, maxLength, style, ignoreBorder } = props;

    const { state } = useContext(AppContext);
    const { isDarkTheme } = state;

    const validations: any = {
        required: state?.t('infoText.validate'),
        phoneNumber: state?.t('infoText.wrongNumber'),
        email: state?.t('infoText.wrongEmail'),
        idNumber: state?.t('infoText.wrongId')
    }

    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        if (isRequired) {
            if (value === '') {
                addValidation!('add', name);
            } else {
                if (validationRule !== 'phoneNumber') {
                    setErrorMessage('');
                };
                addValidation!('remove', name);
            };
        };
    }, [value, isRequired]);

    useEffect(() => {
        let index = errors?.findIndex((e: string) => e === name);
        if (hasError && index! >= 0) {
            setErrorMessage(state?.t('infoText.validate'));
        };
    }, [hasError, errors]);


    useEffect(() => {

        
        if (validationRule === 'email' && value !== '') {
            let regex = /\S+@\S+\.\S+/;
            if (regex.test(value)) {
                setErrorMessage('');
                addValidation!('remove', name);
            } else {
                addValidation!('add', name);
                setErrorMessage(validations[validationRule]);
            };
    } else if (validationRule === 'email' && value === '') {
        addValidation!('add', name);
        setErrorMessage('');
    }
    }, [value, validationRule]);

    useEffect(() => {
        if (validationRule === 'phoneNumber') {
            if (value === '') {
                setErrorMessage('');
            } else if (value.length === 9) {
                addValidation!('remove', name);
                setErrorMessage('');
            } else if (maxLength && (value.length !== 9 || value !== '')) {
                addValidation!('add', name);
                setErrorMessage(validations[validationRule])
            }
        }
    }, [value, validationRule, maxLength])

    useEffect(() => {
        if (validationRule === 'idNumber') {
            if (value === '') {
                setErrorMessage('');
            } else if (value.length === 11 || (maxLength === undefined && value !== '')) {
                addValidation!('remove', name);
                setErrorMessage('');
            } else if (maxLength && (value.length !== 9 || value !== '')) {
                addValidation!('add', name);
                setErrorMessage(validations[validationRule]);
            };
        };
    }, [value, validationRule, maxLength])

    return (
        <View style={{position: 'relative'}}>
            <View style={[styles.inputWrap, ignoreBorder && {borderBottomWidth: 0}, Platform.OS === 'ios' && {paddingVertical: 4}, { borderColor: isDarkTheme ? Colors.white : Colors.black }]}>
                <TextInput
                    style={[style || styles.input, { color: isDarkTheme ? Colors.white : Colors.black }]}
                    {...props}
                    selectionColor={isDarkTheme ? Colors.white : Colors.black}
                    placeholderTextColor={isDarkTheme ? Colors.white : Colors.black} />
            </View>
            {(errorMessage?.trim()?.length > 0 || (props.errorMessage?.trim() || '')?.length > 0) &&
                <Text style={[styles.errorText, Platform.OS === 'ios' && {marginTop: 5}]}>{errorMessage || props.errorMessage}</Text>
                }
        </View>
    );
};

export default AppInput;

const styles = StyleSheet.create({
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
    errorText: {
        position: 'absolute',
        left: 0,
        right: 0,
        width: Dimensions.get('screen').width,
        bottom: -17,
        flex: 1,
        color: Colors.red,
        fontSize: 11,
        fontFamily: 'HMpangram-Medium',

    }
});