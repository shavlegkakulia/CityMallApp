import axios from 'axios';
import React, {useContext, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Linking,
  Modal,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {AppContext} from '../../AppContext/AppContext';
import {ICategories, ILocation} from '../../Constants/DrawerItems';
import {navigate} from '../../Services/NavigationServices';
import env from './../../config/env';

export interface IBmCategoriesItem {
  item?: ICategories;
  routeName: string;
  routeId?: number;
  pageName?: string;
  isPremium?: boolean;
}

interface IEmails {
  id: number;
  name: string;
  connectId: number;
  email: string;
}

const BurgerMenuCategories: React.FC<IBmCategoriesItem> = ({
  item,
  routeName,
  routeId,
  pageName,
  isPremium,
}) => {
  const {state} = useContext(AppContext);
  const {isDarkTheme} = state;
  const [emails, setEmails] = useState<IEmails[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getEmails = () => {
    setIsLoading(true);
    if (emails.length) {
      const emData = emails.filter(email => email.id === routeId);
      if (emData) {
        setIsLoading(false);
        Linking.openURL(`mailto:${emData[0].email}?subject=User's Question`);
      }
    }
    axios
      .get(`${env.API_URL}/api/Organisation/GetServiceCenters`)
      .then(res => {
        setIsLoading(false);
        if (res.data) {
          setEmails(res.data);
          const emData = res.data?.filter(
            (email: {id: number | undefined}) => email.id === routeId,
          );
          if (emData) {
            Linking.openURL(`mailto:${emData[0].email}?subject=User's Question`);
          }
        }
      })
      .catch(() => setIsLoading(false));
  };

  const handleNavigate = (navName: string, params: any) => {
    if (navName === 'ShopGuid' && params?.id === 2) {
      getEmails();
    } else {
      navigate(navName, {...params});
    }
  };

  return (
    <View style={styles.categoryView}>
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
      <TouchableOpacity
        style={styles.categoryItem}
        onPress={() =>
          handleNavigate(routeName!, {
            id: item?.id,
            routeId: routeId,
            name: pageName,
            isPremium: isPremium,
          })
        }>
        <Text
          style={[
            styles.categoryItemText,
            {color: isDarkTheme ? Colors.white : Colors.black},
          ]}>
          {state?.t(item?.name || '')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default BurgerMenuCategories;

const styles = StyleSheet.create({
  categoryView: {
    marginLeft: 10,
    marginVertical: 7,
  },

  categoryItem: {},

  categoryItemText: {},
});
