import { DrowsyButton } from '@/components/DrowsyButton';
import { DrowsyTextInput } from '@/components/DrowsyTextInput';
import { TagColorSelector } from '@/components/TagColorSelector';
import { TagPlate } from '@/components/TagPlate';
import { COLORS } from '@/constants/theme';
import { insertDream } from '@/db/dreams-repository';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function defaultTitle() {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, '0');

  return (
    [now.getFullYear(), pad(now.getMonth() + 1), pad(now.getDate())].join('-') +
    ` ${pad(now.getHours())}:${pad(now.getMinutes())}`
  );
}

export default function AddDreamScreen() {
  const [title, setTitle] = useState(defaultTitle);
  const [text, setText] = useState('');
  const [newTagTitle, setNewTagTitle] = useState('');
  const [tagsForDream, setTagsForDream] = useState<
    { id: number | null; title: string; color: string | null }[]
  >([]);
  const [tagForColoring, setTagForColoring] = useState<string | null>(null);

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

  const canSave = title.trim().length > 0;

  const handleSave = async () => {
    try {
      await insertDream({
        title: title.trim(),
        text: text.trim(),
        tags: tagsForDream,
      });

      router.back();
    } catch {
      Alert.alert('Ошибка', 'Не удалось сохранить сновидение.');
    }
  };

  const handleCancel = () => {
    if (!text) {
      router.back();
      return;
    }

    Alert.alert(
      'Сохранить сновидение?',
      'Если выйти без сохранения, введённый текст будет потерян.',
      [
        {
          text: 'Продолжить',
          style: 'cancel',
        },
        {
          text: 'Не сохранять',
          style: 'destructive',
          onPress: () => router.back(),
        },
        {
          text: 'Сохранить',
          onPress: handleSave,
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
          autoFocus
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
          textAlignVertical="top"
        />

        <View style={styles.footer}>
          <DrowsyButton type="cancel" label="Отмена" onPress={handleCancel} />

          <DrowsyButton
            type="default"
            label="Сохранить"
            disabled={!canSave}
            onPress={handleSave}
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
