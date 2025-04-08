import React, { useContext } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import Header from "../../Navigations/Header";
import themeContext from "../../Utilities/themecontext";
import { View } from 'react-native';
const WalletWebView = (props) => {
    var url=props.route.params.url
    const theme = useContext(themeContext);
    return (
        <SafeAreaView style={style.flexContainer}>
            <View style={{ flex: 1,
        backgroundColor:theme.background}}  >
                <Header title={"History"} />

                <WebView
                    source={{
                        uri: url,
                    }}
                />
            </View>
        </SafeAreaView>
    );
};

const style = StyleSheet.create({
    flexContainer: {
        flex: 1,
    },
    container: {
       
    },
});

export default WalletWebView;
