import { DrowsyButton } from '@/components/DrowsyButton';
import { DrowsyTextInput } from '@/components/DrowsyTextInput';
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

  const canSave = title.trim().length > 0;

  const handleSave = async () => {
    try {
      await insertDream({
        title: title.trim(),
        text: text.trim(),
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
});
