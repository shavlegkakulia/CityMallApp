import React, { useContext, useEffect, useRef, useState } from "react";
import { Dimensions, Image, View, StatusBar, Text, ScrollView, StyleSheet, NativeSyntheticEvent, NativeScrollEvent, TouchableOpacity, ActivityIndicator, Button, Platform } from 'react-native';
import ApiServices, { IClientInfo } from "../Services/ApiServices";
import { Colors } from '../Colors/Colors';
import PaginationDots from "../Components/PaginationDots";
import PromotionBox from "../Components/PromotionBox";
import { useDimension } from "../Hooks/UseDimension";
import Grid from "../Styles/grid";
import AppLayout from "../Components/AppLayout";
import { AppContext } from "../AppContext/AppContext";
import UserCardSmall from "../Components/UserCardSmall";
import { formatNumber, paginationDotCount } from "../Services/Utils";
import { navigate } from "../Services/NavigationServices";
import { GetOffers, IOffer } from "../Services/Api/OffersApi";
import translateService from "../Services/translateService";
import AsyncStorage from "../Services/StorageService";
import { subscriptionService } from "../Services/SubscriptionServive";
import Clipboard from "@react-native-community/clipboard";
import TemporaryText from "../Components/TemporaryText";

const HomeScreen = () => {
    const { state, setGlobalState } = useContext(AppContext);
    const { clientDetails, offersArray, isDarkTheme } = state;


    let isEndFetching = false;
    let startFetching = false;

    const { width, height } = useDimension();
    const [offersStep, setOffersStep] = useState<number>(0);
    const [pagPage, setPagPage] = useState<number>(1);
    const [offers, setOffers] = useState<IOffer[]>([]);
    const [isFetchingData, setIsFetchingData] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [offersView, setOffersView] = useState<any[]>();
    const [initLoading, setInitLoading] = useState<boolean>(true);
    const infoUpdate = useRef<NodeJS.Timer>();
    const [isSkip, setIsSkip] = useState(false);
    const [copiedText, setCopiedText] = useState<string | undefined>();
    const copiedTextTtl = useRef<NodeJS.Timeout>();
  
    const copyToClipboard = (str: string) => {
      Clipboard.setString(str);
      setCopiedText(str);
      copiedTextTtl.current = setTimeout(() => {
        setCopiedText(undefined);
      }, 1000);
    };

    useEffect(() => {
        handleGetClientCards();
        AsyncStorage.getItem('skip_token').then(res => {
            if(res === null) {
                getClientData();
                setIsSkip(false);
            } else {
                setIsSkip(true);
                getOffers(pagPage, true, false);
            }
        })
   
    }, [translateService.lang]);

    useEffect(() => {
        handleSetOffers();
    }, [offers]);

    useEffect(() => {
        if (clientDetails?.[0]?.card !== undefined) {
            handleGetBarcode(clientDetails?.[0]?.card)
        };

    }, [clientDetails]);

    const onChangeSectionStep = (nativeEvent: NativeScrollEvent) => {
        if (offers.length <= 0) return;
        if (nativeEvent) {
            const slide = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width)
            setOffersStep(slide);
        }
        if (isFetchingData || isEndFetching) return;

        let scrollPoint = Math.floor(nativeEvent.contentOffset.x + nativeEvent.layoutMeasurement.width);
        let scrollContentSize = Math.floor(nativeEvent.contentSize.width);

        if (scrollPoint >= scrollContentSize - 1) {
            setPagPage(prevState => prevState + 1);
            setIsFetchingData(true);
            setTimeout(() => {
                getOffers(pagPage);
            }, 1000);
        }
    };


    const handleGetClientCards = () => {
        ApiServices.GetClientCards().then(res => {
            setGlobalState({ clientDetails: res.data });
            setInitLoading(false);
        })
            .catch(e => {
                setInitLoading(false);
            });
    };


    const handleGetBarcode = (card: string) => {
        ApiServices.GenerateBarcode(card)
            .then(res => {
                setGlobalState({ cardDetails: { barcode: res.data.base64Data, cardNumber: clientDetails?.[0]?.card } })
            })
            .catch(e => {
                console.log('barcode error', JSON.parse(JSON.stringify(e.response)).data)
            });
    };

    const handleSetOffers = () => {
        setOffersView([]);
        if (offers !== undefined) {
            for (let i = 4; i < offers!.length + 4; i += 4) {
                const renderElement =
                    <View style={[styles.promotions, { width: width }]}>
                        {offers![i - 4] && <PromotionBox data={offers![i - 4]} index={i - 4} />}
                        {offers![i - 3] && <PromotionBox data={offers![i - 3]} index={i - 3} />}
                        {offers![i - 2] && <PromotionBox data={offers![i - 2]} index={i - 2} />}
                        {offers![i - 1] && <PromotionBox data={offers![i - 1]} index={i - 1} />}
                    </View>
                setOffersView(prev => {
                    return [...(prev || []), renderElement]
                });
            };
        };
    };

    const getOffers = (page: number = 1, renew?:boolean, _private: boolean = false) => { 
        if (startFetching) return;
        startFetching = true;
        setIsLoading(true);
        GetOffers(_private, page)
            .then(res => {
                let tempOffers = res.data.data;
                if (tempOffers.length < 16) {
                    isEndFetching = true;
                }
                if(renew) {
                    setOffers(tempOffers);
                } else {
                setOffers(prevState => {
                    return [...prevState, ...tempOffers];
                  });
                }
                  setIsFetchingData(false);
                  startFetching = false;
                  setIsLoading(false);
            }).catch(e => {
                console.log('error ===>', e)
                setIsLoading(false);
            });
    };

    const getClientData = () => {
        ApiServices.GetClientInfo()
          .then(res => {
              setOffers([]);
              setPagPage(1);
              setOffersStep(0);
              setGlobalState({clientInfo: res.data});
            getOffers(pagPage, true);
          })
          .catch(e => {
            console.log(e);
          });
      };

      useEffect(() => {
        if(infoUpdate.current) clearInterval(infoUpdate.current);
        AsyncStorage.getItem('skip_token').then(res => { 
            if(res === null) {
                infoUpdate.current = setInterval(() => {
                    ApiServices.GetClientInfo()
                    .then(res => {
                        const info = {...res.data};
                        const prevInfo = {...state.clientInfo};
                        prevInfo.points = info.points;
                        prevInfo.ballance = info.ballance;
                        setGlobalState({clientInfo: {...prevInfo}});
                    })
                    .catch(e => {
                      console.log(e);
                    });
                }, 20000);
            } else {
                setIsSkip(true);
            }
        })

        return () => {
            if(infoUpdate.current) clearInterval(infoUpdate.current);
        }
      }, [])

      useEffect(() => {
        AsyncStorage.getItem('skip_token').then(res => { 
            if(res === null) {
                setIsSkip(false);
            } else {
                setIsSkip(true);
            }
        })
      }, [clientDetails])

    useEffect(() => {
        const subscription = subscriptionService?.getData()?.subscribe(data => {
          if (data?.key === 'theme_changed') {
            handleGetClientCards();
            AsyncStorage.getItem('skip_token').then(res => {
                if(res === null) {
                    getClientData();
                    setIsSkip(false);
                } else {
                    setIsSkip(true);
                    getOffers(pagPage, true, false);
                }
            })
          }
        });
    
        return () => {
          subscriptionService?.clearData();
          subscription?.unsubscribe();
        };
      }, []);

      return (
        <AppLayout pageTitle={state?.t('screens.home')}>
          <View
            style={{
              flex: 1,
              backgroundColor: isDarkTheme ? Colors.black : Colors.white,
            }}>
            <View style={{flex: 4.5, justifyContent: 'center'}}>
              {!initLoading ? (
                <UserCardSmall
                  cardNumber={clientDetails?.[0]?.card.replace(
                    /\b(\d{4})(\d{4})(\d{4})(\d{4})\b/,
                    '$1  $2  $3  $4',
                  )}
                  skip={isSkip}
                  navigateToBarCode={() => navigate('UserCardWithBarcode')}
                  navigateToReg={() =>
                    isSkip
                      ? navigate('AuthScreenWithSkip', {skip: true})
                      : navigate('AboutUs', {routeId: 2})
                  }
                />
              ) : (
                <ActivityIndicator animating={initLoading} color="#dadde1" />
              )}
            </View>

            {state.clientInfo !== undefined && (
              <View style={styles.amountInfo}>
                {(state.clientInfo.loyaltyAccountNumber !== undefined && state.clientInfo.loyaltyAccountNumber.length > 0) ? (
                  <View style={[styles.accountNumberSection, Platform.OS === 'ios' ? {marginTop: 15} : {}]}>
                    <View >
                    <Text style={styles.accountTitle}>
                    {state?.t('common.accountNumber')}
                  </Text>
                      <TouchableOpacity
                        style={styles.accountButton}
                        onPress={() => {
                          copyToClipboard(state.clientInfo.loyaltyAccountNumber);
                        }}>
                        <Text style={[styles.accountNumber, {color: isDarkTheme ? Colors.white : Colors.black}]}>
                          {state.clientInfo.loyaltyAccountNumber}{' '}
                          <Image
                            source={require('./../assets/images/textCopyIcon.png')}
                            style={styles.copyImage}
                          />
                          <TemporaryText
                            text={state?.t('common.copied')}
                            show={state.clientInfo.loyaltyAccountNumber === copiedText}
                          />
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : null}
                <View style={styles.depositInfo}>
                <View
                  style={[
                    styles.accesAmount,
                    styles.pointsInfo,
                    Platform.OS === 'ios' && {minHeight: 50, minWidth: 145},
                    {borderColor: isDarkTheme ? Colors.white : Colors.black},
                  ]}>
                  <Text
                    style={[
                      styles.amountTitle,
                      {color: isDarkTheme ? Colors.white : Colors.black},
                    ]}>
                    {state?.t('screens.deposit')}
                  </Text>
                  <Text
                    style={[
                      styles.amountValue,
                      {color: isDarkTheme ? Colors.white : Colors.black},
                    ]}>
                    {formatNumber(state.clientInfo?.ballance || 0)}₾
                  </Text>
                </View>

                <View
                  style={[
                    styles.pointsInfo,
                    Platform.OS === 'ios' && {minHeight: 50},
                    {borderColor: isDarkTheme ? Colors.white : Colors.black},
                  ]}>
                  <Text
                    style={[
                      styles.amountTitle,
                      {color: isDarkTheme ? Colors.white : Colors.black},
                    ]}>
                    {state?.t('screens.cityPoint')}
                  </Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text
                      style={[
                        styles.amountValue,
                        {color: isDarkTheme ? Colors.white : Colors.black},
                      ]}>
                      {formatNumber(state.clientInfo?.points || 0) || 0}
                    </Text>
                    <Image
                      resizeMode={'contain'}
                      source={require('./../assets/images/Star.png')}
                      style={{marginHorizontal: 5, width: 9, height: 9}}
                    />
                  </View>
                </View>
                </View>
              </View>
            )}

            <Image
              style={{width: '100%'}}
              source={require('../assets/images/gradient-line.png')}
            />
            <View style={{flex: 7.5}}>
              <View style={{flex: 1}}>
                <View style={styles.promotionContainer}>
                  <Text
                    style={[
                      styles.promotionsTitle,
                      {color: isDarkTheme ? Colors.white : Colors.black},
                    ]}>
                    {state?.t('common.offers')}
                  </Text>
                  <PaginationDots
                    length={paginationDotCount(offers, 4)}
                    step={offersStep}
                  />
                </View>
                <View style={{flex: 10, position: 'relative'}}>
                  <ScrollView
                    contentContainerStyle={{flexGrow: 1, flexDirection: 'row'}}
                    showsVerticalScrollIndicator={false}>
                    {offersView !== undefined && offersView?.length > 0 && (
                      <ScrollView
                        pagingEnabled={true}
                        contentContainerStyle={{flexDirection: 'row'}}
                        showsHorizontalScrollIndicator={false}
                        horizontal={true}
                        onScroll={({nativeEvent}) => {
                          onChangeSectionStep(nativeEvent);
                        }}>
                        {offersView?.map((el, i) => (
                          <View key={i}>{el}</View>
                        ))}
                      </ScrollView>
                    )}
                  </ScrollView>
                  {isLoading && (
                    <ActivityIndicator
                      color={isDarkTheme ? Colors.white : Colors.black}
                      style={{
                        alignSelf: 'center',
                        position: 'absolute',
                        top: '50%',
                        transform: [{translateY: -50}],
                      }}
                    />
                  )}
                </View>
              </View>
            </View>
          </View>
        </AppLayout>
      );

};


export default HomeScreen;

const styles = StyleSheet.create({
    giftCardImg: {
        maxHeight: 187,
        maxWidth: 300,
        width: '100%',
        height: '100%'
    },

    promotions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',

    },
    promotionContainer: {
        marginTop: 10,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: '7%',
    },
    promotionsTitle: {
        fontFamily: 'HMpangram-Bold',
        fontSize: 14,
        lineHeight: 17,
        fontWeight: '900',
        textTransform: 'uppercase',
        textAlign: 'center',
    },
    authBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'HMpangram-Bold',

    },
    amountInfo: {
        marginBottom: 60
    },
    depositInfo: {
        flexDirection: 'row', 
        flex: 1, 
        justifyContent: 'center', 
    },
    pointsInfo: {
        padding: 7,
        borderColor: Colors.white,
        borderWidth: 1,
        borderRadius: 5,
        minWidth: 137,
        minHeight: 52
    },
accesAmount: {
    padding: 7,
    borderColor: Colors.white,
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 12,
    minWidth: 137,
    minHeight: 52
},
amountTitle: {
    fontFamily: 'HMpangram-Bold',
    fontSize: 8,
    lineHeight: 11,
    textTransform: 'uppercase',
},
amountValue: {
    fontFamily: 'HMpangram-Bold',
    fontSize: 24,
    lineHeight: 29,
    textTransform: 'uppercase',
},
accountNumberSection: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    top: -8
  },
accountNumber: {
    color: Colors.white,
    fontFamily: 'HMpangram-Bold',
    lineHeight: 17,
    fontWeight: '900',
    textTransform: 'uppercase',
    fontSize: 13,
    letterSpacing: 1,
    textAlign: 'center',
  },
  copyImage: {
    width: 12,
    height: 12
  },
  accountButton: {
    marginBottom: 5
  },
  accountTitle: {
    color: Colors.white,
    fontFamily: 'HMpangram-Bold',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: 3
  }
});