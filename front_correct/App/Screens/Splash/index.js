import React, { useCallback, useEffect } from "react"
import { View, StatusBar, Image } from "react-native"
import LinearGradient from 'react-native-linear-gradient';
import LottieView from "lottie-react-native"
import { GetStatauspasscode, SetDapp, UseWalletArray } from "../../Utilities/usestorage"
import { lotties, Images } from "../../Utilities/images";
import { useFocusEffect } from "@react-navigation/native";


const Splash = (props) => {
    //Initial Navigation to create page
    useFocusEffect(
        useCallback(() => {
            SetDapp(true)

            let Wallet = UseWalletArray()
            let status = GetStatauspasscode()
            if (Wallet?.length != 0) {

                if (status) {
                    props.navigation.navigate("Passcode", { routename: "home" })
                } else if (!status) {
                    props.navigation.navigate("Walletmain")
                }
            }
            else {
                setTimeout(() => {
                    props.navigation.navigate("Createwallet", { from: "splash" })
                }, 2000)


            }
        }, [])
    )



    return (
        <View style={{ flex: 1 }} >

            <StatusBar backgroundColor={'#00001C'} />
            <LinearGradient style={{ width: "100%", height: "100%", justifyContent: "center", }} start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0.5 }} colors={['#00001C', '#317ED1']} >
                {/* 
                <LottieView
                   style={{flex:1}}
                    source={lotties.splash}
                    autoPlay
                    loop
                    resizeMode="cover"
                /> */}

                <Image source={Images?.splash} style={{ height: "100%", width: "100%" }} />

            </LinearGradient >


        </View>
    )
}
export default Splash