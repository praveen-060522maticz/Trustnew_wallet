import React, { useCallback, useContext, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";

const StackComponent = createStackNavigator();


const Stakewallet = (props) => {

    // useFocusEffect(
    //     useCallback(() => {
    //         return () => props.navigation.addListener("focus", async (e) => {
    //             props.navigation.navigate('Connectwallet')
    //         })
    //     }, [])
    // )

    return (
        <>
            {/* <StackComponent.Navigator
                screenOptions={Slidingnavigation}
                initialRouteName={"Connectwallet"}
            > */}
                {/* <StackComponent.Screen name={"Connectwallet"} component={Connectwallet} />
                <StackComponent.Screen name={"Walletlist"} component={Walletlist} /> */}
            {/* </StackComponent.Navigator> */}
        </>
    )
}
export default Stakewallet;