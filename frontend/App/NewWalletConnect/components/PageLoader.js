import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import Loader from "../../Assets/lotties/Loader.json";
import LottieView from "lottie-react-native";
import themeContext from '../../Utilities/themecontext';
import { deviceheight, devicewidth } from '../../Utilities/Dimensions';
// import successLottie from "../Assets/lotties/sucss.json";
export default function PageLoader({ success,txt1,txt2 }) {
    const theme = useContext(themeContext);
    console.log('theme---->',theme);
    return (
        <View style={{ height:"100%", backgroundColor: theme.theme == "dark" ? "#e1e1e112" : "#e1e1e12e", alignItems: "center", justifyContent: "center",position:"absolute",width:"100%" }}>
            <LottieView
                style={{
                    width: devicewidth * (success ? 0.25 : 0.10),
                    height: deviceheight * (success ? 0.25 : 0.10),
                    alignSelf: "center"
                }}
                source={success ? successLottie : Loader}
                autoPlay
                loop
                resizeMode="cover"
            />
            {/* {txt1 && <Text style={{ color: theme.text, width: "80%", textAlign: "center" }}>{txt1} </Text>}
            {txt2 && <Text style={{ color: theme.text, width: "80%", textAlign: "center" }}>{txt2}</Text>} */}
        </View>
    )
}