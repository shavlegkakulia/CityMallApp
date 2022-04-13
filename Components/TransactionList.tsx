import React, { useContext } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { AppContext } from '../AppContext/AppContext';
import { Colors } from '../Colors/Colors';
import { tranTypes } from '../Screens/ProfileScreen/ProfileScreen';

const TransactionList = (props: any) => {
    const { state } = useContext(AppContext);
    const { isDarkTheme } = state;

    let _color = {color: Colors.successGreen};

    if(props.isPayment) {
        if(parseFloat(props.item.amount) > 0) {
            _color = {color: Colors.successGreen}
        } else {
            _color = {color: Colors.red}
        }
    } else {
        _color = props.item.transactionType === tranTypes.accumulate ? {color: Colors.successGreen} : {color: Colors.red};
    }
  
    return (
        <View style={styles.trListWrap}>
            <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
                <Image
                    resizeMode={'contain'}
                    source={{uri: props.isPayment ? props.item?.imageUrl : props.item?.imageURL}}
                    style={{ width: 25, height: 25}}
                />
                <View style={{ marginLeft: 10, flex: 1 }}>
                    <Text style={{ color: isDarkTheme ? Colors.white : Colors.black }}>{new Date(props.isPayment ? props.item?.tranDate : props.item?.authDate).toLocaleDateString().split('/').join('.')} {new Date(props.isPayment ? props.item?.tranDate : props.item?.authDate).toLocaleTimeString()}</Text>
                    <Text numberOfLines={2} style={{ color: isDarkTheme ? Colors.white : Colors.black }}>{props.isPayment ? props.item.shortDescription : props.item?.merchantName}</Text>
                </View>
            </View>
            <View style={{flexDirection: 'row'}}>
                <Text style={[{..._color}]}>{props.isPayment ? props.item.amount + ' ' + props.item.ccy : props.item?.points}</Text>
                <Image source={require('./../assets/images/Star.png')} style={{width: 9, height: 9}} resizeMode={'contain'} />
                </View>
        </View> 
    )
};

export default TransactionList;


const styles = StyleSheet.create({
    trListWrap: {
        width: '100%',
        height: 40,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 20
    },
    trDetailsView: {

    }
})
