import axios from 'axios';
import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {AppContext} from '../AppContext/AppContext';
import {Colors} from '../Colors/Colors';
import AppLayout from './AppLayout';
import MapComponent from './FloorMap/Map';
import ZoomableView from './FloorMap/ZoomableView';
import envs from './../config/env';
import {RouteProp, useRoute} from '@react-navigation/native';
import {GoBack, navigate} from '../Services/NavigationServices';
import Layout from './Layouts/Layout';
import translateService from '../Services/translateService';

type RouteParamList = {
  params: {
    mallId: number;
  };
};

export default () => {
  const {state, setGlobalState} = useContext(AppContext);
  const {isDarkTheme} = state;
  const route = useRoute<RouteProp<RouteParamList, 'params'>>();
  const [roomId, setRoomId] = useState<number | string | undefined>('');
  const [floors, setFloors] = useState<Array<any>>([]);
  const [floorIndex, setFloorIndex] = useState<any>(undefined);
  const [floorIndexTemp, setFloorIndexTemp] = useState<any>(undefined);
  const [pickerPositionTop, setPickerPositionTop] = useState<
    number | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(false);
   const [choosing, setChoosing] = useState<boolean>(false);
  const [floorsDetails, setFloorsDetails] = useState<Array<any>>([]);
  const [floorData, setFloorData] = useState<any>();
  const [selecting, setSelecting] = useState(false);

  useEffect(() => {
    if (!isNaN(parseInt(roomId?.toString() || ''))) {
      setIsLoading(true);
      axios
        .get(`${envs.API_URL}/api/Mobile/GetConnectStore?StoreId=${roomId}`)
        .then(res => {
          setGlobalState({singleMerchant: res.data});
          navigate('ShopDetailsScreen');
          setIsLoading(false);
        })
        .catch(() => setIsLoading(true));
    }
  }, [roomId]);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(
        `${envs.API_URL}/api/Connect/GetFloorsMap?address=${
          route.params?.mallId || 1
        }`,
      )
      .then(res => {
        setFloors(res.data.floors);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [route.params?.mallId]);

  useEffect(() => {
    axios.get(`${envs.API_URL}/api/Connect/GetFloors`).then(res => {
      if (res.data) {
        const ret: any[] = [];
        floors.map(f => {
          const data = res.data.filter((fd: any) => fd.id == f.title);
          if (data.length) {
            ret.unshift(...data);
          }
        });
        setFloorsDetails(ret);
      }
    });
  }, [floors]);

  useEffect(() => {
    if (floors && floorsDetails) {
      try {
        const current = floorsDetails.filter(data => data.id == floorIndex);

        const cf = floors.filter(data => data.title == current[0].id);

        setFloorData(cf[0]);
      } catch (_) {
        setFloorData(floors[floors.length - 1]);
      }
    }
  }, [floorData, floorsDetails, floorIndex]);

  const choseItem = () => {
    setSelecting(false);
    setFloorIndex(floorIndexTemp);
  };

  useEffect(() => {
    if(floorData && floorIndex === undefined) {
      try {
        const i = floorsDetails[0].id;
        setFloorIndex(i);
      } catch (e) {}
    }
  }, [floorData, route.params?.mallId])

  let floorIndexOnStart = '';
  let btnTitle = '';
  try {
    btnTitle = floorsDetails.filter(f => f.id === floorIndex)[0].title;

  } catch (e) {}

  try {
    const i = floorsDetails[0].title;
    floorIndexOnStart = i;
  } catch (e) {}

  return (
    <>
      <Layout pageName={state?.t('screens.floorPlan')} onPressBack={GoBack} hasBackArrow>
        <View
          style={[
            styles.sectionContainer,
            {backgroundColor: isDarkTheme ? Colors.black : Colors.white},
          ]}>
          {floorData !== undefined && (
            <ZoomableView
              maxZoom={1.5}
              minZoom={1}
              zoomStep={0.5}
              initialZoom={1}
              bindToBorders={true}>
              <MapComponent
                passHeight={h => {
                  setPickerPositionTop(
                    Dimensions.get('screen').height - (h + 240),
                  );
                }}
                SvgXmlString={floorData.svgToJson}
                activeBorderWidth={20}
                activeBorderColor="green"
                activeId={roomId}
                onPress={setRoomId}
              />
              {floors.length > 0 &&
                pickerPositionTop &&
                
                  <TouchableOpacity
                    onPress={() => {
                      Platform.OS === 'ios' ? setSelecting(!selecting) : setChoosing(true)
                    }}
                    style={[
                      styles.floorPicker,
                      {
                        paddingVertical: 15,
                        paddingHorizontal: 15,
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row'
                      },
                      {top: pickerPositionTop},
                    ]}>
                    <Text style={{color: isDarkTheme ? Colors.white : Colors.black}}>
                      {`${state?.t('common.floor')} ${btnTitle || floorIndexOnStart}`}
                    </Text>
                    <Image
                      source={isDarkTheme ? require('./../assets/images/arrow-sm.png') : require('./../assets/images/arrow-black.png')}
                      style={{transform: [{rotate: '90deg'}], width: 7, height: 7, marginLeft: 5}}
                    />
                  </TouchableOpacity>
                }
            </ZoomableView>
          )}
        </View>
      </Layout>
      <Modal
        visible={selecting}
        animationType="slide"
        transparent={true}
        style={{position: 'relative'}}>
        <TouchableOpacity
          activeOpacity={1}
          style={{flex: 1}}
          onPress={() => setSelecting(false)}>
          <View
            onStartShouldSetResponder={event => true}
            onTouchEnd={e => {
              e.stopPropagation();
            }}
            style={{
              flex: 1,
              backgroundColor: Colors.black,
              maxHeight: 250,
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              borderTopLeftRadius: 14,
              borderTopRightRadius: 14,
            }}>
            <Picker
              dropdownIconColor={'#FFCA06'}
              selectedValue={floorIndexTemp}
              itemStyle={{color: '#ffffff'}}
              mode="dropdown"
              onValueChange={itemValue => setFloorIndexTemp(itemValue)}>
              {floorsDetails.map((f, i) => (
                <Picker.Item
                  key={f.id}
                  label={`${state?.t('common.floor')} ${f.title}`}
                  value={f.id}
                />
              ))}
            </Picker>
            <TouchableOpacity
              style={[styles.modalBar, {marginBottom: 40}]}
              onPress={() => choseItem()}>
              <Text
                style={[
                  styles.infoText,
                  {textAlign: 'right', color: Colors.red},
                ]}>
                {state?.t('common.select')}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      <Modal visible={isLoading} animationType="slide" transparent={true}>
        <ActivityIndicator
          size={'small'}
          color={'#ffffff'}
          style={{
            alignSelf: 'center',
            transform: [{translateY: Dimensions.get('screen').height / 2}],
          }}
        />
      </Modal>
      <Modal visible={choosing} animationType="fade" transparent={true} onRequestClose={() => setChoosing(false)}>
        <TouchableOpacity
        onPress={() => setChoosing(false)}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#000000',
            opacity: 0.8,
          }}>
          <View
            style={{
              padding: 15,
              borderRadius: 14,
              maxHeight: Dimensions.get('window').height - 80,
              minWidth: '50%',
              backgroundColor: isDarkTheme ? Colors.black : Colors.white,
            }}>
            {floorsDetails.map((f, i) => (
              <TouchableOpacity key={f.id} style={{paddingVertical: 15}} onPress={() => {
                setFloorIndex(f.id);
                setChoosing(false);
              }}>
                <Text
                  style={{
                    color: isDarkTheme ? Colors.white : Colors.black,
                    textAlign: 'center',
                    fontWeight: btnTitle === f.title ? '800' : '500'
                  }}>
                  {`${state?.t('common.floor')} ${f.title}`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
  },
  roomId: {
    fontSize: 20,
    color: '#ffffff',
    position: 'absolute',
    top: 100,
    alignSelf: 'center',
  },
  floorPicker: {
    position: 'absolute',
    left: 0,
    color: '#ffffff',
    elevation: 9,
  },

  infoText: {
    fontSize: 20,
    fontFamily: 'HMpangram-Medium',
    color: Colors.black,
  },
  modalBar: {
    marginHorizontal: 15,
  },
});
