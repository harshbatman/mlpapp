import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Platform, Pressable, StyleSheet, View } from 'react-native';

const MOCK_LISTINGS = [
    // You can add sample data here later
];

export default function MyListingsScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme as 'light' | 'dark'];

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconWrapper, { backgroundColor: colors.secondary }]}>
                <IconSymbol name="building.2.fill" size={48} color={colors.tint} />
            </View>
            <ThemedText type="subtitle" style={styles.emptyTitle}>No Listings Yet</ThemedText>
            <ThemedText style={styles.emptySubtitle}>You haven't posted any properties for sale or rent yet.</ThemedText>
            <Pressable
                style={[styles.addButton, { backgroundColor: colors.tint }]}
                onPress={() => router.push('/(tabs)/add')}
            >
                <ThemedText style={styles.addButtonText}>Add Your First Listing</ThemedText>
            </Pressable>
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

            <FlatList
                data={MOCK_LISTINGS}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        {/* Listing Item UI */}
                    </View>
                )}
                ListEmptyComponent={renderEmpty}
                contentContainerStyle={styles.listContent}
            />
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
    listContent: { flexGrow: 1, paddingBottom: 40 },
    card: { padding: 20 },
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
        elevation: 2,
    },
    addButtonText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
});
