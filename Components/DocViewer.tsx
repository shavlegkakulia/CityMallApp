import {RouteProp, useRoute} from '@react-navigation/native';
import React, {useContext} from 'react';
import {StyleSheet, Dimensions, View} from 'react-native';
import Pdf from 'react-native-pdf';
import {AppContext} from '../AppContext/AppContext';
import {GoBack} from '../Services/NavigationServices';
import Layout from './Layouts/Layout';

type RouteParamList = {
  params: {
    docUrl: string;
  };
};

const DocView = () => {
  const {state} = useContext(AppContext);
  const routeParams = useRoute<RouteProp<RouteParamList, 'params'>>();
  const source = {
    uri: routeParams.params.docUrl,
    cache: true,
  };

  return (
    <Layout
      pageName={state.t('common.cityMall')}
      hasBackArrow={true}
      onPressBack={GoBack}>
      <View style={styles.container}>
        <Pdf
          source={source}
          onLoadComplete={(numberOfPages, filePath) => {
          }}
          onPageChanged={(page, numberOfPages) => {
          }}
          onError={error => {
          }}
          onPressLink={uri => {
          }}
          style={styles.pdf}
        />
      </View>
    </Layout>
  );
};

export default DocView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    // height: Dimensions.get('window').height,
  },
});
