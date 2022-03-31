import React from 'react'
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface IloaderStyle {
    size: any ,
    color: string
}


export interface IAppBtnProps {
    onPress: () => void,
    title: string,
    loading?: boolean,
    btnStyle: any,
    titleStyle?: any,
    loaderStyle?: IloaderStyle,
}



const AppButton: React.FC<IAppBtnProps> = (props) => {


    const { onPress, title, loading, btnStyle, titleStyle, loaderStyle } = props;
    //const styles = StyleSheet.create({});
    return (
        <TouchableOpacity
            style={btnStyle}
            onPress={onPress}>
            {loading?
             <ActivityIndicator size ={loaderStyle?.size} color= {loaderStyle?.color} />
             :
            <Text
                style={titleStyle}>
                {title}
            </Text>}
        </TouchableOpacity>
    )
}
export default AppButton;


