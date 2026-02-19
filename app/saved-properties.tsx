import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { auth, db } from '@/config/firebase';
import { Colors } from '@/constants/theme';
import { useTabVisibility } from '@/context/tab-visibility-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Platform, Pressable, StyleSheet, View } from 'react-native';

export default function SavedPropertiesScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme as 'light' | 'dark'];
    const [savedProperties, setSavedProperties] = useState<any[]>([]);
    const { handleScroll } = useTabVisibility();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, 'properties'),
            where('likedBy', 'array-contains', currentUser.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setSavedProperties(data);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching saved properties:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const renderItem = ({ item }: { item: any }) => (
        <Pressable
            style={[styles.card, { backgroundColor: colors.background }]}
            onPress={() => router.push({ pathname: '/properties/[id]', params: { id: item.id } })}
        >
            <View style={styles.cardImageContainer}>
                {item.images && item.images.length > 0 ? (
                    <Image source={{ uri: item.images[0] }} style={styles.cardImage} />
                ) : (
                    <View style={[styles.imagePlaceholder, { backgroundColor: colors.secondary }]}>
                        <IconSymbol name="house.fill" size={30} color={colors.icon} />
                    </View>
                )}
                <View style={styles.priceTag}>
                    <ThemedText style={styles.priceSymbol}>₹</ThemedText>
                    <ThemedText style={styles.priceText}>{item.price}</ThemedText>
                </View>
            </View>
            <View style={styles.cardContent}>
                <ThemedText style={styles.cardTitle} numberOfLines={1}>{item.title}</ThemedText>
                <View style={styles.locationRow}>
                    <IconSymbol name="mappin.circle.fill" size={12} color="#8E8E93" />
                    <ThemedText style={styles.cardLocation} numberOfLines={1}>{item.location}</ThemedText>
                </View>
                <View style={styles.featureRow}>
                    <View style={styles.featureItem}>
                        <IconSymbol name="square.dashed" size={12} color="#8E8E93" />
                        <ThemedText style={styles.featureText}>{item.area || '3 BHK'}</ThemedText>
                    </View>
                </View>
            </View>
        </Pressable>
    );

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconWrapper, { backgroundColor: colors.secondary }]}>
                <IconSymbol name="heart.fill" size={48} color={colors.tint} />
            </View>
            <ThemedText type="subtitle" style={styles.emptyTitle}>Nothing Saved Yet</ThemedText>
            <ThemedText style={styles.emptySubtitle}>Tap the heart icon on any property to save it to your collection.</ThemedText>
            <Pressable
                style={[styles.exploreButton, { backgroundColor: colors.tint }]}
                onPress={() => router.push('/(tabs)')}
            >
                <ThemedText style={styles.exploreButtonText}>Explore Properties</ThemedText>
            </Pressable>
        </View>
    );

    return (
        <ThemedView style={styles.container}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <IconSymbol name="chevron.left" size={24} color={colors.text} />
                </Pressable>
                <ThemedText type="subtitle" style={styles.headerTitle}>Saved Properties</ThemedText>
                <View style={{ width: 40 }} />
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.tint} />
                </View>
            ) : (
                <FlatList
                    data={savedProperties}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    ListEmptyComponent={renderEmpty}
                    contentContainerStyle={styles.listContent}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    showsVerticalScrollIndicator={false}
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
        backgroundColor: '#FFF',
    },
    backButton: { width: 40, height: 40, justifyContent: 'center' },
    headerTitle: { fontSize: 18, fontWeight: '700' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    listContent: { flexGrow: 1, padding: 20, paddingBottom: 40 },
    card: {
        borderRadius: 20,
        marginBottom: 20,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    cardImageContainer: {
        height: 180,
        width: '100%',
        position: 'relative',
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    imagePlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    priceTag: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 2,
    },
    priceSymbol: {
        fontSize: 12,
        fontWeight: '600',
        color: '#000',
    },
    priceText: {
        fontSize: 18,
        fontWeight: '800',
        color: '#000',
    },
    cardContent: {
        padding: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 8,
    },
    cardLocation: {
        fontSize: 13,
        color: '#8E8E93',
    },
    featureRow: {
        flexDirection: 'row',
        gap: 12,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    featureText: {
        fontSize: 12,
        color: '#8E8E93',
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
    exploreButton: {
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 12,
    },
    exploreButtonText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
});
