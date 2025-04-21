import 'fast-text-encoding';  // or perhaps this
import React, { useCallback, useEffect } from 'react';
import { Provider } from "react-redux";
import configureStore from "./App/Redux/store";


import { Linking, LogBox, PermissionsAndroid, Platform, StyleSheet } from 'react-native';


import Routes from "./App/Navigations/Routes";
import '@ethersproject/shims';
import { GetNotifiactionstatus, SetNotifiactionstatus } from './App/Utilities/usestorage';
import { isEmpty } from './App/Utilities/commenfuctions';
import Toast from 'react-native-toast-message';
import useInitializeWalletKit from './App/NewWalletConnect/hooks/useInitializeWalletKit';
import useWalletKitEventsManager from './App/NewWalletConnect/hooks/useWalletKitEventsManager';


LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreLogs(['Error: ...']);

LogBox.ignoreAllLogs();

const store = configureStore();



const App = ({ navigation }) => {

  const initialized = useInitializeWalletKit()
  console.log('initialized---->', initialized);
  useWalletKitEventsManager(initialized);

  useEffect(() => {
    requestNotificationPermission()

      , []
  })



  LogBox.ignoreLogs
    (['Warning: The provided value \'moz',
      'Warning: The provided value \'ms-stream'
    ])

  const requestNotificationPermission = async () => {
    try {
      let status = GetNotifiactionstatus()

      if (Platform.OS === 'android') {



        const response = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATION
        )
        if (Platform.Version <= 11) {
          if (isEmpty(status)) {
            SetNotifiactionstatus(true)


          }
          else {
            SetNotifiactionstatus(status)

          }
        }
        else {
          if (isEmpty(status)) {
            SetNotifiactionstatus(true)

          }
          else {
            SetNotifiactionstatus(status)

          }

        }

      } else {
        //  configurePushNotifications()
      }
    } catch (err) {
      if (DEV) console.warn('requestNotificationPermission error: ', err)
    }
  }

  const pair = useCallback(async (uri) => {
    console.log('pairUririri---->', uri);
    try {
      // ModalStore.open('LoadingModal', {loadingMessage: 'Pairing...'});
      dispatch(openModal({
        modal: "LoadingModal",
        modalData: { loadingMessage: 'Pairing...' }
      }))
      await walletKit.pair({ uri });
    } catch (error) {
      dispatch(openModal({
        modal: "LoadingModal",
        modalData: { errorMessage: 'There was an error App pairing.' }
      }))
    }
  }, []);

  const deeplinkHandler = useCallback(
    ({ url }) => {
      const isLinkMode = url.includes('wc_ev');
      // SettingsStore.setIsLinkModeRequest(isLinkMode);

      if (isLinkMode) {
        return;
      } else if (url.includes('wc?uri=')) {
        const uri = url.split('wc?uri=')[1];
        pair(decodeURIComponent(uri));
      } else if (url.includes('wc:')) {
        pair(url);
      } else if (url.includes('wc?')) {
        dispatch({
          type: "openModal",
          data: {
            modal: "LoadingModal",
            modalData: { loadingMessage: 'Pairing...' }
          }
        })
      }
    },
    [pair],
  );

  useEffect(() => {

    async function checkInitialUrl() {
      const initialUrl = await Linking.getInitialURL();
      console.log('initialUrl---->', initialUrl);
      if (!initialUrl) {
        return;
      }

      deeplinkHandler({ url: initialUrl });
    }

    const sub = Linking.addEventListener('url', deeplinkHandler);

    checkInitialUrl();
    return () => sub.remove();
  }, [deeplinkHandler]);


  return (
    <>
      {/* <Provider store={store}> */}

      <Routes />
      {/* <View style={{ backgroundColor: 'red' }}>
        <Text style={{ color: '#000' }}>App</Text>
        <AddIcon />
      </View> */}
      {/* </Provider> */}
    </>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
