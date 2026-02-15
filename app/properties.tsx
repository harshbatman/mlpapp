import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';

export default function PropertyListScreen() {
    const { category } = useLocalSearchParams();
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme as 'light' | 'dark'];

    // Empty array to be populated by users
    const properties: any[] = [];

    return (
        <ThemedView style={styles.container}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <Pressable
                    onPress={() => {
                        if (router.canGoBack()) {
                            router.back();
                        } else {
                            router.replace('/(tabs)');
                        }
                    }}
                    style={styles.backButton}
                >
                    <IconSymbol name="chevron.left" size={28} color={colors.text} />
                </Pressable>
                <ThemedText style={styles.headerTitle}>{category || 'Properties'}</ThemedText>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.searchSection}>
                <View style={styles.searchRow}>
                    <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <IconSymbol name="magnifyingglass" size={20} color={colors.icon} />
                        <TextInput
                            placeholder={`Search ${category || 'properties'}...`}
                            placeholderTextColor={colors.icon}
                            style={[styles.searchInput, { color: colors.text }]}
                        />
                    </View>
                    <Pressable style={[styles.filterButton, { backgroundColor: colors.primary }]}>
                        <IconSymbol name="slider.horizontal.3" size={20} color="#FFF" />
                    </Pressable>
                </View>
            </View>

            <FlatList
                data={properties}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <Pressable style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <View style={styles.imagePlaceholder}>
                            <ThemedText style={{ fontSize: 40 }}>{item.image}</ThemedText>
                        </View>
                        <View style={styles.cardInfo}>
                            <ThemedText style={styles.propertyTitle}>{item.title}</ThemedText>
                            <ThemedText style={styles.propertyLocation}>{item.location}</ThemedText>
                            <View style={styles.priceRow}>
                                <ThemedText style={[styles.propertyPrice, { color: colors.accent }]}>{item.price}</ThemedText>
                                <Pressable style={[styles.viewButton, { backgroundColor: colors.primary }]}>
                                    <ThemedText style={styles.viewButtonText}>View</ThemedText>
                                </Pressable>
                            </View>
                        </View>
                    </Pressable>
                )}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <ThemedText>No properties found in this category.</ThemedText>
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
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    searchSection: {
        padding: 20,
        paddingBottom: 0,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 52,
        borderRadius: 8,
        borderWidth: 1,
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        fontWeight: '500',
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    filterButton: {
        width: 52,
        height: 52,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 20,
        paddingTop: 10,
    },
    card: {
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 20,
        overflow: 'hidden',
    },
    imagePlaceholder: {
        height: 180,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardInfo: {
        padding: 16,
    },
    propertyTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
    },
    propertyLocation: {
        fontSize: 14,
        opacity: 0.6,
        marginBottom: 12,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    propertyPrice: {
        fontSize: 18,
        fontWeight: '800',
    },
    viewButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 4,
    },
    viewButtonText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 14,
    },
    emptyContainer: {
        marginTop: 100,
        alignItems: 'center',
    },
});
