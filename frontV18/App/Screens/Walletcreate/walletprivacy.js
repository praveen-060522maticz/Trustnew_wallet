import React, { useCallback, useContext, useEffect, useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import Header from "../../Navigations/Header";
import { deviceheight, devicewidth } from "../../Utilities/Dimensions";
import { RFPercentage } from "react-native-responsive-fontsize";
// import CheckBox from '@react-native-community/checkbox';
import { Fonts } from "../../Utilities/fonts";
import { ScrollView } from "react-native-gesture-handler";
import Button from "../../Components/Button";
import { useFocusEffect } from "@react-navigation/native";
import themeContext from "../../Utilities/themecontext";
import { C } from "../../Utilities/colors";
import LottieView from "lottie-react-native";
import { lotties } from "../../Utilities/images";
import { Cmsdata } from "../../Utilities/axios";
import { Toastfn } from "../../Utilities/toast";
import RenderHTML from 'react-native-render-html';
import { CheckBox } from "react-native-elements";
import CustomCheckBox from "../../Components/CheckBox";


const isphone = devicewidth < 600
export default function Walletprivacy({ navigation }) {
    const theme = useContext(themeContext);
    const style = styles(theme);
    const [selectcheck, setSelectcheck] = useState(false);
    const [load, setLoad] = useState(false);
    const [data, setdata] = useState()


    useFocusEffect(
        useCallback(() => {
            setLoad(false);
            setSelectcheck(false)
            // Getcmsdata()

        }, [])
    )


    const mixedStyle = {

        p: {
            color: theme.theme == "light" ? '#000' : '#fff',
            fontSize: RFPercentage(1.80),
            fontFamily: Fonts.Regular,
            width: "100%",
            textAlign: "justify"
        }
    }

    /** Get cms content (privacy policy,terms and conditions,abuot us)*/
    // const Getcmsdata=async()=>{



    //     try{
    //         var params={
    //             content:"Privacy Policy"
    //           }

    //         let Resp= await Cmsdata(params)
    //  if(Resp?.status){
    //         setdata(Resp.data)

    //       }
    //       else {
    //         Toastfn(Resp?.msg)
    //       }
    //         }
    //         catch(err){
    //             console.log("Getcmsdata err", err);         
    //            }


    // }
    return (
        <SafeAreaView style={style.container} >
            <StatusBar backgroundColor={theme.background} />
            <View style={style.container}>
                <Header title={"Privacy Policy"} type={"frompivacy"} />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={style.box_container} >
                        <View style={style.imgsec}>
                            <LottieView
                                style={{
                                    width: devicewidth * 0.5,
                                    height: deviceheight * 0.27,
                                    alignSelf: "center",

                                }}
                                source={lotties.secure}
                                autoPlay
                                loop
                                resizeMode="cover"
                            />
                        </View>
                        <View style={style.card_container} >
                            <ScrollView showsVerticalScrollIndicator={true} >

                                {data && data?.answer ?
                                    <View style={style.contentsec}>
                                        <RenderHTML
                                            source={{ html: data?.answer }}
                                            tagsStyles={mixedStyle}
                                        />

                                        {/* <Text style={style.para} >{data?.answer&&data?.answer}</Text> */}


                                    </View>
                                    :
                                    <View style={{ alignItems: "center", justifyContent: "center", marginTop: "30%" }}>
                                    {/* <View style={{ alignItems: "center", justifyContent: "center", marginTop: "35%" }}> */}
                                        {/* <Text style={style.paraempty}>No Data Found !</Text> */}
                                        <Text style={{
                                            color: theme.theme == "light" ? '#000' : '#fff',
                                            fontSize: RFPercentage(1.80),
                                            fontFamily: Fonts.Regular,
                                            width: "100%",
                                            textAlign: "center",
                                            lineHeight:22
                                        }}>
                                            The Recovery phrase is the master key to your funds. Never share it with anyone else The wallet will never ask you to share your recovery phrase If you lose your recovery phrase, not even the wallet can recovery your funds.
                                        </Text>
                                    </View>}
                            </ScrollView>
                        </View>


                    </View>
                </ScrollView>
            </View>

            <View style={{ position: "absolute", bottom: "3%", left: 0, right: 0, alignItems: "center", justifyContent: "center", backgroundColor: theme.background }}>
                <View style={style.checkboxsec}>
                    <CustomCheckBox
                        onChange={(newValue) => setSelectcheck(newValue)}
                    />
                    <Text style={style.checkboxlabel}>I understand the risks</Text>
                </View>
                {selectcheck == true ?
                    <TouchableOpacity
                        onPress={() =>
                            navigation.push('Copywalletphrase')
                        }
                        disabled={load}
                        style={style.create_button} >
                        <Button title={load ? <ActivityIndicator /> : "Continue"} colors={['#1AC6C9', '#3878C7', "#3D1E88"]} />
                    </TouchableOpacity> :
                    <TouchableOpacity

                        style={style.create_button1} >
                        <Button title={"Continue"} colors={['#010101', '#010101', '#010101']} />
                    </TouchableOpacity>
                }
            </View>
        </SafeAreaView>
    )
}

const styles = (theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,



        },
        box_container: {
            // height: "100%",
            // justifyContent: "center",
            alignItems: 'center',

        },
        card_container: {
            width: "92.5%",
            alignSelf: "center",
            paddingHorizontal: "5%",
            // justifyContent: "space-around",
            // height:"10%"
            height: deviceheight * 0.4,

        },

        para: {
            fontSize: RFPercentage(2.15),
            color: C.textgrey,
            fontFamily: Fonts.Regular,
            // marginTop: '5%',
            textAlign: "justify",
            letterSpacing: 0.1,
            lineHeight: RFPercentage(3.5)

        },

        create_button: {
            marginTop: "5%",
            width: "90%",
            alignSelf: "center",


        },
        create_button1: {
            marginTop: "5%",
            width: "90%",
            alignSelf: "center",
            opacity: 0.3,
        },

        contentsec: {
            justifyContent: "center",
            alignSelf: "center",
            marginBottom: "15%",
            width: "100%"

        },

        imgsec: {
            marginTop: "10%",
            //    width:"100%",


        },
        checkboxsec: {
            marginHorizontal: 20,
            flexDirection: "row",
            alignItems: 'center',
            justifyContent: "center",

        },
        checkboxlabel: {
            fontSize: RFPercentage(2.15),
            color: theme.text,
            fontFamily: Fonts.Regular,
            marginLeft: "2%"
            // marginTop: "5%",
            // marginBottom: "5%"
        },
        checkboxstyles: {
            // borderColor: "#0091FF",
        }



    })