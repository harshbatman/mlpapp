import { Tabs } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useProfile } from '@/context/profile-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { profile } = useProfile();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Post',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="plus.circle.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => {
            if (profile.image) {
              return (
                <View style={[styles.tabAvatarContainer, { borderColor: color }]}>
                  <Image source={{ uri: profile.image }} style={styles.tabAvatar} />
                </View>
              );
            }
            return <IconSymbol size={28} name="person.fill" color={color} />;
          },
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabAvatarContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1.5,
  },
  tabAvatar: {
    width: '100%',
    height: '100%',
  },
});
