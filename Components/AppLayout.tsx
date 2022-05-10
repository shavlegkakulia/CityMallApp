import React, { useContext } from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { AppContext } from '../AppContext/AppContext';
import { Colors } from '../Colors/Colors';
import AppNavigator from '../Navigation/AppNavigator';
import Grid from '../Styles/grid';
import AppHeader from './AppHeader';


const AppLayout = (props: any) => {
    const { state, setGlobalState } = useContext(AppContext);
    const { isDarkTheme } = state;
       return <AppNavigator >
            <>
                <AppHeader pageTitle = {props.pageTitle}/>
                <ScrollView style={[Grid.col_11, {backgroundColor: isDarkTheme ? Colors.black : Colors.white }]} contentContainerStyle={{flex:1}} >
                    <View style={{flex: 1}}>
                        {props.children}
                    </View>
                </ScrollView>
            </>
        </AppNavigator>
}

export default AppLayout;