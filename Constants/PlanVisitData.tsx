import React from 'react';
import HowCome from '../Components/PlanVisit/HowCome';
import WorkingHours from "../Components/PlanVisit/WorkingHours";

export interface RoadMap{
    id: number,
    name: string,
    lightIcon: string,
    darkIcon: string,
    content: JSX.Element
    routeName?: string
}

export default [
    {
        id: 1,
        name: 'screens.cityMap',
        lightIcon:  require('../assets/images/bigArrow.png'),
        darkIcon:  require('../assets/images/big-black-arrow.png'),
        content: <></>,
        routeName: 'GoogleMap'
    },
    {
        id: 2,
        name: 'screens.floorPlan',
        lightIcon:  require('../assets/images/bigArrow.png'),
        darkIcon:  require('../assets/images/big-black-arrow.png'),
        content: <></>,
        routeName: 'FloorMap'
    },
    {
        id: 3,
        name: 'screens.workAndContact',
        lightIcon:  require('../assets/images/bigArrow.png'),
        darkIcon:  require('../assets/images/big-black-arrow.png'),
        content: WorkingHours
       
    },
    {
        id: 4,
        name: 'screens.howCome',
        lightIcon:  require('../assets/images/bigArrow.png'),
        darkIcon:  require('../assets/images/big-black-arrow.png'),
        content: HowCome

      
        
    },
]

