import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Platform, Pressable, StyleSheet, View } from 'react-native';

const INITIAL_NOTIFICATIONS = [
    {
        id: '1',
        title: 'Welcome to MAHTO!',
        message: 'Thank you for joining MAHTO Land & Properties. Start exploring properties today!',
        time: '2h ago',
        type: 'info',
        isRead: false,
    },
    {
        id: '2',
        title: 'New Listing Alert',
        message: 'A new property matching your interests has been posted in your area.',
        time: '5h ago',
        type: 'house',
        isRead: false,
    },
    {
        id: '3',
        title: 'Security Update',
        message: 'Your profile password was successfully changed.',
        time: '1d ago',
        type: 'lock',
        isRead: true,
    },
    {
        id: '4',
        title: 'Feature Tip',
        message: 'Did you know you can suggest new features directly from the Help Center?',
        time: '2d ago',
        type: 'tip',
        isRead: true,
    }
];

export default function NotificationsScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme as 'light' | 'dark'];
    const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'house': return 'house.fill';
            case 'lock': return 'lock';
            case 'tip': return 'lightbulb.fill';
            default: return 'bell.fill';
        }
    };

    const getIconColor = (type: string) => {
        switch (type) {
            case 'house': return '#10B981';
            case 'lock': return '#EF4444';
            case 'tip': return '#F59E0B';
            default: return '#3B82F6';
        }
    };

    const renderItem = ({ item }: { item: typeof INITIAL_NOTIFICATIONS[0] }) => (
        <View style={[styles.notificationCard, { borderBottomColor: colors.border, backgroundColor: item.isRead ? 'transparent' : (colorScheme === 'light' ? '#F0F9FF50' : '#1E293B50') }]}>
            <View style={[styles.iconContainer, { backgroundColor: `${getIconColor(item.type)}15` }]}>
                <IconSymbol name={getIcon(item.type) as any} size={22} color={getIconColor(item.type)} />
            </View>
            <View style={styles.textContent}>
                <View style={styles.textHeader}>
                    <ThemedText style={[styles.notiTitle, { opacity: item.isRead ? 0.7 : 1 }]}>{item.title}</ThemedText>
                    <ThemedText style={styles.notiTime}>{item.time}</ThemedText>
                </View>
                <ThemedText style={[styles.notiMessage, { opacity: item.isRead ? 0.5 : 0.8 }]}>{item.message}</ThemedText>
            </View>
            {!item.isRead && <View style={styles.unreadDot} />}
        </View>
    );

    return (
        <ThemedView style={styles.container}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <IconSymbol name="chevron.left" size={24} color={colors.text} />
                </Pressable>
                <ThemedText type="subtitle" style={styles.headerTitle}>Notifications</ThemedText>
                <Pressable onPress={markAllAsRead}>
                    <ThemedText style={[styles.markRead, { color: colors.tint }]}>Mark all read</ThemedText>
                </Pressable>
            </View>

            {notifications.length > 0 ? (
                <FlatList
                    data={notifications}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <IconSymbol name="bell.fill" size={64} color={colors.icon} style={{ opacity: 0.2, marginBottom: 16 }} />
                    <ThemedText style={styles.emptyText}>You're all caught up!</ThemedText>
                </View>
            )}
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
    markRead: { fontSize: 14, fontWeight: '600' },
    listContent: { paddingBottom: 40 },
    notificationCard: {
        flexDirection: 'row',
        padding: 20,
        borderBottomWidth: 1,
        alignItems: 'center',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    textContent: { flex: 1 },
    textHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    notiTitle: { fontSize: 16, fontWeight: '700' },
    notiTime: { fontSize: 12, opacity: 0.4 },
    notiMessage: { fontSize: 14, lineHeight: 20 },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#3B82F6',
        marginLeft: 12,
    },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { fontSize: 16, opacity: 0.5, fontWeight: '600' },
});
