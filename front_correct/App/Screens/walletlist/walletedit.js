/** packages */
import React, { useCallback, useContext, useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Header from "../../Navigations/Header";
import { borderradius, deviceheight, devicewidth } from "../../Utilities/Dimensions";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Fonts } from "../../Utilities/fonts";
import themeContext from "../../Utilities/themecontext";
import { Card } from 'react-native-shadow-cards';
import Button from "../../Components/Button";
import Righticon from '../../Assets/Icons/rightarrow.svg'
import Righticon1 from '../../Assets/Icons/rightarrowwhite.svg'
import { Toastfn } from "../../Utilities/toast";
import { UseWalletArray,SetWallets,Deletewallet, GetStatauspasscode} from "../../Utilities/usestorage";
import { C } from "../../Utilities/colors";
import { useFocusEffect } from "@react-navigation/native";


export default function Walletedit({ navigation,route }) {
    const theme = useContext(themeContext);
    const style = styles(theme);
    const [Name, setName] = useState(route?.params?.item[0]?.walletname);
    const [walletName, setWalletName] = useState([]);

    useFocusEffect(
    useCallback(() => {
        getWalletData();
        setName(route?.params?.item[0]?.walletname)
    }, [route])
    )


    /** Get Wallet data*/
    const getWalletData = () => {
        let walletarray = UseWalletArray();
        let walletName = [];
        
        walletarray.map((item, i) => {
            item.map((val) => {
                if(!walletName.some((item)=>{return(item==val.walletname) })){

                    walletName.push(val.walletname)   
                                         }
              
            }
            )
        })
        setWalletName(walletName);

    };
    /** Edit WalletName*/
    const EditWalletName = () => {
  
        if (Name.length > 25) {
            return Toastfn("Name length is too big")
        }
        if(walletName.includes(Name)){
            return Toastfn("Wallet Name already exist")
        }
        else{
        let walletarray = UseWalletArray();

        walletarray[route.params?.index]?.map((item,index)=>{
            let data=item
        if(item?.walletType=="singlecoin"){

            walletarray[route.params?.index][index].walletname = Name
            data.walletname = Name
            item = data
        
        }
        else{

                if(item.walletname){
                    walletarray[route.params?.index][index].walletname = Name
                    data.walletname = Name
                    item = data
                }
        }
    })
    
     Deletewallet()
    SetWallets(walletarray)
    navigation.push("Walletlisting")
    Toastfn("Wallet Name Change Successfully")
    

        }
      
    
       
    };
/** Show PrivateKey and Phrase*/
    const Showprivateandphrase = (privatekey,phrase)=>{

        let enablepasscodestatus=GetStatauspasscode()
        if(enablepasscodestatus){
        if(phrase){
        navigation.push("Passcode",{
            routename:"showphrase",
            mnemonic:phrase
        })
    }
    else if(privatekey){
        navigation.push("Passcode",{
            routename:"showkey",
            privKey:privatekey,
            type:route.params?.item[0]?.walletType,
            index:route.params?.index,
    })
    }
}
else{
    if(phrase){
        navigation.push("Showphrase", { mnemonic: phrase })
    }
    else if(privatekey){

        if(route.params?.item[0]?.walletType=="singlecoin"){

            navigation.push("Showprivatekey", { privKey: Object.values(privatekey)[0] });


        } 
        else{
            navigation.push("WalletPrivateKey",{index:route.params?.index});

        }              


       

    }
}
    }
    return (
        <SafeAreaView style={style.container} >
            <StatusBar backgroundColor={theme.background} />
            <View style={{ flex: 1, backgroundColor: theme.background }}   >
                <Header title={"Wallets"} />

                <View style={style.box_container} >


                    <Card style={style.card_container} >
                        <View style={style.inputrow}>
                            <View >
                                <Text style={style.inputtitle}>Name</Text>
                            </View>
                            <View style={style.inputsec}>
                                <View style={style.leftinput}>
                                    <TextInput
                                        style={style.inputstyle}
                                        onChangeText={(name) => {
                                            setName(String(name));
                                        }}value={Name}
                                        placeholder="Multi-Coin Wallet"
                                        placeholderTextColor="#464549"
                                    />
                                </View>


                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={() => EditWalletName()}
                            style={style.create_button} >
                            <Button title={"Edit Wallet Name"}  colors={['rgba(26,198,201,1)', 'rgba(56,120,199,1)', 'rgba(61,30,136,1)']} />
                        </TouchableOpacity>

                        <View style={style.listsec}>
                          {  route.params?.item[0].mnemonic!==""&&
                        <TouchableOpacity onPress={() => Showprivateandphrase(false,route.params?.item[0].mnemonic)}>
                            <View style={style.listoption}>
                               
                                <View style={style.leftoption}>
                                    <Text style={style.inputtitle}>Show Secret Phrase</Text>
                                    <Text style={style.para}>If you lose access to this device, your funds
                                        will be lost, unless you back up! </Text>
                                </View>
                                <View>
                                    {theme.theme == "dark"?   <Righticon1 width={devicewidth * 0.04} height={deviceheight * 0.017} />:   <Righticon width={devicewidth * 0.04} height={deviceheight * 0.017} />}
                             
                                </View>
                            </View>
                            </TouchableOpacity>
}
                        {  route.params?.item[0].privateKey!==""&&
                        
                        <TouchableOpacity onPress={() => Showprivateandphrase(route.params?.item[0].privateKey,false)}>

                            <View style={style.listoption}>
                                <View style={style.leftoption}>
                                    <Text style={style.inputtitle}>Show Private Key</Text>
                                    <Text style={style.para}>If you lose access to this device, your funds
                                        will be lost, unless you back up! </Text>
                                </View>
                                <View>
                                {theme.theme == "dark"?   <Righticon1 width={devicewidth * 0.04} height={deviceheight * 0.017} />:   <Righticon width={devicewidth * 0.04} height={deviceheight * 0.017} />}
                                </View>
                            </View>
                            </TouchableOpacity>}
                        </View>



                    </Card>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = (theme) =>
    StyleSheet.create({
        container: {
            flex: 1
        },
        box_container: {
            // height: "90%",
            paddingHorizontal: "3%",
            justifyContent: "center",
            alignItems: 'center',
          
        },
        card_container: {
            width: "92.5%",
            backgroundColor: theme.secondarybg,
            alignSelf: "center",
            borderRadius: borderradius * 1,
            paddingVertical: "7%",
            paddingHorizontal: "7%",
            // shadowColor: '#000',
            // shadowOffset: { width: 0, height: 2 },
            // shadowOpacity: 1,
            // shadowRadius: 4,
            // elevation: 5,
            height: "80%"

        },

        para: {
            fontSize: RFPercentage(1.65),
            color: theme.theme == "dark"? C.secondary:C.primary,
            fontFamily: Fonts.Regular,
            textAlign: 'left'
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
        inputtitle: {
            fontSize: RFPercentage(2.05),
            color: theme.text,
            fontFamily: Fonts.Regular,
        },
        inputsec: {
            backgroundColor: theme.theme == "dark"? "#1D1B24":"#D0D2DF",
            borderRadius: 7,
            width: "100%",
            height:deviceheight*0.0540,
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: "5%"

        },
        leftinput: {
            width: "100%"
        },


        inputstyle: {
            paddingHorizontal: 10,
            color: theme.text,
            fontSize: RFPercentage(1.85),
            fontFamily: Fonts.Regular,
        },
        inputrow: {
            height: "15%",
            marginBottom: "5%",

        },
        balancesec: {
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            marginBottom: "5%"
        },
        listoption:
        {
            flexDirection:'row',
            justifyContent:"space-between",
            paddingVertical:'5%'
        },
        leftoption:{
            width:'80%'
        },
        listsec:{
            marginTop:'10%'
        }


    })