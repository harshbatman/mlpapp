import React from 'react';
import { FlatList, Image, Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { formatDistanceToNow } from 'date-fns';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useChat, Conversation } from '@/context/chat-context';

export default function MessagesScreen() {
    const router = useRouter();
    const { conversations, loading } = useChat();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme as 'light' | 'dark'];

    const handlePress = (conversationId: string) => {
        router.push(`/chat/${conversationId}`);
    };

    const renderItem = ({ item }: { item: Conversation }) => (
        <Pressable
            style={({ pressed }) => [
                styles.itemContainer,
                { backgroundColor: pressed ? colors.border : colors.background }
            ]}
            onPress={() => handlePress(item.id)}
        >
            <View style={styles.avatarContainer}>
                {item.otherUser?.avatar ? (
                    <Image source={{ uri: item.otherUser.avatar }} style={styles.avatar} />
                ) : (
                    <View style={[styles.avatarPlaceholder, { backgroundColor: colors.secondary }]}>
                        <IconSymbol name="person.fill" size={24} color={colors.icon} />
                    </View>
                )}
            </View>

            <View style={styles.contentContainer}>
                <View style={styles.headerRow}>
                    <ThemedText style={styles.name} numberOfLines={1}>
                        {item.otherUser?.name || 'User'}
                    </ThemedText>
                    {item.lastMessageTimestamp && (
                        <ThemedText style={styles.date}>
                            {formatDistanceToNow(item.lastMessageTimestamp?.toDate ? item.lastMessageTimestamp.toDate() : new Date(), { addSuffix: true })}
                        </ThemedText>
                    )}
                </View>

                {item.propertyTitle && (
                    <ThemedText style={styles.propertyRef} numberOfLines={1}>
                        Listing: {item.propertyTitle}
                    </ThemedText>
                )}

                <View style={styles.messageRow}>
                    <ThemedText style={[styles.message, { color: colors.icon }]} numberOfLines={2}>
                        {item.lastMessage || 'Start a conversation'}
                    </ThemedText>
                    {item.unreadCount > 0 && (
                        <View style={[styles.badge, { backgroundColor: colors.tint }]}>
                            <ThemedText style={styles.badgeText}>{item.unreadCount}</ThemedText>
                        </View>
                    )}
                </View>
            </View>

            <IconSymbol name="chevron.right" size={16} color={colors.icon} style={{ opacity: 0.5 }} />
        </Pressable>
    );

    return (
        <ThemedView style={styles.container}>
            <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <IconSymbol name="chevron.left" size={24} color={colors.text} />
                </Pressable>
                <ThemedText type="subtitle" style={styles.headerTitle}>Messages</ThemedText>
                <View style={{ width: 40 }} />
            </View>

            <FlatList
                data={conversations}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <IconSymbol name="bubble.left.and.bubble.right" size={64} color={colors.icon} style={{ opacity: 0.2, marginBottom: 16 }} />
                        <ThemedText style={{ opacity: 0.6, textAlign: 'center' }}>No messages yet.</ThemedText>
                        <ThemedText style={{ opacity: 0.4, textAlign: 'center', fontSize: 13, marginTop: 8 }}>
                            Contact an agent or property owner to start chatting.
                        </ThemedText>
                    </View>
                }
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    list: {
        paddingVertical: 10,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#eee',
    },
    avatarContainer: {
        marginRight: 16,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
    },
    avatarPlaceholder: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        flex: 1,
        marginRight: 8,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 4,
    },
    name: {
        fontSize: 16,
        fontWeight: '700',
        flex: 1,
        marginRight: 8,
    },
    date: {
        fontSize: 12,
        opacity: 0.5,
    },
    propertyRef: {
        fontSize: 12,
        color: '#276EF1',
        fontWeight: '600',
        marginBottom: 2,
    },
    messageRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    message: {
        fontSize: 14,
        flex: 1,
        marginRight: 8,
        lineHeight: 20,
    },
    badge: {
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
    },
    badgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '700',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
        paddingHorizontal: 40,
    },
});
