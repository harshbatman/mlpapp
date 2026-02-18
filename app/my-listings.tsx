import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { auth, db } from '@/config/firebase';
import { Colors } from '@/constants/theme';
import { useNotification } from '@/context/notification-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, Image, Platform, Pressable, StyleSheet, View } from 'react-native';

export default function MyListingsScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { showNotification, showConfirm } = useNotification();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme as 'light' | 'dark'];
    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, 'properties'),
            where('ownerId', '==', currentUser.uid),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setListings(data);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching listings:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = (id: string, title: string) => {
        showConfirm({
            title: 'Delete Listing',
            message: `Are you sure you want to delete "${title}"? This action cannot be undone.`,
            icon: 'trash',
            iconColor: '#EF4444',
            primaryActionText: 'Delete',
            secondaryActionText: 'Cancel',
            onPrimaryAction: async () => {
                try {
                    await deleteDoc(doc(db, 'properties', id));
                    showNotification('success', 'Deleted', 'Listing has been removed successfully.');
                } catch (error) {
                    console.error("Error deleting document: ", error);
                    showNotification('error', 'Delete Failed', 'Could not delete the listing. Please try again.');
                }
            }
        });
    };

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconWrapper, { backgroundColor: colors.secondary }]}>
                <IconSymbol name="building.2.fill" size={48} color={colors.tint} />
            </View>
            <ThemedText type="subtitle" style={styles.emptyTitle}>No Listings Yet</ThemedText>
            <ThemedText style={styles.emptySubtitle}>You haven&apos;t posted any properties for sale or rent yet.</ThemedText>
            <Pressable
                style={[styles.addButton, { backgroundColor: colors.tint }]}
                onPress={() => router.push('/(tabs)/add')}
            >
                <ThemedText style={styles.addButtonText}>Add Your First Listing</ThemedText>
            </Pressable>
        </View>
    );

    const renderItem = ({ item }: { item: any }) => (
        <Pressable
            style={[styles.card, { backgroundColor: colors.background }]}
            onPress={() => router.push({ pathname: '/(tabs)/add', params: { editId: item.id } })}
        >
            <View style={styles.imageContainer}>
                {item.images && item.images.length > 0 ? (
                    <Image source={{ uri: item.images[0] }} style={styles.image} />
                ) : (
                    <View style={[styles.imagePlaceholder, { backgroundColor: colors.secondary }]}>
                        <IconSymbol name="house.fill" size={40} color={colors.icon} />
                    </View>
                )}
                <View style={styles.badgeRow}>
                    <View style={[styles.typeBadge, { backgroundColor: '#000000' }]}>
                        <ThemedText style={styles.typeBadgeText}>{t(item.listingType)}</ThemedText>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: 'rgba(255,255,255,0.9)' }]}>
                        <View style={styles.statusDot} />
                        <ThemedText style={styles.statusText}>{t('Active')}</ThemedText>
                    </View>
                </View>

                <View style={styles.floatingPrice}>
                    <ThemedText style={styles.priceSymbol}>₹</ThemedText>
                    <ThemedText style={styles.priceText}>{item.price}</ThemedText>
                </View>
            </View>

            <View style={styles.cardContent}>
                <View style={styles.cardMainInfo}>
                    <ThemedText style={styles.cardTitle} numberOfLines={1}>{item.title}</ThemedText>
                    <View style={styles.locationRow}>
                        <IconSymbol name="mappin.and.ellipse" size={14} color="#8E8E93" />
                        <ThemedText style={styles.cardLocation} numberOfLines={1}>
                            {item.location}
                        </ThemedText>
                    </View>
                </View>

                <View style={styles.cardFooter}>
                    <View style={styles.footerActions}>
                        <Pressable
                            style={[styles.iconActionButton, { backgroundColor: '#F2F2F7' }]}
                            onPress={() => router.push({ pathname: '/(tabs)/add', params: { editId: item.id } })}
                        >
                            <IconSymbol name="pencil" size={18} color="#000" />
                        </Pressable>
                        <Pressable
                            style={[styles.iconActionButton, { backgroundColor: '#FFF5F5' }]}
                            onPress={() => handleDelete(item.id, item.title)}
                        >
                            <IconSymbol name="trash.fill" size={18} color="#FF3B30" />
                        </Pressable>
                    </View>

                    <Pressable
                        style={[styles.viewButton, { backgroundColor: colors.tint }]}
                        onPress={() => router.push({ pathname: '/(tabs)/add', params: { editId: item.id } })}
                    >
                        <ThemedText style={styles.viewButtonText}>{t('Manage')}</ThemedText>
                        <IconSymbol name="arrow.right" size={14} color="#FFF" />
                    </Pressable>
                </View>
            </View>
        </Pressable>
    );

    return (
        <ThemedView style={styles.container}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <IconSymbol name="chevron.left" size={24} color={colors.text} />
                </Pressable>
                <ThemedText type="subtitle" style={styles.headerTitle}>My Listings</ThemedText>
                <View style={{ width: 40 }} />
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.tint} />
                </View>
            ) : (
                <FlatList
                    data={listings}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    ListEmptyComponent={renderEmpty}
                    contentContainerStyle={styles.listContent}
                />
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
    listContent: { padding: 16, paddingBottom: 40 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    card: {
        borderRadius: 24,
        marginBottom: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    imageContainer: {
        height: 200,
        width: '100%',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    imagePlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeRow: {
        position: 'absolute',
        top: 15,
        left: 15,
        right: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    typeBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    typeBadgeText: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 6,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#34C759',
    },
    statusText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#000',
    },
    floatingPrice: {
        position: 'absolute',
        bottom: 15,
        left: 15,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 2,
    },
    priceSymbol: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
    priceText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '800',
    },
    cardContent: {
        padding: 20,
    },
    cardMainInfo: {
        marginBottom: 15,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 6,
        letterSpacing: -0.3,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    cardLocation: {
        fontSize: 13,
        fontWeight: '500',
        color: '#8E8E93',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#F2F2F7',
    },
    footerActions: {
        flexDirection: 'row',
        gap: 10,
    },
    iconActionButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        gap: 6,
    },
    viewButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '700',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        marginTop: 100,
    },
    emptyIconWrapper: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    emptyTitle: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
    emptySubtitle: { fontSize: 15, opacity: 0.5, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
    addButton: {
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 12,
    },
    addButtonText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
});
