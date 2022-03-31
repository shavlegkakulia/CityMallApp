import React, {
  useContext,
  useEffect,
  useState
} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { AppContext } from '../AppContext/AppContext';
import { Colors } from '../Colors/Colors';
import { useDimension } from '../Hooks/UseDimension';
import { GoBack } from '../Services/NavigationServices';
import MapComponent from '../Components/FloorMap/Map';
import axios from 'axios';
import envs from './../config/env';
import { RouteProp, useRoute } from '@react-navigation/native';
import translateService from '../Services/translateService';
type RouteParamList = {
  params: {
    mallId: number;
  };
};
const ShopDetailsScreen = () => {
  const route = useRoute<RouteProp<RouteParamList, 'params'>>();
  const { width, height } = useDimension();
  const { state } = useContext(AppContext);
  const { isDarkTheme, singleMerchant } = state;

  const [singleLocalMerchant, setSingleLocalMerchant] =
    useState<any>(singleMerchant);
  const [floorData, setFloorData] = useState<any>();
  const [floors, setFloors] = useState<Array<any>>([]);
  const [floorsDetails, setFloorsDetails] = useState<Array<any>>([]);

  const [isLoading, setIsLoading] = useState(false);
  const textColorStyle = {
    color: isDarkTheme ? Colors.white : Colors.black,
  };

  const {
    imageUrl,
    logo,
    desctiption,
    categoryNames,
    name,
    floor,
    workingHours,
    address,
    phone,
    id,
  } = singleLocalMerchant;

  const [roomId, setRoomId] = useState<number | string | undefined>(id);

  //aq dausete archeuli moli
  useEffect(() => {
    axios
      .get(`${envs.API_URL}/api/Connect/GetFloorsMap?address=${1}`)
      .then(res => {
        setFloors(res.data.floors);
      });
  }, []);

  useEffect(() => {
    if (floors && floorsDetails) {
      try {
        const current = floorsDetails.filter(data => data.title == floor[0]);
        const cf = floors.filter(data => data.title == current[0].id);
        setFloorData(cf[0]);
      } catch (_) {
        setFloorData(floors[floors.length - 1]);
      }
    }
  }, [floorData, floorsDetails]);

  useEffect(() => {
    axios
      .get(`${envs.API_URL}/api/Connect/GetFloors`)
      .then(res => {
        setFloorsDetails(res.data);
      });
  }, [floors]);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${envs.API_URL}/api/Mobile/GetConnectStore?StoreId=${roomId}`)
      .then(res => {
        setSingleLocalMerchant(res.data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [roomId]);



  return (
    <>
      <ScrollView
        style={{ backgroundColor: isDarkTheme ? Colors.black : Colors.white }}
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: isDarkTheme ? Colors.black : Colors.white,
        }}>
        <View style={[styles.banner, { height: height / 2 }]}>
          <Image
            source={{ uri: imageUrl }}
            style={{ width: width, height: height / 2 }}
          />
          <Text style={[styles.pageTitle, textColorStyle]}>
          {state?.t('screens.saburtalo')}
          </Text>
          <TouchableOpacity
            onPress={() => GoBack()}
            style={{
              position: 'absolute',
              top: 42,
              left: 15,
              width: 30,
              height: 30,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={isDarkTheme? require('../assets/images/back-arrow.png') : require('../assets/images/left-arrow-black.png')}
              style={{ width: 12, height: 12 }}
            />
          </TouchableOpacity>
        </View>
        <Image source={require('../assets/images/gradient-line.png')} />
        <View
          style={[
            styles.shopDetailsWrap,
            // {height: (height * 5) / 12}
          ]}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}>
            <Image resizeMode={'contain'} source={{ uri: logo }} style={{ width: 74, height: 99 }} />
            <View style={styles.shopDetails}>
              <View style={{}}>
                <Text style={[styles.shopName, textColorStyle]}>{name}</Text>
                <Text style={[styles.shopDesc, textColorStyle]}>
                  {categoryNames}
                </Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={[styles.shopDesc, textColorStyle]}>{state?.t('common.floor')}: </Text>
                {floor?.map((floor: string) => (
                  <Text key={floor} style={[styles.shopDesc, textColorStyle]}>
                    {floor}
                  </Text>
                ))}
              </View>
            </View>
          </View>
          <View style={{ marginTop: 30 }}>
            <Text style={[styles.shopDesc, textColorStyle]}>{desctiption}</Text>
          </View>
          <View
            style={{
              height: 1,
              width: '75%',
              backgroundColor: isDarkTheme ? Colors.white : Colors.black,
              marginTop: 25,
            }}
          />
          <View style={styles.shopContactInfo}>
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={[
                  styles.infoTitle,
                  textColorStyle,
                  { fontFamily: 'HMpangram-Bold' },
                ]}>
                {state?.t('screens.mobile')}:{' '}
              </Text>
              <Text
                style={[
                  styles.infoTitle,
                  textColorStyle,
                  { fontFamily: 'HMpangram-Medium' },
                ]}>
                {phone}
              </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={[
                  styles.infoTitle,
                  textColorStyle,
                  { fontFamily: 'HMpangram-Bold' },
                ]}>
                {state?.t('screens.workingHours')}:{' '}
              </Text>
              <Text
                style={[
                  styles.infoTitle,
                  textColorStyle,
                  { fontFamily: 'HMpangram-Medium' },
                ]}>
                {workingHours?.[0] + ' - ' + workingHours?.[1]}
              </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={[
                  styles.infoTitle,
                  textColorStyle,
                  { fontFamily: 'HMpangram-Bold' },
                ]}>
                 {state?.t('screens.address')}:{' '}
              </Text>
              <Text
                style={[
                  styles.infoTitle,
                  textColorStyle,
                  { fontFamily: 'HMpangram-Medium' },
                ]}>
                {address}
              </Text>
            </View>
          </View>
        </View>
        {/* <View style={styles.offersWrap}>
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: '6%',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={styles.shopName}>შეთავაზებები</Text>
            <PaginationDots length={offersArray.length / 2} step={offersStep} />
          </View>
          <View style={{marginTop: 20}}>
            <ScrollView
              contentContainerStyle={{flexDirection: 'row'}}
              horizontal={true}
              onScroll={handleOffersScroll}>
              {offersArray.map((item: IOffer, index: number) => (
                <PromotionBox key={index} data={item} />
              ))}
            </ScrollView>
          </View>
        </View> */}
        <View style={styles.floorPlan}>
          <Text
            style={[
              styles.shopName,
              textColorStyle,
              { marginBottom: 20, marginLeft: '8%' },
            ]}>
            {state?.t('screens.floorPlan')}
          </Text>

          {floorData !== undefined && (
            <MapComponent
              SvgXmlString={floorData.svgToJson}
              activeBorderWidth={20}
              activeBorderColor="green"
              activeId={id}
              onPress={setRoomId}
            />
          )}
        </View>
      </ScrollView>

      <Modal visible={isLoading} animationType="slide" transparent={true}>
        <ActivityIndicator
          size={'small'}
          color={'#ffffff'}
          style={{
            alignSelf: 'center',
            transform: [{ translateY: Dimensions.get('screen').height / 2 }],
          }}
        />
      </Modal>
    </>
  );
};

export default ShopDetailsScreen;

const styles = StyleSheet.create({
  banner: {
    width: '100%',
  },
  pageTitle: {
    fontFamily: 'HMpangram-Bold',
    fontSize: 16,
    lineHeight: 17,
    textAlign: 'center',
    position: 'absolute',
    top: 47,
    width: '80%',
    left: 30,
    color: Colors.white
  },
  shopDetailsWrap: {
    paddingTop: 30,
    paddingHorizontal: '8%',
  },
  shopDetails: {
    height: 100,
    width: '60%',
    justifyContent: 'space-between',
  },
  shopName: {
    fontFamily: 'HMpangram-Bold',
    fontSize: 16,
    lineHeight: 19,
    marginBottom: 5
  },
  shopDesc: {
    fontFamily: 'HMpangram-Medium',
    fontSize: 12,
    lineHeight: 14,
  },
  shopContactInfo: {
    marginTop: 19,
  },
  infoTitle: {
    fontFamily: 'HMpangram-Bold',
    fontSize: 12,
    lineHeight: 20,
  },
  offersWrap: {
    marginTop: 120,
    paddingHorizontal: '2%',
  },
  floorPlan: {
    flex: 1,
    //height: '100%',
    maxHeight: 422,
    marginTop: '8%',
  },
});

