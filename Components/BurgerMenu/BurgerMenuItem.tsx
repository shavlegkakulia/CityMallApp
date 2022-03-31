import React, {
    useContext,
    useEffect,
    useState
} from "react";
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { AppContext } from "../../AppContext/AppContext";
import { Colors } from "../../Colors/Colors";
import { IDrawerItem } from "../../Constants/DrawerItems";
import { navigate } from "../../Services/NavigationServices";
import AsyncStorage from "../../Services/StorageService";
import { subscriptionService } from "../../Services/SubscriptionServive";
import translateService from "../../Services/translateService";
import BurgerMenuLocation from "./BurgerMenuLocation";

interface IBmItem {
    item: IDrawerItem
};

const BurgerMenuItem: React.FC<IBmItem> = ({ item }) => {
    const { state, setGlobalState } = useContext(AppContext);
    const { isDarkTheme, clientDetails } = state;
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
    const [isSkip, setIsSkip] = useState<boolean>(false);
    
    const handleOnMenuItemPress = () => {
        if (item.location?.length == 0) {
            if((clientDetails.length === 0 || isSkip) && item.id === 10) {
                isSkip ? navigate('AuthScreenWithSkip', { skip: true }) : navigate('AboutUs', { routeId: 2 });
                return;
            } else {
                return navigate(item.routeName!, {name: item.name});
            };
            
        } else {
            if (item.objectTypeId !== undefined) {
                return [setGlobalState({ objectTypeId: item.objectTypeId }), setIsCollapsed(!isCollapsed)]
            } else {
                return setIsCollapsed(!isCollapsed);
            }
        };
    };

    useEffect(() => {
        const subscription = subscriptionService?.getData()?.subscribe(data => {
          if (data?.key === 'CLOSE_ALL_MENUS') {
            setIsCollapsed(false);
          }
        });
    
        return () => {
          subscriptionService?.clearData();
          subscription?.unsubscribe();
        };
      }, []);


    const themeTextColor = {
        color: isDarkTheme ? Colors.white : Colors.black
    };
    const notRegisteredTextColor = {
        color: Colors.red
    }

    useEffect(() => {
        AsyncStorage.getItem('skip_token').then(res => {
            if(res === null) {
                setIsSkip(false);
            } else {
                setIsSkip(true);
            }
        }).catch(() => setIsSkip(false));
    }, [clientDetails]);

    return (
        <View style={{ marginBottom: 20 }}>
            <TouchableOpacity style={styles.mainContStyle}
                onPress={handleOnMenuItemPress}>
                {
                    item?.location?.length! !== 0 ?
                        <Image style={[styles.arrowImgStyle, { transform: [{ rotate: isCollapsed ? '90deg' : '0deg' }] }]}
                        
                            source={isDarkTheme? require('../../assets/images/arrow-sm.png') : require('../../assets/images/arrow-black.png')} />
                        :
                        null
                }
                <Text style={[styles.listName, ((clientDetails.length === 0 || isSkip) && item.id === 10)? notRegisteredTextColor :  themeTextColor]}>
                    {state?.t(item.name || '')}
                </Text>
            </TouchableOpacity>
            {
                isCollapsed &&
                <View style={{ marginBottom: 5 }}>
                    {
                        item?.location?.map((el, i) => (
                            <BurgerMenuLocation item={el} key={i} categories={item.categories} isPremium={el.isPremium} routeName={item.routeName!} pageName={item.name} />
                        ))
                    }
                </View>
            }
        </View>
    );
};

export default BurgerMenuItem;

const styles = StyleSheet.create({
    mainContStyle: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    arrowImgStyle: {
        width: 7,
        height: 7,
    },

    listName: {
        fontFamily: 'HMpangram-Bold',
        fontSize: 14,
        lineHeight: 17,
        marginLeft: 5,
        textTransform: "uppercase"
    },

    subMenuListText: {
        fontFamily: 'HMpangram-Medium',
        fontSize: 14,
        lineHeight: 17,
        fontWeight: '500',
        marginVertical: 8
    }
});
