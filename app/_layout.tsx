import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  initialRouteName: '(auth)/login',
};

import { ProfileProvider } from '@/context/profile-context';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ProfileProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="edit-profile" options={{ presentation: 'modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </ProfileProvider>
  );
}
