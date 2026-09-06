import { DrowsyButton } from '@/components/DrowsyButton';
import { DrowsyLoading } from '@/components/DrowsyLoading';
import { DrowsyText } from '@/components/DrowsyText';
import { DrowsyTextInput } from '@/components/DrowsyTextInput';
import { COLORS } from '@/constants/theme';
import { getDreamById, updateDream } from '@/db/dreams-repository';
import { Dream } from '@/db/schema';
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

  const [dream, setDream] = useState<Dream | null>(null);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const canSave = title.trim().length > 0;
  const hasChanges = dream && (title !== dream.title || text !== dream.text);

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

  const handleEdit = async () => {
    if (!dream || !canSave) return;

    try {
      await updateDream({
        id: dreamId,
        title: title.trim(),
        text: text.trim(),
      });

      router.back();
    } catch {
      Alert.alert('Ошибка', 'Не удалось обновить сновидение.');
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
      >
        <DrowsyTextInput
          type="oneline"
          value={title}
          onChangeText={setTitle}
          placeholder="Название"
          placeholderTextColor="#777"
          maxLength={100}
        />

        <DrowsyTextInput
          type="multiline"
          value={text}
          onChangeText={setText}
          placeholder="Что тебе снилось?"
          placeholderTextColor="#777"
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
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    columnGap: 20,
  },
});
