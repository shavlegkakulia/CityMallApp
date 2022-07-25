import React, { useState, useContext, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { AppContext } from '../AppContext/AppContext';
import { Colors } from '../Colors/Colors';
import translateService from '../Services/translateService';
import Clipboard from '@react-native-community/clipboard';
import TemporaryText from './TemporaryText';

interface IBankDetails {
    id: number,
    bankName: {
        ka: string,
        en: string,
    },
    GEL: string,
    USD: string,
    EUR: string,
    bankCode: string
}

interface ITopUpDetailsProps {
    accountNumber: string
}


const TopUpDetails: any = [
    {
        id: 1,
        bankName: {
            ka: 'ს.ს "საქართველოს ბანკი"',
            en: 'JSC "Bank Of Georgia"'
        },
        GEL: 'GE74BG0000000162455757',
        USD: 'GE74BG0000000162455757',
        EUR: 'GE74BG0000000162455757',
        bankCode: 'BAGAGE22'
    },
    {
        id: 2,
        bankName: {
            ka: 'ს.ს "თიბისი ბანკი"',
            en: 'JSC "TBC Bank"'
        },
        GEL: 'GE13TB7251636090000001',
        USD: 'GE57TB7251636190000001',
        EUR: 'GE57TB7251636190000001',
        bankCode: 'TBCBGE22'
    },
    {
        id: 3,
        bankName: {
            ka: 'ს.ს "ლიბერთი ბანკი"',
            en: 'JSC "Liberty Bank"' 
        },
        GEL: 'GE70LB0113162834673006',
        USD: 'GE43LB0113162834673007',
        EUR: 'GE86LB0113162834673009',
        bankCode: 'LBRTGE22'
    },
]

const TopUpCityCard: React.FC<ITopUpDetailsProps> = ({ accountNumber }) => {
    const { state } = useContext(AppContext);
    const { isDarkTheme } = state;
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [copiedText, setCopiedText] = useState<string | undefined>();
    const copiedTextTtl = useRef<NodeJS.Timeout>();
    let selectedBank = TopUpDetails[activeIndex];

    const handleSelectBank = (index: number) => {
        setActiveIndex(index)
    };
    const copyToClipboard = (str: string) => {
        Clipboard.setString(str);
        setCopiedText(str);
        copiedTextTtl.current = setTimeout(() => {
            setCopiedText(undefined);
        }, 1000);
    };

    const BorderColor = {
        borderColor: isDarkTheme ? Colors.white : Colors.black
    };
    const TextColor = {
        color: isDarkTheme ? Colors.white : Colors.black
    }
    let imagePath;
    if (isDarkTheme && translateService.lang == 'en') {
        imagePath = require('./../assets/images/LB-light-en.png');
    } else if (!isDarkTheme && translateService.lang == 'en') {
        imagePath = require('./../assets/images/LB-dark-en.png');
    } else if (isDarkTheme && translateService.lang == 'ka') {
        imagePath = require('./../assets/images/LB-light-ka.png');
    } else if (!isDarkTheme && translateService.lang == 'ka') {
        imagePath = require('./../assets/images/LB-dark-ka.png');
    }



    console.log(translateService.lang)

    return (
        <View style={styles.contentWrapper}>
            <View style={styles.bankWrapper}>
                <TouchableOpacity
                    style={[styles.bankBtn, activeIndex == 0 ? { borderColor: Colors.yellow } : BorderColor]}
                    onPress={() => handleSelectBank(0)}>
                    <Image
                        style={styles.bankLogo}
                        source={require('./../assets/images/BOG-logo.png')}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.bankBtn, activeIndex == 1 ? { borderColor: Colors.blue } : BorderColor]}
                    onPress={() => handleSelectBank(1)}>
                    <Image
                        style={styles.bankLogo}
                        source={require('./../assets/images/TBC-logo.png')}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.bankBtn, activeIndex == 2 ? { borderColor: Colors.red } : BorderColor]}
                    onPress={() => handleSelectBank(2)}>
                    <Image
                        style={styles.bankLogo}
                        source={imagePath}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.bankDetailsWrapper}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
                    <Text style={[styles.detailesTextStyle, TextColor]}>
                        მიმღები ბანკი:
                    </Text>
                    <Text style={[styles.detailesTextStyle, TextColor, { fontWeight: 'bold' }]}>
                        {selectedBank.bankName[translateService.lang]}
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={[styles.detailesTextStyle, TextColor]}>
                        მიმღების ანგარიში:
                    </Text>
                    <TouchableOpacity
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                        onPress={() => copyToClipboard(selectedBank.GEL)}>
                        <Text style={[styles.detailesTextStyle, TextColor, { fontWeight: 'bold' }]}>
                            {selectedBank.GEL}
                        </Text>
                        <Image
                            source={require('./../assets/images/textCopyIcon.png')}
                            style={styles.copyImage}
                        />

                    </TouchableOpacity>
                </View>
                <TemporaryText
                    text={state?.t('common.copied')}
                    show={selectedBank.GEL === copiedText}
                    textPosition='right'
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={[styles.detailesTextStyle, TextColor]}>

                        მიმღების სახელი
                    </Text>
                    <Text style={[styles.detailesTextStyle, TextColor, { fontWeight: 'bold' }]}>
                        შპს 'ფეი უნიდარდი'
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={[styles.detailesTextStyle, TextColor]}>
                        დანიშნულება
                    </Text>
                    <TouchableOpacity
                        onPress={() => copyToClipboard(accountNumber)}
                        style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={[styles.detailesTextStyle, TextColor, { fontWeight: 'bold' }]}>
                            {accountNumber}
                        </Text>
                        <Image
                            source={require('./../assets/images/textCopyIcon.png')}
                            style={styles.copyImage}
                        />

                    </TouchableOpacity>

                </View>
                <TemporaryText
                    text={state?.t('common.copied')}
                    show={accountNumber === copiedText}
                    textPosition='right'
                />
            </View>
        </View>
    );
};

export default TopUpCityCard;

const styles = StyleSheet.create({
    contentWrapper: {
        marginBottom: 30
    },


    bankWrapper: {
        flexDirection: 'row',
        marginBottom: 15
    },
    bankBtn: {
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        marginHorizontal: 5,
    },
    bankLogo: {
        width: 40,
        height: 40
    },
    bankDetailsWrapper: {

    },
    detailesTextStyle: {
        fontSize: 13,
        fontFamily: 'HMpangram-Medium',
        lineHeight: 20
    },
    copyImage: {
        width: 12,
        height: 12,
        marginLeft: 5
    },
})