import React, { useCallback, useEffect, useState } from "react";
import { Linking, Platform, StatusBar } from "react-native"
import StackNavigator from "./Stacknavigator";
import {

  NavigationContainer
} from "@react-navigation/native";
import theme from "../Utilities/theme";
import themeContext from "../Utilities/themecontext";
import { Getmobiletheme, Setmobiletheme } from "../Utilities/usestorage";
import { EventRegister } from 'react-native-event-listeners'
import { localnotification } from "../Utilities/pushnotification";
import messaging from '@react-native-firebase/messaging';
import { useDispatch } from "react-redux";
import Toast from "react-native-toast-message";


const Routes = () => {
  const [mode, setMode] = useState("light");
  const dispatch = useDispatch()

  useEffect(() => {
    if (mode == "dark") {
      setMode("dark")
      StatusBar.setBarStyle('light-content');

    }
    else {
      setMode("light")
      StatusBar.setBarStyle('dark-content');
    }

  }, [mode])

  useEffect(() => {
    const theme = Getmobiletheme()
    if (!theme) {
      Setmobiletheme("light")
      setMode("light")
    }
    else {
      Setmobiletheme(theme)
      setMode(theme)
    }
  }, [])

  useEffect(() => {
    let eventListener = EventRegister.addEventListener(
      "mobile_theme",
      (data) => {
        setMode(data);
        Setmobiletheme(data)

      }
    );
    return () => {
      EventRegister.removeEventListener(eventListener);
    };
  });
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      var data = {
        title: remoteMessage.notification.title,
        message: remoteMessage.notification.body,
      }
      localnotification(data)

    })
    return unsubscribe;

  }, [])




  return (
    <themeContext.Provider value={mode === "light" ? theme.light : theme.dark}  >
      <NavigationContainer>
        <Toast
          position="top"
          topOffset={Platform.select({ ios: 80, android: 0 })}
        />
        <StackNavigator />
      </NavigationContainer>
      <Toast
        position="top"
        topOffset={Platform.select({ ios: 80, android: 0 })}
      />
    </themeContext.Provider>
  )
}
export default Routes;