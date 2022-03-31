import React, {useEffect} from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import ContactUs from './ContactUs';
import PlanVisit from './PlanVisit';

type RouteParamList = {
    params: {
        id: number,
        routeId: number
    }
}

 const ShopGuid = () => {
    const routeParams = useRoute<RouteProp<RouteParamList, 'params'>>();
    
    useEffect(() => {

    }, [routeParams.params.id])

  return (
    routeParams.params.id === 1?
      
      <PlanVisit/>
      :
      <ContactUs/>
  );
}

export default ShopGuid;
