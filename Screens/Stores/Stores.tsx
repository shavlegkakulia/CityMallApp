import React, {createRef, useContext, useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  NativeScrollEvent,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {AppContext} from '../../AppContext/AppContext';
import AppLayout from '../../Components/AppLayout';
import {Colors} from '../../Colors/Colors';
import PaginationDots from '../../Components/PaginationDots';
import {ChunkArrays as ChunkArrays} from '../../Utils/utils';
import RenderCategories from '../../Components/CategoriesFilter/RenderCategories';
import {RouteProp, useRoute} from '@react-navigation/native';
import ShopDetailBox from '../../Components/ShopDetailBox';
import {
  GetMainCategories,
  GetSubCategories,
  IMainCategories,
} from '../../Services/Api/CategoryApi';
import {GetMerchants, IMerchant} from '../../Services/Api/ShopsApi';
import NotFound from '../../Components/NotFound';
import translateService from '../../Services/translateService';
import { subscriptionService } from '../../Services/SubscriptionServive';

export interface IServiceCategories {
  id?: number;
  name?: string;
  objectTypeId?: number;
  objectTypeName?: string;
  subCategories: IServiceSubCategories[];
}

export interface IServiceSubCategories {
  id: number;
  name: string;
}

type RouteParamList = {
  params: {
    id: number;
    routeId: number;
    name: string,
    isPremium?:boolean
  };
};

const Stores: React.FC = () => {
  const [isFilterCollapsed, setIsFilterCollapsed] = useState<boolean>(true);
  const [secStep, setSectStep] = useState<number>(0);

  const carouselRef = createRef<ScrollView>();
  const routeParams = useRoute<RouteProp<RouteParamList, 'params'>>();
  const {state, setGlobalState} = useContext(AppContext);
  const {isDarkTheme, objectTypeId, subCategoryArray, categoryArray} = state;

  const itemChunk = 4;

  const [isEndFetching, setIsEndFetching] = useState(false);
  let startFetching = false;

  const [mainCategories, setMainCategories] = useState<IMainCategories[]>();
  const [subCategories, setSubCategories] = useState<IServiceSubCategories[]>(
    [],
  );
  const [merchants, setMerchants] = useState<IMerchant[]>([]);
  const [isFetchingData, setIsFetchingData] = useState<boolean>(false);
  const [pagPage, setPagPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    handleGetMainCategories();
  }, [objectTypeId, translateService.lang]);

  useEffect(() => {
    handleGetSubCategories();
  }, [categoryArray.length, translateService.lang]);

  useEffect(() => {
    if (merchants.length <= 0) {
      return;
    } else {
      setIsEndFetching(false);
    }
  }, [
    subCategoryArray.length,
    categoryArray.length,
    objectTypeId,
    routeParams.params.routeId,
    routeParams.params.id,
  ]);

  useEffect(() => {
    handleGetMerchants();
  }, [
    objectTypeId,
    subCategoryArray.length,
    categoryArray.length,
    routeParams.params.routeId,
    routeParams.params.id
  ]);

  useEffect(() => {
    setSectStep(0);
    setMerchants([]);
  }, [subCategoryArray.length, categoryArray.length]);

  useEffect(() => {
    setMerchants([]);
    setSectStep(0);
    handleGetMerchants();
  }, [translateService.lang]);

  const handleGetMainCategories = () => {
    GetMainCategories([objectTypeId])
      .then(res => {
        setMainCategories(res.data);
      })
      .catch(e => {
        console.log(JSON.parse(JSON.stringify(e.response)));
      });
  };

  const handleGetSubCategories = () => {
    GetSubCategories(categoryArray)
      .then(res => {
        if(res.data.length)
        setSubCategories(res.data);
      })
      .catch(e => {
        console.log(JSON.parse(JSON.stringify(e.response)));
      });
  };

  const handleGetMerchants = (push: boolean = false, p: number = 1) => {
    let isPremium;
    if (routeParams.params.isPremium) {
      isPremium = true;
    } else {
      isPremium = false;
    }
    if (startFetching) return;
    startFetching = true;
    setIsLoading(true);
    GetMerchants(
      routeParams.params.routeId,
      objectTypeId,
      isPremium,
      categoryArray,
      subCategoryArray,
      p,
    )
      .then(res => {
        let tempMerchants = res.data.data;
        if (tempMerchants.length < 16) {
          setIsEndFetching(true);
        }
        
        if (push) {
          setMerchants(prevState => {
            return [...prevState, ...tempMerchants];
          });
        } else {
          setMerchants(res.data.data);
        }
        setIsFetchingData(false);
        startFetching = false;
        setIsLoading(false);
      })
      .catch(e => {
        console.log(JSON.parse(JSON.stringify(e.response)));
        startFetching = false;
        setIsLoading(false);
      });
  };

  const onChangeSectionStep = (nativeEvent: NativeScrollEvent) => {
    if (merchants.length <= 0) return;
    if (nativeEvent) {
      const slide = !isFilterCollapsed
        ? Math.ceil(
            nativeEvent.contentOffset.y / nativeEvent.layoutMeasurement.height,
          )
        : Math.ceil(
            nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width,
          );

      setSectStep(slide);
    }
    if (isFetchingData || isEndFetching) return;

    let scrollPoint = !isFilterCollapsed
      ? Math.floor(
          nativeEvent.contentOffset.y + nativeEvent.layoutMeasurement.height,
        )
      : Math.floor(
          nativeEvent.contentOffset.x + nativeEvent.layoutMeasurement.width,
        );
    let scrollContentSize = !isFilterCollapsed
      ? Math.floor(nativeEvent.contentSize.height)
      : Math.floor(nativeEvent.contentSize.width);

    if (scrollPoint >= scrollContentSize - 1) {
      setPagPage(prevState => prevState + 1);
      setIsFetchingData(true);
      setTimeout(() => {
        handleGetMerchants(true, pagPage);
      }, 1000);

    }
  };

  const collapseFilters = () => {
    setIsFilterCollapsed(collapsed => !collapsed);
  };

  const animatedIsCollapsed = useRef(
    new Animated.Value(isFilterCollapsed ? 1 : 0),
  );

  useEffect(() => {
    setGlobalState({ categoryArray: [] });
    setGlobalState({ subCategoryArray: [] });
  }, []);

  useEffect(() => {
    Animated.timing(animatedIsCollapsed.current, {
      toValue: isFilterCollapsed ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFilterCollapsed]);

  let collapsableHeight = 266;
  if (subCategories.length <= 0) {
    collapsableHeight = 180;
  }

  if (!mainCategories || mainCategories.length <= 0) {
    collapsableHeight = 120;
  }

  const collapsibleHeight = {
    height: animatedIsCollapsed.current.interpolate({
      inputRange: [0, 1],
      outputRange: [0, collapsableHeight],
    }),
  };

  const containerStyle = {
    backgroundColor: isDarkTheme ? Colors.black : Colors.white,
  };

  const textStyle = {
    color: isDarkTheme ? Colors.white : Colors.black,
  };

  const itemStyle = {
    width: Dimensions.get('screen').width,
  };

  const chunkedData = ChunkArrays<IMerchant>(merchants!, itemChunk);
  const fillSpace = (ln: number) => {
    if (itemChunk - ln === 0) return null;
    return Array.from(Array(itemChunk - ln).keys()).map(element => (
      <View style={styles.emptyItem} key={`_${element}`}></View>
    ));
  };

  useEffect(() => {
    const subscription = subscriptionService?.getData()?.subscribe(data => {
      if (data?.key === 'theme_changed') {
        setMerchants([]);
        setSectStep(0);
        handleGetMerchants();
      }
    });
  
    return () => {
      subscriptionService?.clearData();
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <>
      <AppLayout>
        <View style={[styles.container, containerStyle]}>
          <Animated.View style={[styles.collapsible, collapsibleHeight]}>
            <Text style={[styles.headerText, textStyle]}>
              <Text style={styles.baseText}>{state?.t(routeParams.params.name)}</Text> | {routeParams.params.routeId === 1? state?.t('screens.citySaburtalo') : state?.t('screens.cityGldani')}
            </Text>
            {mainCategories && mainCategories.length > 0 && (
              <RenderCategories
                isCategory
                data={mainCategories!}
                title= {state?.t('common.categories')}
              />
            )}

            {subCategories.length > 0 && (
              <RenderCategories
                data={subCategories}
                title={state?.t('common.subCategories')}
                style={styles.subCategories}
                isCategory={false}
              />
            )}

            <Image
              source={require('./../../assets/images/gradient-line.png')}
              style={styles.line}
            />
          </Animated.View>
          <TouchableOpacity
            style={styles.collapseButton}
            onPress={collapseFilters}>
            <Image
              source={
                isFilterCollapsed
                  ? isDarkTheme ? require('./../../assets/images/icon-collapse-up.png') : require('./../../assets/images/icon-collapse-up-light.png')
                  : isDarkTheme ?  require('./../../assets/images/icon-collapse-down.png') : require('./../../assets/images/icon-collapse-down-light.png')
              }
              style={styles.sollapseIcon}
            />
          </TouchableOpacity>

          {isFilterCollapsed && merchants.length > 0 && (
            <PaginationDots
              length={chunkedData?.length}
              step={secStep}
              style={styles.dataPagination}
            />
          )}

          <View
            style={[
              (!isLoading && merchants.length <=0) ? { flex: 1, justifyContent: 'center', alignItems: 'center'} :
              isFilterCollapsed
                ? {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    flex: 1,
                  }
                : {
                    justifyContent: 'space-between',
                    flex: 1,
                  },
            ]}>
              {!isLoading && merchants.length <=0 ? 
              // <Text style={{ fontSize: 10, color: isDarkTheme ? Colors.white : Colors.black}}>ქონთენთი ვერ მოიძებნა</Text>
              <NotFound />
              :
            <ScrollView
              contentContainerStyle={{flexGrow: 1, flexDirection: 'row'}}
              onScroll={({nativeEvent}) => {
                if (isFilterCollapsed) return;
                onChangeSectionStep(nativeEvent);
              }}>
              {merchants.length > 0 && (
                <ScrollView
                  scrollToOverflowEnabled={true}
                  style={[
                    styles.dataScroller,
                    isFilterCollapsed && {height: 500},
                  ]}
                  contentContainerStyle={{paddingRight: 5}}
                  ref={carouselRef}
                  onScroll={({nativeEvent}) => onChangeSectionStep(nativeEvent)}
                  showsHorizontalScrollIndicator={false}
                  pagingEnabled={true}
                  horizontal={isFilterCollapsed}>
                  {chunkedData.map((data, i) => (
                    <View key={i} style={[styles.dataContent, itemStyle]}>
                      {data.map((item, index) => (
                        <ShopDetailBox
                          index={index}
                          data={item}
                          key={item.name! + index}
                          style={styles.dataItem}
                        />
                      ))}

                      {fillSpace(data.length)}
                    </View>
                  ))}
                </ScrollView>
              )}
            </ScrollView>}
            {merchants.length > 0 && isFetchingData && pagPage > 1 ? (
              <View
                style={[
                  isFilterCollapsed
                    ? {
                        flex: 1,
                        maxWidth: 50,
                        justifyContent: 'center',
                        marginRight: 10,
                        paddingHorizontal: 20,
                      }
                    : {
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingVertical: 20,
                      },
                ]}>
                <ActivityIndicator size={'small'} color={isDarkTheme ? Colors.white : Colors.black} />
              </View>
            ) : null}
          </View>
        </View>
        {isLoading && !(merchants.length > 0 && isFetchingData && pagPage > 1) && <View style={styles.loader}>
        <ActivityIndicator
          size={'small'}
          color={isDarkTheme ? Colors.white : Colors.black}
          style={{
            alignSelf: 'center',
            transform: [{translateY: Dimensions.get('screen').height / 2}],
          }}
        />
      </View>}
      </AppLayout>
     
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  collapsible: {
    overflow: 'hidden',
  },
  headerText: {
    fontFamily: 'HMpangram-Bold',
    fontSize: 14,
    lineHeight: 17,
    textAlign: 'center',
  },
  baseText: {
    fontWeight: '700',
  },

  subCategories: {
    marginTop: 50,
  },

  line: {
    width: '100%',
    marginTop: 22,
  },
  collapseButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sollapseIcon: {
    marginVertical: 14,
  },
  dataContent: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dataItem: {
    marginBottom: 20,
  },
  dataPagination: {
    marginRight: '7%',
    alignSelf: 'flex-end',
    marginBottom: 9,
  },
  dataScroller: {
    marginTop: 20,
  },
  emptyItem: {
    width: 159,
    height: 180,
    margin: 10,
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent'
}
});

export default Stores;
