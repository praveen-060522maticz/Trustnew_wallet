import { useCallback, useContext, useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { getSdkError } from '@walletconnect/utils';
import { useNavigation } from '@react-navigation/native';

// import { ModalHeader } from '@/components/Modal/ModalHeader';
import { useDispatch } from 'react-redux';
import { walletKit } from '../utils/WalletConnectUtills';
import { Card } from "react-native-shadow-cards";
import { BeatifyConsole, ImageComponent } from '../utils/common';
import themeContext from '../../Utilities/themecontext';
import Header from '../../Navigations/Header';
import { Fonts } from '../../Utilities/fonts';
import { CurrentWalletArray } from '../../Utilities/usestorage';
import { borderradius, deviceheight } from '../../Utilities/Dimensions';
import { C } from '../../Utilities/colors';
import Button from '../../Components/Button';
import { timeformat } from '../../Utilities/commenfuctions';
import { getRequestChainType } from '../utils/HelperUtil';


export default function SessionDetail({ route }) {
  const topic = route.params.topic;
  const nativagor = useNavigation();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const dispatch = useDispatch()
  const theme = useContext(themeContext);

  const session = useMemo(
    () =>
      walletKit.engine.signClient.session.values.find(s => s.topic === topic),
    [topic],
  );
  const namespaces = useMemo(() => session?.namespaces, [session]);
  const isLinkMode = session?.transportType === 'link_mode';
  BeatifyConsole("fawdfawdfwadwd", session)
  // Get necessary data from session
  const expiryDate = useMemo(
    () => new Date(session?.expiry * 1000),
    [session],
  );
  let wallet = CurrentWalletArray()
  const current_walletname = (walletaddress) =>
    wallet.filter(it => it.walletaddress == walletaddress)?.pop()?.walletname
console.log('walletwallet---->',wallet.filter(it => it.walletaddress == "TDDgocU8xqMnwDaW6gpmVkiYfZdKk1dj4V")?.pop()?.walletname);
  // Handle deletion of a session
  const onDeleteSession = useCallback(async () => {
    setDeleteLoading(true);
    try {
      console.log('tototoototototo---->', topic);
      await walletKit.disconnectSession({
        topic,
        reason: getSdkError('USER_DISCONNECTED'),
      });

      dispatch({
        type: "setSession",
        data: Object.values(walletKit.getActiveSessions())
      })
      nativagor.goBack();
    } catch (e) {
      console.log((e).message, 'error');
    }
    setDeleteLoading(false);
  }, [nativagor, topic]);

  const getChainType = getRequestChainType(session?.namespaces, {})
  const splitt = session?.namespaces?.[getChainType]?.accounts?.[0]?.split?.(":")
  const walletAddress = session?.namespaces?.[getChainType]?.accounts?.[0]?.split?.(":")?.[splitt.length - 1]
  console.log('walletAddress---->',getChainType, walletAddress, session?.namespaces?.[getChainType]?.accounts?.[0], session?.peer?.metadata?.icons?.[0]);
  return (
    <>
      {/* <SafeAreaView
        style={[styles.container, { backgroundColor: "#000" }]}
      >
        <View style={{ height: "75%" }} >
          <Card
            style={{
              width: "90%",
              marginTop: "5%",
              alignSelf: "center",
              borderWidth: 0.5,
              borderColor: "gray",
              paddingVertical: "2.5%",
              borderRadius: 10,
              height: "100%",
              backgroundColor: "#dddddd"
            }}
          >
            <View style={{ height: "15%", alignItems: "center", marginTop: "5%" }} >
              <ImageComponent icons={session?.peer?.metadata?.icons?.[0]} url={session?.peer?.metadata?.url} style={{ height: 80, width: 80, }} />
            </View>
            <View style={{ height: "70%", display: "flex", justifyContent: "space-evenly" }}>
              <View style={styles.datesContainer}>
                <Text style={{ color: "#000", textAlign: "center", width: "90%" }}>
                  {session?.peer?.metadata?.description}
                </Text>
              </View>
              <View style={[styles.divider, { backgroundColor: "#808080" }]} />

              <View style={styles.datesContainer}>
                <Text style={[styles.dateText, { color: "#000" }]}>WalletAddres</Text>
                <Text numberOfLines={1} style={{ color: "#000", width: "50%" }}>
                  {walletAddress}
                </Text>
              </View>
              <View style={[styles.divider, { backgroundColor: "#808080" }]} />
              <View style={styles.datesContainer}>
                <Text style={[styles.dateText, { color: "#000" }]}>name</Text>
                <Text numberOfLines={1} style={{ color: "#000", width: "50%" }}>
                  {session?.peer?.metadata?.name}
                </Text>
              </View>
              <View style={[styles.divider, { backgroundColor: "#808080" }]} />

              <View style={styles.datesContainer}>
                <Text style={[styles.dateText, { color: "#000" }]}>url</Text>
                <Text numberOfLines={1} style={{ color: "#000", width: "50%" }}>
                  {session?.peer?.metadata?.url}
                </Text>
              </View>
              <View style={[styles.divider, { backgroundColor: "#808080" }]} />
              <View style={styles.datesContainer}>
                <Text style={[styles.dateText, { color: "#000" }]}>Expiry</Text>
                <Text numberOfLines={1} style={{ color: "#000", width: "50%" }}>
                  {expiryDate.toDateString()} - {expiryDate.toLocaleTimeString()}
                </Text>
              </View>
              <View style={[styles.divider, { backgroundColor: "#808080" }]} />


            </View>
            <View style={styles.actionsContainer}>
              <TouchableOpacity disabled={deleteLoading} style={{ backgroundColor: "red", borderRadius: 20, height: 50, width: 120, alignItems: "center", justifyContent: "center" }} onPress={() => onDeleteSession()}>
                <Text style={{ textAlign: "center", fontWeight: "700", color: "#000" }}  >Delete</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </View>
      </SafeAreaView> */}

      <View style={{ flex: 1, backgroundColor: theme.background }} >

        <Header title={"Session detail"} />

        <Card
          style={{
            width: "90%",
            marginTop: "5%",
            alignSelf: "center",
            // borderWidth: 0.5,
            // borderColor: "#FEF0E5",
            flexDirection: "row",
            paddingTop: "2%",
            borderRadius: 10,
            backgroundColor: theme.theme == "dark" ? "#26263D" : theme.secondarybg


          }}
        >
          <View
            style={{
              width: "90%",

              marginHorizontal: '5%', marginVertical: '5%',


            }}
          >
            <ImageComponent icons={session?.peer?.metadata?.icons?.[0]} url={session?.peer?.metadata?.url} style={{ height: 40, width: 40 }} />
            {/* <Image
      source={{
        uri:
          Show?.item.peer?.metadata?.icons[0] ??
          Show?.item.metadata?.icons[0],
      }}
      style={{ height: 40, width: 40 }}
    /> */}

            <Text
              style={{
                fontFamily: Fonts.Regular,
                fontSize: 17,
                color: theme.text,
                marginTop: "2%"
              }}
            >
              {session?.peer?.metadata?.name}{" "}
            </Text>
            <Text
              style={{
                fontFamily: Fonts.Regular,
                fontSize: 14,
                color: C.textgrey,
                marginTop: "4%"
              }}
            >
              {session?.peer?.metadata?.description}
            </Text>
          </View>

        </Card>

        <Card
          style={{
            width: "90%",
            marginTop: "7%",
            alignSelf: "center",
            // borderWidth: 0.5,
            // borderColor: "#FEF0E5",
            paddingVertical: "1%",
            borderRadius: 10,
            justifyContent: "space-evenly",
            backgroundColor: theme.theme == "dark" ? "#26263D" : theme.secondarybg
          }}
        >
          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              paddingHorizontal: "5%",
              paddingVertical: "3%",
            }}
          >
            <Text
              style={{
                fontFamily: Fonts.Regular,
                fontSize: 16,
                color: theme.text,
              }}
            >
              Expiry In
            </Text>
            <Text
              style={{
                fontFamily: Fonts.Regular,
                fontSize: 16,
                color: C.textgrey,

              }}
            >
              {timeformat(expiryDate)}
            </Text>
          </View>

          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
              paddingVertical: "3%",
              width: "100%",
              paddingHorizontal: "5%",
            }}
          >
            <Text
              style={{
                fontFamily: Fonts.Regular,
                fontSize: 16,
                color: theme.text,
              }}
            >
              Wallet
            </Text>
            <Text
              style={{
                fontFamily: Fonts.Regular,
                fontSize: 16,
                color: C.textgrey,
              }}
            >
              {current_walletname(walletAddress)}
            </Text>
          </View>
        </Card>



        <View

          style={{ width: "100%", alignItems: "center", position: "absolute", bottom: "4%" }}
        >

          <TouchableOpacity
            disabled={deleteLoading}
            onPress={() => onDeleteSession()}
            style={{
              width: "90%", height: deviceheight * 0.0625,
              borderRadius: borderradius * 0.5, justifyContent: "center", alignItems: "center",
            }} >
            <Button title={"Disconnect"} colors={['rgba(26,198,201,1)', 'rgba(56,120,199,1)', 'rgba(61,30,136,1)']} />
          </TouchableOpacity>



        </View>
      </View>
    </>
  );
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
      justifyContent: "center",
      alignItems: 'center',
    },
    card_container: {
      width: "95%",
      marginTop: "8%",
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
      // height: "90%",
      // justifyContent: "center",
      // alignItems: 'center'

    },
    innercard: {
      backgroundColor: theme.background,
      flexDirection: "row",
      justifyContent: 'space-between',
      alignItems: "center",
      paddingHorizontal: "5%",
      paddingVertical: "5%",
      borderRadius: borderradius * 0.7,
      marginVertical: "5%",
      // shadowColor: '#000',
      // shadowOffset: { width: 0, height: 2 },
      // shadowOpacity: 1,
      // shadowRadius: 4,
      // elevation: 5,

    },
    innercardleft: {
      flexDirection: 'row',
      // gap: 5,
      alignItems: "center",
      width: "100%"
    },

    para: {
      fontSize: RFPercentage(1.65),
      color: "#010101",
      fontFamily: Fonts.Regular,
      textAlign: 'left',
      width: "90%"
    },
    para1: {
      fontSize: RFPercentage(1.65),
      color: theme.text,
      fontFamily: Fonts.Regular,
      textAlign: 'left',
      width: "90%"
    },

    paralite: {
      fontSize: RFPercentage(1.85),
      color: theme.text,
      fontFamily: Fonts.Regular,
      textAlign: 'left'
    },
    parablue: {
      fontSize: RFPercentage(1.95),
      color: "#0091FF",
      fontFamily: Fonts.Regular,
      textAlign: 'center'
    },

    create_button: {
      marginTop: "15%",
      width: "100%",
      alignSelf: "center",
      marginBottom: "7%"
    },

    contentsec: {
      justifyContent: "center",
      alignSelf: "center",
      marginBottom: "7%"
    },
    gradTitle: {
      fontSize: RFPercentage(2.85),
      color: "#010101",
      fontFamily: Fonts.Regular,
      textAlign: "center"

    },
    gradTitle1: {
      fontSize: RFPercentage(2.55),
      color: "#010101",
      fontFamily: Fonts.Regular,
      textAlign: "center"

    },
    inputtitle: {
      fontSize: RFPercentage(2.05),
      color: theme.text,
      fontFamily: Fonts.Regular,
    },



    inputrow: {
      marginTop: "3%"

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