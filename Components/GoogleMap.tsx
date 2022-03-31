import React, {useContext} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import AppLayout from './AppLayout';
import {AppContext} from '../AppContext/AppContext';
import {Colors} from '../Colors/Colors';
import { RouteProp, useRoute } from '@react-navigation/native';
import translateService from '../Services/translateService';
import { GoBack } from '../Services/NavigationServices';
import Layout from './Layouts/Layout';


type RouteParamList = {
  params: {
    mallId: number;
  };
};

const coordinates: any = {
    '1': {
      latitude: 41.723971393990055,
      longitude: 44.73773667814966,
    },
    '2': {
      latitude: 41.79036874377467,
      longitude: 44.81475656342277,
    }, 
  }


export default () => {
  const {state} = useContext(AppContext);
  const {isDarkTheme} = state;
  const route = useRoute<RouteProp<RouteParamList, 'params'>>();

  return (
    <Layout pageName={state?.t('screens.cityMap')} onPressBack={GoBack} hasBackArrow>
    
      <View
        style={[
          styles.mapcontainer,
          {backgroundColor: isDarkTheme ? Colors.black : Colors.white},
        ]}>
        <MapView
          //provider={PROVIDER_GOOGLE} // 41.723971393990055, 44.73773667814966
          style={styles.map}
          region={{
            latitude: coordinates[route.params.mallId].latitude,
            longitude: coordinates[route.params.mallId].longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
          //  showsIndoorLevelPicker={true}
          //  showsIndoors={true}
          showsMyLocationButton={true}
          //  showsBuildings={true}
          showsCompass={true}
          showsUserLocation={true}
          //  showsScale={true}
          //  showsPointsOfInterest={true}
          // toolbarEnabled={true}
          followsUserLocation={Platform.OS === 'android'}
          zoomControlEnabled={true}
          zoomEnabled={true}
          // pitchEnabled={true}

          rotateEnabled={true}>
              <Marker
            coordinate={{
              latitude: coordinates[1].latitude,
              longitude: coordinates[1].longitude,
            }}
          />
                 <Marker
            coordinate={{
              latitude: coordinates[2].latitude,
              longitude: coordinates[2].longitude,
            }}
          />
        
               
        </MapView>
      </View>
      </Layout>
  );
};

const styles = StyleSheet.create({
  mapcontainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
