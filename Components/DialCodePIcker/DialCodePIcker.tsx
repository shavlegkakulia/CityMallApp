import React, { useContext, useEffect, useRef, useState } from 'react';
import { Animated, FlatList, Image, Modal, SafeAreaView, ScrollView, ScrollViewComponent, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, VirtualizedList } from 'react-native';
import { AppContext } from '../../AppContext/AppContext';
import { Colors } from '../../Colors/Colors';
import { useDimension } from '../../Hooks/UseDimension';
import countryCodes from './CountryCodes';
import translateService from "../../Services/translateService";


export interface ICountryCodes {
    name: string,
    dial_code: string,
    code: string,
}


const DialCodePIcker = (props: any) => {
    const [isSelecting, setIsSelecting] = useState<boolean>(false);
    const [countryCode, setCountryCode] = useState<ICountryCodes[]>([]);
    const [selectedItem, setSelectedItem] = useState<ICountryCodes>();
    const [searchValue, setSearchValue] = useState<string>('');
    const { width, height } = useDimension();
    const { state, isDarkTheme } = useContext(AppContext);

    useEffect(() => {
        if (selectedItem) {
            props.onSelect(selectedItem.dial_code);
        };
    }, [selectedItem]);

    const styles = StyleSheet.create({
        background: {

            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 30,
            backgroundColor: 'red',
            elevation: 10,

        },

        centeredView: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        },

        selectBox: {

        },
        modalView: {
            backgroundColor: Colors.black,
            borderRadius: 10,
            borderColor: Colors.bgColor,
            borderWidth: 1,
            paddingVertical: 10,
            shadowColor: Colors.black,
            shadowOffset: {
                width: 0,
                height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
            width: '90%',
            maxWidth: 380
        },

        selectedItem: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 16,
            paddingBottom: 10,
            paddingHorizontal: 10,
            borderBottomColor: isDarkTheme ? Colors.white : Colors.black,
            borderBottomWidth: 1,
            color: isDarkTheme ? Colors.white : Colors.black,
            marginRight: 5
        },

        itemText: {
            color: isDarkTheme ? Colors.white : Colors.black
        }
    });


    useEffect(() => {
        setSelectedItem(countryCodes[0]);
        props.onSelect(countryCodes[0].dial_code)
    }, []);

    useEffect(() => {
        if (countryCode?.length <= 0) {
            setCountryCode(countryCodes)
        }
    }, [countryCode])


    const handleSearch = () => {
        let filteredCodes = countryCodes.filter(el => el.dial_code.match(searchValue) || el.name.toLowerCase().match(searchValue.toLowerCase()));
        if (searchValue === '') {
            setCountryCode(countryCodes)
        } else {
            setCountryCode(filteredCodes)
        }
    }

    const handleSelect = (item: ICountryCodes) => {
        setSelectedItem(item);
        setIsSelecting(false);
    };


    return (
        !isSelecting ?
            <TouchableOpacity
                style={styles.selectedItem}
                onPress={() => setIsSelecting(true)}>
                {selectedItem ?
                    <Text style={styles.itemText}>{selectedItem?.dial_code}</Text>
                    :
                    <Text style={styles.itemText}>{props.placeholder}</Text>
                }
                <Image source={require('./../../assets/images/arrow-down-sm.png')} style={{ width: 7, height: 7, marginLeft: 10 }} />
            </TouchableOpacity>
            :

            <TouchableOpacity style={styles.centeredView} onPress={() => setIsSelecting(false)}>
                <Modal
                    animationType="fade"
                    transparent={true}
                    onRequestClose={() => {
                        setIsSelecting(!isSelecting)
                    }}
                    visible={isSelecting}>

                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <ScrollView style={{ maxHeight: height - 300 }} contentContainerStyle={{ flexGrow: 1 }} pointerEvents='box-none'>
                                <View style={{ position: 'relative' }}>
                                    <Image source={require('./../../assets/images/loupe.png')} style={{ width: 20, height: 20, position: 'absolute', right: 10, top: 8 }} />
                                    <TextInput
                                        placeholder={state?.t('common.search')}
                                        placeholderTextColor={isDarkTheme ? Colors.white : Colors.black}
                                        style={styles.selectedItem} value={searchValue}
                                        onChangeText={(value: string) => setSearchValue(value)}
                                        onChange={handleSearch} />
                                </View>

                                {countryCode.map((item: any) => (
                                    <TouchableOpacity
                                        style={styles.selectedItem}
                                        key={item.code}
                                        onPress={() => handleSelect(item)}>
                                        <Text style={styles.itemText}>{item.dial_code} {item.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
            </TouchableOpacity>
    );
};



export default DialCodePIcker;
