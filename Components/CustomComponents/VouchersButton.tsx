import React, { useContext } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { AppContext } from '../../AppContext/AppContext';
import {Colors} from '../../Colors/Colors';



export interface IAppBtnProps {
    onPress: () => void,
    title: string,
}



const VouchersButton: React.FC<IAppBtnProps> = (props) => {
    const { onPress,title} = props;
    const { state } = useContext(AppContext);
    const { isDarkTheme } = state;

    return (
        <TouchableOpacity
            onPress={onPress}>
            <View style={styles.btn}>
                <Image source={require('../../assets/images/vaucher.png')} style ={{width: 21, height: 16, marginRight: 10  }} />
                <Text style={styles.btnTitle}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create ({
    btn: {
        width: 272,
        height: 39,
        backgroundColor: Colors.btnGrey,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection:'row'
    },
    btnTitle: {
        color: Colors.white,
        fontSize: 10,
        fontFamily: 'HM pangram',
        textTransform: "uppercase",
    }
})
export default VouchersButton;