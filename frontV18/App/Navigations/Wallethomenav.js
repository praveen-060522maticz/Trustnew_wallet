import React, { useCallback, useContext, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Slidingnavigation } from "../Utilities/Slidingnavigation";
import Wallethome from "../Screens/WalletHome/Wallethome";
import Walletsend from "../Screens/sendwallet/Sendwallet";
import Walletrecieve from "../Screens/recievewallet/Receivewallet";
import Sendcurrency from "../Screens/sendwallet/Sendcurrency";
import ConfirmSend from "../Screens/sendwallet/Confirmsend";

import Receivecurrency from "../Screens/recievewallet/Receivecurrency";
import Tokentranscations from "../Screens/tokentranscation/tokentranscation";
import Tokentranscationsweb from "../Screens/WalletHome/walletwebView";




import { useFocusEffect } from "@react-navigation/native";

const StackComponent = createStackNavigator();


const Wallethomenav = (props) => {



    return (
        <>
            <StackComponent.Navigator
                screenOptions={Slidingnavigation}
                initialRouteName={"Wallethome"}
            >
                <StackComponent.Screen name={"Wallethome"} component={Wallethome} />
                {/* <StackComponent.Screen name={"Walletsend"} component={Walletsend} />
                <StackComponent.Screen name={"Walletrecieve"} component={Walletrecieve} />
                <StackComponent.Screen name={"Sendcurrency"} component={Sendcurrency} />
                <StackComponent.Screen name={"ConfirmSend"} component={ConfirmSend} />
                <StackComponent.Screen name={"Receivecurrency"} component={Receivecurrency} />
                <StackComponent.Screen name={"Tokentranscations"} component={Tokentranscations}  />
                <StackComponent.Screen name={"Tokentranscationsweb"} component={Tokentranscationsweb}  /> */}

                
            </StackComponent.Navigator>
        </>
    )
}
export default Wallethomenav;