import React from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AppNavigator from '../Navigation/AppNavigator';
import Grid from '../Styles/grid';
import AppHeader from './AppHeader';


const AppLayout = (props: any) => (

        <AppNavigator >
            <>
                <AppHeader pageTitle = {props.pageTitle}/>
                <ScrollView style={Grid.col_11} contentContainerStyle={{flex:1}} >
                    <View style={{flex: 1}}>
                        {props.children}
                    </View>
                </ScrollView>
            </>
        </AppNavigator>
)

export default AppLayout;