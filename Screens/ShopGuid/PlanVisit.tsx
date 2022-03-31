import React, {useContext, useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {AppContext} from '../../AppContext/AppContext';
import {Colors} from '../../Colors/Colors';
import {useDimension} from '../../Hooks/UseDimension';
import {GoBack, navigate} from '../../Services/NavigationServices';
import Layout from '../../Components/Layouts/Layout';
import PlanVisitLayout from '../../Components/CustomComponents/PlanVisitLayout';
import data from '../../Constants/PlanVisitData';
import ApiServices from '../../Services/ApiServices';
import { RouteProp, useRoute } from '@react-navigation/native';
import translateService from '../../Services/translateService';


type RouteParamList = {
  params: {
    id: number,
    routeId: number
}
};

const PlanVisit = () => {
  const {width} = useDimension();
  const {state} = useContext(AppContext);

  
  const {isDarkTheme} = state;

  const route = useRoute<RouteProp<RouteParamList, 'params'>>();


  const [contentData, setContentData] = useState<any>([]);
useEffect(() => {
  getWidgets();
}, [state.lang])
  const getWidgets = () => {
    ApiServices.GetWidgets().then(res => {
      setContentData(res.data)
    }).catch(e => {
      console.log(JSON.parse(JSON.stringify(e.response)))
    })
  }

  return (
    <Layout hasBackArrow pageName={state?.t('screens.planVisit')} onPressBack={GoBack}>
      <View
        style={{
          flexGrow: 1,
          backgroundColor: isDarkTheme ? Colors.black : Colors.white,
          paddingHorizontal: '7%',
        }}>
          {data.map((el: any, i: React.Key) => (
            <PlanVisitLayout key={i} title={el.name} icon={isDarkTheme? el.lightIcon : el.darkIcon} Content={el.content} routeName={el.routeName} contentData = {contentData} routeId = {route.params.routeId} />
          ))}
        
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: Colors.white,
  },
});

export default PlanVisit;
