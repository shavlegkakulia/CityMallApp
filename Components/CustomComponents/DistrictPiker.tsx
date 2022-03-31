import React, {
    useContext,
    useEffect,
    useRef,
    useState
} from 'react';
import {
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { AppContext } from '../../AppContext/AppContext';
import { Colors } from '../../Colors/Colors';
import translateService from "../../Services/translateService";

export interface IDistrict {
    id: number,
    name: string
}


const DistrictPiker = (props: any) => {

    const { state } = useContext(AppContext);
    const { isDarkTheme } = state;

    const [selectedValue, setSelectedValue] = useState<string>('');
    const [isSelecting, setIsSelecting] = useState<boolean>(false);

    useEffect(() => {
        if (selectedValue !== '') {
            props.onSelect(selectedValue);
            setIsSelecting(false);
        }
    }, [selectedValue]);

    const picker = useRef<any>();

    useEffect(() => {
        if (isSelecting) {
            picker.current?.focus()
        }
    }, [isSelecting])

    const styles = StyleSheet.create({
        centeredView: {
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "center",
        },

        pickerStyle: {
        },
        choseButton: {

        },

        textStyles: {
            color: isDarkTheme? 'white' : 'black',
            fontSize: 20,
            fontFamily: 'HMpangram-Medium',

            paddingRight: 20
        },
        modalView: {
            backgroundColor: isDarkTheme? 'black' : 'white',
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
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 16,
            paddingHorizontal: 10,
            borderBottomColor: isDarkTheme ? Colors.white : Colors.black,
            borderBottomWidth: 1,
            color: isDarkTheme ? Colors.white : Colors.black,
            marginRight: 5
        },

        itemText: {
            color: isDarkTheme ? Colors.white : Colors.black
        },

        infoText: {
            fontSize: 20,
            fontFamily: 'HMpangram-Medium',
            color: isDarkTheme ? Colors.white : Colors.black
        },
        modalBar: {
            paddingVertical: 10,
            marginHorizontal: 15,
        }
    })
    return (
        <>
                    <TouchableOpacity
                style={[styles.selectedItem]}
                onPress={() => setIsSelecting(true)}>
                {
                    selectedValue ?
                        <Text style={[styles.itemText]}>{selectedValue}</Text>
                        :
                        <Text style={[styles.itemText]}>{props.placeholder}</Text>
                }
            </TouchableOpacity>
            {
                (isSelecting && Platform.OS === 'ios') ?
                    <TouchableOpacity style={styles.centeredView} onPress={() => setIsSelecting(false)}>
                        <Modal
                            animationType="fade"
                            transparent={true}
                            onRequestClose={() => {
                                setIsSelecting(!isSelecting)
                            }}
                            visible={isSelecting}>
                            <View style={styles.centeredView}>
                                <View style={[styles.modalView]}>
                                    <View style={styles.modalBar}>
                                        <Text style={styles.infoText}>{props.placeholder || state?.t('screens.selectCountry')}</Text>
                                    </View>
                                    <Picker
                                        style={styles.pickerStyle}
                                        itemStyle={[styles.textStyles]}
                                        selectedValue={selectedValue}
                                        onValueChange={(itemValue, itemIndex) =>
                                            setSelectedValue(itemValue)}
                                    >
                                        {props.districts.map((item: any, index: number) => (
                                            <Picker.Item
                                                key={item.name}
                                                label={item.name} value={item.name} />

                                        ))}
                                    </Picker>
                                    <TouchableOpacity style={[styles.modalBar, { paddingBottom: 20 }]} onPress={() => setIsSelecting(false)}>
                                        <Text style={[styles.infoText, { textAlign: 'right', color: Colors.red }]}>{state?.t('common.select')}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    </TouchableOpacity>
                    : (isSelecting && Platform.OS === 'android') ?
                        <Picker ref={picker}
                            style={styles.pickerStyle}
                            itemStyle={styles.textStyles}
                            selectedValue={selectedValue}
                            onValueChange={(itemValue, itemIndex) =>
                                setSelectedValue(itemValue)}
                        >
                            {props.districts.map((item: any, index: number) => (
                                <Picker.Item
                                    key={item.name}
                                    label={item.name} value={item.name} />

                            ))}
                        </Picker>
                        :
                        null
            }

        </>
    );
};

export default DistrictPiker;

