import { AddDreamButton } from '@/components/AddDreamButton';
import { DreamList } from '@/components/DreamList';
import { DrowsyText } from '@/components/DrowsyText';
import { Header } from '@/components/Header';
import { COLORS } from '@/constants/theme';
import { useDreams } from '@/context/DreamsContext';
import { router } from 'expo-router';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  const { dreams } = useDreams();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Header />
      {dreams.length > 0 && <DreamList dreams={dreams} />}
      {dreams.length === 0 && <DrowsyText>Добавь первое сновидение</DrowsyText>}
      <AddDreamButton onPress={() => router.push('/add-dream')} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.DARK.BG,
  },
});
