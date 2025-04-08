import React, { useState,useEffect } from "react"
import {  SafeAreaView, Text, TouchableOpacity, View, ScrollView } from "react-native"
import LinearGradient from "react-native-linear-gradient";
import Header from "../../../Navigations/Header";
import { style } from "./style";
import{getUserName} from "../../../Utilities/usestorage";
import { SvgUri } from 'react-native-svg';

const Walletlist = (props) => {
    if(getUserName()){
        var datas=JSON.parse(getUserName())
    }
    
    useEffect(()=>{
        Walletdata()

    },[])
    const[wallets,setwallets]=useState()



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "red" }} >
            <LinearGradient style={{ flex: 1 }} colors={["#3D4A6C", "#12182B"]} >
                <Header title={"Wallet"} type={""} />
                <View style={{ height: "88%",}} >
                    <ScrollView>
                        <View style={{ width: "90%", alignSelf: "center",}} >
            
                          {   wallets?.map((item,index)=>       <>
                                        {index == selectedindex ?
                                            <LinearGradient colors={['#5CB9FF', '#0091FF']} style={{ backgroundColor: "#19233F", width: "26%", margin: "3.8%", padding: "3%", alignItems: "center", borderRadius: 10 }} >
    <SvgUri
    
    uri={`http://200.140.70.109:1208/walletimages/${item.currencyimage}`}
/>
                       
                                                <Text style={style.Active_Title_text} >{item.currencySymbol}</Text>
                                            </LinearGradient> :

                                            <TouchableOpacity onPress={() => setSelectedindex(index)} style={{ backgroundColor: "#19233F", width: "26%", margin: "3.8%", padding: "3%", alignItems: "center", borderRadius: 10 }} >
                                                <SvgUri
  
    uri={`http://200.140.70.109:1208/walletimages/${item.currencyimage}`}
/>
          
                                                <Text style={style.Title_text} >{item.currencySymbol}</Text>
                                                {/* <Text style={style.value_text} >{item.value}</Text> */}
                                            </TouchableOpacity>
                                            }
                                    </>
                                    )}
                                {/* )
                                }
                            /> */}
                        </View>
                        {/* <TouchableOpacity style={{ width: "80%", height: "100%",marginBottom:"5%",alignSelf:"center",marginTop:"10%"  }} onPress={() =>Disconnect(props.navigation.navigate("Home"))}>
                            <Button title={"Disconnect"} />
                        </TouchableOpacity> */}
                    </ScrollView>
                </View>
                {/* <View style={{ height: "15%", width: "75%", alignItems: "center", alignSelf: "center", }} >
                    <TouchableOpacity style={{width:"100%",height:"100%"}} >
                        <Button title={"Disconnect"} />
                    </TouchableOpacity>
                </View> */}
            </LinearGradient>
        </SafeAreaView >
    )
}
export default Walletlist;