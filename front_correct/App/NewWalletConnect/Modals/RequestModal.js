import { ActivityIndicator, Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { addressshowing, isEmpty } from '../utils/common';

export function RequestModal({
  children,
  metadata,
  onApprove,
  onReject,
  approveLoader,
  rejectLoader,
  intention,
  isLinkMode,
  walletAddress,
  chain
}) {
  console.log('metadata---->', metadata);
  return (
    <View style={[styles.container, { backgroundColor: "#dedede" }]}>

      <View style={{ paddingVertical: 20 }}>
        {metadata?.icons?.length != 0 && <Image source={{ uri: metadata?.icons[0] }} style={{ height: 55, width: 55, alignSelf: "center", marginVertical: "2%" }} />}
        <Text style={styles.headerTxt} >
          {metadata?.name} {intention}
        </Text>
        <View style={styles.urlholder} >
          <Text numberOfLines={1} style={{ color: "#fff", maxWidth: "100%" }} >
            {metadata?.url}
          </Text>
        </View>

        {
          walletAddress &&
          <View style={{ backgroundColor: "transparent", display: "flex", alignItems: "center", flexDirection: "row", width: "100%", marginTop: 10 }} >
            <Text style={{ color: "#000", fontWeight: 600, width: "40%", textAlign: "center" }} >
              Wallet address
            </Text>
            <Text style={{ color: "#000", fontWeight: 600, width: "10%", textAlign: "left" }} >
              -
            </Text>
            <Text style={{ color: "#000", fontWeight: 600, width: "50%", textAlign: "left" }} >
              {addressshowing(walletAddress)}
            </Text>
          </View>
        }

        {
          !isEmpty(chain) &&
          <View style={{ backgroundColor: "transparent", display: "flex", alignItems: "center", flexDirection: "row", width: "100%", marginTop: 10 }} >
            <Text style={{ color: "#000", fontWeight: 600, width: "40%", textAlign: "center" }} >
              Chain
            </Text>
            <Text style={{ color: "#000", fontWeight: 600, width: "10%", textAlign: "left" }} >
              -
            </Text>
            <Text style={{ color: "#000", fontWeight: 600, width: "50%", textAlign: "left" }} >
              {chain?.id} ({chain?.name})
            </Text>
          </View>
        }

      </View>
      {children}


      <View style={{ display: "flex", width: "100%" }}>
        <View style={styles.footerBtns} >
          <TouchableOpacity disabled={approveLoader || rejectLoader} style={{ backgroundColor: "#2bc92b", borderRadius: 10, height: 50, width: 120, alignItems: "center", justifyContent: "center" }} onPress={() => onApprove()}>
            {approveLoader ?
              <ActivityIndicator size="small" /> :
              <Text style={{ textAlign: "center", fontWeight: "700" }} >Approve</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity disabled={rejectLoader || approveLoader} style={{ backgroundColor: "red", borderRadius: 10, height: 50, width: 120, alignItems: "center", justifyContent: "center" }} onPress={() => onReject()}>
            {rejectLoader ?
              <ActivityIndicator size={"small"} /> :
              <Text style={{ textAlign: "center", fontWeight: "700" }} >Deny</Text>}
          </TouchableOpacity>

        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    width: '100%',
    // flex:1
  },
  headerTxt: {
    color: "#000",
    textAlign: "center",
    marginBottom: 10
  },
  urlholder: {
    backgroundColor: "#312f2fa8",
    padding: 8,
    borderRadius: 50,
    width: "80%",
    maxWidth: "80%",
    overflow: "hidden",
    alignSelf: "center"
  },
  footerBtns: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    // backgroundColor: "red",
    marginVertical: 20
  }
});
