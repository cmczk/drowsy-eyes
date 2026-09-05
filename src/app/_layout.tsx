import { COLORS } from '@/constants/theme';
import { migrateDatabase } from '@/db/migrations';
import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';

export default function RootLayout() {
  return (
    <ThemeProvider value={DarkTheme}>
      <SQLiteProvider databaseName="drowsy-eyes.db" onInit={migrateDatabase}>
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
      </SQLiteProvider>
    </ThemeProvider>
  );
}
