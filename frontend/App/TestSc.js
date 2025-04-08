import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getSdkError } from "@walletconnect/utils";
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CHAIN_INFO } from "./Screens/WalletHome/useweb3";
import { GetWalletType } from "./WalletConnect/WC1";
import { connect_Wallet_WC2, pair, connector, getcurrensession_WC2 } from "./WalletConnect/WC2";
import { Toastfn } from "./Utilities/toast";
import { isEmpty } from "./Utilities/commenfuctions";
import { EIP155_SIGNING_METHODS_Name, EIP155_SIGNING_METHODS, TRON_SIGNING_METHODS_Name, TRON_SIGNING_METHODS } from "./api/ApiConstants";
import { CurrentWalletArray } from "./Utilities/usestorage";
import { Alert } from "react-native";


export default function TestSc() {

  const navigation = useNavigation();
  const [walletdata, setWalletdata] = useState("")


  const {
    url,
    WC_Connector,
    Session,
    Type_Emit,
    Address,
    chain,
    topic,
    Loader, All_Session
  } = useSelector((state) => state.wcreducer);



  useFocusEffect(
    useCallback(() => {
      let curentwallet = CurrentWalletArray()
      let data = curentwallet.filter((val) => val.type == "Crypto")
      console.log('curentwalletcurentwallet---->', data);
      if (data[0]?.walletType == 'multicoin') {
        var walletdata = data.filter((val) => val.currency == 'BNB')
      }
      else {

        var walletdata = data

      }
      console.log('walletdata---->', walletdata);
      setWalletdata(walletdata)
    }, [])
  )

  /** Walletconnect *
  /** Connecting Wallet From any Screen */


  useFocusEffect(

    useCallback(() => {
      (async () => {

        try {

          console.log('urlurlurl---->', url);
          if (url) {
            if (url?.includes('relay')) {
              try {
                return await pair(connector, url);

              } catch (e) {
                console.log('afawawfawfawfa---->', e);
                Toastfn("Re-Open ");

              }
            }
            else if (url?.includes('request')) {

              transaction_methods(connector)
            }
          }


          var data = connector ? connector : await connect_Wallet_WC2()

          var get_curre_session = getcurrensession_WC2()
          dispatch({
            type: "Session",
            data: { All_Session: get_curre_session, WC_Connector: data },
          });

        } catch (e) {
          console.error("Session_err", e.toString());
        }
      })();
    }, [connector, url, Loader])

  );


  const AddressChainChanged = async (Address, chain, topic, Type_Emit) => {
    try {
      var updata = await connector.emitSessionEvent({
        topic,
        event: {
          name: Type_Emit,
          data: [Address],
        },
        chainId: `eip155:${Session?.chainId}`,
      });
      dispatch({
        type: 'Session',
        data: { Type_Emit: null, Address: null, chain: null }
      })
    } catch (e) {
      console.error('AddressChainChanged_err', e)
      Logout(connector);
    }
  };

  const dispatch = useDispatch();
  useFocusEffect(
    useCallback(() => {
      if (Type_Emit) {
        if (Type_Emit == "accountsChanged") {
          AddressChainChanged(Address, chain, topic, Type_Emit);
        } else if (Type_Emit == "chainChanged") {
          AddressChainChanged(Address, chain, topic, Type_Emit);
        }
      }
    }, [Type_Emit, topic])
  )

  const Update_walet = (data) => {
    dispatch({
      type: "Session",
      data: data,
    });
  };

  const transaction_methods = async (payload) => {
    try {
      const method = payload?.params?.request?.method;
      if (method) {
        switch (method) {

          /**EVM Transactions methods */
          case EIP155_SIGNING_METHODS.ETH_SIGN:
          case EIP155_SIGNING_METHODS.PERSONAL_SIGN: {
            dispatch({
              type: "page",
              data: {
                page: EIP155_SIGNING_METHODS.PERSONAL_SIGN,
                type: EIP155_SIGNING_METHODS_Name[
                  EIP155_SIGNING_METHODS.PERSONAL_SIGN
                ],
                payload: payload,
                current_session: All_Session.filter(it => it.topic == payload.topic)[0],
                Site_Detail: All_Session.filter(it => it.topic == payload.topic)[0]?.peer?.metadata,
                lp: walletdata[0]
              },
            });
            navigation.navigate("SignPage");
            return;
          }
          case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
            dispatch({
              type: "page",
              data: {
                page: EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION,
                type: EIP155_SIGNING_METHODS_Name[
                  EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION
                ],
                payload: payload,
                current_session: All_Session.filter(it => it.topic == payload.topic)[0],
                Site_Detail: All_Session.filter(it => it.topic == payload.topic)[0]?.peer?.metadata,
                Session: { ...Session, ...{ lp: walletdata[0] } }

              },
            });
            navigation.navigate("SignPage");
            return;

          case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA:
          case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3:

          case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4:
            {
              dispatch({
                type: "page",
                data: {
                  page: EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION,
                  type: EIP155_SIGNING_METHODS_Name[
                    EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION
                  ],
                  payload: payload,
                },
              });

            }
            return;

          /**Tron Transactions methods */
          case TRON_SIGNING_METHODS.TRON_SIGN_TRANSACTION: {
            dispatch({
              type: "page",
              data: {
                page: TRON_SIGNING_METHODS.TRON_SIGN_TRANSACTION,
                type: TRON_SIGNING_METHODS_Name[
                  TRON_SIGNING_METHODS.TRON_SIGN_TRANSACTION
                ],
                payload: payload,
                current_session: All_Session.filter(it => it.topic == payload.topic)[0],
                Site_Detail: All_Session.filter(it => it.topic == payload.topic)[0]?.peer?.metadata,
                lp: walletdata[0]
              },
            });
            navigation.navigate("SignPage");
            return;
          }


        }



      }
    } catch (e) {
      console.error("transaction_methodsPerr", e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      try {

        if (!isEmpty(connector)) {
          connector.on("session_request", (payload) => {
            return transaction_methods(payload);
          });
          connector.on("session_delete", (e) => {
            console.log('eeeeeeeeeeeeeeeeeeeeeeee---->', e);
            Logout();
          });

          connector.on('session_proposal', (proposal) => {
            return _ApproveSession_WC2(proposal)
          })

        }
      } catch (e) {
        console.error("WC_CONNECTOR_err", e);
      }
    }, [connector, Loader])
  )


  const _ApproveSession_WC2 = async (payload, type) => {
    try {
      const { id, params } = payload;
      const { requiredNamespaces, optionalNamespaces } = params;
      console.log('pauloadada---->', payload);
      console.log('walletdata---->', walletdata);
      let Namespaces = !isEmpty(requiredNamespaces) ? requiredNamespaces : optionalNamespaces


      var namespaces = {};
      if (!isEmpty(walletdata)) {
        const chainId =
          Namespaces?.eip155 ?

            Namespaces?.eip155?.chains[0].split("eip155:")[1]
            :
            Namespaces.tron.chains[0].split("tron:")[1]


        if (chainId)
          var isChaindHere = chainId == 0x2b6653dc ? walletdata.filter(
            (it) => it.tokenType == "TRC20" && it.type == "Crypto"
          )
            :
            [walletdata[0]]

        {
          const current_chain = CHAIN_INFO.filter(
            (it) => it.chainId == chainId
          )?.pop();
          console.log('isChaindHereisChaindHere---->', isChaindHere, current_chain, chainId, chainId && isChaindHere.length > 0 && current_chain?.img);
          if (chainId && isChaindHere.length > 0 && current_chain?.img) {
            if (chainId != 0x2b6653dc) {
              namespaces["eip155"] = {
                accounts: [
                  `${Namespaces?.eip155?.chains[0]}:${isChaindHere[0]?.walletaddress}`,
                ],
                methods: Namespaces["eip155"].methods,
                events: Namespaces["eip155"].events,
              }
            }
            else {
              namespaces["tron"] = {
                accounts: [
                  `${Namespaces?.tron?.chains[0]}:${isChaindHere[0]?.walletaddress}`

                ],
                methods: Namespaces["tron"].methods,
                events: Namespaces["tron"].events,
              };
            }
            var outt = {
              Site_Detail: payload?.params?.proposer?.metadata,
              All_Session: [payload],

              Session: {
                lp: isChaindHere[0],
                autoSign: false,
                connector: WC_Connector,
                walletaddress: isChaindHere[0]?.walletaddress,
                Wallet: WC_Connector,
                payload: payload,
                chainId: chainId,
                version: "V2",
                namespaces: namespaces,
              },
            };
            Update_walet(outt);
            return navigation.navigate("Settingconnectconfirm");
          }
          else {
            return _rejectsession(payload.id, GetWalletType(chainId), "V2");
          }
        }
      } else {
        console.log("Wallet not found");
      }
    } catch (e) {
      console.error("Error in Apprve", e);
      return false
    }
  };

  const _rejectsession = async (id, Network, version) => {
    dispatch({
      type: "Session",
      Loader: false,
    });
    await WC_Connector.rejectSession({
      id,
      reason: getSdkError("UNSUPPORTED_CHAINS"),
    });
    Toastfn(
      Network ? `Switch ${Network} Wallet to Connect The DAPP` : 'Network Not Available',
    );
  };

  const Logout = async (connector, bool) => {
    try {

      if (!isEmpty(connector)) {
        dispatch({
          type: "initial",
        });
        if (Object.values((connector).getActiveSessions()).length > 0) {
          Object.values((connector).getActiveSessions()).map((it) => {

            (connector).disconnectSession({
              topic: it.topic,
              reason: getSdkError("USER_DISCONNECTED"),
            });
          });

          Toastfn(`Session Disconnected`);
        }
      }

    } catch (e) {
      console.error("LogoutLogout_err", e);
    }
  };

  /** Walletconnect */

  return <></>;
}
