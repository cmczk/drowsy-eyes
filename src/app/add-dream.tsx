import { DrowsyButton } from '@/components/DrowsyButton';
import { COLORS } from '@/constants/theme';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
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

  const canSave = title.trim().length > 0;

  const handleSave = () => {
    const dream = {
      id: Date.now(),
      title: title.trim(),
      text: text.trim(),
    };

    console.log(dream);

    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Название"
          placeholderTextColor="#777"
          style={styles.titleInput}
          maxLength={100}
        />

        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Что снилось?"
          placeholderTextColor="#777"
          style={styles.textInput}
          multiline
          autoFocus
          textAlignVertical="top"
        />

        <View style={styles.footer}>
          <DrowsyButton
            type="cancel"
            label="Отмена"
            onPress={() => router.back()}
          />

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
  titleInput: {
    padding: 14,
    color: COLORS.DARK.TEXT,
    borderBottomWidth: 1,
    borderColor: '#777',
    fontSize: 18,
  },
  textInput: {
    flex: 1,
    padding: 14,
    color: COLORS.DARK.TEXT,
    fontSize: 16,
  },
});
