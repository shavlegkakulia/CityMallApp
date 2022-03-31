import React, {useContext, useState} from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {AppContext} from '../../AppContext/AppContext';
import {Colors} from '../../Colors/Colors';
import data from '../../Constants/ToggleData';
import { navigate } from '../../Services/NavigationServices';

export interface ToggleListProps {
  name: string;
  icon: ImageSourcePropType;
  Content: React.FC;
  routeName?: string;
}

const ToggleDropdownLayout: React.FC<ToggleListProps> = props => {
  const {name, icon, Content, routeName} = props;
  const [collapse, setCollapse] = useState<boolean>(false);
  const {state} = useContext(AppContext);
  const {isDarkTheme} = state;

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          if(!routeName) {
            setCollapse(!collapse)
          } else {
            navigate(routeName);
          }
        }}
        style={[
          styles.main,
          {backgroundColor: isDarkTheme ? Colors.black : Colors.white},
        ]}>
        <Image
          source={icon}
          style={[
            styles.iconStyle,
            {transform: collapse ? [{rotate: '90deg'}] : [{rotate: '0deg'}]},
          ]}
        />
        <Text
          style={[
            styles.name,
            {fontWeight: collapse ? '700' : '400'},
            {color: isDarkTheme ? Colors.white : Colors.black},
          ]}>
          {state?.t(name)}
        </Text>
      </TouchableOpacity>
      {collapse ? <Content /> : null}
    </>
  );
};

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  name: {
    color: Colors.white,
    fontSize: 10,
    fontFamily: 'HM pangram',
    textTransform: 'uppercase',
    left: 5,
  },
  iconStyle: {
    width: 7,
    height: 7,
  },
});
export default ToggleDropdownLayout;
