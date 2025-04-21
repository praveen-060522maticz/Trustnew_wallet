import React from "react"
import { StatusBar, View, StyleSheet } from "react-native"
import LinearGradient from "react-native-linear-gradient";

import { Card } from 'react-native-shadow-cards';
import { borderradius } from "../Utilities/Dimensions";


const Cardcontent = () => {
    return (
        <Card style={{ width: "90%", borderRadius: borderradius * 1, paddingVertical: "4%", paddingHorizontal: "2%",height:50}} >
            {/* <LinearGradient style={{ width: "100%", height: "100%" }} colors={["#3D4A6C", "#12182B"]} /> */}
        </Card>
    )
}
export default Cardcontent;

