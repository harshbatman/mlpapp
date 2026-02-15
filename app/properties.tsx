import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, FlatList, Modal, Pressable, StyleSheet, TextInput, View } from 'react-native';

const { height } = Dimensions.get('window');

export default function PropertyListScreen() {
    const { category } = useLocalSearchParams();
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme as 'light' | 'dark'];
    const [filterModalVisible, setFilterModalVisible] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');

    // Empty array to be populated by users
    const properties: any[] = [];

    return (
        <ThemedView style={styles.container}>
            <View style={[styles.header, { backgroundColor: colors.tint }]}>
                <View style={styles.headerTop}>
                    <Pressable
                        onPress={() => router.back()}
                        style={styles.backButton}
                    >
                        <IconSymbol name="chevron.left" size={28} color="#FFF" />
                    </Pressable>
                    <ThemedText style={styles.headerTitle}>{category || 'All Properties'}</ThemedText>
                    <View style={{ width: 40 }} />
                </View>
            </View>

            <View style={styles.searchSection}>
                <View style={styles.searchRow}>
                    <View style={[styles.searchContainer, { backgroundColor: colors.background }]}>
                        <IconSymbol name="magnifyingglass" size={20} color={colors.icon} />
                        <TextInput
                            placeholder={`Search in ${category || 'all category'}...`}
                            placeholderTextColor={colors.icon}
                            style={[styles.searchInput, { color: colors.text }]}
                        />
                    </View>
                    <Pressable
                        style={[styles.filterButton, { backgroundColor: colors.tint }]}
                        onPress={() => setFilterModalVisible(true)}
                    >
                        <IconSymbol name="slider.horizontal.3" size={22} color="#FFF" />
                    </Pressable>
                </View>
            </View>

            <FlatList
                data={properties}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
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

            {/* Simple Filter Modal for Properties Page */}
            <Modal
                visible={filterModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setFilterModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
                        <View style={styles.modalHeader}>
                            <ThemedText style={styles.modalTitle}>Sort & Filter</ThemedText>
                            <Pressable onPress={() => setFilterModalVisible(false)} style={styles.closeButton}>
                                <IconSymbol name="plus.circle.fill" size={24} color={colors.text} style={{ transform: [{ rotate: '45deg' }] }} />
                            </Pressable>
                        </View>

                        <View style={styles.filterSection}>
                            <ThemedText style={styles.filterSectionTitle}>Current Category: {category || 'All'}</ThemedText>
                            <ThemedText style={{ opacity: 0.6, marginTop: 4 }}>
                                You are currently viewing {category || 'all properties'}.
                            </ThemedText>
                        </View>

                        <ThemedText style={{ padding: 20, textAlign: 'center', opacity: 0.5 }}>
                            Advanced filtering (Price Range, BHK, Area) will be available in the next update.
                        </ThemedText>

                        <View style={styles.modalFooter}>
                            <Pressable
                                style={[styles.applyButton, { backgroundColor: colors.tint }]}
                                onPress={() => setFilterModalVisible(false)}
                            >
                                <ThemedText style={styles.applyButtonText}>Close</ThemedText>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 60,
        paddingBottom: 24,
        paddingHorizontal: 20,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
        color: '#FFF',
    },
    searchSection: {
        paddingHorizontal: 20,
        marginTop: -32, // Offset to pull search box into header area if desired, or just space out
        zIndex: 10,
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        height: 64,
        borderRadius: 16,
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 18,
        fontWeight: '500',
    },
    filterButton: {
        width: 64,
        height: 64,
        borderRadius: 16,
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        height: height * 0.5,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '800',
    },
    closeButton: {
        padding: 4,
    },
    filterSection: {
        marginBottom: 32,
    },
    filterSectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 12,
    },
    modalFooter: {
        marginTop: 'auto',
        paddingTop: 16,
    },
    applyButton: {
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    applyButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
    },
});
