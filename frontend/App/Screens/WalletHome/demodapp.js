import React, { useContext } from 'react';
import { SafeAreaView, StyleSheet ,View,Text ,TouchableOpacity} from 'react-native';
import { WebView } from 'react-native-webview';
import Header from "../../Navigations/Header";
import LinearGradient from "react-native-linear-gradient";
import themeContext from "../../Utilities/themecontext";
import {  Icon as Icn } from "react-native-elements";
import Ethicon from '../../Assets/Icons/eth.svg';
import { borderradius, deviceheight, devicewidth } from "../../Utilities/Dimensions";
const Dappwebview = props => {
      const url = props.route.params.url;
    const theme = useContext(themeContext);
    return (
        <SafeAreaView style={style.flexContainer}>
            <LinearGradient style={style.container} colors={["#3D4A6C", "#12182B"]} >
                <Header title={"Transfer History"} />
                 
                <WebView
                    source={{
                        uri: url,
                    }}
                />
                <View>
                 <View style={style.footernav}>
                    <TouchableOpacity style={style.navstyle}>
                    <Icn name="arrow-back" type="ionicons" color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={style.navstyle}>
                    <Icn name="home" type="ionicons" color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity style={style.navstyle}>
                        <Icn name="arrow-forward" type="ionicons" color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity style={style.navstyle}>
                        <Ethicon width={devicewidth * 0.20} height={deviceheight * 0.15} />
                        </TouchableOpacity>
                        
                 </View>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
};

const style = StyleSheet.create({
    flexContainer: {
        flex: 1,
    },
    container: {
        flex: 1
    },
    footernav:{
        flexDirection: "row", alignItems: "center", justifyContent: "space-around", width: "100%", paddingVertical: 10  
    },
    navstyle:{
        borderWidth: 1,
        borderColor: "#fff",
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
        borderRadius: 100,
    }
});

export default Dappwebview;

