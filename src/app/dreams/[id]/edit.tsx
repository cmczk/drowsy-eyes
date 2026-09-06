import { DrowsyButton } from '@/components/DrowsyButton';
import { DrowsyLoading } from '@/components/DrowsyLoading';
import { DrowsyText } from '@/components/DrowsyText';
import { DrowsyTextInput } from '@/components/DrowsyTextInput';
import { TagColorSelector } from '@/components/TagColorSelector';
import { TagPlate } from '@/components/TagPlate';
import { COLORS } from '@/constants/theme';
import { getDreamById, updateDream } from '@/db/dreams-repository';
import { Dream, DreamPreview } from '@/db/schema';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditDreamScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dreamId = Number(id);

  const [dream, setDream] = useState<
    (Dream & Pick<DreamPreview, 'tags'>) | null
  >(null);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [newTagTitle, setNewTagTitle] = useState('');
  const [tagsForDream, setTagsForDream] = useState<
    { id: number | null; title: string; color: string | null }[]
  >([]);
  const [tagForColoring, setTagForColoring] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const canSave = title.trim().length > 0;
  const hasChanges =
    dream &&
    (title !== dream.title ||
      text !== dream.text ||
      tagsForDream.length !== dream.tags.length ||
      tagsForDream.some((tag, index) => {
        const originalTag = dream.tags[index];

        return (
          !originalTag ||
          tag.id !== originalTag.id ||
          tag.title !== originalTag.title ||
          tag.color !== originalTag.color
        );
      }));

  useEffect(() => {
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

          if (result) {
            setTitle(result.title);
            setText(result.text);
            setTagsForDream(
              result.tags.map(({ id, title, color }) => ({ id, title, color })),
            );
          }
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
  }, [dreamId]);

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

  const handleAddTag = () => {
    const tagTitle = newTagTitle.trim();
    if (!tagTitle) return;

    setTagsForDream((currentTags) => {
      const alreadyAdded = currentTags.some(
        (currentTag) =>
          currentTag.title.toLowerCase() === tagTitle.toLowerCase(),
      );

      return alreadyAdded
        ? currentTags
        : [...currentTags, { id: null, title: tagTitle, color: null }];
    });

    setNewTagTitle('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTagsForDream((currentTags) =>
      currentTags.filter((tag) => tag.title !== tagToRemove),
    );
  };

  const handleEdit = async () => {
    if (!dream || !canSave) return;

    try {
      await updateDream({
        id: dreamId,
        title: title.trim(),
        text: text.trim(),
        tags: tagsForDream,
      });

      router.back();
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось обновить сновидение.');
      console.log(error);
    }
  };

  const handleCancel = () => {
    if (!hasChanges) {
      router.back();
      return;
    }

    Alert.alert(
      'Сохранить изменения?',
      'Если выйти без сохранения, отредактированный текст будет потерян.',
      [
        {
          text: 'Продолжить',
          style: 'cancel',
        },
        {
          text: 'Не обновлять',
          style: 'destructive',
          onPress: () => router.back(),
        },
        {
          text: 'Обновить',
          onPress: handleEdit,
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        onTouchStart={() => setTagForColoring(null)}
      >
        <DrowsyTextInput
          type="oneline"
          value={title}
          onChangeText={setTitle}
          placeholder="Название"
          placeholderTextColor={COLORS.DARK.MUTED}
          maxLength={100}
        />

        <DrowsyTextInput
          type="oneline"
          value={newTagTitle}
          onChangeText={setNewTagTitle}
          onSubmitEditing={handleAddTag}
          submitBehavior="submit"
          returnKeyType="done"
          placeholder="Теги"
          placeholderTextColor={COLORS.DARK.MUTED}
          maxLength={100}
        />

        {tagsForDream.length > 0 && (
          <View style={styles.tagList}>
            {tagsForDream.map((tag) => {
              const isColorSelectorOpen = tagForColoring === tag.title;

              return (
                <View
                  key={tag.title}
                  style={[
                    styles.tagWrapper,
                    isColorSelectorOpen && styles.activeTagWrapper,
                  ]}
                >
                  <TagPlate
                    title={tag.title}
                    color={tag.color}
                    onPress={() => setTagForColoring(tag.title)}
                    onCrossPress={() => handleRemoveTag(tag.title)}
                  />

                  {isColorSelectorOpen && (
                    <TagColorSelector
                      onColorSelect={(color) => {
                        setTagsForDream((currentTags) =>
                          currentTags.map((currentTag) =>
                            currentTag.title === tag.title
                              ? { ...currentTag, color }
                              : currentTag,
                          ),
                        );

                        setTagForColoring(null);
                      }}
                    />
                  )}
                </View>
              );
            })}
          </View>
        )}

        <DrowsyTextInput
          type="multiline"
          value={text}
          onChangeText={setText}
          placeholder="Что тебе снилось?"
          placeholderTextColor={COLORS.DARK.MUTED}
          autoFocus
          textAlignVertical="top"
        />

        <View style={styles.footer}>
          <DrowsyButton type="cancel" label="Отмена" onPress={handleCancel} />

          <DrowsyButton
            type="default"
            label="Обновить"
            disabled={!canSave || !hasChanges}
            onPress={handleEdit}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.DARK.BG,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.DARK.PRIMARY,
    padding: 20,
    gap: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    columnGap: 20,
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tagWrapper: {
    position: 'relative',
  },

  activeTagWrapper: {
    zIndex: 20,
  },
});
