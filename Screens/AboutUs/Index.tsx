import React, { useContext, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import AboutUs from './AboutUs';
import Loyalty from './Loyalty';
import axios from 'axios';
import envs from './../../config/env';
import { AppContext } from '../../AppContext/AppContext';
import translateService from '../../Services/translateService';


type RouteParamList = {
  params: {
    id: number,
    routeId: number,
    userPhoneNumber?: string;
    skip?: boolean;
  }
}

const AboutUsIndex = () => {
  const { state } = useContext(AppContext);
  const routeParams = useRoute<RouteProp<RouteParamList, 'params'>>();
  const [strings, setStrings] = useState<any>();
  const [pageLoader, setPageLoader] = useState<boolean>(false);

  const getPageTexts = () => {
    setPageLoader(true);
    try {
      axios.get(`${envs.API_URL}/api/Mobile/GetGeneralTxt`).then(res => {
        setStrings(res.data);
        setPageLoader(false);
      });
    } catch (error: any) {
      setPageLoader(false)
      console.log(error.response)
    }
  }


  useEffect(() => {
    getPageTexts();
  }, [translateService.lang]);

  return (
    routeParams.params.routeId === 1 ?
      <AboutUs strings={strings} />
      :
      <Loyalty strings={strings} userPhoneNumber={routeParams?.params?.userPhoneNumber} skip={routeParams?.params?.skip} pageLoading={pageLoader} />

  );
}

export default AboutUsIndex;
