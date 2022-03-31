import React, {useContext, useEffect} from 'react';
import {AppContext} from '../AppContext/AppContext';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from '../Services/NavigationServices';
import HomeScreen from '../Screens/HomeScreen';
import AuthScreen from '../Screens/AuthScreen';
import UserCardWithBarcode from '../Screens/UserCardWithBarcode';
import ShopDetailsScreen from '../Screens/ShopDetailsScreen';
import OrderGiftCardScreen from '../Screens/OrderGiftCardScreen';
import StatusInfoScreen from '../Screens/ProfileScreen/StatusInfoScreen';
import {useState} from 'react';
import {ScreenOne, ScreenTwo, ScreenThree} from '../Screens/Registration/index';
import AuthService from '../Services/AuthService';
import {Platform, Text, View} from 'react-native';
import ProfileScreen from '../Screens/ProfileScreen/ProfileScreen';
import OffersScreen from '../Screens/OffersScreen/OffersScreen';
import SingleOfferScreen from '../Screens/OffersScreen/SingleOfferScreen';
import VouchersInfo from '../Components/Vouchers/VouchersInfo';
import BuyVouchers from '../Components/Vouchers/BuyVouchers';
import Stores from '../Screens/Stores/Stores';
import SelectedVouchers from '../Components/Vouchers/SelectedVouchers';
import VouchersDone from '../Components/Vouchers/VouchersDone';
import Parameters from '../Components/Parameters/Parameters';
import ProfileInfo from '../Components/Parameters/ProfileInfo';
import EmailChanged from '../Components/Parameters/EmailChanged';
import ContactUs from '../Screens/ShopGuid/ContactUs';
import PlanVisit from '../Screens/ShopGuid/PlanVisit';
import AboutUsIndex from '../Screens/AboutUs/Index';
import ShopGuid from '../Screens/ShopGuid/ShopGuid';
import FloorMap from '../Components/FloorMap';
import ShopDetailBox from '../Components/ShopDetailBox';
import GoogleMap from '../Components/GoogleMap';
import Searches from '../Screens/Stores/Searches';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import DocView from '../Components/DocViewer';
import CheckGiftCardBalanceScreen from '../Screens/CheckGiftCardBalanceScreen';

interface IProps {
  init: boolean;
}

const Stack = createStackNavigator();

const AppStack: React.FC<IProps> = ({init}) => {
  const {state, setGlobalState} = useContext(AppContext);
  const {isAuthenticated} = state;

  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    AuthService.isAuthenticated()
      .then(data => {
        if (data) {
          setGlobalState({isAuthenticated: true});
        } else {
          setGlobalState({isAuthenticated: false});
        }
      })
      .finally(() => {
        setIsInitialized(true);
      });
  }, []);

  if (!isInitialized) return <Text>Loading ...</Text>;

  //if(!init) return <View style={{backgroundColor: Colors.black, flex: 1}} />

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="AuthScreen">
        {isAuthenticated === false ? (
          <>
            <Stack.Screen
              name="AuthScreen"
              component={AuthScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="DocView"
              component={DocView}
              options={{
                headerShown: false,
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="HomeScreen"
              component={HomeScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="HomeScreen2"
              component={HomeScreen}
              options={{
                headerShown: false,
              }}
            />
             <Stack.Screen
              name="AuthScreenWithSkip"
              component={AuthScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="REGSTEP_ONE"
              component={ScreenOne}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="REGSTEP_TWO"
              component={ScreenTwo}
              options={{
                animationEnabled: false,
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="REGSTEP_THREE"
              component={ScreenThree}
              options={{
                animationEnabled: false,
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="UserCardWithBarcode"
              component={UserCardWithBarcode}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="ShopDetailsScreen"
              component={ShopDetailsScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="OrderGiftCardScreen"
              component={OrderGiftCardScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
            name='CheckGiftCardBalanceScreen'
            component={CheckGiftCardBalanceScreen}
            options={{
              headerShown: false,
            }} />
            <Stack.Screen
              name="ProfileScreen"
              component={ProfileScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="StatusInfoScreen"
              component={StatusInfoScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="OffersScreen"
              component={OffersScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="SingleOfferScreen"
              component={SingleOfferScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Stores"
              component={Stores}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Fun"
              component={Stores}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Feed"
              component={Stores}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="TServices"
              component={Stores}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="VouchersInfo"
              component={VouchersInfo}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="BuyVouchers"
              component={BuyVouchers}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="SelectedVouchers"
              component={SelectedVouchers}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="VouchersDone"
              component={VouchersDone}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="Parameters"
              component={Parameters}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="ProfileInfo"
              component={ProfileInfo}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="EmailChanged"
              component={EmailChanged}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="AboutUs"
              component={AboutUsIndex}
              options={{
                headerShown: false,
              }}
            />
            {/* <Stack.Screen
                    name='Loiality'
                    component={Loiality}
                    options={{
                        headerShown: false,
                    }}
                /> */}
            {/* <Stack.Screen
                    name='ContactUs'
                    component={ContactUs}
                    options={{
                        headerShown: false,
                    }}
                /> */}
            <Stack.Screen
              name="ShopGuid"
              component={ShopGuid}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="FloorMap"
              component={FloorMap}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="GoogleMap"
              component={GoogleMap}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Searches"
              component={Searches}
              options={{
                headerShown: false,
                animationEnabled: Platform.OS === 'android'? false : true
              }}
            />
            <Stack.Screen
              name="DocView"
              component={DocView}
              options={{
                headerShown: false,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppStack;
