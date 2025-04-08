import React, { useCallback, useContext, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
} from "react-native";
import WebView from "react-native-webview";
import Header from "../../Navigations/Header";
import themeContext from "../../Utilities/themecontext";
import { CurrentWalletArray } from "../../Utilities/usestorage";
import { useFocusEffect } from "@react-navigation/native";
export default function Cryptobuy(props) {
  const theme = useContext(themeContext);
  const style = styles(theme);
  const [walletdata,setWalletdata]=useState("")



  useFocusEffect(
  useCallback(() => {
    let curentwallet=CurrentWalletArray()
    let data=curentwallet.filter((val)=>val.type== "Crypto")
    if(data[0]?.walletType=='multicoin'){
      var currrentwalletdata= data.filter((val)=>val.currency=='BNB')
    }
    else{
     
      var currrentwalletdata=data

    }
    setWalletdata(currrentwalletdata)
  },[])
  )

  return (
    <>
      <SafeAreaView style={style.container}>
        <Header title={"Buy Crypto"} />
        <WebView
          source={{
            uri:
              `https://exchange.mercuryo.io/?fiat_amount=%22%22&fiat_currency=%22%22&amount=%22%22&currency=%22%22%22` 
          }}
        />
      </SafeAreaView>
    </>
  )
}
const styles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    custsearch: {
      borderRadius: 30,
      backgroundColor: "#fff",
      margin: 15,
      // shadowOffset: 0,
    //   fontFamily: Fonts.Bold
    },
    container2: {
      backgroundColor: theme.background,
      padding: 16,
    },
    seperatorLine: {
      height: 0.5,
      backgroundColor: "grey",
    },
  });