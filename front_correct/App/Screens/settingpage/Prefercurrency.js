/** Packages*/
import React, { useContext, useState, useEffect } from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Header from "../../Navigations/Header";
import { borderradius } from "../../Utilities/Dimensions";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Fonts } from "../../Utilities/fonts";
import themeContext from "../../Utilities/themecontext";
import { ScrollView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { defaultCurrencies } from "../../Redux/Actions/Defaultcurrencies";
import { setdefaultcurrencies } from "../../Utilities/usestorage";
import { Toastfn } from "../../Utilities/toast";
export default function Prefercurrency({ navigation }) {
    const theme = useContext(themeContext);
    const style = styles(theme);
    const dispatch = useDispatch();
    const choosecurrencies = (item) => dispatch(defaultCurrencies(item));


    const [selectedValue, setSelectedValue] = useState('option1');
//redux
    const currenciessymbol = useSelector(
        (state) => state.defaultcurrencies.Currencies
    )

    useEffect(()=>{
        if(currenciessymbol.choosedcurrencies=="USD"){
            setSelectedValue("option1")
        }
        else if(currenciessymbol.choosedcurrencies=="EUR"){
            setSelectedValue("option2")
        }
        else if(currenciessymbol.choosedcurrencies=="GBP"){
            setSelectedValue("option3")
        }
        },[])
/** Choose currencies*/
    const handleRadioPress = (value,data) => {
        setSelectedValue(value);
        choosecurrencies({
            choosedcurrencies:data
        })
        setdefaultcurrencies(data)
        Toastfn("Default Coin Changed Successfully")
        setTimeout(() => {
            navigation.navigate('Walletmain')
        }, 1000);
      };






    return (
        <SafeAreaView style={style.container} >
            <StatusBar backgroundColor={theme.background} />
            <View style={{flex:1,backgroundColor:theme.background}} >
                <Header title={"Currency"} />

                <View style={style.box_container} >
                    <View style={style.card_container} >

                        <ScrollView showsVerticalScrollIndicator={false} >
    <View>
    <TouchableOpacity onPress={() => handleRadioPress('option1',"USD")} style={style.radioButton}>
        <View style={style.radiolist}>
        <Text style={style.para}>USD</Text>
        <View style={selectedValue === 'option1' ? style.selectedradio : style.defaultradio} >
        <View style={selectedValue === 'option1' ? style.selectedradioinner : ""} >
        </View>
        </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleRadioPress('option2',"EUR")} style={style.radioButton}>
      <View style={style.radiolist}>
        <Text style={style.para}>EUR</Text>
        <View style={selectedValue === 'option2' ? style.selectedradio : style.defaultradio} >
        <View style={selectedValue === 'option2' ? style.selectedradioinner : ""} >
        </View>
        </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleRadioPress('option3','GBP')} style={style.radioButton}>
      <View style={style.radiolist}>
        <Text style={style.para}>GBP</Text>
        <View style={selectedValue === 'option3' ? style.selectedradio : style.defaultradio} >
        <View style={selectedValue === 'option3' ? style.selectedradioinner : ""} >
        </View>
        </View>
        </View>
      </TouchableOpacity>
    {/* ))} */}
    </View>

                        </ScrollView>


                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = (theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor:theme.background
        },
        box_container: {
            // height: "80%",
            paddingHorizontal: "3%",
            justifyContent: "center",
            alignItems: 'center',
        },
        card_container: {
            width: "92.5%",
            marginTop: "0%",
            alignSelf: "center",
            borderRadius: borderradius * 1,
            paddingVertical: "7%",
            paddingHorizontal: "5%",
            backgroundColor:theme.secondarybg

        },

        para: {
            fontSize: RFPercentage(1.85),
            color: theme.text,
            fontFamily: Fonts.Regular,
            textAlign: 'left',
        },
        radiolist:{
            marginVertical:"3%",
            flexDirection:'row',
            justifyContent:"space-between"
        },
        defaultradio:{
            borderColor:theme.theme =="dark"?"#fff":"#00001C",
            borderWidth:2,
            borderRadius:50,
            height:20,
            width:20

        },
       selectedradio:{
            borderColor:theme.theme =="dark"?"#fff":"#00001C",
            borderWidth:2,
            borderRadius:50,
            height:20,
            width:20,

        },
        selectedradioinner:{
            height:13,
            width:13,
            borderRadius:50,
            backgroundColor:theme.theme =="dark"?"#fff":"#00001C",
            alignSelf:'center',
            justifyContent:'center',
            alignItems:'center',
            marginTop:"10%"
        },
        parabtn: {
            fontSize: RFPercentage(2.25),
            color: "#3bad43",
            fontFamily: Fonts.Regular,
            textAlign: 'center',
            marginTop: "7%"
        },
        paragray: {
            fontSize: RFPercentage(1.55),
            color: "#8C9BAA",
            fontFamily: Fonts.Regular,
            textAlign: 'center',
            lineHeight: 15

        },

        paralite: {
            fontSize: RFPercentage(1.85),
            color: "#37607F",
            fontFamily: Fonts.Regular,
            textAlign: 'center'
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

        contentsec: {
            justifyContent: "center",
            alignSelf: "center",
            marginBottom: "7%"
        },
        gradTitle: {
            fontSize: RFPercentage(2.85),
            color: "#3bad43",
            fontFamily: Fonts.Regular,
            textAlign: "center"

        },
        gradTitle1: {
            fontSize: RFPercentage(2.55),
            color: "#3bad43",
            fontFamily: Fonts.Regular,
            textAlign: "left"

        },
        logoname: {
            flexDirection: "row",
            gap: 5,
            alignItems: 'center'
        },
        coinlistsec: {
            flexDirection: "row",
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: "3%"
        },
        toggle:{
            transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
        }




    })