import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Platform, Pressable, StyleSheet, View, Image, ActivityIndicator, Alert } from 'react-native';
import { collection, query, where, onSnapshot, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
import { useNotification } from '@/context/notification-context';

export default function MyListingsScreen() {
    const router = useRouter();
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
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.imageContainer}>
                {item.images && item.images.length > 0 ? (
                    <Image source={{ uri: item.images[0] }} style={styles.image} />
                ) : (
                    <View style={[styles.imagePlaceholder, { backgroundColor: colors.secondary }]}>
                        <IconSymbol name="house.fill" size={40} color={colors.icon} />
                    </View>
                )}
                <View style={[styles.typeBadge, { backgroundColor: colors.tint }]}>
                    <ThemedText style={styles.typeBadgeText}>{item.listingType}</ThemedText>
                </View>
            </View>
            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <View style={{ flex: 1 }}>
                        <ThemedText style={styles.cardTitle} numberOfLines={1}>{item.title}</ThemedText>
                        <ThemedText style={styles.cardLocation} numberOfLines={1}>
                            <IconSymbol name="mappin.circle.fill" size={12} color={colors.icon} /> {item.location}
                        </ThemedText>
                    </View>
                    <ThemedText style={[styles.cardPrice, { color: colors.tint }]}>₹{item.price}</ThemedText>
                </View>

                <View style={styles.cardActions}>
                    <Pressable
                        style={[styles.actionButton, { borderColor: colors.border }]}
                        onPress={() => router.push({ pathname: '/(tabs)/add', params: { editId: item.id } })}
                    >
                        <IconSymbol name="pencil" size={16} color={colors.text} />
                        <ThemedText style={styles.actionButtonText}>Edit</ThemedText>
                    </Pressable>
                    <Pressable
                        style={[styles.actionButton, { borderColor: '#FEE2E2' }]}
                        onPress={() => handleDelete(item.id, item.title)}
                    >
                        <IconSymbol name="trash.fill" size={16} color="#EF4444" />
                        <ThemedText style={[styles.actionButtonText, { color: '#EF4444' }]}>Delete</ThemedText>
                    </Pressable>
                </View>
            </View>
        </View>
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
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    imageContainer: {
        height: 160,
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
    typeBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    typeBadgeText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    cardContent: {
        padding: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
    },
    cardLocation: {
        fontSize: 13,
        opacity: 0.6,
    },
    cardPrice: {
        fontSize: 18,
        fontWeight: '800',
    },
    cardActions: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        gap: 8,
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: '600',
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
