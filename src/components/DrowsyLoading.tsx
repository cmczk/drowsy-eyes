import { COLORS } from '@/constants/theme';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const DrowsyLoading = () => {
  return (
    <SafeAreaView style={styles.loading}>
      <ActivityIndicator
        color={COLORS.DARK.TEXT}
        accessibilityLabel="Загрузка"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.DARK.BG,
  },
});
