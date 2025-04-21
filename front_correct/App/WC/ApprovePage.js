import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState, useContext } from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  BackHandler,
  Image
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Header from "../Navigations/Header";
import { Fonts } from "../Utilities/fonts";
import themeContext from "../Utilities/themecontext";
import { CHAIN_INFO } from "../Screens/WalletHome/useweb3";
import { Approvesession_WC2, connector, getcurrensession_WC2 } from "./WC2";
import { Toastfn } from "../Utilities/toast";
import { Button } from "react-native-elements";

const ApprovePage = (props) => {

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // BackHandler.exitApp();
        return true;
      };
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [])
  );
  const { Session, version, namespaces,payload,from ,Site_Detail } = useSelector(
    (state) => state.wcreducer
  );
  const dispatch = useDispatch();
  const Approve = async () => {
    try {
        var data = await Approvesession_WC2(
          // Session.connector,
          {
            id: Session?.payload?.id,
            relayProtocol: Session?.payload?.params?.relays[0].protocol,
            namespaces: Session?.namespaces,
          }
        );
      
      dispatch({
        type: "Session",
        data: {Connected:true,Loader:false,time:new Date(),topic:data.topic,
          WC_Connector: connector, StopAction: false,
                   url: null
        },
      });


        var get_curre_session = getcurrensession_WC2()
         dispatch({
                  type: "Session",
                  data: { All_Session: get_curre_session},
                });  
    
        
        if(props?.route?.params?.from){
      props.navigation.navigate("Dappweb", { Approve: true });
        }
        if(from){
          dispatch({
            type: "url",
            data: from });
          props.navigation.navigate("Dappweb");

        }
        else{
          props.navigation.navigate("Settingwalletconnect", { Approve: true });
        }

    } catch (e) {
      console.error("data-error", e);
      Toastfn("Try Again")
      props.navigation.navigate("Settingwalletconnect", { Approve: false });
      
    }
  };
  const current_chain = (chainId) => CHAIN_INFO.filter(
    (it) => it.chainId == chainId
  )?.pop();


  const theme = useContext(themeContext);
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;
  const Current_Network_detail = CHAIN_INFO.filter(
    (it) => it.currency == Session?.lp?.currency
  )?.pop();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor:"#3D4A6C" 
      }}
    >
      <View style={{ height: "10%" }}>
        <Header name={"Connect Dapp"} leftImage={"back_wallet"} />
      </View>
      <View style={{ height: "80%", justifyContent: "center" ,alignContent:'center',alignItems:'center' }}>
         <Image
          source={{
            uri: Site_Detail?.icons[0] ??
              Site_Detail?.icons[0]}}
          
          // style={{ height: 40, width: 40 }
          // width={width * 0.15} height={width * 0.15}
          style={{ alignSelf: "center", resizeMode: "contain" ,alignItems:'center', width:width * 0.15,height:width * 0.15}}
        />

        {/* <Logo width={width * 0.15} height={width * 0.15} style={{ alignSelf: "center", resizeMode: "contain", }} /> */}
        <View style={{ width: "70%", alignSelf: "center", marginTop: "2%" }}>
          <Text
            style={{
              fontFamily: Fonts.Bold,
              fontSize: 18,
              color: theme.primarytextcolor,
              textAlign: "center",
            }}
          >
            {Site_Detail?.name ??
              Site_Detail?.name}{" "}
            - wants to connect to your wallet
          </Text>
          <Text
            style={{
              fontFamily: Fonts.Medium,
              fontSize: 14,
              color: "gray",
              textAlign: "center",
              marginTop: "3%",
            }}
          >
            {" "}
            {Site_Detail?.description ??
              Site_Detail?.description}
          </Text>
        </View>
        <View style={{ width: "85%", alignSelf: "center", marginTop: "5%" }}>
          <Text
            style={{
              fontFamily: Fonts.Medium,
              fontSize: 15,
              color: "gray",
              marginTop: "3%",
            }}
          >
            {/* {(current_chain(Session?.chainId)?.name)} */}

          </Text>

          <View
            style={{
              width: "100%",
              alignSelf: "center",
              paddingVertical: "2.5%",
              borderWidth: 1,
              borderColor: theme.primarytextcolor,
              borderRadius: 5,
              flexDirection: "row",
              marginTop: "4%",
            }}
          >
            <View
              style={{
                width: "20%",
                alignItems: "center",
                justifyContent: "center",
                // width: 40, height: 40
              }}
            >
              <Image
                source={Current_Network_detail?.img}
                style={{ width: 40, height: 40 }}
              />

            </View>
            <View style={{ width: "80%", justifyContent: "center" }}>
              <Text
                style={{
                  fontFamily: Fonts.Bold,
                  fontSize: 16,
                  color: "#000",
                  marginLeft: "5%",
                }}
              >
                {current_chain(Session?.chainId)?.currency}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: Fonts.Regular,
                  fontSize: 14,
                  color: "gray",
                  marginLeft: "5%",
                  marginTop: "1%",
                  width: "90%",
                }}
              >
                {Session?.lp?.walletaddress}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignSelf: "center",
              width: "80%",
              marginTop: "10%",
              alignItems: "center",
            }}
          >
        
          </View>
          <View
            style={{
              flexDirection: "row",
              alignSelf: "center",
              width: "80%",
              marginTop: "2%",
              alignItems: "center",
            }}
          >
        
            <Text
              style={{
                fontFamily: Fonts.Medium,
                fontSize: 14,
                color: theme.text,
                marginLeft: "2.5%",
                marginTop: "1%",
              }}
            >
              Request approval for transactions
            </Text>
          </View>
        </View>
      </View>

      <View style={{ height: "10%" }}>

      <TouchableOpacity   >
         
     
      <Button onPress={()=>Approve()}
       title={"Approve"} colors={['#3db5a6', 'rgba(56,120,199,1)', 'rgba(61,30,136,1)']} />

        </TouchableOpacity>

{/* 
        <TouchableOpacity
          style={{
            width: "90%",
            justifyContent: "center",
            alignSelf: "center",
            height: "60%",
            backgroundColor: theme.theme == "#fc0",
            borderRadius: 10,
          }}
          onPress={() => {
            Approve();
          }}
        >
          <Text
            style={{
              fontFamily: Fonts.Medium,
              fontSize: 16,
              color: "#000",
              textAlign: "center",
            }}
          >
            Continue
          </Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};
export default ApprovePage;

const style = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    seperatorLine: {
      height: 0.5,
      backgroundColor: "grey",
    },
  });
