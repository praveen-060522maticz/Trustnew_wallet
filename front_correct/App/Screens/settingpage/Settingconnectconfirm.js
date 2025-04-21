import React, { useContext } from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View, BackHandler, Image, Pressable } from "react-native";
import Header from "../../Navigations/Header";
import { borderradius, deviceheight, devicewidth } from "../../Utilities/Dimensions";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Fonts } from "../../Utilities/fonts";
import Button from "../../Components/Button";
import Walleticon from '../../Assets/Icons/wallet.svg';
import Checkicon from '../../Assets/Icons/check.svg';
import Walleticon1 from '../../Assets/Icons/wallet1.svg';
import Checkicon1 from '../../Assets/Icons/check1.svg';
import { CHAIN_INFO } from "../WalletHome/useweb3";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { Approvesession_WC2, connector, getcurrensession_WC2 } from "../../WalletConnect/WC2";
import { Toastfn } from "../../Utilities/toast";
import { C } from "../../Utilities/colors";
import themeContext from "../../Utilities/themecontext";
import Backarrow from '../../Assets/caexicons/backarrow1.svg'
import Backarrow1 from '../../Assets/caexicons/backarrow2.svg'
import { Card } from 'react-native-shadow-cards';
const isPhone = devicewidth < 600;

export default function Settingconnectconfirm({ navigation, route }) {
  const theme = useContext(themeContext);
  const style = styles(theme);
  const { Session, from, Site_Detail } = useSelector(
    (state) => state.wcreducer
  );
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true;
      };
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [])
  );

  const dispatch = useDispatch();
  const Approve = async () => {
    try {

      var data = await Approvesession_WC2(
        {
          id: Session?.payload?.id,
          relayProtocol: Session?.payload?.params?.relays[0].protocol,
          namespaces: Session?.namespaces,
        }
      );
      dispatch({
        type: "Session",
        data: {
          Connected: true, Loader: false, time: new Date(), topic: data.topic,
          WC_Connector: connector, StopAction: false,
          url: null
        },
      });

      var get_curre_session = getcurrensession_WC2()
      dispatch({
        type: "Session",
        data: { All_Session: get_curre_session },
      });

      if (route?.params?.from) {
        navigation.navigate("Dappweb", { Approve: true });
      }
      if (from) {
        dispatch({
          type: "url",
          data: from
        });
        navigation.navigate("Dappweb");

      }
      else {
        navigation.goBack()
      }
    } catch (e) {
      console.error("Approve-error", e);
      Toastfn("Try Again")

    }
  };
  const current_chain = (chainId) => CHAIN_INFO.filter(
    (it) => it.chainId == chainId
  )?.pop();

  const Current_Network_detail = CHAIN_INFO.filter(
    (it) => it.currency == Session?.lp?.currencyName
  )?.pop();
  return (
    <SafeAreaView style={style.container} >
      <StatusBar backgroundColor={theme.background} />
      <View style={{ flex: 1, backgroundColor: theme.background }} >
        <View style={{
          width: "90%",
          flexDirection: "row",
          height: deviceheight * 0.10,
          alignItems: "center", alignSelf: "center",
        }} >
          <Text style={style.headertext} >Wallet Connect</Text>
          <Pressable
            onPress={() => navigation.goBack()}
          >

            {theme.theme == "light" ? <Backarrow1 width={isPhone ? devicewidth * 0.05 : devicewidth * 0.025} height={devicewidth * 0.0545} style={style.arrowcontainer} /> : <Backarrow width={isPhone ? devicewidth * 0.05 : devicewidth * 0.025} height={devicewidth * 0.045} style={style.arrowcontainer} />}
          </Pressable>
        </View>

        <View style={style.box_container} >


          <Card style={style.card_container} >
            <View style={style.topsec}>
              <Image
                source={{
                  uri: Site_Detail?.icons[0] ??
                    Site_Detail?.icons[0]
                }}
              />
              <Text style={style.parahead}>  {Site_Detail?.name ??
                Site_Detail?.name}{" "}</Text>
              <Text style={style.paradesc}>
                {" "}
                {Site_Detail?.description ??
                  Site_Detail?.description}</Text>
            </View>
            <View style={style.inputrow}>

              <View style={style.inputsec}>
                <View style={style.leftinput}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {Current_Network_detail?.img}
                    <Text style={style.parahead1}> {current_chain(Session?.chainId)?.currency} </Text>
                  </View>


                  <Text style={style.parahead2}> {Session?.lp?.walletaddress} </Text>


                </View>


              </View>
            </View>
            <View style={style.detailsec}>
              <View style={style.detaillist}>
                {theme.theme == "dark" ? <Walleticon1 width={devicewidth * 0.065} height={deviceheight * 0.028} /> : <Walleticon width={devicewidth * 0.065} height={deviceheight * 0.028} />}
                <Text style={style.paracheck}>View your wallet balance and activity</Text>
              </View>
              <View style={style.detaillist}>
                {theme.theme == "dark" ? <Checkicon1 width={devicewidth * 0.075} height={deviceheight * 0.035} /> : <Checkicon width={devicewidth * 0.075} height={deviceheight * 0.035} />}
                <Text style={style.paracheck}>Request approval for transactions</Text>
              </View>
            </View>



            <TouchableOpacity
              style={style.create_button}
              onPress={() => Approve()}>
              <Button title={"Continue"} colors={['#307CD1', '#31B4A6']} />
            </TouchableOpacity>

          </Card>



        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background
    },
    box_container: {
      // height: "90%",
      paddingHorizontal: "3%",
      alignItems: 'center',

    },
    card_container: {
      width: "92.5%",
      marginTop: "10%",
      backgroundColor: theme.theme == "dark" ? "#26263D" : theme.secondarybg,
      alignSelf: "center",
      borderRadius: borderradius * 1,
      paddingVertical: "7%",
      paddingHorizontal: "7%",
      // shadowColor: '#000',
      // shadowOffset: { width: 0, height: 2 },
      // shadowOpacity: 1,
      // shadowRadius: 4,
      // elevation: 5,
      height: "80%",
      alignItems: "center"



    },

    topsec: {
      alignItems: 'center'
    },
    detailsec: {
      paddingVertical: "5%",
      alignSelf: "flex-start",
    },
    detaillist: {
      flexDirection: 'row',
      gap: 10,
      marginVertical: "2%"

    },
    para: {
      fontSize: RFPercentage(1.65),
      color: "#9ACFFF",
      fontFamily: Fonts.Regular,
      textAlign: 'left'
    },
    parahead: {
      fontSize: RFPercentage(1.75),
      color: theme.text,
      fontFamily: Fonts.Regular,
      textAlign: 'left'
    },
    parahead1: {
      fontSize: RFPercentage(1.75),
      color: theme.theme == "dark" ? "#000" : "#fff",
      fontFamily: Fonts.Regular,


    },
    parahead2: {
      fontSize: RFPercentage(1.75),
      color: theme.theme == "dark" ? "#000" : "#fff",
      fontFamily: Fonts.Regular,
      textAlign: 'left',
      marginLeft: "4%",
      marginTop: "1.5%"

    },
    paracheck: {
      fontSize: RFPercentage(1.55),
      color: theme.text,
      fontFamily: Fonts.Regular,
      textAlign: 'left'
    },
    paradesc: {
      fontSize: RFPercentage(1.55),
      color: theme.text,
      fontFamily: Fonts.Regular,
      textAlign: 'left',
      marginTop: "4%"
    },

    paralite: {
      fontSize: RFPercentage(1.85),
      color: "#37607F",
      fontFamily: Fonts.Regular,
      textAlign: 'left'
    },
    parablue: {
      fontSize: RFPercentage(1.85),
      color: "#0091FF",
      fontFamily: Fonts.Regular,
      textAlign: 'center'
    },

    create_button: {
      marginTop: "10%",
      width: "100%",
      alignSelf: "center"
    },

    contentsec: {
      justifyContent: "center",
      alignSelf: "center",
      marginBottom: "2%"
    },
    gradTitle: {
      fontSize: RFPercentage(2.85),
      color: "#9ACFFF",
      fontFamily: Fonts.Regular,
      textAlign: "center"

    },
    gradTitle1: {
      fontSize: RFPercentage(2.55),
      color: "#9ACFFF",
      fontFamily: Fonts.Regular,
      textAlign: "center"

    },
    inputtitle: {
      fontSize: RFPercentage(2.05),
      color: "#9ACFFF",
      fontFamily: Fonts.Regular,
    },
    expsec: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: "3%"
    },

    inputsec: {
      backgroundColor: theme.theme == "dark" ? "#E8E9EF" : "#1D1B24",
      borderRadius: 7,
      width: "100%",
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: "2%",
      paddingHorizontal: "4%",
      paddingVertical: "2.5%"
    },
    leftinput: {
      width: "100%",
      justifyContent: "center"
    },


    inputstyle: {
      paddingHorizontal: 10,
      color: "#9ACFFF",
      fontSize: RFPercentage(1.85),
      fontFamily: Fonts.Regular,
    },
    inputrow: {
      marginBottom: "4%",
      marginTop: "2%"

    },
    headertext: {
      position: "absolute",
      left: 0,
      right: 0,
      textAlign: "center",
      fontFamily: Fonts.Regular,
      fontSize: RFPercentage(2.5),
      color: theme.text
    },





  })