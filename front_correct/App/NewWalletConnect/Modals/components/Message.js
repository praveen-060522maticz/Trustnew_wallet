import { ScrollView, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';


export function Message({ message, style, showTitle = true }) {
console.log('message---->',message);
  if (!message) {
    return null;
  }

  return (
    <ScrollView
      bounces={false}
      style={[styles.container, { backgroundColor: "#1a1a1c" }, style]}
      contentContainerStyle={styles.content}>
      {showTitle && (
        <Text style={[styles.title, { color: "#fff" }]}>Message</Text>
      )}
      <Text style={[styles.message, { color: "#fff" }]}>{message}</Text>
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
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  message: {
    fontSize: 12,
    lineHeight: 18,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
