import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getImageUrl, ImageComponent, isEmpty } from '../utils/common';
import { useCallback, useContext, useEffect, useState } from 'react';
import { walletKit } from '../utils/WalletConnectUtills';
import themeContext from '../../Utilities/themecontext';
import { Fonts } from '../../Utilities/fonts';


function Sessions() {
  const { sessions } = useSelector(state => state.walletconnectReducer);
  const navigator = useNavigation();
  const [data, setData] = useState([])
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch()
  const onPress = (topic) => {
    navigator.navigate('SessionDetail', { topic: topic });
  };
  console.log('sessions---->', sessions);
  const theme = useContext(themeContext);
  const styles = style(theme)
  useEffect(() => {
    setData([...sessions, ...sessions, ...sessions, ...sessions, ...sessions])
  }, [sessions])

  //Refresh Controller
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    dispatch({
      type: "setSession",
      data: Object.values(walletKit.getActiveSessions())
    })
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);


  if (!sessions?.length) {
    return (
      <View style={styles.container}>
        {/* <ConnectTemplateSvg height={37} width={33} /> */}
        <Text style={styles.greyText}>
          Apps you connect with will appear here. To connect scan the
          code that is displayed in the app.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollViewContainer}
      data={sessions}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      renderItem={({ item, index }) => {
        const { name, icons, url } = item?.peer.metadata;
        const icon = !isEmpty(icons) ? icons[0] : null;
        console.log('iconsicons---->', icons, name, icons, url);
        return (
          <TouchableOpacity style={styles.container} onPress={() => onPress(item.topic)}>
            <View style={styles.flexRow}>
              <ImageComponent icons={icon} url={url} style={styles.iconContainer} />
              <View style={styles.textContainer}>
                <Text numberOfLines={2} ellipsizeMode='tail' style={[styles.mainText, { color: theme.text }]}>
                  {name ? name : 'No Name'}
                </Text>
                <Text style={styles.urlText} numberOfLines={1} ellipsizeMode="tail">
                  {url}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
}



export default Sessions;

const style = (theme) => StyleSheet.create({
  scrollViewContainer: {
    marginTop: "5%",
    paddingBottom:"5%"
    // backgroundColor: "red",
    // marginBottom:"12%"
    // padding: 16,
    // gap: 20
  },
  greyText: {
    fontSize: 14,
    color: theme.text,
    textAlign: 'center',
  },
  container: {
    height: 80,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.background,
    borderRadius: 10,
    marginBottom: "5%"
  },
  iconContainer: {
    height: 50,
    width: 50,
    borderRadius: 30,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    paddingLeft: 10,
    marginRight: 10,
    flex: 1,
  },
  mainText: {
    fontSize: 14,
    // lineHeight: 12,
    fontWeight: '600',
  },
  urlText: {
    fontSize: 12,
    lineHeight: 28,
    color: theme.text,
    fontFamily: Fonts.Regular,
  },
});
