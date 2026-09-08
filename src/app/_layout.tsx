import { DrowsyLoading } from '@/components/DrowsyLoading';
import { DrowsyText } from '@/components/DrowsyText';
import { COLORS } from '@/constants/theme';
import {
  LocalizationProvider,
  useLocalization,
} from '@/localization';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import migrations from '../../drizzle/migrations';
import { db } from '../db/client';

export default function RootLayout() {
  return (
    <LocalizationProvider>
      <RootNavigator />
    </LocalizationProvider>
  );
}

function RootNavigator() {
  const { t } = useLocalization();
  // @ts-expect-error Drizzle RC4 expects a legacy journal in types,
  // but drizzle-kit generates the new migrations-only format.
  const { success, error } = useMigrations(db, migrations);

  if (error) {
    return (
      <DrowsyText>
        {t('database.migrationError', { message: error.message })}
      </DrowsyText>
    );
  }

  if (!success) {
    return <DrowsyLoading />;
  }

  return (
    <ThemeProvider value={DarkTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: COLORS.DARK.BG,
          },
        }}
      >
        <Stack.Screen name="index" />

        <Stack.Screen
          name="add-dream"
          options={{
            presentation: 'fullScreenModal',
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
