import { Redirect, Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useProfile } from '@/context/profile-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

const ACTIVE_COLOR = '#000000';
const INACTIVE_COLOR = '#8E8E93';

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const { profile, loading } = useProfile();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  if (!loading && !profile.isLoggedIn) {
    return <Redirect href="/" />;
  }

  const colors = Colors[colorScheme as 'light' | 'dark'];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarActiveBackgroundColor: 'transparent',
        tabBarInactiveBackgroundColor: 'transparent',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          position: 'absolute',
          bottom: insets.bottom + 12,
          left: 12,
          right: 12,
          height: 68,
          borderRadius: 34,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          paddingBottom: 8,
          paddingTop: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.15,
          shadowRadius: 16,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: '600',
          marginBottom: 0,
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginTop: 0,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('Home'),
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={26} name="house.fill" color={focused ? ACTIVE_COLOR : INACTIVE_COLOR} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: t('Search'),
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={26} name="magnifyingglass" color={focused ? ACTIVE_COLOR : INACTIVE_COLOR} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: '',
          tabBarButton: (props: any) => {
            const { style, children, ...otherProps } = props;
            return (
              <Pressable
                {...otherProps}
                style={styles.postButtonWrapper}
                android_ripple={{ color: 'rgba(255,255,255,0.25)', borderless: false, radius: 28 }}
              >
                <View style={styles.postButtonContent}>
                  <IconSymbol name="plus" size={16} color="#FFFFFF" />
                  <Text style={styles.postButtonText} numberOfLines={1}>Post</Text>
                </View>
              </Pressable>
            );
          },
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: t('Saved'),
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={26} name="heart.fill" color={focused ? ACTIVE_COLOR : INACTIVE_COLOR} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('Profile'),
          tabBarIcon: ({ color, focused }) => {
            const iconColor = focused ? ACTIVE_COLOR : INACTIVE_COLOR;
            if (profile.image) {
              return (
                <View style={[styles.tabAvatarContainer, { borderColor: focused ? ACTIVE_COLOR : 'transparent' }]}>
                  <Image source={{ uri: profile.image }} style={styles.tabAvatar} />
                </View>
              );
            }
            return <IconSymbol size={26} name="person.fill" color={iconColor} />;
          },
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabAvatarContainer: {
    width: 26,
    height: 26,
    borderRadius: 13,
    overflow: 'hidden',
    borderWidth: 1.5,
  },
  tabAvatar: {
    width: '100%',
    height: '100%',
  },
  postButtonWrapper: {
    marginTop: 0,
    marginHorizontal: 0,
    height: 44,
    paddingHorizontal: 16,
    minWidth: 90,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  postButtonContent: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  postButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    flexShrink: 0,
  },
});
