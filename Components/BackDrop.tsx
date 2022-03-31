import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { Colors } from '../Colors/Colors';
import Grid from '../Styles/grid';



interface IBackDrop {
    show: boolean,
    onHide: () => void
};


const BackDrop: React.FC<IBackDrop> = (props) => {
    return (
        props.show? <View style={styles.backDrop}></View> : null
    );
};

const styles = StyleSheet.create({
    backDrop: {
        backgroundColor: Colors.white,
        opacity: 0.3,
        height: '100%',
        position: 'absolute',
        elevation: 2,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0

    }
})

export default BackDrop;