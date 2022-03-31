import {Portal} from '@gorhom/portal';
import React, {useContext, useEffect, useState} from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {AppContext} from '../AppContext/AppContext';
import {Colors} from '../Colors/Colors';
import {useDimension} from '../Hooks/UseDimension';
import translateService from '../Services/translateService';

const data = {
  name: 'ცისანა',
  surname: 'თოდრია',
  ballance: null,
  points: 121100,
  status: 'სილვერი',
  category: 3,
  categoryStatus: 1,
  categoryPointInfo: [
    {
      point: 0,
      pointsLeft: 0,
      category: 1,
    },
    {
      point: 40000,
      pointsLeft: 0,
      category: 2,
    },
    {
      point: 90000,
      pointsLeft: 89900,
      category: 3,
    },
    {
      point: 150000,
      pointsLeft: 149900,
      category: 4,
    },
  ],
};

const ProgressCircle = ({
  hide,
  title,
  desc,
  visible,
  index,
  onBlur,
}: {
  hide?: boolean;
  title: string;
  desc: string;
  visible: boolean;
  index: number;
  onBlur: () => void;
}) => {
  const {state} = useContext(AppContext);
  const {isDarkTheme} = state;

if(hide) return null;

  return (
    <View style={{position: 'relative'}}>
      <Text
        style={{
          color: isDarkTheme ? Colors.white : Colors.black,
          fontSize: 10,
          left: index === 1? -12 : undefined
        }}>
        {title}
      </Text>
      <View
        style={{
          backgroundColor: 'red',
        }}>
        {visible ? (
          <TouchableOpacity
            style={[
              {
                position: 'absolute',
                top: -130,
                elevation: 999999999,
                zIndex: 9999,
              },
              index === 3 && {right: 0},
            ]}
            onPress={onBlur}>
            <View
              style={{
                backgroundColor: Colors.darkGrey,
                width: 113,
                //height: 89,
                borderRadius: 10,
              }}
              onStartShouldSetResponder={event => true}>
              <Text
                style={[
                  Platform.OS === 'ios' ? {fontSize: 10} : {fontSize: 9},
                  {color: Colors.white, padding: 10},
                ]}>
                {desc}
              </Text>
            </View>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const StatusBar = (props: any) => {
  const {state} = useContext(AppContext);
  const {isDarkTheme} = state;
  const {width, height} = useDimension();

  const [pointArray, setPointArray] = useState<Array<number>>([]);
  const [{visible1, visible2, visible3, visible4}, setVisible] = useState({
    visible1: false,
    visible2: false,
    visible3: false,
    visible4: false,
  });

  const lineWidth = width / 2 - 70 - (width * 15) / 100;
  const curPoints = props?.data?.points; // ეს არის სერვისის მიერ დაბრუნებული მნიშვნელობა

  useEffect(() => {
    setPointArray([]);
    if (props.data?.categoryPointInfo)
      props.data?.categoryPointInfo.map((point: any, index: number) => {
        if (index !== 0) {
          setPointArray(prev => [...(prev || []), point.point]);
        }
      });
  }, [props.data?.categoryPointInfo]);

  const _progressValue = (value: number, points: number) => {
    const mod = points / lineWidth;
    return value / mod;
  };

  const getMax = (value: number, mod: number) => {
    if (value < lineWidth) {
      return value;
    } else if (value === lineWidth) {
      return lineWidth;
    } else if (value > lineWidth) {
      return lineWidth;
    }
  };

  const activeCategoryStandart = {
    backgroundColor: Colors.standard,
    borderWidth: 0,
  };

  const activeCategorySilver = {
    backgroundColor: Colors.silver,
    borderWidth: 0,
  };

  const activeCategoryGold = {
    backgroundColor: Colors.gold,
    borderWidth: 0,
  };

  const activeCategoryPlatinum = {
    backgroundColor: Colors.platinum,
    borderWidth: 0,
  };

  const inActiveCategory = {
    backgroundColor: isDarkTheme ? Colors.black : Colors.white,
    borderWidth: 1,
    borderColor: isDarkTheme ? Colors.white : Colors.black,
  };

  return (
    <View style={{position: 'relative'}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() =>
              setVisible({
                visible1: !visible1,
                visible2: false,
                visible3: false,
                visible4: false,
              })
            }
            style={[
              styles.round,
              props?.data?.category >= 1
                ? activeCategoryStandart
                : inActiveCategory,
              {borderColor: isDarkTheme ? Colors.white : Colors.black},
            ]}>
            <View
              style={[
                styles.checkmark,
                {
                  borderBottomColor: isDarkTheme ? Colors.white : Colors.black,
                  borderRightColor: isDarkTheme ? Colors.white : Colors.black,
                },
              ]}
            />
          </TouchableOpacity>
        </View>

        <View style={{position: 'relative'}}>
          <View
            style={[
              styles.line,
              {width: lineWidth},
              {borderColor: isDarkTheme ? Colors.white : Colors.black},
            ]}
          />
          <View
            style={[
              styles.line,
              {
                width: getMax(_progressValue(curPoints, pointArray[0]), 1),
                backgroundColor: Colors.standard,
                position: 'absolute',
              },
            ]}
          />
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() =>
              setVisible({
                visible1: false,
                visible2: !visible2,
                visible3: false,
                visible4: false,
              })
            }
            style={[
              styles.round,
              props?.data?.category >= 2
                ? activeCategorySilver
                : inActiveCategory,
            ]}>
            <View
              style={[
                styles.checkmark,
                {
                  borderBottomColor: isDarkTheme ? Colors.white : Colors.black,
                  borderRightColor: isDarkTheme ? Colors.white : Colors.black,
                },
              ]}
            />
          </TouchableOpacity>
        </View>

        <View style={{position: 'relative'}}>
          <View
            style={[
              styles.line,
              {width: lineWidth},
              {borderColor: isDarkTheme ? Colors.white : Colors.black},
            ]}
          />
          <View
            style={[
              styles.line,
              {
                width: getMax(
                  _progressValue(
                    curPoints - pointArray[0],
                    pointArray[1] - pointArray[0],
                  ),
                  2,
                ),
                backgroundColor: Colors.silver,
                position: 'absolute',
              },
            ]}
          />
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() =>
              setVisible({
                visible1: false,
                visible2: false,
                visible3: !visible3,
                visible4: false,
              })
            }
            style={[
              styles.round,
              props?.data?.category >= 3
                ? activeCategoryGold
                : inActiveCategory,
            ]}>
            <View
              style={[
                styles.checkmark,
                {
                  borderBottomColor: isDarkTheme ? Colors.white : Colors.black,
                  borderRightColor: isDarkTheme ? Colors.white : Colors.black,
                },
              ]}
            />
          </TouchableOpacity>
          <View style={{position: 'relative'}}>
            <View
              style={[
                styles.line,
                {width: lineWidth},
                {borderColor: isDarkTheme ? Colors.white : Colors.black},
              ]}
            />
            <View
              style={[
                styles.line,
                {
                  width: getMax(
                    _progressValue(
                      curPoints - pointArray[1],
                      pointArray[2] - pointArray[1],
                    ),
                    3,
                  ),
                  backgroundColor: Colors.gold,
                  position: 'absolute',
                },
              ]}
            />
          </View>
        </View>
        <TouchableOpacity
          onPress={() =>
            setVisible({
              visible1: false,
              visible2: false,
              visible3: false,
              visible4: !visible4,
            })
          }
          style={[
            styles.round,
            {borderColor: isDarkTheme ? Colors.white : Colors.black},
            props?.data?.category === 4
              ? activeCategoryPlatinum
              : inActiveCategory,
          ]}>
          <View
            style={[
              styles.checkmark,
              {
                borderBottomColor: isDarkTheme ? Colors.white : Colors.black,
                borderRightColor: isDarkTheme ? Colors.white : Colors.black,
              },
            ]}
          />
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          marginTop: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '45%',
          }}>
          <ProgressCircle
            hide={props.hide}
            index={0}
            visible={visible1}
            onBlur={() =>
              setVisible({visible1: false, visible2, visible3, visible4})
            }
            title={`${state?.t('common.standart')}`}
            desc={`${state?.t('infoText.standartText')} ${
              props?.data?.categoryPointInfo?.length &&
              props?.data?.categoryPointInfo[0]?.pointsLeft
            } ${state?.t('common.point')}`}
          />
          <ProgressCircle
            hide={props.hide}
            index={1}
            visible={visible2}
            onBlur={() =>
              setVisible({visible1, visible2: false, visible3, visible4})
            }
            title={`${state?.t('common.silver')}`}
            desc={`${state?.t('infoText.silverText')} ${
              props?.data?.categoryPointInfo?.length &&
              props?.data?.categoryPointInfo[1]?.pointsLeft
            } ${state?.t('common.point')}`}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '40%',
          }}>
          <ProgressCircle
            hide={props.hide}
            index={2}
            visible={visible3}
            onBlur={() =>
              setVisible({visible1, visible2, visible3: false, visible4})
            }
            title={`${state?.t('common.gold')}`}
            desc={`${state?.t('infoText.goldText')} ${
              props?.data?.categoryPointInfo?.length &&
              props?.data?.categoryPointInfo[2]?.pointsLeft
            } ${state?.t('common.point')}`}
          />
          <ProgressCircle
            hide={props.hide}
            index={3}
            visible={visible4}
            onBlur={() =>
              setVisible({visible1, visible2, visible3, visible4: false})
            }
            title={`${state?.t('common.platin')}`}
            desc={`${state?.t('infoText.platinumText')} ${
              props?.data?.categoryPointInfo?.length &&
              props?.data?.categoryPointInfo[3]?.pointsLeft
            } ${state?.t('common.point')}`}
          />
        </View>
      </View>
    </View>
  );
};
export default StatusBar;

const styles = StyleSheet.create({
  round: {
    position: 'relative',
    borderRadius: 15,
    width: 30,
    height: 30,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{rotate: '45deg'}],
  },

  checkmark: {
    borderBottomWidth: 2,
    borderRightWidth: 2,
    width: 7,
    height: 10,
    position: 'relative',
    top: -1,
    left: -1,
  },

  line: {
    height: 8,
    borderColor: Colors.white,
    borderWidth: 1,
  },
  dropDown: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    //zIndex: 100,
    //backgroundColor: '#a8a7a761',
  },
});
