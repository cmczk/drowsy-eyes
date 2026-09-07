import { AddDreamButton } from '@/components/AddDreamButton';
import { DreamList } from '@/components/DreamList';
import { DrowsyLoading } from '@/components/DrowsyLoading';
import { DrowsyText } from '@/components/DrowsyText';
import { Header } from '@/components/Header';
import { COLORS } from '@/constants/theme';
import { getDreams } from '@/db/dreams-repository';
import { DreamPreview, TagPreview } from '@/db/schema';
import { getTags } from '@/db/tags-repository';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  const [dreams, setDreams] = useState<DreamPreview[]>([]);
  const [tags, setTags] = useState<TagPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      async function loadDreams() {
        try {
          const [dreamsResult, tagsResult] = await Promise.all([
            getDreams(),
            getTags(),
          ]);

          if (!cancelled) {
            setDreams(dreamsResult);
            setTags(tagsResult);
          }
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
    }, []),
  );

  if (isLoading) return <DrowsyLoading />;

  if (loadError) {
    return (
      <SafeAreaView style={styles.container}>
        <DrowsyText>Не удалось загрузить сновидения.</DrowsyText>
      </SafeAreaView>
    );
  }

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const filteredDreams = dreams.filter((dream) => {
    const matchesSearch =
      normalizedSearchQuery.length === 0 ||
      dream.title.toLowerCase().includes(normalizedSearchQuery) ||
      dream.text.toLowerCase().includes(normalizedSearchQuery);

    const matchesTags = selectedTagIds.every((selectedTagId) =>
      dream.tags.some((tag) => tag.id === selectedTagId),
    );

    return matchesSearch && matchesTags;
  });

  const handleTagToggle = (tagId: number) => {
    setSelectedTagIds((currentTagIds) =>
      currentTagIds.includes(tagId)
        ? currentTagIds.filter((currentTagId) => currentTagId !== tagId)
        : [...currentTagIds, tagId],
    );
  };

  const hasDreams = dreams.length > 0;
  const hasFilteredDreams = hasDreams && filteredDreams.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        tags={tags}
        selectedTagIds={selectedTagIds}
        onTagToggle={handleTagToggle}
        onResetFilter={() => setSelectedTagIds([])}
      />
      {hasFilteredDreams ? (
        <DreamList dreams={filteredDreams} />
      ) : hasDreams ? (
        <DrowsyText>Ничего не нашлось.</DrowsyText>
      ) : (
        <View style={styles.emptyState}>
          <DrowsyText style={styles.emptyStateTxt}>
            Добавь первое сновидение
          </DrowsyText>
        </View>
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateTxt: {
    fontSize: 32,
    color: COLORS.DARK.MUTED,
    textAlign: 'center',
    paddingBottom: 100,
  },
});
