import { DreamsProvider } from '@/context/DreamsContext';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <DreamsProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />

        <Stack.Screen
          name="add-dream"
          options={{
            presentation: 'fullScreenModal',
          }}
        />
      </Stack>
    </DreamsProvider>
  );
}
