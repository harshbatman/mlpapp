import { ThemedText } from '@/components/themed-text';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  initialRouteName: '(auth)/login',
};

import { ProfileProvider } from '@/context/profile-context';

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
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 4,
    lineHeight: 56, // Fixed: Added line height to prevent cropping
  },
  splashSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
    letterSpacing: 2,
    lineHeight: 24, // Added line height for consistency
    textTransform: 'uppercase',
  },
});
