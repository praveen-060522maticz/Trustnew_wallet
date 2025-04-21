import { StyleSheet } from "react-native";

import { RFPercentage } from "react-native-responsive-fontsize";

import { borderradius, devicewidth } from "../../Utilities/Dimensions";
import { Fonts } from "../../Utilities/fonts";
import { CardField } from "@stripe/stripe-react-native";

const isphone = devicewidth <600
export const style = StyleSheet.create({
    card_container: {
        width: "92.5%",
        backgroundColor: "#2A3553",
        alignSelf: "center",
        borderRadius: borderradius * 1,
        paddingVertical: isphone ?"13%":"10%",
        paddingHorizontal: "10%",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 5,
        // justifyContent:"center"
        // height:"90%"
    },
    Title_text: {
        fontSize: RFPercentage(2),
        color: "#8C9BAA",
        fontFamily: Fonts.Medium,
    },
    connect_text:{
        fontSize: RFPercentage(1.6),
        color: "#fff",
        fontFamily: Fonts.Bold,
        // marginLeft:'5%',
        textAlign:"center"
    },
    buysecheight:{
        // height: "50%",
         justifyContent: "center" 
    },
    Cardform:{
        height: 170,
width:'90%'    },
modalinner: {
    paddingHorizontal: "10%",
    paddingVertical: "5%",
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: "center",
    height: '100%',
    marginTop: "-6%"
},
centeredView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
},
modalView: {
    backgroundColor: "#9ACFFF",
    width: "70%",
    alignSelf: 'center',
    borderRadius: borderradius * 0.5,
    height: "35%",
    position: "relative",

},
modalinner: {
    paddingHorizontal: "10%",
    paddingVertical: "5%",
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: "center",
    height: '100%',
    marginTop: "-6%"
},
closeicon: {
    position: "absolute",
    right: 10,
    top: 0
},
modalText: {
    color: "#19233F",
    fontSize: RFPercentage(2.4),
    fontFamily: Fonts.Medium,
    textAlign: "center",
    lineHeight: 30

},
container: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
})