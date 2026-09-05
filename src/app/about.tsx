import { DrowsyButton } from '@/components/DrowsyButton';
import { DrowsyText } from '@/components/DrowsyText';
import { COLORS } from '@/constants/theme';
import { router } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <DrowsyButton
        style={styles.backBtn}
        type="icon"
        icon="back"
        onPress={() => router.back()}
      />
      <DrowsyText type="heading">О проекте</DrowsyText>
      <DrowsyText>Drowsy Eyes – ...</DrowsyText>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.DARK.BG,
  },
  backBtn: {
    marginBottom: 30,
  },
});
