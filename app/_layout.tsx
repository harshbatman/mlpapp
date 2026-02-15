import { ThemedText } from '@/components/themed-text';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import 'react-native-reanimated';
import '../config/i18n';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  initialRouteName: '(auth)/login',
};

import { NotificationProvider } from '@/context/notification-context';
import { ProfileProvider } from '@/context/profile-context';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [appIsReady, setAppIsReady] = useState(false);
  const fadeAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    // Simulate some loading time for splash screen
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start(() => {
        setAppIsReady(true);
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaProvider>
      <NotificationProvider>
        <View style={{ flex: 1 }}>
          <ProfileProvider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="edit-profile" options={{ presentation: 'modal' }} />
              </Stack>
              <StatusBar style="light" />
            </ThemeProvider>
          </ProfileProvider>

          {!appIsReady && (
            <Animated.View
              style={[
                styles.splashContainer,
                { opacity: fadeAnim }
              ]}
            >
              <ThemedText style={styles.splashTitle}>MAHTO</ThemedText>
              <ThemedText style={styles.splashSubtitle}>Land & Properties</ThemedText>
            </Animated.View>
          )}
        </View>
      </NotificationProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  splashTitle: {
    color: '#FFFFFF',
    fontSize: 80,
    fontWeight: '900',
    letterSpacing: 4,
    lineHeight: 88,
  },
  splashSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
    letterSpacing: 7.2,
    lineHeight: 24,
    textTransform: 'uppercase',
  },
});
