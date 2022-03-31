import React, { useEffect, useState, useRef } from 'react'
import {Animated, StyleSheet, TouchableOpacity} from 'react-native';
import {  } from 'react-native-gesture-handler';
import { Colors } from '../../Colors/Colors';

export interface IAppSwitch {
    onPress: (status: boolean) => void;
    pressable: boolean;
}

const AppSwitch: React.FC<IAppSwitch> = (props) => {
    const animatedBall = useRef(new Animated.Value(0));
    const [isActive, setIsActive] = useState<boolean>(false);
    const isInit = useRef<boolean>(false);

    useEffect(() => {
        if(isActive) {
            Animated.timing(animatedBall.current, {
                toValue: 1,
                duration: 500,
                useNativeDriver: false
            }).start();
            
        } else {
            Animated.timing(animatedBall.current, {
                toValue: 0,
                duration: 500,
                useNativeDriver: false
            }).start();
        }
    }, [isActive])

    const activeBallStyle = {
        left: animatedBall.current.interpolate({
            inputRange: [0, 1],
            outputRange: [3, 26],
        })
    }

    const toggleSwitchBall = () => {
        if(!props.pressable) return;
        setIsActive(!isActive);
    }

    useEffect(() => {
        if(isInit.current) {
            props.onPress(isActive);
        }
        isInit.current = true;
    }, [isActive]);

    return (
        <TouchableOpacity style={styles.switchView} onPress={toggleSwitchBall}>
            <Animated.View style={[styles.switchBall, activeBallStyle  ]}/>
        </TouchableOpacity>
    )
}
export default  AppSwitch;

const styles = StyleSheet.create({
    switchView: {
        width: 49, 
        height: 24 , 
        borderWidth: 1, 
        borderColor: Colors.white, 
        borderRadius: 15,
        paddingVertical: 3,
        marginHorizontal: 10,
        backgroundColor: '#28AD25'
    },
    switchBall : {
        position: 'relative',
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: Colors.white
    }
})
