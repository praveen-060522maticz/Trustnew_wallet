import React, { useContext, useState, useEffect } from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import Header from "../../Navigations/Header";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Fonts } from "../../Utilities/fonts";
import themeContext from "../../Utilities/themecontext";
import { useRoute } from '@react-navigation/native';
import LinearGradient from "react-native-linear-gradient";
import { ScrollView } from "react-native-gesture-handler";

import { Toastfn } from "../../Utilities/toast";
import { Cmsdata } from "../../Utilities/axios";
import { ActivityIndicator } from "react-native-paper";
import { borderradius, devicewidth } from "../../Utilities/Dimensions";
import RenderHTML from 'react-native-render-html';
import WebView from "react-native-webview";
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconFont from 'react-native-vector-icons/FontAwesome';
import IconMatComm from 'react-native-vector-icons/MaterialCommunityIcons';
import Privacyicon from "../../Assets/caexicons/privacy.svg"
import Privacyicon1 from "../../Assets/caexicons/privacy1.svg"

export default function Cmspage(props) {
    const theme = useContext(themeContext);
    const style = styles(theme);
    const route = useRoute();
    const [data, setdata] = useState()
    const [loader, setloader] = useState(true);
    console.log('loadad---->', loader, data);


    const previousRouteName = route.params.routename;
    useEffect(() => {

        // Getcmsdata()
        setTimeout(() => {
            setloader(false)
        }, 1000)
    }, []);

    /** Get cms content (privacy policy,terms and conditions,abuot us)*/
    const Getcmsdata = async () => {



        try {
            var params = {
                content: previousRouteName
            }

            let Resp = await Cmsdata(params);
            console.log('Respsspeesp---->', Resp);
            if (Resp?.status == true) {
                setloader(false)
                setdata(Resp.data)

            }
            else {
                Toastfn(Resp?.msg)
            }
        }
        catch (err) {
            console.log("Getcmsdata err", err);
        }


    }

    const mixedStyle = {

        p: {
            color: theme.theme == "light" ? '#000' : '#fff',
            fontSize: RFPercentage(1.80),
            fontFamily: Fonts.Regular,
            textAlign: "justify",
            width: "100%"
        }
    }
    return (
        <SafeAreaView style={style.container} >
            <StatusBar backgroundColor={theme.background} />




            <Header
                title={
                    previousRouteName
                }
            />

            <View style={style.maincontainer} >
                <View style={style.privacyicon}>
                    {
                        previousRouteName === "AboutUs" ?
                            <IconFont name="users" size={60} color={theme.theme == "dark" ? "#fff" : "#00001C"} /> :
                            previousRouteName === "Privacy Policy" ?
                                (theme.theme == "dark" ? <Privacyicon width={devicewidth * 0.18} height={devicewidth * 0.18} /> : <Privacyicon1 width={devicewidth * 0.18} height={devicewidth * 0.18} />) :
                                <Icon name="privacy-tip" size={60} color={theme.theme == "dark" ? "#fff" : "#00001C"} />
                        // <IconMatComm name="file-document-edit-outline" size={60} color={theme.theme == "dark" ? "#fff" : "#00001C"} />
                    }
                </View>
                <Text style={style.content} >
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

                </Text>
            </View>


            {/* {loader ?
                <View style={{ flex: 1, justifyContent: "center", backgroundColor: theme.background, borderRadius: borderradius * 1, marginTop: "5%" }} >
                    <ActivityIndicator color={theme.theme == "dark" ? "#fff" : "#00001C"} size={"small"} />
                </View>
                :


                data?.question == 'Privacy Policy' ?
                    // <WebView
                    //     source={{
                    //         uri:
                    //             `https://walletceax-privacy.maticz.in/privacypolicy.html`
                    //     }}
                    // />
                    <Icon name="privacy-tip" size={30} color="#000" />
                    :
                    data?.question == 'TermsandConditions' ?
                        <WebView
                            source={{
                                uri:
                                    'https://walletceax-privacy.maticz.in/terms.html'
                            }}
                        />
                        :
                        null



            } */}

        </SafeAreaView >
    )
}

const styles = (theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background
        },
        box_container: {
            height: "80%",
            paddingHorizontal: "3%",
            justifyContent: "center",
            alignItems: 'center',
            width: "100%"

        },
        cmscontent: {
            paddingVertical: "5%",
            width: "90%",
            justifyContent: "center",
            alignSelf: "center",
            alignItems: "center"


        },

        para: {
            fontSize: RFPercentage(1.65),
            color: "#9ACFFF",
            fontFamily: Fonts.Regular,
            textAlign: 'left'
        },

        paralite: {
            fontSize: RFPercentage(1.95),
            color: theme.text,
            fontFamily: Fonts.Regular,
            textAlign: 'justify',
            letterSpacing: 0.1,
            lineHeight: RFPercentage(4.5)
        },
        parablue: {
            fontSize: RFPercentage(1.95),
            color: "#0091FF",
            fontFamily: Fonts.Regular,
            textAlign: 'center'
        },

        create_button: {
            marginTop: "5%",
            width: "100%",
            alignSelf: "center"
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
        maincontainer: {
            alignItems: "center",
            flex: 1,
            // paddingVertical: 30,
            // justifyContent:"space-between",

        },
        privacyicon: {
            paddingVertical: "15%"
        },
        content: {
            fontSize: RFPercentage(2),
            color: theme.text,
            fontFamily: Fonts.Regular,
            textAlign: "center",
            marginHorizontal: "5%"
        }

    })