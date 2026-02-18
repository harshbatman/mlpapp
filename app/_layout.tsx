import { ThemedText } from '@/components/themed-text';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import 'react-native-reanimated';
import '../config/i18n';

// Prevent the native splash screen from auto-hiding before we're ready
SplashScreen.preventAutoHideAsync();

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  initialRouteName: '(auth)/signup',
};

import { ChatProvider } from '@/context/chat-context';
import { NotificationProvider } from '@/context/notification-context';
import { ProfileProvider } from '@/context/profile-context';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [appIsReady, setAppIsReady] = useState(false);
  const fadeAnim = useState(new Animated.Value(1))[0];
  const scaleAnim = useState(new Animated.Value(0.95))[0];

  useEffect(() => {
    // Hide native splash screen immediately so our coded one shows up
    SplashScreen.hideAsync();

    // Scale in animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 10,
      friction: 2,
      useNativeDriver: true,
    }).start();

    // Simulate some loading time for splash screen
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        setAppIsReady(true);
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaProvider>
      <NotificationProvider>
        <View style={{ flex: 1 }}>
          <ProfileProvider>
            <ChatProvider>
              <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="edit-profile" options={{ presentation: 'modal' }} />
                  <Stack.Screen name="chat/[id]" options={{ presentation: 'card', title: 'Chat' }} />
                </Stack>
                <StatusBar style="light" />
              </ThemeProvider>
            </ChatProvider>
          </ProfileProvider>

          {!appIsReady && (
            <Animated.View
              style={[
                styles.splashContainer,
                { opacity: fadeAnim }
              ]}
            >
              <Animated.View style={[styles.splashContent, { transform: [{ scale: scaleAnim }] }]}>
                <ThemedText style={styles.splashTitle}>MAHTO</ThemedText>
                <ThemedText style={styles.splashSubtitle}>Land & Properties</ThemedText>
              </Animated.View>

              <View style={styles.splashFooter}>
                <ThemedText style={styles.footerText}>BUILDING THE FUTURE</ThemedText>
              </View>
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
  splashContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashTitle: {
    color: '#FFFFFF',
    fontSize: 72,
    fontWeight: '900',
    letterSpacing: 8,
    lineHeight: 80,
    textAlign: 'center',
  },
  splashDivider: {
    width: 40,
    height: 4,
    backgroundColor: '#FFFFFF',
    marginVertical: 20,
    borderRadius: 2,
  },
  splashSubtitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 4,
    textTransform: 'uppercase',
    textAlign: 'center',
    opacity: 0.9,
  },
  splashFooter: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 3,
  }
});
