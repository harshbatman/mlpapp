import { Redirect, Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Image, Platform, Pressable, StyleSheet, View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useProfile } from '@/context/profile-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const { profile, loading } = useProfile();
  const { t } = useTranslation();

  if (!loading && !profile.isLoggedIn) {
    return <Redirect href="/" />;
  }

  const colors = Colors[colorScheme as 'light' | 'dark'];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#8E8E93',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 40 : 25,
          left: 20,
          right: 20,
          height: 72,
          borderRadius: 35,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          paddingBottom: 0,
          paddingTop: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.15,
          shadowRadius: 16,
          elevation: 8,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginBottom: 10,
        },
        tabBarIconStyle: {
          marginTop: 8,
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('Home'),
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: t('Search'),
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="magnifyingglass" color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: '',
          tabBarButton: (props: any) => {
            const { style, ...otherProps } = props;
            return (
              <Pressable
                {...otherProps}
                style={[style, styles.postButtonWrapper, { backgroundColor: '#000000' }]}
              >
                <View style={styles.postButtonContent}>
                  <IconSymbol name="plus" size={20} color="#FFFFFF" />
                  <ThemedText style={styles.postButtonText}>Post</ThemedText>
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
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="heart.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('Profile'),
          tabBarIcon: ({ color }) => {
            if (profile.image) {
              return (
                <View style={[styles.tabAvatarContainer, { borderColor: color === '#000000' ? '#000000' : 'transparent' }]}>
                  <Image source={{ uri: profile.image }} style={styles.tabAvatar} />
                </View>
              );
            }
            return <IconSymbol size={26} name="person.fill" color={color} />;
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
    marginTop: -8,
    marginHorizontal: 10,
    height: 48,
    paddingHorizontal: 18,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  postButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  postButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  }
});

