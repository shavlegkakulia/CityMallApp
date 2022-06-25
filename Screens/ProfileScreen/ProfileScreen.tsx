import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  NativeScrollEvent,
  Image,
  RefreshControl,
  ActivityIndicator,
  NativeSyntheticEvent,
  Linking,
} from 'react-native';
import {AppContext} from '../../AppContext/AppContext';
import {Colors} from '../../Colors/Colors';
import AppLayout from '../../Components/AppLayout';
import AppSwitch from '../../Components/CustomComponents/AppSwitch';
import PaginationDots from '../../Components/PaginationDots';
import PromotionBox from '../../Components/PromotionBox';
import StatusBar from '../../Components/StatusBar';
import TransactionList from '../../Components/TransactionList';
import ApiServices, {
  IClientInfo,
  IClientPaymentTransaction,
  IClientTransaction,
} from '../../Services/ApiServices';
import {navigate} from '../../Services/NavigationServices';
import {formatNumber} from '../../Services/Utils';
import {GetOffers, IOffer} from '../../Services/Api/OffersApi';
import {GetVouchersToBuy, IVouchers} from '../../Services/Api/VouchersApi';
import VaucherPromptBox from '../../Components/VaucherPromptBox';
import translateService from '../../Services/translateService';
import { subscriptionService } from '../../Services/SubscriptionServive';
import Clipboard from '@react-native-community/clipboard';
import TemporaryText from '../../Components/TemporaryText';

//transactionType
export enum tranTypes {
  accumulate = 1,
  transfer = 4,
}

const ProfileScreen = (props: any) => {
  const {state, setGlobalState} = useContext(AppContext);
  const {isDarkTheme, offersArray} = state;

  let isEndFetching = false;
  let startFetching = false;

  const [offersStep, setOffersStep] = useState<number>(0);
  const [offersStepv, setOffersStepv] = useState<number>(0);
  const [personalOffers, setPersonalOffers] = useState<IOffer[]>([]);
  const [isMoneyTransaction, setIsMoneyTransaction] = useState<boolean>(false);
  // const [clientInfo, setClientInfo] = useState<IClientInfo>({});
  const [clientTransactions, setClientTransactions] = useState<
    IClientTransaction[]
  >([]);
  const [clientPaymentTransactions, setClientPaymentTransactions] = useState<
    IClientPaymentTransaction[]
  >([]);
  const [isFetchingData, setIsFetchingData] = useState<boolean>(false);
  const [pagPage, setPagPage] = useState<number>(1);

  const [clientVouchers, setClientVouchers] = useState<IVouchers[] | []>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [fetchingMore, setFetchingMore] = useState(false);

  const [renewing, setRenewing] = useState(false);
  const [canOperation, setCanOperation] = useState(true);

  const darkArrowIcon = require('../../assets/images/arrow-black.png');
  const lightArrowIcon = require('../../assets/images/arrow-sm.png');

  const [outer, setOuter] = useState(true);
  const [copiedText, setCopiedText] = useState<string | undefined>();
  const copiedTextTtl = useRef<NodeJS.Timeout>();

  const copyToClipboard = (str: string) => {
    setOuter(false);
    Clipboard.setString(str);
    setCopiedText(str);
    copiedTextTtl.current = setTimeout(() => {
      setCopiedText(undefined);
    }, 1000);
  };

  useEffect(() => {
    getClientData();
    // getClientTransactions();
    getPersonalOffers(pagPage, true);
  }, [translateService.lang]);

  const toggleSwitch = (status: boolean) => {
    setCanOperation(false);
    setRowIndex(1);
    setClientTransactions([]);
    setClientPaymentTransactions([]);
    setStopFetching(false);
    setRenewing(false);
    setIsMoneyTransaction(status);
  };

  const [cinfo, setcinfo] = useState<IClientInfo | undefined>();

  const getClientData = () => {
    ApiServices.GetClientInfo()
      .then(res => { console.log(res.data)
        setGlobalState({clientInfo: res.data});
        setcinfo(res.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const rowCount = 10;
  const getClientPayTransactions = (renew?: boolean) => {
    if (renew) {
      setRenewing(false);
    }
    if (stopFetching) return;
    ApiServices.GetClientPayTransactions(
      rowIndex,
      rowCount,
      isDarkTheme ? 'dark' : 'light',
    )
      .then(res => {console.log('>>>', res.data.data)
        if (renew) {
          setClientPaymentTransactions(res.data.data!);
        } else {
          setClientPaymentTransactions([
            ...clientPaymentTransactions,
            ...res.data.data!,
          ]);
        }
        if (
          (res.data?.data?.length || 0) < rowCount ||
          (res.data?.data?.length || 0) <= 0
        ) {
          setStopFetching(true);
        } else {
          setStopFetching(false);
        }
        setFetchingMore(false);
        setCanOperation(true);
      })
      .catch(e => {
        setCanOperation(true);
        //setFetchingMore(false);
      });
  };

  const getClientTransactions = (renew?: boolean) => {
    if (renew) {
      setRenewing(false);
    }
    if (stopFetching) return;
    ApiServices.GetClientTransactions(
      rowIndex,
      rowCount,
      isDarkTheme ? 'dark' : 'light',
    )
      .then(res => {
        setCanOperation(true);
        if (renew) {
          setClientTransactions(res.data.data!);
        } else {
          setClientTransactions([...clientTransactions, ...res.data.data!]);
        }
        if (
          (res.data?.data?.length || 0) < rowCount ||
          (res.data?.data?.length || 0) <= 0
        ) {
          setStopFetching(true);
        } else {
          setStopFetching(false);
        }
        setFetchingMore(false);
      })
      .catch(e => {
        setCanOperation(true);
       // setFetchingMore(false);
      });
  };

  const getPersonalOffers = (page: number = 1, renew?: boolean) => {
    if (startFetching) return;
    startFetching = true;
    GetOffers(true, page)
      .then(res => {
        let tempOffers = res.data.data;
        if (tempOffers.length < 16) {
          isEndFetching = true;
        }
        if (renew) {
          setPersonalOffers(tempOffers);
        } else {
          setPersonalOffers(prevState => {
            return [...prevState, ...tempOffers];
          });
        }
        setIsFetchingData(false);
        startFetching = false;
      })
      .catch(e => {
        console.log('error ===>', e);
      });
  };

  const onChangeSectionStep = (nativeEvent: NativeScrollEvent) => {
    if (clientVouchers.length <= 0) return;
    if (nativeEvent) {
      const slide = Math.ceil(
        nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width,
      );
      setOffersStep(slide);
    }
    if (isFetchingData || isEndFetching) return;
    let scrollPoint = Math.floor(
      nativeEvent.contentOffset.x + nativeEvent.layoutMeasurement.width,
    );
    let scrollContentSize = Math.floor(nativeEvent.contentSize.width);
    if (scrollPoint >= scrollContentSize - 1) {
      setPagPage(prevState => prevState + 1);
      setIsFetchingData(true);
      setTimeout(() => {
        getPersonalOffers(pagPage);
      }, 1000);
    }
  };

  const onChangeSectionStepV = (nativeEvent: NativeScrollEvent) => {
    if (personalOffers.length <= 0) return;
    if (nativeEvent) {
      const slide = Math.ceil(
        nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width,
      );
      setOffersStepv(slide);
    }
  };

  useEffect(() => {
    getVouchersToBuy();
  }, []);

  const getVouchersToBuy = () => {
    if (isLoading) return;
    setIsLoading(true);
    GetVouchersToBuy()
      .then(res => {
        setClientVouchers(res.data);
        setIsLoading(false);
      })
      .catch(e => {
        setIsLoading(false);
      });
  };

  const onRefresh = () => {
    getClientData();
    setRenewing(true);
    setRowIndex(1);
    setStopFetching(false);
    if (isMoneyTransaction) {
      getClientPayTransactions(true);
    } else {
      getClientTransactions(true);
    }
    getPersonalOffers(1, true);
  };

  const scrollRef = useRef<ScrollView | null>(null);
  const [rowIndex, setRowIndex] = useState<number>(1);
  const [stopFetching, setStopFetching] = useState(false);

  useEffect(() => {
    if (!renewing) {
      if (isMoneyTransaction) {
        getClientPayTransactions();
      } else {
        getClientTransactions();
      }
    }
  }, [rowIndex, isDarkTheme, isMoneyTransaction]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (stopFetching) return;
    const paddingToBottom = 5;
    const isChunk =
      event.nativeEvent.layoutMeasurement.height +
        event.nativeEvent.contentOffset.y >=
      event.nativeEvent.contentSize.height - paddingToBottom;

    if (isChunk && !fetchingMore && canOperation) {
      setFetchingMore(true);
      setRowIndex(prev => {
        let rowIndex = prev + 1;
        return rowIndex;
      });
      scrollRef.current?.scrollTo({
        x: 0,
        y: event.nativeEvent.contentSize.height + paddingToBottom,
        animated: true,
      });
    }
  };

  const lounchpayunicard = () => {
    Linking.openURL('https://www.payunicard.ge');
  };

  const BottomLoading = () =>
    fetchingMore ? (
      <View
        style={[
          styles.bottomLoading,
          {backgroundColor: isDarkTheme ? Colors.black : Colors.white},
        ]}>
        <ActivityIndicator
          size="small"
          color={isDarkTheme ? Colors.white : Colors.black}
        />
      </View>
    ) : null;

useEffect(() => {
  const subscription = subscriptionService?.getData()?.subscribe(data => {
    if (data?.key === 'theme_changed') {
      if (!renewing) {
        if (isMoneyTransaction) {
          getClientPayTransactions();
        } else {
          getClientTransactions();
        }
      }
    }
  });

  return () => {
    subscriptionService?.clearData();
    subscription?.unsubscribe();
  };
}, []);

const accountNumber = cinfo?.loyaltyAccountNumber;

  return (
    <AppLayout pageTitle={state?.t('screens.room')}>
      <ScrollView
        ref={scrollRef}
        onScroll={handleScroll}
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: isDarkTheme ? Colors.black : Colors.white,
          paddingHorizontal: '7%',
        }}
        refreshControl={
          <RefreshControl
            progressBackgroundColor={isDarkTheme ? Colors.white : Colors.black}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }>
        <View style={styles.balanceView}>
          <View>
            <Text style={styles.balanceWrapTitle}>
              {state?.t('screens.deposit')}
            </Text>
            <Text
              style={[
                styles.balanceWrapAmount,
                isDarkTheme ? {color: Colors.white} : {color: Colors.black},
              ]}>
              {formatNumber(state.clientInfo.ballance) || 0}₾
            </Text>
          </View>
          <View>
            <Text style={styles.balanceWrapTitle}>
              {state?.t('screens.cityPoint')}
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={[
                  styles.balanceWrapAmount,
                  isDarkTheme ? {color: Colors.white} : {color: Colors.black},
                ]}>
                {formatNumber(state.clientInfo.points) || 0}
              </Text>
              <Image
                source={require('./../../assets/images/Star.png')}
                style={{width: 9, height: 9, marginLeft: 3}}
                resizeMode={'contain'}
              />
            </View>
          </View>
        </View>
        <View style={{marginBottom: 30, width: '100%'}}>
          <View style={styles.statusBarView}>
            <Text
              style={[
                styles.promotionsTitle,
                {color: isDarkTheme ? Colors.white : Colors.black},
              ]}>
              {state?.t('screens.statusbar')}
            </Text>
            <TouchableOpacity
              onPress={() => navigate('StatusInfoScreen')}
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={[
                  styles.promotionsTitle,
                  {color: isDarkTheme ? Colors.white : Colors.black},
                ]}>
                {state?.t('common.seeMore')}
              </Text>
              <Image
                source={isDarkTheme ? lightArrowIcon : darkArrowIcon}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
          {cinfo ? <StatusBar data={cinfo} /> : null}
        </View>
        <View style={{marginBottom: 20, alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() => navigate('VouchersInfo')}
            style={{
              flexDirection: 'row',
              width: 272,
              height: 39,
              backgroundColor: '#636363',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 50,
            }}>
            <Image
              source={require('../../assets/images/vaucher.png')}
              style={{width: 22, height: 16, marginRight: 10}}
            />
            <Text style={styles.promotionsTitle}>
              {state?.t('screens.myVouchers')}
            </Text>
          </TouchableOpacity>
        </View>
        {accountNumber !== undefined ? <View style={styles.accountNumberSection}>
          <View>
            <Text style={styles.accountTitle}>
              {state?.t('common.accountNumber')}
            </Text>
            <TouchableOpacity
            style={styles.accountButton}
              onPress={() => {
                copyToClipboard(accountNumber);
              }}>
              <Text style={styles.accountNumber}>
                <Image
                  source={require('./../../assets/images/textCopyIcon.png')}
                  style={styles.copyImage}
                />{' '}
                {accountNumber}
                <TemporaryText
                  text={state?.t('common.copied')}
                  show={accountNumber === copiedText}
                />
              </Text>
            </TouchableOpacity>
          </View>
        </View>: null}
        <View style={{marginBottom: 30}}>
          <View style={styles.promotionContainer}>
            <Text
              style={[
                styles.promotionsTitle,
                {color: isDarkTheme ? Colors.white : Colors.black},
              ]}>
              {state?.t('screens.myOffers')}
            </Text>
            <PaginationDots
              length={Math.round(personalOffers?.length / 2)}
              step={offersStep}
            />
          </View>
          <ScrollView
            contentContainerStyle={{flexDirection: 'row'}}
            pagingEnabled={true}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            onScroll={({nativeEvent}) => {
              onChangeSectionStep(nativeEvent);
            }}>
            {personalOffers?.map((el: any, i: number) => (
              <PromotionBox key={i} data={el} />
            ))}
          </ScrollView>
        </View>
        <View style={{marginBottom: 30}}>
          <View style={styles.promotionContainer}>
            <Text
              style={[
                styles.promotionsTitle,
                {color: isDarkTheme ? Colors.white : Colors.black},
              ]}>
              {state?.t('screens.pointsOption')}
            </Text>
            <PaginationDots
              length={Math.round(clientVouchers?.length / 2)}
              step={offersStepv}
            />
          </View>

          <ScrollView
            contentContainerStyle={{flexDirection: 'row'}}
            pagingEnabled={true}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            onScroll={({nativeEvent}) => {
              onChangeSectionStepV(nativeEvent);
            }}>
            {clientVouchers?.map((el: any, i: number) => (
              <VaucherPromptBox key={i} data={el} />
            ))}
          </ScrollView>
        </View>

        <View style={styles.lounchcontent}>
          <Image
            source={
              isDarkTheme
                ? require('../../assets/images/payunicard_dark.png')
                : require('../../assets/images/payunicard_light.png')
            }
            style={styles.payunicard}
          />
          <TouchableOpacity
            style={styles.lounchbutton}
            onPress={lounchpayunicard}>
            <Text style={styles.lounchtext}>{state.t('common.payuninfo')}</Text>
            <Image
              source={require('../../assets/images/lounch.png')}
              style={styles.lounchicon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.transactionView}>
          <View style={styles.trViewHeader}>
            <Text
              style={[
                styles.promotionsTitle,
                {color: isDarkTheme ? Colors.white : Colors.black},
              ]}>
              {state?.t('screens.transactions')}
            </Text>
            <View style={styles.trViewHeaderRight}>
              <Image
                source={
                  isDarkTheme
                    ? require('../../assets/images/points_active.png')
                    : require('../../assets/images/points_inactive.png')
                }
                style={{width: 19, height: 19}}
              />

              <AppSwitch
                onPress={toggleSwitch}
                pressable={cinfo?.hasPayCard === true}
              />
              <Image
                source={
                  isDarkTheme
                    ? require('../../assets/images/GEL_active.png')
                    : require('../../assets/images/GEL_inactive.png')
                }
                style={{width: 15, height: 18}}
              />
            </View>
          </View>

          <View>
            {clientTransactions &&
              clientTransactions.map((item, index) => (
                <TransactionList item={item} key={index} />
              ))}

            {clientPaymentTransactions &&
              clientPaymentTransactions.map((item, index) => (
                <TransactionList item={item} key={index} isPayment={true} />
              ))}
            {(!clientTransactions || clientTransactions.length <= 0) &&
              (!clientPaymentTransactions ||
                clientPaymentTransactions.length <= 0) && (
                <Text
                  style={{
                    fontSize: 10,
                    marginBottom: 50,
                    color: isDarkTheme ? Colors.white : Colors.black,
                  }}>
                  {state?.t('infoText.transactionsNotFound')}
                </Text>
              )}
            {BottomLoading()}
          </View>
        </View>
      </ScrollView>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  balanceView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 50,
    marginBottom: 35,
  },
  balanceWrap: {},
  balanceWrapTitle: {
    fontSize: 11,
    fontFamily: 'HMpangram-Medium',
    color: Colors.darkGrey,
  },
  balanceWrapAmount: {
    fontSize: 24,
    fontFamily: 'HMpangram-Bold',
  },

  statusBarView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  promotions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 400,
  },
  promotionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  promotionsTitle: {
    color: Colors.white,
    fontFamily: 'HMpangram-Bold',
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '900',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  transactionView: {
    marginBottom: 20,
  },
  trViewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trViewHeaderRight: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  icon: {
    width: 8,
    height: 8,
    left: 6,
  },
  bottomLoading: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  payunicard: {
    marginRight: 20,
    maxHeight: 27,
  },
  lounchcontent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 36,
  },
  lounchbutton: {
    flexDirection: 'row',
    flex: 1,
    height: 39,
    backgroundColor: '#636363',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    paddingHorizontal: 15,
  },
  lounchtext: {
    color: Colors.white,
    fontFamily: 'HMpangram-Bold',
    fontSize: 12,
    lineHeight: 14,
    fontWeight: '900',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  lounchicon: {
    marginLeft: 5,
  },
  accountNumberSection: {
    marginTop: 30, 
    marginBottom: 40, 
    flexDirection: 'row'
  },
  accountTitle: {
    color: Colors.white,
    fontFamily: 'HMpangram-Bold',
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  accountNumber: {
    color: Colors.white,
    fontFamily: 'HMpangram-Bold',
    lineHeight: 17,
    fontWeight: '900',
    textTransform: 'uppercase',
    fontSize: 13,
    letterSpacing: 1
  },
  copyImage: {
    width: 12,
    height: 12
  },
  accountButton: {
    paddingVertical: 10
  }
});

export default ProfileScreen;
