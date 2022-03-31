import React, { useContext } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppContext } from '../../AppContext/AppContext';
import { Colors } from '../../Colors/Colors';
import { useDimension } from '../../Hooks/UseDimension';

const HowCome = ({ data, routeId }: any) => {
    const { width } = useDimension();
    const { state } = useContext(AppContext);
    const { isDarkTheme } = state;


   let busSaburtalo3title = '', busSaburtalo3teaser = '', busGldani2title = '', busGldani2teaser = '',
   taxiSaburtalo3title = '', taxiSaburtalo3teaser = '', minibusGldani2title = '', minibusGldani2teaser = '',
   metroSaburtalo3title = '', metroSaburtalo3teaser = '', metroGldani2title = '', metroGldani2teaser = '';
   try {
     busSaburtalo3title = data[3]["bus-saburtalo"].title;
     busSaburtalo3teaser = data[3]["bus-saburtalo"].teaser;
     busGldani2title = data[2]["bus-gldani"].title;
     busGldani2teaser = data[2]["bus-gldani"].teaser;
     taxiSaburtalo3title = data[3]["taxi-saburtalo"].title;
     taxiSaburtalo3teaser = data[3]["taxi-saburtalo"].teaser;
     minibusGldani2title = data[2]["minibus-gldani"].title;
     minibusGldani2teaser = data[2]["minibus-gldani"].teaser;
     metroSaburtalo3title = data[3]["metro-saburtalo"].title;
     metroSaburtalo3teaser = data[3]["metro-saburtalo"].teaser;
     metroGldani2title = data[2]["metro-gldani"].title;
     metroGldani2teaser = data[2]["metro-gldani"].teaser;
   } catch(_) {
 
   }

    if(!data.length)
     return    <ActivityIndicator style={{alignSelf: 'flex-start'}} color={'#ffffff'} />
    return (
        <View style={{backgroundColor: isDarkTheme ? Colors.black : Colors.white}}>
            <View style={styles.row}>
                <View style={styles.width}>
                    <Image source={require('../../assets/images/train.png')} />
                </View>
                {
                    routeId === 1 ?
                        <View>
                            <Text style={[styles.titleTxt,{color: isDarkTheme ? Colors.white : Colors.black}]}>{busSaburtalo3title} </Text>
                            <Text style={[styles.detailTxt,{color: isDarkTheme ? Colors.white : Colors.black}]}>{busSaburtalo3teaser}</Text>
                        </View>
                        :
                        <View>
                            <Text style={[styles.titleTxt,{color: isDarkTheme ? Colors.white : Colors.black}]}>{busGldani2title} </Text>
                            <Text style={[styles.detailTxt,{color: isDarkTheme ? Colors.white : Colors.black}]}>{busGldani2teaser}</Text>
                        </View>
                }
            </View>
            <View style={styles.row}>
                <View style={styles.width}>
                    <Image source={require('../../assets/images/bus.png')} />
                </View>
                {
                    routeId === 1 ?
                        <View>
                            <Text style={[styles.titleTxt,{color: isDarkTheme ? Colors.white : Colors.black}]}>{taxiSaburtalo3title}</Text>
                            <Text style={[styles.detailTxt,{color: isDarkTheme ? Colors.white : Colors.black}]}>{taxiSaburtalo3teaser}</Text>
                        </View>
                        :
                        <View>
                            <Text style={[styles.titleTxt,{color: isDarkTheme ? Colors.white : Colors.black}]}>{minibusGldani2title} </Text>
                            <Text style={[styles.detailTxt,{color: isDarkTheme ? Colors.white : Colors.black}]}>{minibusGldani2teaser}</Text>
                        </View>
                }
            </View>
            <View style={styles.row}>
                <View style={styles.width}>
                    <Image source={require('../../assets/images/metro.png')} />
                </View>
                {
                    routeId === 1 ?
                        <View>
                            <Text style={[styles.titleTxt,{color: isDarkTheme ? Colors.white : Colors.black}]}>{metroSaburtalo3title} </Text>
                            <Text style={[styles.detailTxt,{color: isDarkTheme ? Colors.white : Colors.black}]}>{metroSaburtalo3teaser}</Text>
                        </View>
                        :
                        <View>
                            <Text style={[styles.titleTxt,{color: isDarkTheme ? Colors.white : Colors.black}]}>{metroGldani2title} </Text>
                            <Text style={[styles.detailTxt,{color: isDarkTheme ? Colors.white : Colors.black}]}>{metroGldani2teaser}</Text>
                        </View>
                }
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        height: 55,
        alignItems: 'center',


    },
    titleTxt: {
        color: Colors.white,
        fontSize: 12,
        fontFamily: 'HMpangram-Bold',
        textTransform: 'uppercase',
        lineHeight: 20
    },
    detailTxt: {
        color: Colors.white,
        fontSize: 12,
        fontFamily: 'HM pangram',
    },
    width: {
        width: 60,
    }
});

export default HowCome;
