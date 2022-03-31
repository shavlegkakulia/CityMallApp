import React, { useState, useEffect, useContext } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Picker, PickerIOS } from '@react-native-picker/picker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import translateService from "../../Services/translateService";
import { AppContext } from '../../AppContext/AppContext';

const AppPicker = (props: any) => {
    const { state } = useContext(AppContext);
    const [selectedValue, setSelectedValue] = useState<string>('');
    const [isSelecting, setIsSelecting] = useState<boolean>(false);

  
    const haldeClosePicker = () => {
        if(isSelecting &&selectedValue == '') {
            return
        } else {
            setIsSelecting(false)
        }
    }
    return (

        isSelecting ?
            <TouchableOpacity activeOpacity={1} style={{backgroundColor: 'blueviuolet', width: '100%', height: '100%', justifyContent: 'center'}} onPress={() => {setIsSelecting(!isSelecting) }}>
                
                <View style={styles.card}>
                    <TouchableOpacity onPress={haldeClosePicker} style={{width: '100%'}}>
                        <Text style={[styles.textStyles, {textAlign: 'right'}]}>{state?.t('common.select')}</Text>
                    </TouchableOpacity>
                <Picker
                    style={styles.pickerStyle}
                    itemStyle={styles.textStyles}
                    selectedValue={selectedValue}
                    onValueChange={(itemValue, itemIndex) =>
                        setSelectedValue(itemValue)}
                >
                    <Picker.Item label = '' value = '' />
                    
                    {props.data?.map((item: any, index: number) => (
                            <Picker.Item
                                key={item.name}
                                 label={item.name} value={item.name} />

                    ))}

                </Picker>
                </View>
            </TouchableOpacity>
            :
            <TouchableOpacity style={{ borderWidth: 1, borderColor: '#FFFFFF', height: 40, width: '100%' }} onPress={() => setIsSelecting(!isSelecting)}>
                <Text>
                    {selectedValue? selectedValue : props.placeholder }
                </Text>

            </TouchableOpacity>

    )
}

export default AppPicker;

const styles = StyleSheet.create({
    card:{
        borderRadius: 10,
        marginTop: 10,
        backgroundColor: 'black',
        position: 'relative',
        paddingVertical: 20
      },
    
    pickerStyle: {
    },
    choseButton: {

    },

    textStyles: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'HMpangram-Medium',
        
        paddingRight: 20
    }
})
