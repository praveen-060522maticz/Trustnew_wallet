import React, {
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import Header from "../Navigations/Header";
import { useSelector } from "react-redux";

import themeContext from "../Utilities/themecontext";
import { Card } from "react-native-shadow-cards";
import { Fonts } from "../Utilities/fonts";
import { CHAIN_INFO, useWeb3WithRPC } from "../Screens/WalletHome/useweb3";

import { useFocusEffect } from "@react-navigation/native";
import { getSdkError } from "@walletconnect/utils";
import {
  ApproveReq_WC2,
  eth_sendTransaction_WC2,
  personal_sign_WC2,
  tokenBlanace,
  _rejectsession,
  Tron_Approve_sign,
} from "./WC2";

import { Image } from "react-native-elements";
import { convertHexToNumber, fiatcurrencies, getSignParamsMessage, toExpo } from "../Utilities/commenfuctions";
import { Toastfn } from "../Utilities/toast";
import {isEmpty} from "../Utilities/commenfuctions";
import { CurrentWalletArray, GetCurrentIndex, UseWalletArray } from "../Utilities/usestorage";
import Button from "../Components/Button";
import { Main_Tron_chainId } from "../api/ApiConstants";
import Loader from "../Components/loader";




const SignPage = (props) => {
  const theme = useContext(themeContext);
  const style = styles(theme);

  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;


  const [fiatData, setFiat] = useState([])

  const DefaultCurrencys = useSelector(
    (state) => state.defaultcurrencies.Currencies.choosedcurrencies
  )
  const { type, page, Session, payload, Site_Detail, current_session, All_Session,lp } = useSelector(
    (state) => state.wcreducer
  );

  var currentSes = All_Session.filter(it => it.topic == payload.topic)[0]
  var chainid = currentSes?.namespaces?.eip155?
  currentSes?.namespaces?.eip155?.accounts[0]?.split(':')[1]
  :
  currentSes?.namespaces?.tron?.accounts[0]?.split(':')[1]
  const current_chain = () => CHAIN_INFO.filter(
    (it) => it.chainId == chainid
  )?.pop();


  if (payload?.params?.request?.method != "personal_sign" && payload?.params?.request?.method != "tron_signTransaction") {
    var { gasPrice, gas, value, to, data, from } =
      payload?.params?.request?.params[0];
  }
  const getfiatdata = async (data) => {


    let curentwallet=CurrentWalletArray()

    var fiatcurrency = []

    curentwallet.map((item) => {
      fiatcurrency.push(item.symbol)
    })
    var Fiatdata = await fiatcurrencies(fiatcurrency, data)
    setFiat(Fiatdata)





  }
  useFocusEffect(useCallback(() => {
    getbalance()
    getfiatdata(DefaultCurrencys)

  }, []))

  const [bln, setbln] = useState(0)
  const getbalance = async () => {
    var getbln = await tokenBlanace(chainid, Session?.lp?.walletaddress)
    setbln(getbln)
  }
  const Approve = async () => {
    try {
      let Privatekey=Session.lp.privKey

      if(chainid == Main_Tron_chainId){
       var response = await Tron_Approve_sign(payload,Privatekey)
       var app = await ApproveReq_WC2({ topic: payload.topic, response });
      }
      else{
        setisload(true);
        var response = await transaction();
        console.log('responseresponse---->',response);
        var app = await ApproveReq_WC2({ topic: payload.topic, response });

      }
      if (app === true) {
        setisload(false);
        props.navigation.goBack();
        Toastfn(`Transaction Executed Succesfully`);

      } else {
        setisload(false);
        Toastfn(`${app}`);
      }

    } catch (e) {
      setisload(false);
      Toastfn(`${e.toString().split("Error:")[1]}`);

    }
  };
  const [_Gas, SetGas] = useState({});
  const [isload, setisload] = useState(false);
console.log('_Gas_Gas_Gas---->',_Gas);
  useFocusEffect(
    useCallback(() => {
      const rpcurl = current_chain()?.rpc;

      const web3 = useWeb3WithRPC(rpcurl);
      var gasPrice_custom, gas_custom;
      if (payload?.params?.request?.method != "personal_sign" && payload?.params?.request?.method != "tron_signTransaction") {
        console.log('gasPricegasPrice---->',gasPrice,gas,typeof gas);
        if (isEmpty(gasPrice)  || isNaN(gas)) {
          (async () => {
            gasPrice_custom = await web3.eth.getGasPrice();
            SetGas({ ..._Gas, ...{ gasPrice_custom: parseInt(gasPrice_custom) } });
            console.log('gasPrice_custom---->',gasPrice_custom);
          })();
        }

        // Estimate gas with { to, data } when gas is null
        if (isEmpty(gas) || isNaN(gas)) {
          (async () => {
            try {
              gas_custom = await web3.eth.estimateGas({
                from,
                to,
                data,
                value,
              });
              console.log('gas_custom---->',gas_custom);
            } catch (E) {
              console.error(E);
            }

            SetGas({ ..._Gas, ...{ gas_custom: parseInt(gas_custom) } });
          })();
        }

        console.log('segfsegfsegsegse---->',gasPrice_custom, gas_custom);
      }
    }, [payload])
    // }, [])

  );
  const fiatdata = (fiatData || [])
    ?.map(
      (it) =>
        it[
        Object.keys(it)
          .filter(
            (item) =>
              item ==
              current_chain()?.currency?.toString()?.toLowerCase()
          )
          .pop()
        ]
    )
    .filter((it) => it && it)
    ?.pop();
  const Current_Fiat = useMemo(() => {

    var values = value
      ? (
        (convertHexToNumber(value) / 1e18) *
        fiatData
          .map(
            (it) =>
              it[
              Object.keys(it)
                .filter(
                  (item) =>
                    item ==
                    current_chain()?.currency
                      ?.toString()
                      ?.toLowerCase()
                )
                .pop()
              ]
          )
          .filter((it) => it && it)
          ?.pop()
      )
      : 0;
    gas = (
      (((gas ? convertHexToNumber(gas) : _Gas?.gas_custom) *
        (gasPrice ? convertHexToNumber(gasPrice) : _Gas?.gasPrice_custom)) /
        1e18) *
      fiatdata
    );
    return {
      value: values,
      gas: gas,
      total: parseFloat(value) + parseFloat(gas),
    };
  }, [_Gas]);
  const transaction = async (Coming_Type) => {
    try {
      var message = getSignParamsMessage(payload?.params?.request?.params);
      console.log('messagemessage---->',_Gas);
      var result =
        page == "personal_sign"
          ? personal_sign_WC2(Session?.lp, message, payload?.id, chainid)
          : await eth_sendTransaction_WC2(
            Session?.lp,
            payload,
            Coming_Type,
            _Gas,
            chainid
          );
console.log('resultresult---->',result);
      return result;
    } catch (e) {
      console.error("failed_result", e);
      return false;
    }
  };
  const Reject = async () => {
    try {
      setisload(true);
      var result = await transaction("cancel");
      var app = await _rejectsession(
        {
          id: payload.id, // required
          reason: getSdkError("USER_REJECTED"),

        },
        payload.topic
      );

      if (app === true) {
        setisload(false);

        props.navigation.goBack();
      } else {
        setisload(false);
        Toastfn(`${app}`);
      }
    } catch (E) {
      setisload(false);
      console.error("Reject_err", E);
      Toastfn(`${E.toString().split("Error:")[1]}`);
    }
  };

  return page == "personal_sign" ? (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.theme == "dark" ? "#000" : "#fff",
      }}
    >
      <Header name={type} leftImage={"back"} />

      <View style={{ height: "82.5%", justifyContent: "center" }}>
        <ScrollView>
          <Card
            style={{
              width: "90%",
              marginTop: "5%",
              alignSelf: "center",
              borderWidth: 0.5,
              borderColor: "gray",
              paddingVertical: "2.5%",
              borderRadius: 10,
              justifyContent: "space-evenly",
            }}
          >
            <View
              style={{
                width: "90%",
                marginTop: "5%",
                alignSelf: "center",
                borderWidth: 0.5,
                borderColor: "gray",
                paddingVertical: "2.5%",
                borderRadius: 10,
                justifyContent: "space-evenly",
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                  paddingHorizontal: "5%",
                  paddingVertical: "4%",
                  borderBottomWidth: 0.5,
                  borderColor: "gray",
                }}
              >
                <Text
                  style={{
                    fontFamily: Fonts.Medium,
                    fontSize: 16,

                    color: "#000",
                  }}
                >
                  From
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: Fonts.Medium,
                    fontSize: 16,
                    color: "gray",
                    width: "70%",
                  }}
                >
                  {Session?.lp?.walletname}
                </Text>
              </View>

              <View
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: "4%",
                  width: "100%",
                }}
              >
                <Text
                  style={{
                    fontFamily: Fonts.Medium,
                    fontSize: 16,
                    color: "#000",
                  }}
                >
                  DApp
                </Text>
                <Text
                  style={{
                    fontFamily: Fonts.Medium,
                    fontSize: 16,
                    color: "gray",
                  }}
                >
                  {Site_Detail?.name}
                </Text>
              </View>
            </View>
          </Card>
          

          <Card
            style={{
              width: "90%",
              marginTop: "5%",
              alignSelf: "center",
              borderWidth: 0.5,
              borderColor: "gray",
              paddingVertical: "2.5%",
              borderRadius: 10,
              justifyContent: "space-evenly",
              marginBottom: "5%",
            }}
          >
            <View style={{ padding: "5%" }}>
              <Text
                style={{
                  fontFamily: Fonts.Medium,
                  fontSize: 16,
                  color: "gray",
                }}
              >
                {getSignParamsMessage(payload?.params?.request?.params)}
              </Text>
            </View>
          </Card>
        </ScrollView>
      </View>
      {isload ? (
     <View style={{ width: "90%", alignSelf: "center" }}>
     <Loader />
 </View>  
      ) :

        (
          
<>
            <View style={{ position: "absolute", bottom: "15%", left: 0, right: 0, alignItems: "center", justifyContent: "center", marginBottom: "4%" }}>

              <TouchableOpacity
                style={style.create_button}
                onPress={() => {
                  Approve();
                }}
              >
                <Button title={"Sign"} colors={['#3db5a6', 'rgba(56,120,199,1)', 'rgba(61,30,136,1)']} />

              </TouchableOpacity>
            </View>
            <View style={{ position: "absolute", bottom: "8%", left: 0, right: 0, alignItems: "center", justifyContent: "center", marginBottom: "4%" }}>

              <TouchableOpacity
                style={style.create_button}

                onPress={() => {
                  Reject();
                }}
              >
                <Button title={"Cancel"} colors={['#3db5a6', 'rgba(56,120,199,1)', 'rgba(61,30,136,1)']} />

              </TouchableOpacity>
            </View>
            </>
            
          
        )}
    </View>
  ) : (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.theme == "dark" ? "#000" : "#fff",
      }}
    >
      <Header name={"Smart Contract Call"} leftImage={"back"} />

      <View style={{ height: "82.5%" }}>
        <ScrollView>
          <Text
            style={{
              fontFamily: Fonts.Medium,
              fontSize: 26,
              color: theme.primarytextcolor,
              textAlign: "center",
              marginTop: "5%",
            }}
          >
            {convertHexToNumber(value) / 1e18}{" "}
            {current_chain()?.currency}
          </Text>

          {/* <Text
            style={{
              fontFamily: Fonts.Medium,
              fontSize: 16,
              color: "gray",
              textAlign: "center",
            }}
          >
            = {DefaultCurrencys} {Current_Fiat?.value}
          </Text> */}

          <Card
            style={{
              width: "90%",
              marginTop: "5%",
              alignSelf: "center",
              borderWidth: 0.5,
              borderColor: "gray",
              paddingVertical: "2.5%",
              borderRadius: 10,
              justifyContent: "space-evenly",
            }}
          >
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                width: "100%",
                paddingVertical: "4%",
                borderBottomWidth: 0.5,
                borderColor: "gray",
                paddingHorizontal: "4%",
              }}
            >
              <View style={{ width: "30%" }}>
                <Text
                  style={{
                    fontFamily: Fonts.Medium,
                    fontSize: 16,

                    color: "#000",
                  }}
                >
                  Asset
                </Text>
              </View>
              <View style={{ width: "70%", alignItems: "flex-end" }}>
                <Text
                  style={{
                    fontFamily: Fonts.Medium,
                    fontSize: 16,
                    color: "gray",
                  }}
                >
                  {current_chain()?.name}
                  {" "}
                  {current_chain()?.currency}
                </Text>
              </View>
            </View>

            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                width: "100%",
                paddingVertical: "4%",
                borderBottomWidth: 0.5,
                borderColor: "gray",
                paddingHorizontal: "4%",
              }}
            >
              <View style={{ width: "30%" }}>
                <Text
                  style={{
                    fontFamily: Fonts.Medium,
                    fontSize: 16,

                    color: "#000",
                  }}
                >
                  From
                </Text>
              </View>
              <View style={{ width: "70%", alignItems: "flex-end" }}>
                <Text
                  style={{
                    fontFamily: Fonts.Medium,
                    fontSize: 16,
                    color: "gray",
                  }}
                >
                  {lp?.walletname?lp?.walletname:Session.lp.walletname}{" "}
                  {lp?.walletaddres?lp?.walletaddres:Session.lp?.walletaddres
                    ?.toString()
                    ?.substr(0, 3)
                    .concat("...")
                    .concat(
                    lp?.walletaddres?lp?.walletaddres:Session.lp?.walletaddres.toString()?.substr(0, 3)
                    )}
                </Text>
              </View>
            </View>

            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                width: "100%",
                paddingVertical: "4%",
                paddingHorizontal: "4%",
              }}
            >
              <View style={{ width: "30%" }}>
                <Text
                  style={{
                    fontFamily: Fonts.Medium,
                    fontSize: 16,

                    color: "#000",
                  }}
                >
                  DApp
                </Text>
              </View>
              <View style={{ width: "70%", alignItems: "flex-end" }}>
                <Text
                  style={{
                    fontFamily: Fonts.Medium,
                    fontSize: 16,
                    color: "gray",
                  }}
                >
                  {Site_Detail?.name ??
                    Site_Detail?.name}
                </Text>
              </View>
            </View>
          </Card>

          <Card
            style={{
              width: "90%",
              marginTop: "5%",
              alignSelf: "center",
              borderWidth: 0.5,
              borderColor: "gray",
              paddingVertical: "2.5%",
              borderRadius: 10,
              justifyContent: "space-evenly",
            }}
          >
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                width: "100%",
                paddingVertical: "4%",
                borderBottomWidth: 0.5,
                borderColor: "gray",
                paddingHorizontal: "4%",
              }}
            >
              <View
                style={{
                  width: "40%",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: Fonts.Medium,
                    fontSize: 16,
                    color: "#000",
                  }}
                >
                  Network Fee
                </Text>

                <Image
                  // source={{uri:Images.infob}}
                  width={15} height={15} style={{ marginLeft: "3%" }} />
              </View>
              <View style={{ width: "60%", alignItems: "flex-end" }}>
                <Text
                  style={{
                    fontFamily: Fonts.Medium,
                    fontSize: 16,
                    color: "gray",
                  }}
                >
               {
                    ((gas ? convertHexToNumber(gas) : _Gas?.gas_custom) *
                      (gasPrice
                        ? convertHexToNumber(gasPrice)
                        : _Gas?.gasPrice_custom)) /
                    1e18
                  }{" "}
                  {current_chain()?.name}
                   ({current_chain()?.currency}) = {DefaultCurrencys}{" "}
                  {/* {Current_Fiat?.gas} */}
                </Text>
              </View>
            </View>

            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                width: "100%",
                paddingVertical: "4%",
                paddingHorizontal: "4%",
              }}
            >
              {/* <View style={{ width: "30%" }}>
                <Text
                  style={{
                    fontFamily: Fonts.Medium,
                    fontSize: 16,

                    color: "#000",
                  }}
                >
                  Max Total
                </Text>
              </View>
              <View style={{ width: "70%", alignItems: "flex-end" }}>
                <Text
                  style={{
                    fontFamily: Fonts.Medium,
                    fontSize: 16,
                    color: "#000",
                  }}
                >
                  {DefaultCurrencys} {Current_Fiat?.total}
                </Text>
              </View> */}
            </View>
          </Card>
        </ScrollView>
      </View>

      {isload ? (
   <View style={{ width: "90%", alignSelf: "center" }}>
   <Loader />
</View>  
      ) :

        // bln < toExpo(
        //   ((gas ? convertHexToNumber(gas) : _Gas?.gas_custom) *
        //     (gasPrice
        //       ? convertHexToNumber(gasPrice)
        //       : _Gas?.gasPrice_custom)) /
        //     1e18
        // )?
        (
          <>
            <View style={{ position: "absolute", bottom: "15%", left: 0, right: 0, alignItems: "center", justifyContent: "center", marginBottom: "4%" }}>

              <TouchableOpacity
                style={style.create_button}
                onPress={() => {
                  Approve();
                }}
              >
                <Button title={"Sign"} colors={['#3db5a6', 'rgba(56,120,199,1)', 'rgba(61,30,136,1)']} />

              </TouchableOpacity>
            </View>
            <View style={{ position: "absolute",  bottom: "8%", left: 0, right: 0, alignItems: "center", justifyContent: "center", marginBottom: "4%" }}>

              <TouchableOpacity
                style={style.create_button}

                onPress={() => {
                  Reject();
                }}
              >
                <Button title={"Cancel"} colors={['#3db5a6', 'rgba(56,120,199,1)', 'rgba(61,30,136,1)']} />

              </TouchableOpacity>
            </View>
          </>
        )

      }
    </View>
  );
};
export default SignPage;

const styles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.theme == "dark" ? "#000" : "#fff",
    },
    invalidPhraseTxt: {
      fontFamily: Fonts.Medium,
      fontSize: 12,
      color: "red",
      alignSelf: "flex-start",
    },
    create_button: {
      // marginTop: "5%",
      width: "90%",
      alignSelf: "center"
    },
  });
