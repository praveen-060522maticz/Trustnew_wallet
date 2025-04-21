import React, { useContext, useState, useEffect, useCallback } from "react";
import {
  SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, ToastAndroid, FlatList, Switch, PermissionsAndroid,
  Linking,
  Platform,
  Alert,
  BackHandler,
} from "react-native";
import Header from "../../Navigations/Header";
import { borderradius, deviceheight, devicewidth } from "../../Utilities/Dimensions";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Fonts } from "../../Utilities/fonts";
import themeContext from "../../Utilities/themecontext";
import LinearGradient from "react-native-linear-gradient";
import Clipboard from "@react-native-clipboard/clipboard";

// import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Toastfn } from "../../Utilities/toast";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
// import { connector, connect_Wallet_WC2, getcurrensession_WC2, pair } from "../../WalletConnect/WC2";
import { getSdkError } from "@walletconnect/utils";
import { AddScandetails } from "../../Redux/Actions/scandetails.";
import QRcodeScanner from "../../Components/QRcodeScanner";




export default function Walletconnectqr({ navigation, route }) {



  const theme = useContext(themeContext);
  const style = styles(theme);

  const dispatch = useDispatch();

  const setScanDetails = (item) => dispatch(AddScandetails(item));
  const {

    Session

  } = useSelector((state) => state.wcreducer);
  var test = useSelector((state) => state.wcreducer);


  const [qrCodeData, SetQrCodeData] = useState("");
  const path = route?.params?.path
  const from = route?.params?.from


  useEffect(() => {

    const onBackPress = () => {
      navigation.navigate(path, { data: "" })
      return true;
    };
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );

    return () => {
      subscription.remove()
      // BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    };
  }, [navigation])

  const CopyAddress = (e) => {
    var d = e ? e : qrCodeData
    var copy = d
    console.log('pathpath---->', path, d);
    Clipboard.setString(copy);
    nav(copy);
    setScanDetails(copy);
  };


  const onSuccess = (e) => {
    console.log('sfusuifsg---->', e);
    try {
      SetQrCodeData(e.data);
      CopyAddress(e.data)
      if (String(e.data)?.substring(0, 3) == ('wc:')) {

        dispatch({
          type: "Session",
          data: {
            url: e?.data,
            StopAction: true,
            Loader: true
          }
        })

      }
    }
    catch (err) {
      console.log("onSuccess_Error", err);
    }
  }


  const nav = (data) => {

    path ?
      path == "Sendcurrency" ?
      navigation.navigate(path, { data: data, from: from })
        // navigation.navigate("Walletmain", {
        //   screen: 'Wallethomenav',
        //   params: {
        //     screen: 'Sendcurrency',
        //     params: {
        //       data: data, from: from
        //     },
        //   },
        // }) 
        :
        navigation.navigate(path, { data: data, from: from })
      :
      navigation.goBack("");
  };

  useFocusEffect(
    React.useCallback(() => {
        const onBackPress = () => {
            navigation.goBack();
            return true;
        };

        const subscription = BackHandler.addEventListener(
            "hardwareBackPress",
            onBackPress
        );
        return () => subscription.remove();

    }, [navigation])
);

  return (
    <>
    {/* <SafeAreaView style={style.container} > */}
      {/* <StatusBar backgroundColor={theme.background} /> */}

        <Header title={"Scan Address"} />

          <QRcodeScanner
            onRead={onSuccess}
          />

    {/* </SafeAreaView> */}
    </>
  )
}

const styles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background
    },



    para: {
      fontSize: RFPercentage(2.25),
      color: "#9ACFFF",
      fontFamily: Fonts.Medium,
      textAlign: 'center',
    },
    parabtn: {
      fontSize: RFPercentage(2.25),
      color: "#9ACFFF",
      fontFamily: Fonts.Medium,
      textAlign: 'center',
      marginTop: "7%"
    },
    paragray: {
      fontSize: RFPercentage(1.55),
      color: "#8C9BAA",
      fontFamily: Fonts.Medium,
      textAlign: 'center',
      lineHeight: 15

    },

    paralite: {
      fontSize: RFPercentage(1.85),
      color: "#37607F",
      fontFamily: Fonts.Medium,
      textAlign: 'center'
    },
    parablue: {
      fontSize: RFPercentage(1.95),
      color: "#0091FF",
      fontFamily: Fonts.Regular,
      textAlign: 'center'
    },

    create_button: {
      marginTop: "5%",
      width: "100%",
      alignSelf: "center"
    },

    contentsec: {
      justifyContent: "center",
      alignSelf: "center",
      marginBottom: "7%"
    },
    gradTitle: {
      fontSize: RFPercentage(2.85),
      color: "#9ACFFF",
      fontFamily: Fonts.Medium,
      textAlign: "center"

    },
    gradTitle1: {
      fontSize: RFPercentage(2.55),
      color: "#9ACFFF",
      fontFamily: Fonts.Medium,
      textAlign: "left"

    },





  })