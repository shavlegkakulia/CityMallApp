import React, { useState, useEffect, useContext } from 'react';
import { Text, StyleSheet, View, Modal, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Colors } from '../Colors/Colors';
import { AppContext } from '../AppContext/AppContext';
import translateService from '../Services/translateService';


const DistrictPicker = (props: any) => {
    const { state } = useContext(AppContext);
    const { isDarkTheme } = state;

    const [selectedValue, setSelectedValue] = useState<string>('');
    const [isSelecting, setIsSelecting] = useState<boolean>(false);

    useEffect(() => {
        props.onSelect(selectedValue);
    }, [selectedValue]);

    return (
        <>
            {isSelecting ?
                <TouchableOpacity style={styles.centeredView} onPress={() => setIsSelecting(isSelecting)}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        onRequestClose={() => {
                            setIsSelecting(!isSelecting)
                        }}
                        visible={isSelecting}>
                        <View style={styles.centeredView}>
                            <View style={[styles.modalView,{ backgroundColor: isDarkTheme? Colors.black : Colors.white}]}>
                                <View style={styles.modalBar}>
                                    <Text style={[styles.infoText, {color: isDarkTheme ? Colors.white : Colors.black}]}>{state?.t('screens.selectDistric')}</Text>
                                </View>
                                <Picker
                                    itemStyle={[styles.textStyles, {color: isDarkTheme ? Colors.white : Colors.black}]}
                                    selectedValue={selectedValue}
                                    onValueChange={(itemValue, itemIndex) =>
                                        setSelectedValue(itemValue)}
                                >
                                    <Picker.Item label='' value='' />
                                    {props.data?.map((item: any, index: number) => (
                                        <Picker.Item
                                            key={item.id}
                                            label={item.name.trim()} value={item.name.trim()} />

                                    ))}
                                </Picker>
                                <TouchableOpacity style={[styles.modalBar, { paddingBottom: 20 }]} onPress={() => setIsSelecting(false)}>
                                    <Text style={[styles.infoText, { textAlign: 'right', color: Colors.red }]}>{state?.t('common.select')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </TouchableOpacity>
                :
                null}
            <TouchableOpacity
                style={[styles.selectedItem, {borderBottomColor: isDarkTheme ? Colors.white : Colors.black, }]}
                onPress={() => setIsSelecting(true)}>
                {selectedValue ?
                    <Text style={[styles.itemText, {color: isDarkTheme ? Colors.white : Colors.black}]}>{selectedValue.trim()}</Text>
                    :
              
                        <Text style={[styles.itemText, { color: isDarkTheme ? Colors.white : Colors.black}]}>{props.placeholder}</Text>
    
                    
                }
            </TouchableOpacity>
        </>
    );
};

export default DistrictPicker;

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    textStyles: {
        fontSize: 20,
        fontFamily: 'HMpangram-Medium',
        paddingRight: 20
    },

    modalView: {
        borderRadius: 10,
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '100%',
        
    },

    selectedItem: {
        paddingTop: 33,
        paddingBottom: 10,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        marginRight: 5,
    
    },

    itemText: {
    
    },

    infoText: {
        fontSize: 16,
        fontFamily: 'HMpangram-Medium',
        
    },
    modalBar: {
        paddingVertical: 10,
        marginHorizontal: 15,
    }
});

