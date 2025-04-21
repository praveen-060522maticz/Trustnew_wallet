import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Dimensions, ScrollView, BackHandler, Modal } from 'react-native';
import { WebView } from 'react-native-webview';
import Header from "../../Navigations/Header";
import LinearGradient from "react-native-linear-gradient";
import themeContext from "../../Utilities/themecontext";
import { Icon as Icn } from "react-native-elements";
import Bncicon from '../../Assets/caexicons/bnc.svg';
import Bncicon1 from '../../Assets/caexicons/bnc1.svg';
import { borderradius, deviceheight, devicewidth } from "../../Utilities/Dimensions";
import { CurrentWalletArray, GetCurrentIndex, UseWalletArray } from '../../Utilities/usestorage';
import { ApiConstants, Main_Tron_chainId, Main_bnb_chainId, Main_bnb_url, Main_tron_url } from '../../api/ApiConstants';
import { ActivityIndicator, } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { Fonts } from "../../Utilities/fonts";
import { CHAINS, CHAIN_INFO, useWeb3WithRPC } from "./useweb3";
import { Web3File } from "./DappWeb3";
import MessageModal from "./DappModal";
import { Card } from 'react-native-shadow-cards';
import { Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { DecryptPrivateKey, isEmpty } from '../../Utilities/commenfuctions';
import Closesmall from "../../Assets/Icons/closesmall.svg"
import Closesmall1 from "../../Assets/Icons/closesmall1.svg"
import { C } from '../../Utilities/colors';
import theme from '../../Utilities/theme';
import { walletKit } from '../../NewWalletConnect/utils/WalletConnectUtills';





const Dappwebview = (props) => {
  // const url = props.route.params.url;
  const theme = useContext(themeContext);
  const style = styles(theme);
  const deviceWidth = Dimensions.get("window").width;
  const deviceHeight = Dimensions.get("window").height


  const [ImageLabel, setImageLabel] = useState("");
  const [myUrl, setUrl] = useState('');
  const [isMoving, setIsMoving] = useState(false);
  const [network, setNetwork] = useState('');
  const [isSwitched, setIsSwitched] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const [urltoback, seturltoback] = useState("");
  const [currentUrl, setCurrentUrl] = useState({});
  const [privateKey, setPrivatekey] = useState("");
  const [address, setAddress] = useState("");
  const [connectWalletUrl, setConnectWalletUrl] = useState(false);
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [approvalDetails, setApprovalDetails] = useState(null);
  const [modalView, setModalView] = useState(null);
  const [web3JsContent, setWeb3JsContent] = useState("");
  const [ethersJsContent, setEtherJsContent] = useState("");
  const [paringTopics, setPairingTopics] = useState([])
  console.log('myUrlmyUrl---->', myUrl, paringTopics);
  //for search function
  const [searchQuery, setSearchQuery] = useState("");
  const [chainModal, setChainModal] = useState(false);




  const [name, setname] = useState('loading')
  const [state, setState] = useState({
    data: [],
    loading: false,
  });


  const [networkInfo, setNetworkInfo] = useState({
    chainId: Main_bnb_chainId,
    rpcUrl: Main_bnb_url
    // chainId: Main_Tron_chainId,
    // rpcUrl: Main_tron_url
  });


  const dappurl = useSelector(
    (state) => state.dappreducers.dappurl
  )
  var url = dappurl.data

  useFocusEffect(useCallback(() => {

    let curentwallet = CurrentWalletArray()
    let data = curentwallet.filter((val) => val.type == "Crypto")
    var type =
      data[0].tokenType.includes('ERC20')
        ? ApiConstants.eth_chainId
        : data[0].tokenType.includes('BEP20')
          ? ApiConstants.bnb_chainId : ApiConstants.bnb_chainId



    setNetwork(type)
  }, []))
  useFocusEffect(
    useCallback(() => {

      const backAction = () => {
        //   setDappStatus({ status: "false", item: "item" });
        props.navigation.navigate('Dapp')
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );
      return () => backHandler.remove();
    }, [props.navigation])
  )

  const webview = useRef();
  const web3 = useWeb3WithRPC(networkInfo?.rpcUrl)

  useEffect(() => {
    let curentwallet = CurrentWalletArray()
    let data = curentwallet.filter((val) => val.type == "Crypto")
    if (data[0].walletType == 'multicoin') {
      setPrivKeyy(data.filter((val) => val.currency == 'BNB')[0].privKey)

      setAddress(data.filter((val) => val.currency == 'BNB')[0].walletaddress)
    }
    else {

      setPrivKeyy(data[0].privKey)

      setAddress(data[0].walletaddress)
    }
  })

  const setPrivKeyy = async (priv) => {
    try {
      const getPrivkey = priv.startsWith("0x") ? priv : await DecryptPrivateKey(priv)
      setPrivatekey(getPrivkey)
    } catch (error) {
      console.log("err on setPrivKeyy", error);
    }
  }

  useEffect(() => {
    if (web3JsContent === "") {
      Web3File().then((data) => {
        setWeb3JsContent(data.data);
        setIsMoving(true)
      })
    }
  }, [network])



  const popupMessageModal = async (payload) => {
    const { id, params } = payload;
    const message = params[0].startsWith("0x")
      ? web3.utils.hexToAscii(params[0])
      : params[0];

    setModalView(
      <MessageModal
        title={"Personal Sign"}
        dappUrl={myUrl}
        address={address}
        confirmPress={async () => {
          setModalView(null);
          await handlePersonalSign(id, message);
        }}
        cancelPress={() => handleReject(id)}
        message={message}
      />
    );
  };
  const handleEthSendTransaction = async (id, txData) => {

    try {
      const accountInfo = web3.eth.accounts.privateKeyToAccount(privateKey);
      if (accountInfo.address != "") {
        const signedTransaction = await accountInfo.signTransaction(txData);
        const { rawTransaction } = signedTransaction;

        await web3.eth
          .sendSignedTransaction(rawTransaction)
          .on("transactionHash", async (hash) => {

            const result = { id, result: hash };
            postMessageToWebView(result);


          })
          .on("error", (error) => {
            const result = { id, result: error };
            postMessageToWebView(result);
            handleReject(id, error.message);
          });
      }
    } catch (err) {
      console.log("eth_sendTransaction err: ", err);
      handleReject(id, err.message);
    }
  };

  const handleEthCall = async (payload) => {
    try {
      const { id, params } = payload;
      const res = await web3.eth.call(params[0], params[1]);
      const result = { id, result: res };
      postMessageToWebView(result);
    } catch (err) {
      console.log("handleEthCall_err", err);
    }
  };
  const handleEthGetBlockByNumber = async (payload) => {
    try {
      const { id, params } = payload;
      let res = 0;
      // Get latest block info when passed block number is 0.
      const blockNumber =
        isEmpty(params) || (params[0] && params[0] === "0x0")
          ? "latest"
          : params[0];
      res = await web3.eth.getBlock(blockNumber);
      const result = { id, result: res };
      postMessageToWebView(result);
    } catch (err) {
      console.log("handleEthGetBlockByNumber_err", err);
    }
  };


  const handleEthGetBlockNumber = async (payload) => {
    try {
      const { id } = payload;
      const res = await web3.eth.getBlockNumber();

      const result = { id, result: res };
      postMessageToWebView(result);
    } catch (err) {

    }
  }

  const IsTransacted = async (HASH) => {
    const hashvalue = await web3.eth.getTransactionReceipt(HASH);
    return hashvalue;
  }

  const handleEthGetTransactionReceipt = async (payload) => {
    const { id, params } = payload;
    let res = await web3.eth.getTransactionReceipt(params[0]);
    if (!res) {
      res = "";
    } else {
      // RNS and tRif faucet's transaction status judge condition: parseInt(status, 16) === 1, so need set true to 1 and false to 0
      res.status = res.status ? 1 : 0;
    }
    const result = { id, result: res };
    postMessageToWebView(result);
  };

  const handleReject = async (id, message) => {
    setModalView(null);
    postMessageToWebView({ id, error: 1, message });
  };
  const popupContractModal = async (id, txData, formatedInputData) => {
    try {
      // alert("popupContractModal call")
      const network = "Mainnet";
      const from = web3.utils.toChecksumAddress(address, networkInfo.chainId);
      const to = web3.utils.toChecksumAddress(txData.to, networkInfo.chainId);
      setModalView(
        <MessageModal
          title={"Contract Interaction"}
          dappUrl={myUrl}
          address={address}
          confirmPress={async () => {
            setModalView(null);
            await handleEthSendTransaction(id, txData);
          }}
          cancelPress={() => handleReject(id)}
          txData={{
            ...txData,
            from,
            to,
            network,
          }}
          abiInputData={formatedInputData}
        />
      );
    } catch (e) {
      console.log("Error_Popup : ", e)
    }
  };

  const popupNormalTransactionModal = async (id, txData) => {
    const network = "Mainnet";
    const from = web3.utils.toChecksumAddress(address, networkInfo.chainId);
    const to = web3.utils.toChecksumAddress(txData.to, networkInfo.chainId);

    setModalView(
      <MessageModal
        title={"Transfer"}
        dappUrl={myUrl}
        address={address}
        confirmPress={async () => {
          setModalView(null);
          await handleEthSendTransaction(id, txData);
        }}
        cancelPress={() => handleReject(id)}
        txData={{
          ...txData,
          from,
          to,
          gasLimit: String(txData.gasLimit),
          network,
        }}
      />
    );
  };

  async function checkIsContractAddress(address) {
    const code = await web3.eth.getCode(address);
    return (code == "0x") ? false : true;
  }
  const popupTransactionModal = async (payload) => {
    try {

      const id = payload.id;
      const { params } = payload;
      let { nonce, gasPrice, gas, value } = params[0];
      const { to, data } = params[0];

      // When value is undefiend, set to default value.
      if (!value) {
        value = "0x0";
      }

      // Calculate nonce from blockchain when nonce is null
      if (!nonce) {
        nonce = await web3.eth.getTransactionCount(address, "pending");
      }

      // Get current gasPrice from blockchain when gasPrice is null
      if (!gasPrice) {
        await web3.eth
          .getGasPrice()
          .then((latestGasPrice) => {
            gasPrice = latestGasPrice;
          })
          .catch((err) => {
            console.log("getGasPrice error: ", err);
            gasPrice = "0x47868C00";
          });

      }

      // Estimate gas with { to, data } when gas is null
      if (!gas) {
        await web3.eth
          .estimateGas({
            from: address,
            to,
            data,
            value,
          })
          .then((latestGas) => {
            gas = latestGas;
          })
          .catch((err) => {
            console.log("estimateGas error: ", err);
            gas = "0x927c0";
          });

      }

      const txData = {
        nonce,
        data,
        // gas * 1.5 to ensure gas limit is enough
        gasLimit: parseInt(gas * 1.5, 10),
        gasPrice,
        to,
        value,
      };
      const toAddress = to.toLowerCase();
      const isContractAddress = await checkIsContractAddress(
        toAddress
      );
      if (isContractAddress) {
        // popup default contract modal
        popupContractModal(id, txData);
      } else {
        // popup normal transaction modal
        popupNormalTransactionModal(id, txData);
      }
    } catch (error) {
      console.log("err on popupTransactionModal", error);
    }

  };
  const handleEthGetTransactionByHash = async (payload) => {
    const { id, params } = payload;
    const res = await web3.eth.getTransaction(params[0]);
    const result = { id, result: res };
    postMessageToWebView(result);
  };
  const estimateGas = async (payload) => {
    // alert("popup call")
    const id = payload.id;
    const { params } = payload;
    let { nonce, gasPrice, gas, value } = params[0];
    const { to, data } = params[0];

    // When value is undefiend, set to default value.
    if (!value) {
      value = "0x0";
    }

    // Calculate nonce from blockchain when nonce is null
    if (!nonce) {
      nonce = await web3.eth.getTransactionCount(address, "pending");
    }

    // Get current gasPrice from blockchain when gasPrice is null
    if (!gasPrice) {
      await web3.eth
        .getGasPrice()
        .then((latestGasPrice) => {
          gasPrice = latestGasPrice;
        })
        .catch((err) => {
          console.log("getGasPrice error: ", err);
          gasPrice = "0x47868C00";
        });
    }

    // Estimate gas with { to, data } when gas is null
    if (!gas) {
      await web3.eth
        .estimateGas({
          from: address,
          to,
          data,
          value,
        })
        .then((latestGas) => {
          gas = latestGas;
        })
        .catch((err) => {
          console.log("estimateGas error: ", err);
          gas = "0x927c0";
        });
    }
    let gasLimit = parseInt(gas * 1.5, 10);

    const result = { id, result: gasLimit };
    postMessageToWebView(result);

  }
  const handleEthGasPrice = async (payload) => {
    try {
      const { id } = payload;
      const res = await web3.eth.getGasPrice();
      const result = { id, result: parseInt(res) };
      postMessageToWebView(result);
    } catch (err) {
      console.log("handleEthGasPrice err", err);
    }
  };
  const dispatch = useDispatch();
  // console.log('webview.currentwebview.current---->', webview.current);

  const onMessage = async (event) => {
    console.log('siusegiuewg---->', event);
    let data = JSON.parse(event.nativeEvent.data);
    const payload = data;
    const { method, id } = payload;
    try {
      switch (method) {
        case "eth_requestAccounts": {
          setApproveModalVisible(true);
          setApprovalDetails(event.nativeEvent);
          break;
        }
        case "eth_estimateGas": {
          await estimateGas(payload);
          break;
        }
        case "eth_gasPrice": {
          await handleEthGasPrice(payload);
          break;
        }
        case "eth_call": {
          await handleEthCall(payload);
          break;
        }

        case "eth_getBlockByNumber": {
          await handleEthGetBlockByNumber(payload);
          break;
        }

        case "eth_blockNumber": {
          await handleEthGetBlockNumber(payload);
          break;
        }

        case "personal_sign": {
          await popupMessageModal(payload);
          break;
        }

        case "eth_signTypedData_v4": {
          await popupMessageModal(payload);
          break;
        }

        case "eth_sendTransaction": {
          await popupTransactionModal(payload);
          break;
        }

        case "eth_getTransactionReceipt": {
          await handleEthGetTransactionReceipt(payload);
          break;
        }

        case "eth_getTransactionByHash": {
          await handleEthGetTransactionByHash(payload);
          break;
        }

        case "wallet_switchEthereumChain": {
          try {
            var BN = web3.utils.BN;
            var chainId = new BN(payload.params[0].chainId).toString();
            var rpc = CHAINS[chainId];
            var index = CHAIN_INFO?.map((el) => el.chainId).indexOf(chainId);
            setNetwork(chainId);
            setIsSwitched(true);
            setNetworkInfo({
              rpcUrl: rpc,
              chainId: chainId
            })
            var index = CHAIN_INFO?.map((el) => el.chainId).indexOf(chainId);
            setNetwork(chainId);
            const result = {
              id: payload.id, result: true, switchChain: true, config: {
                chainId: chainId,
                rpcUrl: rpc
              }
            };
            postMessageToWebView(result);

          }
          catch (e) {
            console.log("Error wallet_switchEthereumChain : ", e)
          }
        }

        default:
          break;
      }
    } catch (err) {
      console.log("onMessage error: ", err);

      if (err && err.code) {
        console.log("err_code", err);
      } else {
        console.log("else notification err comes");
      }

      handleReject(id, err.message);
    }
  };
  useEffect(() => {
    var walletarray = UseWalletArray();
    var currenteindex = GetCurrentIndex();
    var data = walletarray[currenteindex]
    var arr = []
    setImageLabel(data[0]?.currency);
    data.map((item, index) => {
      // if (item.currency != "TRX" && item.currency != "BTC") {
      arr.push(item);
      // }
    });
    setState({ data: arr, loading: false });
    // setUrl(url);

    if (
      new RegExp(
        "([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?"
      ).test(url)
    ) {
      setUrl(url);

    } else {
      setUrl("https://www.google.com/search?q=" + url);
    }
  }, [url]);
  // console.log('walletKit---->',walletKit);
  const pair = useCallback(async (uri) => {
    // console.log('walletKitwalletKit---->', walletKit);
    try {
      if (uri) {
        // console.log('walletKit---->', walletKit);
        const getPairTopic = uri?.split?.(":")?.[1]?.split?.("@")
        console.log('paringTopicsparingTopics---->',paringTopics?.includes(getPairTopic),paringTopics,getPairTopic);
        if(paringTopics?.includes(getPairTopic[0])) return false;

        console.log('uriuadawri---->', uri, getPairTopic);
        setPairingTopics([...paringTopics, getPairTopic[0]])
        dispatch({
          type: "openModal",
          data: {
            modal: "LoadingModal",
            modalData: { loadingMessage: 'Pairing...' }
          }
        })
        await new Promise(resolve => setTimeout(resolve, 1000));
        const daada = await walletKit.pair({ uri: uri });
        console.log('daada---->', daada);
        return false
      }

    } catch (error) {
      console.log('Erroro ---->', error);
      dispatch({
        type: "openModal",
        data: {
          modal: "LoadingModal",
          modalData: { errorMessage: 'There was an error pairing.' }
        }
      })
      return false
    }
  }, [walletKit,paringTopics])

  // async function pair(uri) {
  //   try {
  //     if (uri) {
  //       console.log('uriuadawri---->', uri);
  //       dispatch({
  //         type: "openModal",
  //         data: {
  //           modal: "LoadingModal",
  //           modalData: { loadingMessage: 'Pairing...' }
  //         }
  //       })
  //       await new Promise(resolve => setTimeout(resolve, 1000));
  //       const daada = await walletKit.pair({ uri: uri });
  //       console.log('daada---->', daada);
  //       return false
  //     }

  //   } catch (error) {
  //     console.log('Erroro ---->', error);
  //     dispatch({
  //       type: "openModal",
  //       data: {
  //         modal: "LoadingModal",
  //         modalData: { errorMessage: 'There was an error pairing.' }
  //       }
  //     })
  //   }
  // }

  var walletConnectStatus = false
  const handleNavigation = (navigationEvent) => {
    const { url } = navigationEvent;
    console.log('navigationEventnavigationEvent---->', navigationEvent);
    // setCurrentUrl(url)
    if (url.slice(0, 2) == "wc") {
      walletConnectStatus = true;
      setConnectWalletUrl(true);

      setTimeout(() => {
        pair(url)
      }, 1000);

      return false;

    }

    setConnectWalletUrl(false);
    walletConnectStatus = false;
    return true; // allow navigation

  };



  const getJsCode = (address, networkId, rpcUrl) => {
    const dappName = "";
    return `
    ${ethersJsContent}
    ${web3JsContent}
      (function() {
        var web33 = "";
        
        let resolver = {};
        let rejecter = {};
       


        ${Platform.OS === "ios" ? "window" : "document"
      }.addEventListener("message", function(data) {
         
          try {
            const passData = data.data ? JSON.parse(data.data) : data.data;
            const { id, result } = passData;
            
            if (result && result.error && rejecter[id]) {
              rejecter[id](new Error(result.message));
              
            } else if (resolver[id]) {
              
              resolver[id](result);
              
            }

            if(passData?.switchChain){
              try{
             // alert("Switched : ")
              const { config } = passData;
            //  initWeb3(address,config.chainId,config.rpcUrl);
              window.web3.eth.getChainId().then((data)=>{
               // alert("CHain ID : "+data)
              })
                
            // window.web3.eth.currentProvider.disconnect();
             localStorage.setItem("configData",JSON.stringify(config));
             window.location.reload();
              }catch(e){
                alert("passData Eror : "+e);
              }
            }
          } catch(err) {
            console.log('listener message err: ', err);
          }
        })
      
        communicateWithRN = (payload) => {
          return new Promise((resolve, reject) => {
            try{
              window.ReactNativeWebView.postMessage(JSON.stringify(payload));
              const { id } = payload;
              resolver[id] = resolve;
              rejecter[id] = reject;
            }catch(e){
              // alert("communicate",e)
            }
            
          })
        }

        async function transactionInit(data,fromAddr,toAddr,value,gas,gasPrice)
        {

            const nonce = await web33.eth.getTransactionCount(fromAddr, 'pending');

           return new Promise(async(resolve, reject) => {

            const rawTransaction = {
                 "from": fromAddr,
                 "to": toAddr,
                 "value": value,
                 "gasPrice": gasPrice,
                 "gasLimit": gas,
                 "nonce": nonce,
                 "data":data
                };

                const signedTx = await web33.eth.accounts.signTransaction(rawTransaction,'${privateKey}');
                //  alert("signedTx : > "+signedTx)
                try{
                     var hashResp = "";

                     hashResp =await web33.eth.sendSignedTransaction(signedTx.rawTransaction);
                     let result = (hashResp && hashResp.transactionHash)?hashResp.transactionHash:"";


                     resolve(result);
                 }catch(err)
                 //{
                   alert("hashRes err: "+err)
                     //console.log(err,'errerrerr');
                     reject(err);
                 }
            })  
        }

        function initNotification() {
        
          setInterval(() => {
            if (!window.Notification) {
              // Disable the web site notification
              const Notification = class {
                constructor(title, options) {
                  this.title = title;
                  this.options = options;
                }
    
                // Override close function
                close() {
                }
    
                // Override bind function
                bind(notification) {
                }
              }
    
              window.Notification = Notification;
            }
          }, 1000)
        }

        function initWeb3(address,networkId,rpcUrl) {
          //alert("alertinitWeb3"+address+networkId+rpcUrl)
          // Inject the web3 instance to web site
         try{
          const rskEndpoint = rpcUrl;
        
          const provider = new Web3.providers.HttpProvider(rskEndpoint);
        // alert("RPC :"+provider)
         //  const web3Provider = new ethers.providers.Web3Provider(provider)
          
          const web3 = new Web3(provider);
          web33 = new Web3(provider);
          // When Dapp is "Money on Chain", webview uses Web3's Provider, others uses Ethers' Provider
          window.ethereum =provider;
        
          window.ethereum.selectedAddress = address;

         // alert("Window.etherum : "+window.ethereum.selectedAddress)
          window.address = address;
          window.ethereum.networkVersion = networkId;
          window.ethereum.isTrust = true;
          window.ethereum.web3 = web3;
          window.web3 = web3;
          window.web3.eth.defaultAccount = address
          // alert("Window.etherum1 : "+window.ethereum.selectedAddress)

          // Adapt web3 old version (new web3 version move toDecimal and toBigNumber to utils class).
          window.web3.toDecimal = window.web3.utils.toDecimal;
          window.web3.toBigNumber = window.web3.utils.toBN;
          
          const config = {
            isEnabled: true,
            isUnlocked: true,
            networkVersion: networkId,
            onboardingcomplete: true,
            selectedAddress: address,
          }
          // alert("Window.etherum2 : "+config)

          // Some web site using the config to check the window.ethereum is exist or not
          window.ethereum.publicConfigStore = {
            _state: {
              ...config,
            },
            getState: () => {
              return {
                ...config,
              }
            }
          }
          // alert("Window.etherum3 : ")

          window.web3.setProvider(window.ethereum);
          // alert("Window.etherum4 : ")

          // Override enable function can return the current address to web site
          window.ethereum.enable = () => {
          // alert("Window.etherum5 : ")
            return new Promise((resolve, reject) => {
              resolve([address]);
            })
          }
          // window.ethereum.enable()
          // alert("Window.etherum6 : ")
          // Adapt web3 old version (new web3 version remove this function)
          window.web3.version = {
            api: '1.2.7',
            getNetwork: (cb) => { cb(null, networkId) },
          }

          window.ethereum.on = (method, callback) => { if (method) { 
            //alert("Method : "+method) 
          } }
          // alert("Window.etherum7 : ")
          // Adapt web3 old version (need to override the abi's method).
          // web3 < 1.0 using const contract = web3.eth.contract(abi).at(address)
          // web3 >= 1.0 using const contract = new web3.eth.Contract()
          window.web3.eth.contract = (abi) => {
          // alert("Window.etherum8 : ")
            const contract = new web3.eth.Contract(abi);
            contract.at = (address) => {
              contract.options.address = address;
              return contract;
            }
            // alert("Window.etherum9 : ")
            const { _jsonInterface } = contract;
          // alert("Window.etherum10 : ")
            _jsonInterface.forEach((item) => {
          // alert("Window.etherum11 : ")
              if (item.name && item.stateMutability) {
                const method = item.name;
                if (item.stateMutability === 'pure' || item.stateMutability === 'view') {
                  contract[method] = (params, cb) => {
                    contract.methods[method](params).call({ from: address }, cb);
                  };
                } else {
                  contract[method] = (params, cb) => {

                    contract.methods[method](params).send({ from: address }, cb);
                  };
                }
              }
            });

            return contract;
          }
          // alert("Window.etherum12 : ")

         
          const sleep = ms => new Promise(r => setTimeout(r, ms));
          // Override the sendAsync function so we can listen the web site's call and do our things
          const sendAsync = async (payload, callback) => {
            let err, res = '', result = '';

            let unixTime = Math.floor(Date.now() / 1000);
            
            payload.id = unixTime;
            payload.jsonrpc = "2.0"
            
            const {method, params,id,jsonrpc} = payload;
           //  alert("payLoad : "+method);
           //await sleep(1000);
           
            try {
          // alert("Window.etherum13 : ")
              if (method === 'net_version') {
                result = networkId;
              } else if (method === 'eth_chainId') {
                result = web3.utils.toHex(networkId);
              } else if (method === 'eth_requestAccounts' || method === 'eth_accounts' || payload === 'eth_accounts') {
                result = [address];
              }

              else if (method === 'eth_blockNumber')
              {
                  let blockNumberIs = await web33.eth.getBlock("latest");

        
                  result = blockNumberIs.number;
              }
              // else if (method === 'eth_estimateGas')
              // {
              //   try{
              //   const gasPrice = await web33.eth.getGasPrice();
              //     var fromAddr    = (params && params[0] && params[0].from)?params[0].from:"";
              //     var toAddr      = (params && params[0] && params[0].to)?params[0].to:"";
              //     var value       = (params && params[0] && params[0].value)?params[0].value:"";
              //     var data        = (params && params[0] && params[0].data)?params[0].data:"";
              // //  alert("value checking"+fromAddr"+ "+toAddr+" "+value+" "+data)
              //     let estGas =  await web33.eth.estimateGas({
              //       from:fromAddr,
              //       to: toAddr,
              //       value:value,
              //       data: data,
              //       gasPrice: gasPrice
              //   })
              //       alert("eth_estimateGas : "+estGas)
              //   // const estGas1 = estGas * gasPrice;
              //     result = estGas;
              //   }
              //   catch(e){
              //     alert("eth_estimateGas catch error"+e)
              //   }
                  
              // }
              else {
              //  alert("communicateWithRN : "+JSON.stringify(payload));
                result = await communicateWithRN(payload);
              }
              res = {id, jsonrpc, method, result};
            } catch(err) {
              err = err;
               //alert('sendAsync err: '+ err)
            }
            
            if (callback) {
              callback(err, res);
            } else {
              return res || err;
            }
          }

          // ensure window.ethereum.send and window.ethereum.sendAsync are not undefined
          setTimeout(() => {
            if (!window.ethereum.send) {
              window.ethereum.send = sendAsync;
            }
            if (!window.ethereum.sendAsync) {
              window.ethereum.sendAsync = sendAsync;
            }
            if (!window.ethereum.request) {
              window.ethereum.request = (payload) =>
                new Promise((resolve, reject) =>
                  sendAsync(payload).then((response) =>
                    response.result
                      ? resolve(response.result)
                      : reject(new Error(response.message || 'provider error'))));
            }
          }, 1000)

        }catch(e){
         alert("Error : "+e)
        }
        }
        initNotification();
      
        if(localStorage.getItem("configData")){
          var config = JSON.parse(localStorage.getItem("configData"));
          
        initWeb3('${address}',config.chainId,config.rpcUrl);
        }else{
        initWeb3('${address}','${networkId}','${rpcUrl}');

        }
       
       
      }) ();
    
  `
  };

  const switchInjectedData = (_address = address, _chainId = networkInfo.chainId, _rpc = networkInfo.rpcUrl) => {
    // web3 decode response
    var jsCode = getJsCode(_address, _chainId, _rpc);
    return jsCode;
  }


  const handleSwitchChain = (chainId) => {
    try {
      setIsSwitched(true);
      var index = CHAIN_INFO.map((el) => el.chainId).indexOf(chainId);
      setNetwork(chainId);
      var rpc = CHAINS[chainId];
      setNetworkInfo({
        rpcUrl: rpc,
        chainId: chainId
      })
      const result = {
        switchChain: true, config: {
          chainId: chainId,
          rpcUrl: rpc
        }
      };
      postMessageToWebView(result);
    }
    catch (e) {
      console.log("handleSwitchChain_err", e);
    }
  }
  const postMessageToWebView = (result) => {
    if (webview && webview.current) {
      webview.current.postMessage(JSON.stringify(result));
    }
  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={{
        flex: 1,
        backgroundColor: theme.background
      }}  >
        <Header title={"Web View"} />
        <Modal
          //   style={[styles.modal]}
          animationType="slide"
          visible={modalView !== null}
          deviceWidth={deviceWidth} deviceHeight={deviceHeight}
        // onRequestClose={() => {
        //   // Alert.alert("Modal has been closed.");
        //   setModalVisibleLocation(!modalVisibleLocation);
        // }}
        >
          {modalView}
        </Modal>


        <Modal visible={chainModal} style={{
          position: "relative", zIndex: 999,
          borderRadius: 50
        }}
        >
          <View onStartShouldSetResponder={() => setChainModal(false)} style={{ backgroundColor: "rgba(0,0,0,0.5)", width: deviceWidth, height: deviceHeight * 1.2, justifyContent: "center", alignSelf: "center" }} >
            <Card style={{ backgroundColor: theme.background, elevation: 0, alignSelf: "center", elevation: 2, borderRadius: 20, height: deviceHeight * 0.5 }}>

              <TouchableOpacity style={{ alignSelf: "flex-end", marginRight: "4%", marginTop: "2%" }} onPress={() => setChainModal(false)}>
                {theme.theme == "dark" ? <Closesmall1 width={30} height={30} /> : <Closesmall width={30} height={30} />}
              </TouchableOpacity>

              <View>
                <Text style={{ fontSize: 16, fontFamily: Fonts.Bold, width: "100%", textAlign: "center", color: theme.text }}>Networks</Text>

                <View style={{ height: "87.5%", marginTop: "5%" }} >
                  <ScrollView>
                    {CHAIN_INFO?.map((item, index) =>
                      <TouchableOpacity style={{
                        borderBottomColor: `${index == network ? "#7E7E89" : "#7E7E89"}`, borderBottomWidth: 1,
                        padding: 20, flexDirection: "row", alignItems: "center", justifyContent: "flex-start"
                      }}
                        onPress={() => {
                          handleSwitchChain(item.chainId);
                          setChainModal(false);
                        }}
                      >
                        {item.img}
                        <Text style={{ fontFamily: index == network ? Fonts.Bold : Fonts.Regular, fontSize: 13, marginLeft: 20, color: C.textgrey }}>{item.name}</Text>
                      </TouchableOpacity>)
                    }
                  </ScrollView>
                </View>

              </View>

            </Card>
          </View>
        </Modal>

        {(isMoving && privateKey != "" && address != "") ?
          <>
            <WebView
              source={{ uri: myUrl }}
              mixedContentMode={"compatibility"}
              setSupportMultipleWindows={connectWalletUrl}
              originWhitelist={["*"]}
              javaScriptEnabled
              domStorageEnabled={true}
              javaScriptEnabledAndroid
              cacheEnabled
              automaticallyAdjustContentInsets={false}
              canGoBack={true}
              ref={webview}
              renderError={() => {
                return (<View></View>)
              }}
              onLoadProgress={(e) => {
                const state = e.nativeEvent;
                setCanGoBack(state.canGoBack);
                setname(state.title)
                seturltoback(state.url)
              }}
              themeColor="#007AFF"
              injectedJavaScriptBeforeContentLoaded={switchInjectedData()}
              onShouldStartLoadWithRequest={handleNavigation}
              onMessage={(event) => onMessage(event)}
              sendCookies
              javascriptEnabled
              allowsInlineMediaPlayback
              useWebkit
              allowFileAccess
              testID={'browser-webview'}
              applicationNameForUserAgent={'WebView MetaMaskMobile'}
              scalesPageToFit={true}
              scrollEventThrottle={1}
            />
            <View>
              <View style={style.footernav}>
                <TouchableOpacity style={style.navstyle} onPress={() => { webview.current.goBack() }} >
                  <Icn name="arrow-back" type="ionicons" color={theme.text} />
                </TouchableOpacity>
                <TouchableOpacity style={style.navstyle} onPress={() => { props.navigation.navigate("Dapp") }} >
                  <Icn name="home" type="ionicons" color={theme.text} />
                </TouchableOpacity>
                <TouchableOpacity style={style.navstyle} onPress={() => { console.log("goBcak"); webview.current.goForward() }}
                >
                  <Icn name="arrow-forward" type="ionicons" color={theme.text} />
                </TouchableOpacity >
                <TouchableOpacity style={style.navstyle} onPress={() => setChainModal(!chainModal)}>
                  {CHAIN_INFO?.filter(item => item.chainId == network)[0]?.img ?
                    CHAIN_INFO?.filter(item => item.chainId == network)[0]?.img :
                    <Bncicon1 width={devicewidth * 0.13} height={deviceheight * 0.0470} />
                  }
                </TouchableOpacity>

              </View>
            </View>
          </>
          : <ActivityIndicator style={{ marginTop: "60%" }} size={"small"} color={theme.theme == "dark" ? "#fff" : "#00001C"} />
        }
        {/* </View>            */}
      </View>
    </SafeAreaView>
  );
};

const styles = (theme) =>
  StyleSheet.create({
    flexContainer: {
      flex: 1,
    },
    container: {

    },
    footernav: {
      flexDirection: "row", alignItems: "center", justifyContent: "space-around", width: "100%", paddingVertical: 10
    },
    navstyle: {
      borderWidth: 1,
      borderColor: theme.text,
      alignItems: 'center',
      justifyContent: 'center',
      width: 50,
      height: 50,
      borderRadius: 100,
    }
  });

export default Dappwebview;
