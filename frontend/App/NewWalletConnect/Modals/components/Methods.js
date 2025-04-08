import {
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { Tag } from './Tag';



export function Methods({methods, style}) {

  if (!methods?.length) {
    return null;
  }

  return (
    <ScrollView
      bounces={false}
      style={[styles.container, {backgroundColor: "#1a1a1c"}, style]}
      contentContainerStyle={styles.content}>
      <Text style={[styles.title, {color: "#fff"}]}>Methods</Text>
      <View style={styles.row}>
        {methods?.length &&
          methods?.map((method, index) => (
            <Tag key={index} value={method} />
          ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    maxHeight: 120,
  },
  content: {
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    padding: 8,
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
