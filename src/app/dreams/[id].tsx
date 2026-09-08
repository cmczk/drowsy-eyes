import { DrowsyButton } from '@/components/DrowsyButton';
import { DrowsyLoading } from '@/components/DrowsyLoading';
import { DrowsyMarkdown } from '@/components/DrowsyMarkdown';
import { DrowsyText } from '@/components/DrowsyText';
import { TagPlate } from '@/components/TagPlate';
import { COLORS } from '@/constants/theme';
import { deleteDream, getDreamById } from '@/db/dreams-repository';
import { Dream, DreamPreview } from '@/db/schema';
import { useLocalization } from '@/localization';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DreamScreen() {
  const { t } = useLocalization();
  const { id } = useLocalSearchParams<{ id: string }>();
  const dreamId = Number(id);

  const [dream, setDream] = useState<
    (Dream & Pick<DreamPreview, 'tags'>) | null
  >(null);
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
        <DrowsyText>{t('dream.loadError')}</DrowsyText>
      </SafeAreaView>
    );
  }

  if (!dream) {
    return (
      <SafeAreaView style={styles.container}>
        <DrowsyText>{t('dream.notFound')}</DrowsyText>
      </SafeAreaView>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      t('dream.delete.confirmTitle'),
      t('dream.delete.confirmMessage'),
      [
        {
          text: t('dream.delete.action'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDream(dreamId);
              router.dismissTo('/');
            } catch {
              Alert.alert(t('common.error'), t('dream.delete.error'));
            }
          },
        },
        {
          text: t('common.actions.cancel'),
          style: 'cancel',
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.btnContainer}>
        <DrowsyButton
          type="icon"
          icon="back"
          onPress={() => router.back()}
          accessibilityLabel={t('accessibility.back')}
          accessibilityRole="button"
        />
        <View style={styles.editDeleteContainer}>
          <DrowsyButton
            type="icon"
            icon="edit"
            accessibilityLabel={t('accessibility.editDream')}
            accessibilityRole="button"
            onPress={() =>
              router.push({
                pathname: '/dreams/[id]/edit',
                params: {
                  id: dreamId.toString(),
                },
              })
            }
          />
          <DrowsyButton
            type="icon"
            icon="delete"
            onPress={handleDelete}
            accessibilityLabel={t('accessibility.deleteDream')}
            accessibilityRole="button"
          />
        </View>
      </View>

      <View style={styles.textContainer}>
        <DrowsyText type="heading">{dream.title}</DrowsyText>

        {dream.tags.length > 0 && (
          <View style={styles.platesList}>
            {dream.tags.map((tag) => {
              return (
                <TagPlate
                  key={tag.title}
                  style={styles.tagPlate}
                  type="readonly"
                  title={tag.title}
                  color={tag.color}
                />
              );
            })}
          </View>
        )}

        <DrowsyMarkdown value={dream.text} />
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
    flex: 1,
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
  platesList: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    marginBottom: 28,
  },
  tagPlate: {
    alignSelf: 'flex-start',
  },
});
