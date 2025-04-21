import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Splash from "../Screens/Splash";
import { Slidingnavigation } from "../Utilities/Slidingnavigation";


import BottomNav from "./Bottomnav";

import Walletlist from "../Screens/Walletconect/Walletlist";
import Createwallet from '../Screens/Walletcreate/walletcreate';
import Walletprivacy from '../Screens/Walletcreate/walletprivacy';
import Copywalletphrase from '../Screens/Walletcreate/copywalletphrase';
import Confirmwalletphrase from '../Screens/Walletcreate/confirmwalletphrase';
import Addtokens from "../Screens/Addtoken/addtoken";
import Addcustomtokens from "../Screens/Addtoken/addcustomtoken";
import Walletlisting from "../Screens/walletlist/walletlisting";
import Walletedit from "../Screens/walletlist/walletedit";
import Passcode from "../Screens/passcodescreen/passcode";
import CreatePasscode from "../Screens/passcodescreen/createpasscode";
import ConfirmPasscode from "../Screens/passcodescreen/confirmpasscode";
import Walletimport from "../Screens/walletlist/walletimport";
import Importmulti from "../Screens/walletlist/importmulti";
import Importcoin from "../Screens/walletlist/importcoin";
import Settinglist from "../Screens/settingpage/Settinglist";
import Showprivatekey from '../Screens/walletlist/showprivatekey';
import Showphrase from "../Screens/walletlist/showphrase";
import Securitylist from "../Screens/settingpage/Securitylist";
import Notifylist from "../Screens/settingpage/Notifylist";
import Preferences from "../Screens/settingpage/Preferences";
import Prefercurrency from "../Screens/settingpage/Prefercurrency";
import Settingwalletconnect from "../Screens/settingpage/Settingwalletconnect";
import Settingconnectdetail from "../Screens/settingpage/Settingconnectdetail";
import Settingconnectconfirm from "../Screens/settingpage/Settingconnectconfirm";
import Approvepage from "../WalletConnect/ApprovePage";
import SignPage from "../WalletConnect/SignPage";
import SettingConnectDapp from "../Screens/settingpage/SettingconnectDapp";
import Walletconnectqr from "../Screens/settingpage/Walletconnectqr";
import Cmspage from "../Screens/settingpage/Cmspage";
import Dappweb from '../Screens/WalletHome/dappwebview'
import TestSc from '../TestSc'
import QrCodePage from "../Screens/Walletcreate/qrcodepage";
import WalletSuccess from "../Screens/Walletcreate/walletsuccess";
import SendSuccess from "../Screens/sendwallet/Sendsuccess";
import LegalWallet from "../Screens/walletlist/legalwallet";
import ThemePage from "../Screens/settingpage/Themepage";
import Cryptobuy from "../Screens/Cryptobuy";
import WalletPrivateKey from "../Screens/walletlist/walletprivatekey";
import PendingProcess from "../Screens/sendwallet/PendingProcess";
import Home from "../NewWalletConnect/Screens/Home";
import ScanQr from "../NewWalletConnect/Screens/ScanQr";
import SessionDetail from "../NewWalletConnect/Screens/SessionDetails";
import Modal from "../NewWalletConnect/Modals/Modal";
import Walletsend from "../Screens/sendwallet/Sendwallet";
import Walletrecieve from "../Screens/recievewallet/Receivewallet";
import Sendcurrency from "../Screens/sendwallet/Sendcurrency";
import ConfirmSend from "../Screens/sendwallet/Confirmsend";

import Receivecurrency from "../Screens/recievewallet/Receivecurrency";
import Tokentranscations from "../Screens/tokentranscation/tokentranscation";
import Tokentranscationsweb from "../Screens/WalletHome/walletwebView";

const StackComponent = createStackNavigator();

const StackNavigator = () => {

    return (
        <>

            {/* <TestSc /> */}
            <Modal/>
            <StackComponent.Navigator
                screenOptions={Slidingnavigation}
                initialRouteName={"Splash"}
            >
                <StackComponent.Screen name={"Splash"} component={Splash} />
                <StackComponent.Screen name={"Createwallet"} component={Createwallet} />
                <StackComponent.Screen name={"Walletprivacy"} component={Walletprivacy} />
                <StackComponent.Screen name={"Copywalletphrase"} component={Copywalletphrase} />
                <StackComponent.Screen name={"Confirmwalletphrase"} component={Confirmwalletphrase}  />
                <StackComponent.Screen name={"Addtokens"} component={Addtokens} />
                <StackComponent.Screen name={"Addcustomtokens"} component={Addcustomtokens} />
                <StackComponent.Screen name={"Walletlisting"} component={Walletlisting} />
                <StackComponent.Screen name={"Walletedit"} component={Walletedit} />
                <StackComponent.Screen name={"Passcode"} component={Passcode} />
                <StackComponent.Screen name={"CreatePasscode"} component={CreatePasscode} />
                <StackComponent.Screen name={"ConfirmPasscode"} component={ConfirmPasscode} />
                <StackComponent.Screen name={"Walletimport"} component={Walletimport} />
                <StackComponent.Screen name={"Importmulti"} component={Importmulti} />
                <StackComponent.Screen name={"Importcoin"} component={Importcoin} />
                <StackComponent.Screen name={"Showprivatekey"} component={Showprivatekey} />
                <StackComponent.Screen name={"Showphrase"} component={Showphrase} />
                <StackComponent.Screen name={"Settinglist"} component={Settinglist} />
                <StackComponent.Screen name={"Securitylist"} component={Securitylist} />
                <StackComponent.Screen name={"Notifylist"} component={Notifylist} />
                <StackComponent.Screen name={"Preferences"} component={Preferences} />
                <StackComponent.Screen name={"Prefercurrency"} component={Prefercurrency} />
                <StackComponent.Screen name={"Settingwalletconnect"} component={Settingwalletconnect} />
                <StackComponent.Screen name={"Settingconnectdetail"} component={Settingconnectdetail} />
                <StackComponent.Screen name={"Settingconnectconfirm"} component={Settingconnectconfirm} />
                <StackComponent.Screen name={"Walletconnectqr"} component={Walletconnectqr} />
                <StackComponent.Screen name={"SettingConnectDapp"} component={SettingConnectDapp} />
                <StackComponent.Screen name={"cmspage"} component={Cmspage} />
                <StackComponent.Screen name={"Dappweb"} component={Dappweb} />
                <StackComponent.Screen name={"Approvepage"} component={Approvepage} />
                <StackComponent.Screen name={"SignPage"} component={SignPage} />
                <StackComponent.Screen name={"QrCodePage"} component={QrCodePage} />
                <StackComponent.Screen name={"WalletSuccess"} component={WalletSuccess} />
                <StackComponent.Screen name={"SendSuccess"} component={SendSuccess} />
                <StackComponent.Screen name={"LegalWallet"} component={LegalWallet} />
                <StackComponent.Screen name={"ThemePage"} component={ThemePage} />
                <StackComponent.Screen name={"Walletmain"} children={() => <BottomNav />} />
                <StackComponent.Screen name={"Cryptobuy"} component={Cryptobuy} />
                <StackComponent.Screen name={"WalletPrivateKey"} component={WalletPrivateKey} />
                <StackComponent.Screen name={"PendingProcess"} component={PendingProcess} />

                {/* new wallet connect updated */}
                <StackComponent.Screen name={"Home"} component={Home} />
                <StackComponent.Screen name={"ScanQr"} component={ScanQr} />
                <StackComponent.Screen name={'SessionDetail'} component={SessionDetail} />


                <StackComponent.Screen name={"Walletsend"} component={Walletsend} />
                <StackComponent.Screen name={"Walletrecieve"} component={Walletrecieve} />
                <StackComponent.Screen name={"Sendcurrency"} component={Sendcurrency} />
                <StackComponent.Screen name={"ConfirmSend"} component={ConfirmSend} />
                <StackComponent.Screen name={"Receivecurrency"} component={Receivecurrency} />
                <StackComponent.Screen name={"Tokentranscations"} component={Tokentranscations}  />
                <StackComponent.Screen name={"Tokentranscationsweb"} component={Tokentranscationsweb}  />

            </StackComponent.Navigator>

        </>
    )
}

export default StackNavigator;