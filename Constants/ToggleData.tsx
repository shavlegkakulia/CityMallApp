import React from 'react';
import { Text, View } from 'react-native';
import LocationDropdown from '../Components/ToggleDropdown/LocationDropdown';
import MapToggleInfo from '../Components/ToggleDropdown/MapToggleInfo';


export interface ToggleList{
    id: number,
    name: string,
    icon: string,
    content: JSX.Element,
    routeName?: string
}

export default [
    {
        id: 1,
        name: 'common.location',
        iconLight:  require('../assets/images/arrow-sm.png'),
        iconDark: require('../assets/images/arrow-black.png'),
        content: LocationDropdown,
        // routeName: 'GoogleMap'
    },
    {
        id: 2,
        name: 'common.map',
        icon:  require('../assets/images/arrow-sm.png'),
        iconLight:  require('../assets/images/arrow-sm.png'),
        iconDark: require('../assets/images/arrow-black.png'),
        content: MapToggleInfo
       
      
    }
]