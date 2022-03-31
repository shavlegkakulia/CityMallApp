import React, { useContext, useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppContext } from '../../AppContext/AppContext';
import { Colors } from '../../Colors/Colors';
import translateService from "../../Services/translateService";

const AppModal = () => {
    const { state } = useContext(AppContext);
    const [animation, setAnimation] = useState<any>(new Animated.Value(0));
    const {isDarkTheme} = useContext(AppContext);

    useEffect(() => {
        Animated.timing(animation, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false
        }).start();
    }, []);

    const closeModal = () => {
        Animated.timing(animation, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false
        }).start();
    }

    const bgColor = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [
            '#02071700', 
            '#02071799',
            
        ]
    })
 
    const showModal = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
        extrapolate: 'clamp'
    });

    const styles = StyleSheet.create({ 
        moalBox: {
            width: '70%',
            alignSelf: 'center',
            paddingVertical: 26,
            paddingHorizontal: 31,
            margin: 20,
            borderRadius: 10,
            backgroundColor: isDarkTheme? Colors.black : Colors.white,
            shadowColor: '#bdc1c6',
            shadowOffset: {
                width: 8,
                height: 8
            },
            shadowOpacity: 0.75,
            shadowRadius: 30,
            elevation: 10,
            alignItems: 'center',
            justifyContent: 'center' 
        },

        modalTitle: {
            fontFamily: 'HMpangram-Bold',
            fontSize: 18,
            lineHeight: 22,
            color:  isDarkTheme? Colors.white : Colors.black,
            textAlign: 'center'
        },

        modalMessage: {
            fontFamily: 'HMpangram-Medium',
            fontSize: 14,
            lineHeight: 16,
            textAlign: 'center',
            color:  isDarkTheme? Colors.white : Colors.black,
            marginTop: 12,
            marginBottom: 27,
            
        },

        modalBtn: {
            width: '100%',
            height: 39,
            borderRadius: 50,
            borderWidth: 1,
            backgroundColor: Colors.darkGrey,
            padding: 10,
            alignSelf: 'center'
        },
        
        modalBtnTitle: {
            fontFamily: 'HMpangram-Bold',
            fontSize: 14,
            lineHeight: 16,
            textAlign: 'center',
            color:  isDarkTheme? Colors.white : Colors.black,
        },

        shown: {
            transform: [
                {scale: showModal}
            ],
        },

        background: {
            backgroundColor: bgColor,
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
            elevation: 10,
            flex: 1
        },

    });
 


    return (
        <Animated.View style={[styles.shown, styles.background]}>
            <View style={styles.moalBox}>
                <Text style={styles.modalTitle}>{state?.t('common.erorr')}</Text>
                <Text style={styles.modalMessage}>{state?.t('infoText.userExist')}</Text>
                <View style={{width: '100%'}}>
                    <TouchableOpacity style={styles.modalBtn} onPress = {closeModal}>
                        <Text style={styles.modalBtnTitle}>{state?.t('common.close')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Animated.View>

    );
};

export default AppModal; 