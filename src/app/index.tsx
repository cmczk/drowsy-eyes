import { AddDreamButton } from '@/components/AddDreamButton';
import { DreamList } from '@/components/DreamList';
import { DrowsyLoading } from '@/components/DrowsyLoading';
import { DrowsyText } from '@/components/DrowsyText';
import { Header } from '@/components/Header';
import { COLORS } from '@/constants/theme';
import { getDreams } from '@/db/dreams-repository';
import { DreamPreview } from '@/models/dreams';
import { router, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  const db = useSQLiteContext();

  const [dreams, setDreams] = useState<DreamPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      async function loadDreams() {
        try {
          const result = await getDreams(db);

          if (!cancelled) setDreams(result);
        } catch {
          if (!cancelled) setLoadError(true);
        } finally {
          if (!cancelled) setIsLoading(false);
        }
      }

      void loadDreams();

      return () => {
        cancelled = true;
      };
    }, [db]),
  );

  if (isLoading) return <DrowsyLoading />;

  if (loadError) {
    return (
      <SafeAreaView style={styles.container}>
        <DrowsyText>Не удалось загрузить сновидения.</DrowsyText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Header />
      {dreams.length > 0 && <DreamList dreams={dreams} />}
      {dreams.length === 0 && (
        <DrowsyText>Добавь первое сновидение.</DrowsyText>
      )}
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
