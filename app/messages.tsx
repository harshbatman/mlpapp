import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { Conversation, useChat } from '@/context/chat-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function MessagesScreen() {
    const router = useRouter();
    const { conversations, loading } = useChat();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme as 'light' | 'dark'];
    const [searchQuery, setSearchQuery] = useState('');

    const filteredConversations = useMemo(() => {
        if (!searchQuery.trim()) return conversations;
        return conversations.filter(conv =>
            conv.otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            conv.propertyTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            conv.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [conversations, searchQuery]);

    const handlePress = (conversationId: string) => {
        router.push(`/chat/${conversationId}`);
    };

    const renderItem = ({ item }: { item: Conversation }) => (
        <Pressable
            style={({ pressed }) => [
                styles.itemCard,
                { backgroundColor: colors.background, borderColor: colors.border },
                pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }
            ]}
            onPress={() => handlePress(item.id)}
        >
            <View style={styles.cardHeader}>
                <View style={styles.avatarWrapper}>
                    {item.otherUser?.avatar ? (
                        <Image source={{ uri: item.otherUser.avatar }} style={styles.avatar} />
                    ) : (
                        <View style={[styles.avatarPlaceholder, { backgroundColor: colors.secondary }]}>
                            <IconSymbol name="person.fill" size={28} color={colors.icon} />
                        </View>
                    )}
                    <View style={styles.activeStatus} />
                </View>

                <View style={styles.contentContainer}>
                    <View style={styles.nameRow}>
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
                        <View style={styles.propertyBadge}>
                            <IconSymbol name="house.fill" size={10} color={colors.accent} />
                            <ThemedText style={styles.propertyRef} numberOfLines={1}>
                                {item.propertyTitle}
                            </ThemedText>
                        </View>
                    )}

                    <View style={styles.messageRow}>
                        <ThemedText style={[styles.message, { color: item.unreadCount > 0 ? colors.text : colors.icon }]} numberOfLines={1}>
                            {item.lastMessage || 'Start a conversation'}
                        </ThemedText>
                        {item.unreadCount > 0 && (
                            <View style={[styles.badge, { backgroundColor: colors.tint }]}>
                                <ThemedText style={styles.badgeText}>{item.unreadCount}</ThemedText>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </Pressable>
    );

    return (
        <ThemedView style={styles.container}>
            <View style={styles.topSection}>
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={[styles.iconButton, { backgroundColor: colors.secondary }]}>
                        <IconSymbol name="chevron.left" size={22} color={colors.text} />
                    </Pressable>
                    <ThemedText style={styles.headerTitle}>Messages</ThemedText>
                    <Pressable style={[styles.iconButton, { backgroundColor: colors.secondary }]}>
                        <IconSymbol name="slider.horizontal.3" size={20} color={colors.text} />
                    </Pressable>
                </View>

                <View style={[styles.searchWrapper, { backgroundColor: colors.secondary }]}>
                    <IconSymbol name="magnifyingglass" size={18} color={colors.icon} />
                    <TextInput
                        placeholder="Search chats..."
                        placeholderTextColor="#8E8E93"
                        style={[styles.searchInput, { color: colors.text }]}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator color={colors.tint} size="large" />
                </View>
            ) : (
                <FlatList
                    data={filteredConversations}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <View style={styles.emptyIconCircle}>
                                <IconSymbol name="bubble.left.and.bubble.right" size={40} color={colors.icon} />
                            </View>
                            <ThemedText style={styles.emptyTitle}>No conversations</ThemedText>
                            <ThemedText style={styles.emptySubtitle}>
                                {searchQuery ? 'Try a different search term' : 'Contact an owner to start a conversation'}
                            </ThemedText>
                        </View>
                    }
                />
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topSection: {
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingHorizontal: 20,
        paddingBottom: 15,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '900',
        letterSpacing: -0.5,
    },
    searchWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 54,
        borderRadius: 16,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        fontWeight: '600',
    },
    list: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    itemCard: {
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarWrapper: {
        position: 'relative',
        marginRight: 16,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 20,
    },
    avatarPlaceholder: {
        width: 64,
        height: 64,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeStatus: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#4CAF50',
        borderWidth: 3,
        borderColor: '#FFF',
    },
    contentContainer: {
        flex: 1,
    },
    nameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    name: {
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: -0.3,
    },
    date: {
        fontSize: 12,
        opacity: 0.5,
        fontWeight: '600',
    },
    propertyBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(39, 110, 241, 0.1)',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        marginBottom: 6,
        gap: 4,
    },
    propertyRef: {
        fontSize: 11,
        color: '#276EF1',
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    messageRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    message: {
        fontSize: 14,
        flex: 1,
        fontWeight: '500',
    },
    badge: {
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
        marginLeft: 8,
    },
    badgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '900',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 80,
    },
    emptyIconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(0,0,0,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#8E8E93',
        textAlign: 'center',
        paddingHorizontal: 60,
        lineHeight: 20,
    },
});

