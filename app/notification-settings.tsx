import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';

export default function NotificationSettingsScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme as 'light' | 'dark'];

    const [settings, setSettings] = useState({
        push: true,
        email: true,
        propertyAlerts: true,
        security: true,
        marketing: false,
    });

    const toggleSwitch = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const SettingItem = ({
        label,
        description,
        icon,
        value,
        onToggle,
        iconColor = '#6366F1'
    }: {
        label: string,
        description: string,
        icon: any,
        value: boolean,
        onToggle: () => void,
        iconColor?: string
    }) => (
        <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <View style={[styles.iconWrapper, { backgroundColor: `${iconColor}15` }]}>
                <IconSymbol name={icon} size={22} color={iconColor} />
            </View>
            <View style={styles.textContainer}>
                <ThemedText style={styles.label}>{label}</ThemedText>
                <ThemedText style={styles.description}>{description}</ThemedText>
            </View>
            <Switch
                trackColor={{ false: '#767577', true: '#10B981' }}
                thumbColor={value ? '#FFFFFF' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={onToggle}
                value={value}
            />
        </View>
    );

    return (
        <ThemedView style={styles.container}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <IconSymbol name="chevron.left" size={24} color={colors.text} />
                </Pressable>
                <ThemedText type="subtitle" style={styles.headerTitle}>Notification Settings</ThemedText>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.topSection}>
                    <ThemedText type="title" style={styles.mainTitle}>Preferences</ThemedText>
                    <ThemedText style={styles.introText}>
                        Choose what notifications you want to receive and how you want to be notified.
                    </ThemedText>
                </View>

                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Main Channels</ThemedText>
                    <SettingItem
                        label="Push Notifications"
                        description="Receive real-time alerts on your device"
                        icon="bell.fill"
                        value={settings.push}
                        onToggle={() => toggleSwitch('push')}
                        iconColor="#3B82F6"
                    />
                    <SettingItem
                        label="Email Notifications"
                        description="Get important updates in your inbox"
                        icon="envelope.fill"
                        value={settings.email}
                        onToggle={() => toggleSwitch('email')}
                        iconColor="#F59E0B"
                    />
                </View>

                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Activity Alerts</ThemedText>
                    <SettingItem
                        label="New Property Alerts"
                        description="Notify when properties match your saved search"
                        icon="house.fill"
                        value={settings.propertyAlerts}
                        onToggle={() => toggleSwitch('propertyAlerts')}
                        iconColor="#10B981"
                    />
                    <SettingItem
                        label="Security Alerts"
                        description="Important notices about your account security"
                        icon="lock"
                        value={settings.security}
                        onToggle={() => toggleSwitch('security')}
                        iconColor="#EF4444"
                    />
                </View>

                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Other</ThemedText>
                    <SettingItem
                        label="Marketing & Promotions"
                        description="Exclusive offers and app updates"
                        icon="lightbulb.fill"
                        value={settings.marketing}
                        onToggle={() => toggleSwitch('marketing')}
                        iconColor="#A855F7"
                    />
                </View>

                <View style={styles.footer}>
                    <ThemedText style={styles.footerNote}>
                        Settings are saved automatically for MAHTO Land & Properties.
                    </ThemedText>
                </View>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
    },
    backButton: { width: 40, height: 40, justifyContent: 'center' },
    headerTitle: { fontSize: 18, fontWeight: '700' },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 60 },
    topSection: { paddingVertical: 32 },
    mainTitle: { fontSize: 34, fontWeight: '800', marginBottom: 12, letterSpacing: -1 },
    introText: { fontSize: 16, lineHeight: 24, opacity: 0.6 },
    section: { marginBottom: 32 },
    sectionTitle: { fontSize: 13, fontWeight: '700', opacity: 0.4, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    iconWrapper: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    textContainer: { flex: 1, marginRight: 16 },
    label: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
    description: { fontSize: 13, opacity: 0.5, lineHeight: 18 },
    footer: { marginTop: 20, alignItems: 'center' },
    footerNote: { fontSize: 13, opacity: 0.3, fontStyle: 'italic' },
});
