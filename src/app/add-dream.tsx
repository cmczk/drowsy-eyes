import { DrowsyButton } from '@/components/DrowsyButton';
import { DrowsyTextInput } from '@/components/DrowsyTextInput';
import { TagColorSelector } from '@/components/TagColorSelector';
import { TagDropdown } from '@/components/TagDropdown';
import { TagPlate } from '@/components/TagPlate';
import { COLORS } from '@/constants/theme';
import { insertDream } from '@/db/dreams-repository';
import { TagPreview } from '@/db/schema';
import { getTags } from '@/db/tags-repository';
import { useLocalization } from '@/localization';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
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
  const { locale, t } = useLocalization();
  const [title, setTitle] = useState(defaultTitle);
  const [text, setText] = useState('');
  const [newTagTitle, setNewTagTitle] = useState('');
  const [tagsForDream, setTagsForDream] = useState<
    { id: number | null; title: string; color: string | null }[]
  >([]);
  const [tagForColoring, setTagForColoring] = useState<string | null>(null);
  const [availableTags, setAvailableTags] = useState<TagPreview[]>([]);
  const [tagDropdownVisible, setTagDropdownVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadTags() {
      try {
        const result = await getTags();

        if (!cancelled) setAvailableTags(result);
      } catch {}
    }

    void loadTags();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSelectAvailableTag = (tag: TagPreview) => {
    setTagsForDream((currentTags) => {
      const alreadyAdded = currentTags.some(
        (currentTag) => currentTag.id === tag.id,
      );

      if (alreadyAdded) return currentTags;

      return [
        ...currentTags,
        { id: tag.id, title: tag.title, color: tag.color },
      ];
    });

    setNewTagTitle('');
  };

  const handleAddTag = () => {
    const tagTitle = newTagTitle.trim();
    if (!tagTitle) return;

    const normalizedTagTitle = tagTitle.toLocaleLowerCase(locale);
    const existingTag = availableTags.find(
      (tag) => tag.title.toLocaleLowerCase(locale) === normalizedTagTitle,
    );

    if (existingTag) {
      handleSelectAvailableTag(existingTag);
      return;
    }

    setTagsForDream((currentTags) => {
      const alreadyAdded = currentTags.some(
        (currentTag) =>
          currentTag.title.toLocaleLowerCase(locale) === normalizedTagTitle,
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
  const tagsAvailableForSelection = availableTags.filter(
    (availableTag) =>
      !tagsForDream.some((tag) => tag.id === availableTag.id),
  );

  const openTagDropdown = () => {
    setTagForColoring(null);
    setTagDropdownVisible(true);
  };

  const handleSave = async () => {
    try {
      await insertDream({
        title: title.trim(),
        text: text.trim(),
        tags: tagsForDream,
      });

      router.back();
    } catch {
      Alert.alert(t('common.error'), t('dream.create.saveError'));
    }
  };

  const handleCancel = () => {
    if (!text) {
      router.back();
      return;
    }

    Alert.alert(
      t('dream.create.confirmTitle'),
      t('dream.create.confirmMessage'),
      [
        {
          text: t('common.actions.continue'),
          style: 'cancel',
        },
        {
          text: t('dream.create.discard'),
          style: 'destructive',
          onPress: () => router.back(),
        },
        {
          text: t('common.actions.save'),
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
        onTouchStart={() => {
          setTagForColoring(null);
          setTagDropdownVisible(false);
        }}
      >
        <DrowsyTextInput
          type="oneline"
          value={title}
          onChangeText={setTitle}
          placeholder={t('dream.form.titlePlaceholder')}
          placeholderTextColor={COLORS.DARK.MUTED}
          autoFocus
          maxLength={100}
        />

        <View
          style={[
            styles.tagInputWrapper,
            tagDropdownVisible && styles.activeTagInputWrapper,
          ]}
          onTouchStart={(event) => event.stopPropagation()}
        >
          <DrowsyTextInput
            type="oneline"
            value={newTagTitle}
            onChangeText={setNewTagTitle}
            onFocus={openTagDropdown}
            onPressIn={openTagDropdown}
            onSubmitEditing={handleAddTag}
            submitBehavior="submit"
            returnKeyType="done"
            placeholder={t('dream.form.tagsPlaceholder')}
            placeholderTextColor={COLORS.DARK.MUTED}
            maxLength={100}
          />

          {tagDropdownVisible && (
            <TagDropdown
              tags={tagsAvailableForSelection}
              onTagPress={handleSelectAvailableTag}
            />
          )}
        </View>

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
          placeholder={t('dream.form.textPlaceholder')}
          placeholderTextColor={COLORS.DARK.MUTED}
          textAlignVertical="top"
        />

        <View style={styles.footer}>
          <DrowsyButton
            type="cancel"
            label={t('common.actions.cancel')}
            onPress={handleCancel}
          />

          <DrowsyButton
            type="default"
            label={t('common.actions.save')}
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
  tagInputWrapper: {
    position: 'relative',
  },
  activeTagInputWrapper: {
    zIndex: 30,
  },
  tagWrapper: {
    position: 'relative',
  },

  activeTagWrapper: {
    zIndex: 20,
  },
});
