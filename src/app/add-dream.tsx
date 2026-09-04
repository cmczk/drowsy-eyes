import { DrowsyButton } from '@/components/DrowsyButton';
import { DrowsyTextInput } from '@/components/DrowsyTextInput';
import { COLORS } from '@/constants/theme';
import { useDreams } from '@/context/DreamsContext';
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

function defaulTitle() {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, '0');

  return (
    [now.getFullYear(), pad(now.getMonth() + 1), pad(now.getDate())].join('-') +
    ` ${pad(now.getHours())}:${pad(now.getMinutes())}`
  );
}

export default function AddDreamScreen() {
  const [title, setTitle] = useState(defaulTitle);
  const [text, setText] = useState('');

  const { addDream } = useDreams();

  const canSave = title.trim().length > 0;

  const handleSave = () => {
    addDream({
      title: title.trim(),
      text: text.trim(),
    });

    router.back();
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
