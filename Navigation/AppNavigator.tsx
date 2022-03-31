import React from 'react';
import {View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BurgerMenu from '../Components/BurgerMenu/BurgerMenu';
import OrderGiftCardScreen from '../Screens/OrderGiftCardScreen';
import HomeScreen from '../Screens/HomeScreen';



const Drawer = createDrawerNavigator();


const AppNavigator: React.FC = (props) => {
    return (
        <Drawer.Navigator
            drawerContent={()  => (
                <BurgerMenu   />
            )}
        >
            <Drawer.Screen name="HomeScreen2" children={() => (
                <View>{props.children}</View>
            )} options={{ headerShown: false }} />
            {/* <Drawer.Screen name="OrderGiftCardScreen" component = {OrderGiftCardScreen}
             options={{ headerShown: false }} /> */}
        </Drawer.Navigator>
    );
};

export default AppNavigator;