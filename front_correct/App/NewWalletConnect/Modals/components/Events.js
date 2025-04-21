import {
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { Tag } from './Tag';


export function Events({events, style}) {

  if (!events?.length) {
    return null;
  }

  return (
    <ScrollView
      bounces={false}
      style={[styles.container, {backgroundColor: "#1a1a1c"}, style]}
      contentContainerStyle={styles.content}>
      <Text style={[styles.title, {color: "#fff"}]}>Events</Text>
      <View style={styles.row}>
        {events?.map((event, index) => (
          <Tag key={index} value={event} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 8,
    maxHeight: 120,
  },
  content: {
    alignItems: 'flex-start',
    flexWrap: 'wrap',
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
  },
});
