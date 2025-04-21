import React,{useEffect} from "react"


import { BackHandler,SafeAreaView, Text, TouchableOpacity, View } from "react-native"
import LinearGradient from "react-native-linear-gradient";
import Header from "../../../Navigations/Header";
import { style } from "./style";
import { Card } from "react-native-shadow-cards";
import Walletconnect from '../../../Assets/Icons/walletconnect.svg'
import { deviceheight, devicewidth } from "../../../Utilities/Dimensions";
import { useBackButton } from "../../../Navigations/backhandler";
import {useWalletConnectModalV2,useWalletInfo} from "../../../Utilities/UseWalletconnect"
import ApiClient from "../../../api/ApiClients";
import { ApiConstants } from "../../../api/ApiConstants";
import{getUserName,setUserName} from "../../../Utilities/usestorage"
import { Toastfn } from "../../../Utilities/toast";
const Connectwallet = (props) => {
 
    const onBackPress = () => {
        BackHandler.exitApp();
        return true;
    };
    useBackButton(props, onBackPress);
    const { address,provider,open,isConnected,isOpen } = useWalletInfo()
    useEffect(()=>{
   if(isConnected){
        props.navigation.navigate("Walletlist")
    }
    })
 

const WalletConnectfun=()=>{
    // if(isOpen==false){
        // provider.enable()
        open()

        if(address){
        
            var data=JSON.parse(getUserName())

            let params = {
                Email: data.Email,
                walletaddress:address
        
              };
        
              ApiClient.post(ApiConstants.Connectedwallet, params)
                .then((res) => {
                  if(res?.data?.status==true){
                    Toastfn(res?.data?.msg)
                    setUserName(JSON.stringify(res?.data.data))

                  }
                  else {
                    Toastfn(res?.data?.msg)


                  }

        })
    // }

    }

}
const Disconnect=()=>{
    provider.disconnect()
 }


    return (
        <SafeAreaView style={{ flex: 1 }} >
                            {useWalletConnectModalV2()} 

            <LinearGradient style={{ flex: 1 }} colors={["#3D4A6C", "#12182B"]} >
                <Header title={"Connect Wallet"} type={"home"} />
                <View style={{ height: "90%", justifyContent: "center" }} >



                    <Card style={style.card_container} >

                        <View style={{ width: "85%", alignSelf: "center", paddingVertical:"5%", flexDirection: "row", }} >
                            <View style={{ width: "15%", alignItems: "center", justifyContent: "center"}} >
                                <Walletconnect width={devicewidth * 0.06} height={deviceheight * 0.04} style={{ resizeMode: "contain" }} />
                            </View>
                            <View style={{ width: "52.5%", justifyContent: "center" }} >
                                <Text style={style.Title_text} >Wallet connect</Text>

                            </View>
                            {!address?
                                 <LinearGradient colors={['#5CB9FF', '#0091FF']}
                                 start={{ x: 0, y: 0.5 }}
                                 end={{ x: 1, y: 0.5 }}
                                 style={{ padding: "3%", width: "32.5%", borderRadius: 10, justifyContent: "center" }} >
                                 <TouchableOpacity 
                                 onPress={() =>WalletConnectfun()} 
                                 >
                                 
                                     <Text style={style.connect_text} >Connect</Text>
                                 </TouchableOpacity>
                             </LinearGradient>
                       :
                        <LinearGradient colors={['#5CB9FF', '#0091FF']}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            style={{ padding: "3%", width: "32.5%", borderRadius: 10, justifyContent: "center" }} >
                            <TouchableOpacity onPress={() =>Disconnect()} >
                            
                                <Text style={style.connect_text} >Disconnect</Text>
                            </TouchableOpacity>
                        </LinearGradient>}

                        </View>

                   

                    </Card>
                </View>
            </LinearGradient>
        </SafeAreaView >
    )
}
export default Connectwallet;