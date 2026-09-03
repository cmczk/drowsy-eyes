import { AddDreamButton } from '@/components/AddDreamButton';
import { DreamList } from '@/components/DreamList';
import { Header } from '@/components/Header';
import { COLORS } from '@/constants/theme';
import { Dream } from '@/models/Dream';
import { router } from 'expo-router';
import { useState } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const initialDreams = [
  {
    id: 1,
    title: '2026-09-03 Кошмар',
  },
  {
    id: 2,
    title: '2026-09-03 Единороги',
  },
  {
    id: 3,
    title: '2026-09-03 Секс',
  },
  {
    id: 4,
    title: '2026-09-03 Школа',
  },
  {
    id: 5,
    title: '2026-09-03 Венеция',
  },
];

export default function Index() {
  const [dreams, setDreams] = useState<Dream[]>(initialDreams);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Header />
      <DreamList dreams={dreams} />
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
