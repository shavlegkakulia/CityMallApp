import React, { useContext } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppContext } from '../AppContext/AppContext';
import { Colors } from '../Colors/Colors';
import Layout from '../Components/Layouts/Layout';  

interface ICardWithBarcode {
    cardNumber?: string,
    barcodeUrl?: string
}

const UserCardWithBarcode: React.FC = (props:any ) => {
    const { state } = useContext(AppContext);

    const {cardDetails, isDarkTheme} = state;


 //  const win = Dimensions.get('window');

  // const ratio = win.width/450; //246 is actual image width

   const imageStyle = {
    width: 450,
    height: 90, //123 is actual height of image
}
    
    return (
        <View style={[styles.centeredView, { backgroundColor: isDarkTheme? Colors.black : Colors.white}]}>
            <TouchableOpacity style={styles.card} onPress = {()=> props.navigation.navigate('HomeScreen')}>
                <Image source = {require('../assets/images/card-with-barcode.png')} style= {styles.card} />
                <Image source = {{  uri: 'data:image/png;base64,'+cardDetails.barcode}} style={[styles.barCode, {...imageStyle}]}/>
                <Text style={styles.cardNumber}>{cardDetails.cardNumber.replace(
                    /\b(\d{4})(\d{4})(\d{4})(\d{4})\b/,
                    '$1  $2  $3  $4',
                  )}</Text>
            </TouchableOpacity>  
            </View>
    );
};

export default UserCardWithBarcode;

const styles =StyleSheet.create({
    centeredView: {
        flex: 1,
        alignItems: 'center', 
        justifyContent: 'center',  
        position: 'relative', 
       
    },
    card: {
        width: 262,
        height: 534,
        borderRadius: 10,
    },
    barCode: {
        // height: 90,
        // width: 450,
        transform: [{rotate: '90deg'}],
        position: 'absolute',
        top: 238,
        left: -157,
      },
      cardNumber: {
        height: 65,
        width: 565,
        transform: [{rotate: '90deg'}],
        position: 'absolute',
        fontFamily: 'HMpangram-Medium',
        top: '75%',
        left: -137,
        fontSize: 20
      }
});