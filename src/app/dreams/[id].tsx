import { DrowsyButton } from '@/components/DrowsyButton';
import { DrowsyLoading } from '@/components/DrowsyLoading';
import { DrowsyText } from '@/components/DrowsyText';
import { COLORS } from '@/constants/theme';
import { deleteDream, getDreamById } from '@/db/dreams-repository';
import { Dream } from '@/db/schema';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DreamScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dreamId = Number(id);

  const [dream, setDream] = useState<Dream | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      setLoadError(false);

      async function loadDream() {
        if (!Number.isInteger(dreamId) || dreamId <= 0) {
          if (!cancelled) {
            setDream(null);
            setIsLoading(false);
          }

          return;
        }

        try {
          const result = await getDreamById(dreamId);

          if (!cancelled) {
            setDream(result);
          }
        } catch {
          if (!cancelled) {
            setLoadError(true);
          }
        } finally {
          if (!cancelled) {
            setIsLoading(false);
          }
        }
      }

      void loadDream();

      return () => {
        cancelled = true;
      };
    }, [dreamId]),
  );

  if (isLoading) return <DrowsyLoading />;

  if (loadError) {
    return (
      <SafeAreaView style={styles.container}>
        <DrowsyText>Не удалось загрузить сновидение.</DrowsyText>
      </SafeAreaView>
    );
  }

  if (!dream) {
    return (
      <SafeAreaView style={styles.container}>
        <DrowsyText>Сновидение не найдено</DrowsyText>
      </SafeAreaView>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Удалить сновидение?',
      'Ваше сновидение будет удалено навсегда.',
      [
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDream(dreamId);
              router.dismissTo('/');
            } catch {
              Alert.alert('Ошибка', 'Не удалось удалить сновидение.');
            }
          },
        },
        {
          text: 'Отмена',
          style: 'cancel',
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.btnContainer}>
        <DrowsyButton type="icon" icon="back" onPress={() => router.back()} />
        <View style={styles.editDeleteContainer}>
          <DrowsyButton
            type="icon"
            icon="edit"
            onPress={() =>
              router.push({
                pathname: '/dreams/[id]/edit',
                params: {
                  id: dreamId.toString(),
                },
              })
            }
          />
          <DrowsyButton type="icon" icon="delete" onPress={handleDelete} />
        </View>
      </View>

      <View style={styles.textContainer}>
        <DrowsyText type="heading">{dream.title}</DrowsyText>
        <DrowsyText>{dream.text}</DrowsyText>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.DARK.PRIMARY,
    padding: 20,
  },
  textContainer: {
    marginTop: 12,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editDeleteContainer: {
    flexDirection: 'row',
  },
});
