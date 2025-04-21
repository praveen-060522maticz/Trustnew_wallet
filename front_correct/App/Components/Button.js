import React from "react"
import { StatusBar, View, StyleSheet, Text } from "react-native"
import LinearGradient from "react-native-linear-gradient";
import { borderradius, deviceheight } from "../Utilities/Dimensions";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Fonts } from "../Utilities/fonts";



const Button = (props) => {
    return (
        <LinearGradient
            colors={props.colors}
            locations={[0, 0.8, 1]}  // Color stops at 0%, 70%, and 100%
            start={{ x: 0.1, y: 0 }}  // Slightly right of top-left
            end={{ x: 1, y: 0.9 }}    // Bottom-right for 132deg
            style={style.container}
        >
            <Text style={style.text} >{props.title}</Text>
            
        </LinearGradient>
    )
}
export default Button;

const style = StyleSheet.create(({
    container: {
        width: "100%",
        height: deviceheight*0.0625,
        borderRadius: borderradius * 0.5,
        justifyContent: "center"
    },
    text: { 
        fontSize: RFPercentage(1.9),
        color: "#fff",
        fontFamily: Fonts.Regular,
        textAlign: "center",
    }
}))

