import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { INDIAN_LOCATIONS } from '@/constants/locations';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Dimensions, FlatList, Modal, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

const { height } = Dimensions.get('window');

export default function PropertyListScreen() {
    const { category } = useLocalSearchParams();
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme as 'light' | 'dark'];
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [locationModalVisible, setLocationModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [modalSearchQuery, setModalSearchQuery] = useState('');
    const [selectedState, setSelectedState] = useState<any>(null);
    const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);

    const indianStates = INDIAN_LOCATIONS;

    const filteredList = useMemo(() => {
        if (selectedState) {
            const districts = selectedState.districts;
            return districts.filter((d: string) =>
                modalSearchQuery === '' || d.toLowerCase().includes(modalSearchQuery.toLowerCase())
            );
        }
        return indianStates.filter(state =>
            modalSearchQuery === '' ||
            state.name.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
            state.districts.some((d: string) => d.toLowerCase().includes(modalSearchQuery.toLowerCase()))
        );
    }, [modalSearchQuery, selectedState, indianStates]);

    const toggleDistrict = (districtName: string) => {
        setSelectedDistricts(prev =>
            prev.includes(districtName)
                ? prev.filter(d => d !== districtName)
                : [...prev, districtName]
        );
    };

    const handleBackToStates = () => {
        setSelectedState(null);
        setModalSearchQuery('');
    };

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

            {/* Unified Search Filter Modal */}
            <Modal
                visible={filterModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setFilterModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.background, height: height * 0.9 }]}>
                        <View style={styles.modalHeader}>
                            <ThemedText style={styles.modalTitle}>Search Filters</ThemedText>
                            <Pressable onPress={() => setFilterModalVisible(false)} style={styles.closeButton}>
                                <IconSymbol name="plus.circle.fill" size={24} color={colors.text} style={{ transform: [{ rotate: '45deg' }] }} />
                            </Pressable>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                            {/* Location Section */}
                            <View style={styles.filterSection}>
                                <View style={styles.filterSectionHeader}>
                                    <ThemedText style={styles.filterSectionTitle}>Location</ThemedText>
                                    <Pressable onPress={() => {
                                        setFilterModalVisible(false);
                                        setLocationModalVisible(true);
                                    }}>
                                        <ThemedText style={{ color: colors.tint, fontWeight: '700' }}>Change</ThemedText>
                                    </Pressable>
                                </View>
                                <View style={styles.districtGrid}>
                                    {selectedDistricts.length > 0 ? (
                                        selectedDistricts.map((d, i) => (
                                            <View key={i} style={[styles.districtItem, { backgroundColor: colors.tint }]}>
                                                <ThemedText style={[styles.districtText, { color: '#FFF' }]}>{d}</ThemedText>
                                                <Pressable onPress={() => toggleDistrict(d)} style={{ marginLeft: 6 }}>
                                                    <IconSymbol name="xmark.circle.fill" size={14} color="#FFF" />
                                                </Pressable>
                                            </View>
                                        ))
                                    ) : (
                                        <ThemedText style={{ opacity: 0.5, marginLeft: 4 }}>No location selected</ThemedText>
                                    )}
                                </View>
                            </View>

                            {/* Category Section (Read only here) */}
                            <View style={styles.filterSection}>
                                <ThemedText style={styles.filterSectionTitle}>Category</ThemedText>
                                <View style={[styles.districtItem, { backgroundColor: colors.secondary, width: '100%' }]}>
                                    <ThemedText style={styles.districtText}>{category || 'All Properties'}</ThemedText>
                                </View>
                            </View>

                            {/* Reset All */}
                            <Pressable
                                onPress={() => {
                                    setSelectedDistricts([]);
                                }}
                                style={{ marginTop: 20, alignItems: 'center' }}
                            >
                                <ThemedText style={{ color: '#FF3B30', fontWeight: '700' }}>Reset All Filters</ThemedText>
                            </Pressable>
                        </ScrollView>

                        <View style={styles.modalFooter}>
                            <Pressable
                                style={[styles.applyButton, { backgroundColor: colors.tint }]}
                                onPress={() => setFilterModalVisible(false)}
                            >
                                <ThemedText style={styles.applyButtonText}>Apply Filters</ThemedText>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Simplified Location Selector Modal */}
            <Modal
                visible={locationModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setLocationModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.background, height: height * 0.85 }]}>
                        <View style={styles.modalHeader}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {selectedState && (
                                    <Pressable onPress={handleBackToStates} style={{ marginRight: 12 }}>
                                        <IconSymbol name="chevron.left" size={24} color={colors.text} />
                                    </Pressable>
                                )}
                                <ThemedText style={styles.modalTitle}>
                                    {selectedState ? selectedState.name : 'Select State'}
                                </ThemedText>
                            </View>
                            <Pressable onPress={() => {
                                setLocationModalVisible(false);
                                setSelectedState(null);
                                setModalSearchQuery('');
                            }} style={styles.closeButton}>
                                <IconSymbol name="plus.circle.fill" size={24} color={colors.text} style={{ transform: [{ rotate: '45deg' }] }} />
                            </Pressable>
                        </View>

                        <View style={[styles.modalSearch, { backgroundColor: colors.secondary }]}>
                            <IconSymbol name="magnifyingglass" size={18} color={colors.icon} />
                            <TextInput
                                placeholder={selectedState ? "Search district..." : "Search state..."}
                                placeholderTextColor={colors.icon}
                                style={[styles.modalSearchInput, { color: colors.text }]}
                                value={modalSearchQuery}
                                onChangeText={setModalSearchQuery}
                            />
                        </View>

                        <ScrollView
                            style={{ flex: 1 }}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="always"
                        >
                            {selectedState ? (
                                <View style={styles.districtGrid}>
                                    <Pressable
                                        style={[
                                            styles.districtItem,
                                            {
                                                backgroundColor: selectedDistricts.includes(selectedState.name) ? colors.tint : colors.secondary,
                                                width: '98%',
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }
                                        ]}
                                        onPress={() => toggleDistrict(selectedState.name)}
                                    >
                                        <ThemedText style={[styles.districtText, { color: selectedDistricts.includes(selectedState.name) ? '#FFF' : colors.text }]}>
                                            All {selectedState.name}
                                        </ThemedText>
                                        {selectedDistricts.includes(selectedState.name) && (
                                            <IconSymbol name="checkmark.circle.fill" size={18} color="#FFF" />
                                        )}
                                    </Pressable>
                                    {filteredList.map((district: any, dIndex: number) => (
                                        <Pressable
                                            key={dIndex}
                                            style={[
                                                styles.districtItem,
                                                {
                                                    backgroundColor: selectedDistricts.includes(district) ? colors.tint : colors.secondary,
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    paddingRight: selectedDistricts.includes(district) ? 12 : 16
                                                }
                                            ]}
                                            onPress={() => toggleDistrict(district)}
                                        >
                                            <ThemedText style={[styles.districtText, { color: selectedDistricts.includes(district) ? '#FFF' : colors.text }]}>
                                                {district}
                                            </ThemedText>
                                            {selectedDistricts.includes(district) && (
                                                <IconSymbol name="checkmark.circle.fill" size={16} color="#FFF" />
                                            )}
                                        </Pressable>
                                    ))}
                                </View>
                            ) : (
                                filteredList.map((state: any, sIndex: number) => (
                                    <Pressable
                                        key={sIndex}
                                        style={styles.modalOption}
                                        onPress={() => {
                                            setSelectedState(state);
                                            setModalSearchQuery('');
                                        }}
                                    >
                                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <ThemedText style={styles.modalOptionText}>{state.name}</ThemedText>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                {selectedDistricts.filter(d => state.districts.includes(d) || d === state.name).length > 0 && (
                                                    <View style={{ backgroundColor: colors.tint, borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2, marginRight: 8 }}>
                                                        <ThemedText style={{ color: '#FFF', fontSize: 10, fontWeight: '700' }}>
                                                            {selectedDistricts.filter(d => state.districts.includes(d) || d === state.name).length}
                                                        </ThemedText>
                                                    </View>
                                                )}
                                                <IconSymbol name="chevron.right" size={16} color={colors.icon} />
                                            </View>
                                        </View>
                                    </Pressable>
                                ))
                            )}
                        </ScrollView>

                        <View style={styles.modalFooter}>
                            <Pressable
                                style={[styles.applyButton, { backgroundColor: colors.tint }]}
                                onPress={() => setLocationModalVisible(false)}
                            >
                                <ThemedText style={styles.applyButtonText}>
                                    Done {selectedDistricts.length > 0 ? `(${selectedDistricts.length})` : ''}
                                </ThemedText>
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
    filterSectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    districtGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    districtItem: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        marginBottom: 8,
        minWidth: '48%',
        justifyContent: 'center',
    },
    districtText: {
        fontSize: 14,
        fontWeight: '700',
    },
    modalSearch: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 50,
        borderRadius: 12,
        marginBottom: 20,
    },
    modalSearchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
    },
    modalOption: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    modalOptionText: {
        fontSize: 16,
        fontWeight: '500',
    },
});
