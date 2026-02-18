import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { auth, db } from '@/config/firebase';
import { Colors } from '@/constants/theme';
import { useNotification } from '@/context/notification-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
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

                <View style={styles.imageOverlay}>
                    <View style={styles.badgeRow}>
                        <View style={[styles.typeBadge, { backgroundColor: (item.listingType === 'Sell' || item.listingType === 'Sale') ? '#FF3B30' : 'rgba(0,0,0,0.6)' }]}>
                            <ThemedText style={styles.typeBadgeText}>{t(item.listingType)}</ThemedText>
                        </View>
                        <View style={[styles.categoryBadge, { backgroundColor: colors.tint }]}>
                            <ThemedText style={styles.categoryBadgeText}>{t(item.type || 'Property')}</ThemedText>
                        </View>
                    </View>

                    <View style={styles.priceContainer}>
                        <ThemedText style={styles.priceSymbol}>₹</ThemedText>
                        <ThemedText style={styles.priceText}>{item.price}</ThemedText>
                    </View>
                </View>
            </View>

            <View style={styles.cardContent}>
                <View style={styles.mainInfo}>
                    <ThemedText style={styles.cardTitle} numberOfLines={1}>{item.title}</ThemedText>
                    <View style={styles.locationRow}>
                        <IconSymbol name="mappin.circle.fill" size={14} color="#8E8E93" />
                        <ThemedText style={styles.cardLocation} numberOfLines={1}>
                            {item.location}
                        </ThemedText>
                    </View>
                </View>

                {item.area && (
                    <View style={styles.detailsRow}>
                        <View style={styles.detailItem}>
                            <IconSymbol name="square.dashed" size={14} color={colors.icon} />
                            <ThemedText style={styles.detailText}>{item.area}</ThemedText>
                        </View>
                        <View style={styles.statusChip}>
                            <View style={styles.statusDot} />
                            <ThemedText style={styles.statusText}>{t('Active')}</ThemedText>
                        </View>
                    </View>
                )}

                <View style={styles.cardFooter}>
                    <View style={styles.actionButtons}>
                        <Pressable
                            style={[styles.actionButton, styles.editButton]}
                            onPress={() => router.push({ pathname: '/(tabs)/add', params: { editId: item.id } })}
                        >
                            <IconSymbol name="pencil" size={16} color="#000" />
                            <ThemedText style={styles.actionButtonText}>Edit</ThemedText>
                        </Pressable>
                        <Pressable
                            style={[styles.actionButton, styles.deleteButton]}
                            onPress={() => handleDelete(item.id, item.title)}
                        >
                            <IconSymbol name="trash.fill" size={16} color="#FF3B30" />
                        </Pressable>
                    </View>

                    <Pressable
                        style={[styles.manageButton, { backgroundColor: colors.tint }]}
                        onPress={() => router.push({ pathname: '/(tabs)/add', params: { editId: item.id } })}
                    >
                        <ThemedText style={styles.manageButtonText}>Manage</ThemedText>
                        <IconSymbol name="chevron.right" size={14} color="#FFF" />
                    </Pressable>
                </View>
            </View>
        </Pressable>
    );

    return (
        <ThemedView style={styles.container}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <IconSymbol name="chevron.left" size={28} color={colors.text} />
                </Pressable>
                <View>
                    <ThemedText type="subtitle" style={styles.headerTitle}>My Listings</ThemedText>
                    <ThemedText style={styles.headerSubtitle}>{listings.length} properties active</ThemedText>
                </View>
                <Pressable
                    onPress={() => router.push('/(tabs)/add')}
                    style={[styles.headerAddBtn, { backgroundColor: colors.tint }]}
                >
                    <IconSymbol name="plus" size={20} color={colorScheme === 'dark' ? '#000' : '#fff'} />
                </Pressable>
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
                    showsVerticalScrollIndicator={false}
                />
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'ios' ? 60 : 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
    },
    backButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '800',
        letterSpacing: -0.5,
        textAlign: 'center',
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#8E8E93',
        fontWeight: '500',
        textAlign: 'center',
        marginTop: -2,
    },
    headerAddBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 20,
        paddingBottom: 100
    },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    card: {
        borderRadius: 28,
        marginBottom: 24,
        overflow: 'hidden',
        backgroundColor: '#FFF',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.12,
                shadowRadius: 16,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    imageContainer: {
        height: 240,
        width: '100%',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.1)',
        justifyContent: 'space-between',
        padding: 16,
    },
    imagePlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    typeBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    typeBadgeText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    categoryBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    categoryBadgeText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '700',
    },
    priceContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        alignSelf: 'flex-start',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 2,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    priceSymbol: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
    },
    priceText: {
        color: '#000',
        fontSize: 22,
        fontWeight: '900',
        letterSpacing: -0.5,
    },
    cardContent: {
        padding: 20,
    },
    mainInfo: {
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 4,
        letterSpacing: -0.5,
        color: '#1C1C1E',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    cardLocation: {
        fontSize: 14,
        fontWeight: '500',
        color: '#8E8E93',
    },
    detailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F2F2F7',
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#F2F2F7',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    detailText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1C1C1E',
    },
    statusChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#4CAF50',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#2E7D32',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 6,
        paddingHorizontal: 12,
    },
    editButton: {
        backgroundColor: '#F2F2F7',
        paddingHorizontal: 16,
    },
    deleteButton: {
        backgroundColor: '#FFF5F5',
        width: 44,
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#000',
    },
    manageButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 44,
        borderRadius: 14,
        gap: 8,
    },
    manageButtonText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '700',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        marginTop: 80,
    },
    emptyIconWrapper: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
        backgroundColor: '#F2F2F7',
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: '800',
        marginBottom: 12,
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    emptySubtitle: {
        fontSize: 16,
        color: '#8E8E93',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 40,
        fontWeight: '500',
    },
    addButton: {
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 18,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.15,
                shadowRadius: 10,
            },
            android: {
                elevation: 6,
            },
        }),
    },
    addButtonText: {
        color: '#FFF',
        fontWeight: '800',
        fontSize: 17,
        letterSpacing: -0.2,
    },
});
