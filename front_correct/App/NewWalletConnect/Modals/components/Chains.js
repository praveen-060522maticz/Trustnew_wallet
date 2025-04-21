import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';



export function Chains({chains}) {

  return (
    <ScrollView
      bounces={false}
      style={[styles.container, {backgroundColor: "#1a1a1c"}]}
      contentContainerStyle={styles.content}>
      <Text style={[styles.title, {color:"#fff"}]}>
        Blockchain(s)
      </Text>
      <View style={styles.row}>
        {chains?.map(chain => {
          // const logo = PresetsUtil.getChainLogo(chain.id);
          return (
            <View
              key={ Math.random() + Date.now()}
              style={[styles.chain, {borderColor: "#000",borderWidth:1}]}>
              {/* <Image
                source={logo}
                style={[styles.chainLogo, {backgroundColor: "#808080"}]}
              /> */}
              <Text style={styles.chainName}>{chain.name}</Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    maxHeight: 120,
    // backgroundColor:"red"
  },
  content: {
    padding: 8,
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  chainLogo: {
    height: 18,
    width: 18,
    borderRadius: 100,
  },
  chainName: {
    fontWeight: '500',
    fontSize: 12,
    color:"#fff",
    textAlign:"center"
  },
  title: {
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '600',
    margin: 4,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
    columnGap: 12,
    rowGap: 8,
    paddingHorizontal: 4,
  },
  chain: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 26,
    paddingHorizontal: 8,
    borderRadius: 28,
    marginRight: 4,
    marginBottom: 8,
    backgroundColor:"#808080"
  },
});
