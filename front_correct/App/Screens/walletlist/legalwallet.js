/** Packages */
import React, { useCallback, useContext, useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import Header from "../../Navigations/Header";
import { borderradius, deviceheight, devicewidth } from "../../Utilities/Dimensions";
import { RFPercentage } from "react-native-responsive-fontsize";
import CheckBox from '@react-native-community/checkbox';
import { Fonts } from "../../Utilities/fonts";
import { ScrollView } from "react-native-gesture-handler";
import Button from "../../Components/Button";
import { useFocusEffect } from "@react-navigation/native";
import themeContext from "../../Utilities/themecontext";
import { C } from "../../Utilities/colors";
import Rightarrow from '../../Assets/Icons/rightarrowblue.svg';
import Rightarrow1 from "../../Assets/Icons/rightarrowwhite"

// const isphone = devicewidth < 600

export default function LegalWallet({ navigation }) {
    const theme = useContext(themeContext);
    const style = styles(theme);
    const [selectcheck, setSelectcheck] = useState(false);
    const [load, setLoad] = useState(false);

    useFocusEffect(
        useCallback(() => {
            setLoad(false);
            setSelectcheck(false)
        }, [])
    )



    return (
        <SafeAreaView style={style.container} >
            <StatusBar backgroundColor={theme.background} />
            <View style={style.container}>
                <Header title={"Legal"} />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ width: "100%", alignItems: "center" }}>
                        <View style={{ width: "80%", alignItems: "center", marginTop: "2%", justifyContent: "center" }}>
                            <Text style={{
                                fontSize: RFPercentage(2.15),
                                color: C.textgrey,
                                fontFamily: Fonts.Regular,
                                letterSpacing: 0.5
                            }}>Please review the Caex Terms of service and privacy policy</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('cmspage', {
                                routename: "Privacy Policy"
                            })}
                            style={{
                                width: "100%",
                                alignItems: "center",
                                marginTop: "8%"
                            }}>
                            <View style={style.listsec}>
                                <Text style={style.para1}>Privacy policy</Text>
                                <View>
                                    {theme.theme == "dark" ? <Rightarrow1 width={devicewidth * 0.035} height={deviceheight * 0.018} /> : <Rightarrow width={devicewidth * 0.035} height={deviceheight * 0.018} />}
                                </View>

                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('cmspage', {
                                routename: "TermsandConditions"
                            })}
                            style={{
                                width: "100%",
                                alignItems: "center",
                                marginTop: "4%"
                            }}>
                            <View style={style.listsec}>
                                <Text style={style.para1}>Terms of services</Text>
                                <View>
                                    {theme.theme == "dark" ? <Rightarrow1 width={devicewidth * 0.035} height={deviceheight * 0.018} /> : <Rightarrow width={devicewidth * 0.035} height={deviceheight * 0.018} />}
                                </View>

                            </View>
                        </TouchableOpacity>



                    </View>
                </ScrollView>
            </View>
            <View style={{ position: "absolute", bottom: "6%", left: 0, right: 0, alignItems: "center", justifyContent: "center", marginBottom: "4%" }}>
                <View style={style.checkboxsec}>
                    <CheckBox
                        disabled={false}
                        value={selectcheck}
                        style={style.checkboxstyles}
                        tintColors={{ true: theme.theme == "dark" ? "#1AC6C9" : "#00001C", false: theme.text }}
                        onFillColor={'#00000'}
                        onValueChange={(newValue) => setSelectcheck(newValue)}
                    />
                    <Text style={style.checkboxlabel}>I read the terms & condition</Text>
                </View>
                {selectcheck == true ?
                    <TouchableOpacity
                        onPress={() =>
                            navigation.push('Walletimport')
                            // navigation.push('Importcoin')


                        }
                        disabled={load}
                        style={style.create_button} >
                        <Button title={load ? <ActivityIndicator /> : "Continue"} colors={['#1AC6C9', '#3878C7', "#3D1E88"]} />
                    </TouchableOpacity> :
                    <View

                        style={style.create_button1} >
                        <Button title={"Continue"} colors={theme.theme == "dark" ? ['#919191', '#919191'] : ['#010101', '#010101']} />
                    </View>
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
            height: "100%",
            justifyContent: "center",
            alignItems: 'center'
        },
        card_container: {
            width: "92.5%",
            alignSelf: "center",
            paddingHorizontal: "5%",
            justifyContent: "space-around"

        },

        para: {
            fontSize: RFPercentage(2.15),
            color: C.textgrey,
            fontFamily: Fonts.Regular,
            marginTop: '5%',
            textAlign: "center"
        },

        para1: {
            fontSize: RFPercentage(1.95),
            color: theme.text,
            fontFamily: Fonts.Regular,


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
            marginBottom: "7%"
        },

        imgsec: {
            marginTop: "20%"

        },
        checkboxsec: {

            flexDirection: "row",
            alignItems: 'center',
            justifyContent: "center",

        },
        checkboxlabel: {
            fontSize: RFPercentage(2.15),
            color: theme.text,
            fontFamily: Fonts.Regular,
            marginLeft: "1%"
        },
        checkboxstyles: {
            // borderColor: "#0091FF",
        },
        listsec: {
            flexDirection: 'row',
            justifyContent: "space-between",
            alignItems: 'center',

            backgroundColor: theme.secondarybg,
            borderRadius: borderradius * 0.5,
            width: "90%",
            padding: "4%"

        }



    })