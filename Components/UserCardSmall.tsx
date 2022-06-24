import React, { useContext, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppContext } from '../AppContext/AppContext';
import { Colors } from '../Colors/Colors';
import translateService from '../Services/translateService';

interface ICardSm {
    cardNumber: string,
    navigateToBarCode?: () => void,
    navigateToReg?: () => void,
    skip: boolean
}
const UserCardSmall: React.FC<ICardSm> = (props) => {
    const { state } = useContext(AppContext);
    const [y, setY] = useState(0);
    const { cardNumber, navigateToBarCode, navigateToReg, skip } = props;

    return (
        !cardNumber ?
            <TouchableOpacity style={[styles.warningImg,]} onPress={navigateToReg}>
                {
                    skip ?
                        <Text style={styles.warningText}>{state?.t('infoText.skipAuthText')}</Text>
                        :
                        <Text style={styles.warningText}>{state?.t('infoText.registrationText')}</Text>
                }
                <Image style={[styles.giftCardImg, { opacity: 0.2 }]} source={require('../assets/images/loyalty-card.png')} />
                <View style={styles.container}>
                    <Text style={styles.authBtnText}>{state?.t('common.register') + (skip ? ' / ' + state?.t('common.signin') : '')}</Text>
                    <Image style={{ marginLeft: 7, width: 7, height: 7 }} source={require('../assets/images/arrow-sm.png')} />
                </View>
            </TouchableOpacity>
            :
            <TouchableOpacity style={{ position: 'relative', justifyContent: 'center', alignItems: 'center', height: '100%' }} onPress={navigateToBarCode}>
                <Image onLayout={event => {
                    const layout = event.nativeEvent.layout;
                    setY(layout.y + layout.height - 60);
                }} style={styles.giftCardImg} source={require('../assets/images/loyalty-card.png')} />
                <Text style={{ color: Colors.white, position: 'absolute', top: y, fontSize: 17 }}>{cardNumber}</Text>
            </TouchableOpacity>
    );
};

export default UserCardSmall;

const styles = StyleSheet.create({
    giftCardImg: {
        maxHeight: 187,
        maxWidth: 296,
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    warningImg: {
        maxHeight: 187,
        maxWidth: 296,
        width: '100%',
        height: '100%',
        borderRadius: 10,
        borderColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        position: 'relative',
    },
    warningText: {
        color: Colors.yellow,
        fontSize: 10,
        textAlign: 'center',
        fontFamily: 'HMpangram-Bold',
        position: 'absolute',
        width: '80%',
        elevation: 10

    },
    authBtnText: {
        color: Colors.white,
        fontSize: 12,
        fontWeight: '900',
        fontFamily: 'HMpangram-Medium',
        textTransform: 'uppercase',
    },

    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5
    }
});