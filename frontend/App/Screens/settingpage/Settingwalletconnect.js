import React, { useCallback, useContext, useState } from "react";
import { getSdkError } from "@walletconnect/utils";
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View, ScrollView, Image, Pressable } from "react-native";
import Header from "../../Navigations/Header";
import { borderradius, deviceheight, devicewidth } from "../../Utilities/Dimensions";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Fonts } from "../../Utilities/fonts";
import themeContext from "../../Utilities/themecontext";
import { Card } from 'react-native-shadow-cards';
import Button from "../../Components/Button";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { getcurrensession_WC2, connector } from "../../WalletConnect/WC2";
import { isEmpty } from "../../Utilities/commenfuctions";
import { timeformat } from "../../Utilities/commenfuctions";
import { CurrentWalletArray, GetCurrentIndex, Getmobiletheme, UseWalletArray } from "../../Utilities/usestorage";
import { CHAIN_INFO } from "../WalletHome/useweb3";
import { Toastfn } from "../../Utilities/toast";
import { C } from "../../Utilities/colors";
import Backarrow from '../../Assets/caexicons/backarrow1.svg'
import Backarrow1 from '../../Assets/caexicons/backarrow2.svg'
import { EventRegister } from "react-native-event-listeners";
import Righticon from '../../Assets/Icons/rightarrowblue.svg'
import Righticon1 from '../../Assets/Icons/rightarrowwhite.svg'
import { RefreshControl } from "react-native";

const isPhone = devicewidth < 600;

export default function Settingwalletconnect({ navigation, route }) {
  const theme = useContext(themeContext);
  const style = styles(theme);
  const [Show, setShow] = useState({});
  const [All_data, setAll_data] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  console.log('All_data---->', JSON.stringify(All_data, null, 2));
  const dispatch = useDispatch();
  // var walletarray = UseWalletArray();
  // var currenteindex = GetCurrentIndex();
  // var wallet = walletarray[currenteindex]

  let wallet = CurrentWalletArray()

  const current_walletname = (walletaddress) =>
    wallet.filter(it => it.walletaddress == walletaddress)?.pop()?.walletname

  const current_chain = (chainId) => CHAIN_INFO.filter(
    (it) => it.chainId == chainId
  )?.pop();

  const { onChangeWC } = useSelector((state) => state.wcreducer);
  console.log('onChangeWC---->', onChangeWC);
  useFocusEffect(
    useCallback(() => {
      dispatch({
        type: "Session",
        data: {
          Loader: false,
          StopAction: false,
        },
      });
    }, [])
  )

  useFocusEffect(
    useCallback(() => {
      var data = getcurrensession_WC2()
      console.log('datadatadatadataasas---->', data);
      setAll_data(data)
      dispatch({
        type: "Session",
        data: {
          All_Session: data
        },
      });
      setTimeout(() => {
        setLoading(false)
      }, 2000);

    }, [route?.params?.from, onChangeWC]))

  const Logout = async (val, bool) => {
    try {
      connector.disconnectSession({
        topic: Show.item.topic,
        reason: getSdkError("USER_DISCONNECTED"),
      });
      setLoading(true)
      setTimeout(() => {
        navigation.navigate("Settingwalletconnect", { from: "logout" });

      }, 2000);

      setShow({})

      Toastfn(
        `Session Disconnected`
      );

    } catch (e) {
      console.error("getcurrensession_WC2_err", Show.topic, e);
      connector.core.pairings.disconnect({
        topic: Show.item.topic
      })
    }
  };

  const backfn = () => {

    navigation.goBack()

  }
  let curentwallet = CurrentWalletArray()

  //Refresh Controller
  const onRefresh = useCallback(() => {
    setRefreshing(true);
console.log('sfsawfawfawwfa---->',);
    var data = getcurrensession_WC2()
    console.log('datadatadatadataasas---->', data);
    setAll_data(data)
    dispatch({
      type: "Session",
      data: {
        All_Session: data
      },
    });
    setRefreshing(false);
  }, []);

  return (
    <SafeAreaView style={style.container} >
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <StatusBar backgroundColor={theme.background} />
        {isEmpty(Show) ?

          <View style={{ flex: 1, backgroundColor: theme.background }}  >
            <View style={{
              width: "90%",
              flexDirection: "row",
              height: deviceheight * 0.10,
              alignItems: "center",
              alignSelf: "center",

            }} >
              <Text style={style.headertext} >New Connection</Text>
              <Pressable
                onPress={() => backfn()}
                style={{ padding: "4%" }}
              >

                {theme.theme == "light" ? <Backarrow1 width={isPhone ? devicewidth * 0.05 : devicewidth * 0.025} height={devicewidth * 0.0545} style={style.arrowcontainer} /> : <Backarrow width={isPhone ? devicewidth * 0.05 : devicewidth * 0.025} height={devicewidth * 0.045} style={style.arrowcontainer} />}
              </Pressable>
            </View>
            <View style={style.box_container} >


              <Card style={style.card_container} >
                <View style={style.inputrow}>
                  <View >
                    <Text style={style.inputtitle}>Connect your wallet with walletconnect to
                      make transaction </Text>
                  </View>

                </View>
                <TouchableOpacity

                  // onPress={() => navigation.navigate('Settingconnectconfirm')}
                  onPress={() => navigation.navigate('Walletconnectqr', { path: "Settingwalletconnect" })}
                  style={style.create_button} >
                  <Button title={"New Connection"} colors={['rgba(26,198,201,1)', 'rgba(56,120,199,1)', 'rgba(61,30,136,1)']} />
                </TouchableOpacity>


                <ScrollView showsVerticalScrollIndicator={false} >
                  {
                    All_data?.map((item, index) => {
                      return (
                        <Pressable onPress={() => setShow({ item })} >
                          <View style={style.innercard}>
                            <View style={style.innercardleft}>


                              <View style={{ width: "20%" }}>
                                <Image
                                  source={{
                                    uri: item.peer.metadata.icons[0]
                                  }}
                                  style={{ height: 40, width: 40 }}
                                />
                              </View>
                              <View style={{ width: "75%" }}>
                                <Text numberOfLines={1} style={style.para1}>{item?.peer?.metadata?.name}</Text>
                                <Text style={style.paralite}> {(
                                  item?.namespaces?.eip155
                                    ?
                                    item?.namespaces?.eip155?.accounts[0]?.split(':')[2]
                                    :
                                    item?.namespaces?.tron?.accounts[0]?.split(':')[2]

                                ).substr(0, 20).concat('....')
                                }
                                </Text>
                              </View>
                              <View style={{ width: "5%" }}>
                                {theme.theme == "dark" ? <Righticon1 width={devicewidth * 0.025} height={deviceheight * 0.035} /> : <Righticon width={devicewidth * 0.025} height={deviceheight * 0.035} />}

                              </View>
                            </View>


                          </View>
                        </Pressable>

                      )
                    }
                    )}
                </ScrollView>

              </Card>
            </View>


          </View>
          :

          <>


            <View style={{ flex: 1, backgroundColor: theme.background }} >

              <Header title={"Wallet Connect"} />

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
                  <Image
                    source={{
                      uri:
                        Show?.item.peer?.metadata?.icons[0] ??
                        Show?.item.metadata?.icons[0],
                    }}
                    style={{ height: 40, width: 40 }}
                  />

                  <Text
                    style={{
                      fontFamily: Fonts.Regular,
                      fontSize: 17,
                      color: theme.text,
                      marginTop: "2%"
                    }}
                  >
                    {" "}
                    {Show?.item.peer?.metadata?.name}{" "}
                    {" "}
                  </Text>
                  <Text
                    style={{
                      fontFamily: Fonts.Regular,
                      fontSize: 14,
                      color: C.textgrey,
                      marginTop: "4%"
                    }}
                  >
                    {" "}
                    {Show.item.peer?.metadata?.description}
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
                    {timeformat(
                      Show?.item.expiry * 1000
                    )}
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
                    {current_walletname(
                      Show?.item.namespaces?.eip155 ?
                        Show?.item.namespaces?.eip155?.accounts[0]?.split(':')[2]
                        :
                        Show?.item.namespaces?.tron?.accounts[0]?.split(':')[2]
                    )}
                  </Text>
                </View>
              </Card>

              <Card
                style={{
                  width: "90%",
                  marginTop: "5%",
                  alignSelf: "center",
                  // borderWidth: 0.5,
                  // borderColor: "#FEF0E5",
                  paddingVertical: "1%",
                  borderRadius: 10,
                  justifyContent: "space-evenly",
                  paddingVertical: "5%",
                  backgroundColor: theme.theme == "dark" ? "#26263D" : theme.secondarybg
                }}
              >
                <View
                  style={{
                    width: "90%",
                    alignSelf: "center",
                    paddingVertical: "3%",
                    // borderColor: "grey",
                    borderRadius: 5,
                    flexDirection: "row",
                  }}
                >
                  <View
                    style={{
                      width: "20%",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {/* <Image
      source= */}
                    {current_chain(
                      Show?.item.namespaces?.eip155 ?
                        Show?.item.namespaces?.eip155?.accounts[0]?.split(':')[1]
                        :
                        Show?.item.namespaces?.tron?.accounts[0]?.split(':')[1])?.img}

                  </View>
                  <View style={{ width: "80%", justifyContent: "center", }}>
                    <Text
                      style={{
                        fontFamily: Fonts.Bold,
                        fontSize: 16,
                        color: theme.text,
                        marginLeft: "5%",
                      }}
                    >
                      {current_chain(
                        Show?.item.namespaces?.eip155 ?
                          Show?.item.namespaces?.eip155.accounts[0]?.split(':')[1]
                          :
                          Show?.item.namespaces?.tron.accounts[0]?.split(':')[1])?.currency
                      }
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontFamily: Fonts.Regular,
                        fontSize: 14,
                        color: C.textgrey,
                        marginLeft: "5%",
                        marginTop: "1%",
                        width: "90%",
                      }}
                    >
                      {(
                        Show?.item.namespaces?.eip155 ?
                          Show?.item.namespaces?.eip155.accounts[0]?.split(':')[2]
                          :
                          Show?.item.namespaces?.tron.accounts[0]?.split(':')[2]
                      )}
                    </Text>
                  </View>
                </View>
              </Card>


              <View

                style={{ width: "100%", alignItems: "center", position: "absolute", bottom: "4%" }}
              >

                <TouchableOpacity
                  onPress={() => {
                    Logout();
                  }}
                  style={{
                    width: "90%", height: deviceheight * 0.0625,
                    borderRadius: borderradius * 0.5, justifyContent: "center", alignItems: "center",
                  }} >
                  <Button title={"Disconnect"} colors={['#307CD1', '#31B4A6']} />
                </TouchableOpacity>



              </View>
            </View>

          </>
        }
      </ScrollView>
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