import { DrowsyButton } from '@/components/DrowsyButton';
import { DrowsyText } from '@/components/DrowsyText';
import { COLORS } from '@/constants/theme';
import { BORDER_RADIUS, BORDER_WIDTH } from '@/constants/ui';
import {
  SupportedLocale,
  useLocalization,
} from '@/localization';
import { router } from 'expo-router';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const LANGUAGE_OPTIONS: SupportedLocale[] = ['ru', 'en'];

export default function SettingsScreen() {
  const { locale, setLocale, t } = useLocalization();

  const handleLanguagePress = (newLocale: SupportedLocale) => {
    if (newLocale === locale) return;

    try {
      setLocale(newLocale);
    } catch {
      Alert.alert(t('common.error'), t('settings.saveError'));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <DrowsyButton
        style={styles.backButton}
        type="icon"
        icon="back"
        onPress={() => router.back()}
        accessibilityLabel={t('accessibility.back')}
        accessibilityRole="button"
      />

      <DrowsyText type="heading">{t('settings.title')}</DrowsyText>
      <DrowsyText style={styles.sectionTitle}>
        {t('settings.language')}
      </DrowsyText>

      <View style={styles.languageOptions}>
        {LANGUAGE_OPTIONS.map((language) => {
          const isSelected = language === locale;
          const label = t(`settings.languages.${language}`);

          return (
            <Pressable
              key={language}
              accessibilityLabel={label}
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected }}
              onPress={() => handleLanguagePress(language)}
              style={({ pressed }) => [
                styles.languageOption,
                isSelected && styles.selectedLanguageOption,
                pressed && styles.pressedLanguageOption,
              ]}
            >
              <DrowsyText>{label}</DrowsyText>
              <View style={styles.radioOuter}>
                {isSelected && <View style={styles.radioInner} />}
              </View>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.DARK.BG,
  },
  backButton: {
    marginBottom: 30,
  },
  sectionTitle: {
    marginBottom: 12,
    color: COLORS.DARK.MUTED,
  },
  languageOptions: {
    gap: 12,
  },
  languageOption: {
    minHeight: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: BORDER_WIDTH,
    borderColor: COLORS.DARK.MUTED,
    borderRadius: BORDER_RADIUS,
  },
  selectedLanguageOption: {
    borderColor: COLORS.DARK.SECONDARY,
    backgroundColor: '#202020',
  },
  pressedLanguageOption: {
    opacity: 0.7,
  },
  radioOuter: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: BORDER_WIDTH,
    borderColor: COLORS.DARK.SECONDARY,
    borderRadius: 10,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.DARK.SECONDARY,
  },
});
