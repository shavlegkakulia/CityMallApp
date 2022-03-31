import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {Modal, StatusBar, StyleSheet, View} from 'react-native';
import {AppContext} from './AppContext/AppContext';
import AppStack from './Navigation/AppStack';
import {Colors} from './Colors/Colors';
import axios from 'axios';
import AuthService, {IInterceptop} from './Services/AuthService';
import translateService from './Services/translateService';
import AsyncStorage from './Services/StorageService';
import {default_lang_key, locale_key} from './lang';
import SplashScreen from 'react-native-splash-screen';
import Video from 'react-native-video';

const AppIndex = () => {
  const {state, setGlobalState} = useContext(AppContext);
  const {isDarkTheme} = state;

  const [userToken, setUserToken] = useState<string>('');
  const AxiosInterceptor = useRef<IInterceptop[]>([]);
  const [initialized, setInitialized] = useState(true);
  const [videoEnded, seVideoEnded] = useState(false);

  const RegisterCommonInterceptor = () => {
    let requestInterceptor = axios.interceptors.request.use((config: any) => {
      config.headers['langcode'] = translateService.lang === default_lang_key ? 'ka-GE' : 'en-US'; // || default_lang_key;
      config.headers['theme'] = isDarkTheme ? 'dark' : 'light';
      return config;
    });
    let responseInterceptor = axios.interceptors.response.use(
      (response: any) => {
        if (!response.config.objectResponse || response.data.expires_in) {
          return Promise.resolve(response);
        }
        return Promise.resolve(response);
      },
    );
    return {
      unsubscribe: () => {
        axios.interceptors.request.eject(requestInterceptor);
        axios.interceptors.response.eject(responseInterceptor);
      },
    };
  };

  let initialize = (lang?: string) => {
    translateService.use(
      lang || default_lang_key,
      t => {
        setGlobalState({lang: lang});
        setGlobalState({translates: t});
      },
      e => {
        console.log(e);
      },
    );

    setInitialized(true);

    SplashScreen.hide();
  };

  const logOut = async () => {
    await AuthService.SignOut();
    setUserToken('');
    setGlobalState({isAuthenticated: false});
  };

  useEffect(() => {
    //console.log('Developer <--Avtandil Shaburishvili, 08.04.2021--> ')
    AuthService.getToken().then(data => {
      setUserToken(data || '');
    });
  }, [userToken]);

  useEffect(() => {
    const transSub = translateService.subscribe((key: string) => {
      setInitialized(false);
      AsyncStorage.setItem(locale_key, key)
        .then(res => {
          if (res !== null) {
            setInitialized(true);
          }
          setInitialized(true);
        })
        .catch(() => setInitialized(true));
    });

    return () => {
      transSub.unsubscribe();
    };
  }, []);

  useEffect(() => {
    AsyncStorage.getItem(locale_key)
      .then(res => {
        if (res !== null) {
          initialize(res);
        } else {
          initialize();
        }
      })
      .catch(() => {
        initialize();
      });
  }, []);

  useEffect(() => {
    AxiosInterceptor.current = [
      RegisterCommonInterceptor(),
      AuthService.registerAuthInterceptor(logOut),
    ];
    return () => {
      AxiosInterceptor.current.forEach(sub => sub.unsubscribe());
    };
  }, [userToken, isDarkTheme]);

  useEffect(() => {
    AsyncStorage.getItem('isDarkTheme').then(res => {
      if (res != null) {
        if (res == '1') {
          setGlobalState({isDarkTheme: true});
        } else {
          setGlobalState({isDarkTheme: false});
        }
      } else {
        AsyncStorage.setItem('isDarkTheme', '1').then(_ => {
          setGlobalState({isDarkTheme: true});
        });
      }
    });
  }, []);

  return (
    <View style={styles.container} >
      <Modal visible={!videoEnded} animationType="fade">
        <View style={styles.container}>
          <Video
            source={require('./assets/images/video.mp4')}
            onEnd={() => seVideoEnded(true)}
            resizeMode={'cover'}
            style={styles.video}
          />
          <View style={styles.header} />
        </View>
      </Modal>
      <StatusBar backgroundColor={isDarkTheme ? Colors.black : Colors.white} barStyle={isDarkTheme ? 'light-content' : 'dark-content'} />
      <AppStack init={initialized} />
    </View>
  );
};

export default AppIndex;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.black, 
    flex: 1,
    position: 'relative'
  },
  header: {
    height: 50,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.black
  },
  video: {
    flex: 1,
  },
});
