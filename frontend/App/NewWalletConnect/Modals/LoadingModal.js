import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';

import { useSelector } from 'react-redux';

export function LoadingModal() {
  const { modalData } = useSelector(state => state.modalreducers)
  return (
    <View style={[styles.container, { backgroundColor: "#000" }]}>
      {modalData?.errorMessage ? (
        <Text style={{ color: "#000" }}>Icon</Text>
        // <Icon name="warningCircle" color="error-100" width={34} height={34} />
      ) : (
        <ActivityIndicator size="large" />
        // <LoadingSpinner size="xl" color="fg-200" />
      )}
      <Text center variant="paragraph-400" color="fg-200">
        {modalData?.loadingMessage || modalData?.errorMessage || 'Loading...'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '30%',
    padding: 16,
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    rowGap: 16,
  },
});
