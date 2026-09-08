import { COLORS } from '@/constants/theme';
import { useLocalization } from '@/localization';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const DrowsyLoading = () => {
  const { t } = useLocalization();

  return (
    <SafeAreaView style={styles.loading}>
      <ActivityIndicator
        color={COLORS.DARK.TEXT}
        accessibilityLabel={t('common.loading')}
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
