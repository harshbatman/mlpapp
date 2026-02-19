import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { auth, db } from '@/config/firebase';
import { INDIAN_LOCATIONS } from '@/constants/locations';
import { Colors } from '@/constants/theme';
import { useChat } from '@/context/chat-context';
import { useNotification } from '@/context/notification-context';
import { useProfile } from '@/context/profile-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, FlatList, Image, Modal, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');

export default function PropertyListScreen() {
    const { category } = useLocalSearchParams();
    const { t } = useTranslation();
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme as 'light' | 'dark'];
    const { startConversation } = useChat();
    const { profile } = useProfile();
    const { showNotification } = useNotification();
    const insets = useSafeAreaInsets();

    const [properties, setProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [locationModalVisible, setLocationModalVisible] = useState(false);
    const [modalSearchQuery, setModalSearchQuery] = useState('');
    const [selectedState, setSelectedState] = useState<any>(null);
    const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);

    useEffect(() => {
        let q = query(collection(db, 'properties'), orderBy('createdAt', 'desc'));

        if (category && category !== 'All Properties') {
            q = query(collection(db, 'properties'), where('category', '==', category), orderBy('createdAt', 'desc'));
        }

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProperties(data);
            setLoading(false);
        }, (err) => {
            console.error("Error fetching properties:", err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [category]);

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

    const handleContact = async (ownerId: string, propertyId: string, propertyTitle: string) => {
        if (!profile.isLoggedIn) {
            router.push('/(auth)/login');
            return;
        }

        const currentUid = auth.currentUser?.uid;
        // Prevent chatting with self
        if (currentUid && ownerId === currentUid) {
            showNotification('info', 'My Property', "This is your own property!");
            return;
        }

        try {
            const conversationId = await startConversation(ownerId, propertyId, propertyTitle);
            router.push(`/chat/${conversationId}`);
        } catch (error) {
            console.error("Error starting chat", error);
        }
    };

    const filteredProperties = properties.filter(p => !category || p.category === category || category === 'All Properties');

    return (
        <ThemedView style={styles.container}>
            <View style={[styles.header, { backgroundColor: colors.tint, paddingTop: insets.top + 12 }]}>
                <View style={styles.headerTop}>
                    <Pressable
                        onPress={() => router.back()}
                        style={styles.backButton}
                    >
                        <IconSymbol name="chevron.left" size={24} color="#FFF" />
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
                data={filteredProperties}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <Pressable
                        style={[styles.card, { backgroundColor: colors.background }]}
                        onPress={() => router.push({ pathname: '/properties/[id]', params: { id: item.id } })}
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
                                        <ThemedText style={styles.typeBadgeText}>{t(item.listingType || 'Sale')}</ThemedText>
                                    </View>
                                    <Pressable style={styles.favoriteButton}>
                                        <IconSymbol name="heart" size={18} color="#FFF" />
                                    </Pressable>
                                </View>

                                <View style={styles.priceContainer}>
                                    <ThemedText style={styles.priceSymbol}>₹</ThemedText>
                                    <ThemedText style={styles.priceText}>{item.price}</ThemedText>
                                </View>
                            </View>
                        </View>

                        <View style={styles.cardContent}>
                            <View style={styles.cardInfo}>
                                <ThemedText style={styles.propertyTitle} numberOfLines={1}>{item.title}</ThemedText>
                                <View style={styles.locationRow}>
                                    <IconSymbol name="mappin.circle.fill" size={14} color="#8E8E93" />
                                    <ThemedText style={styles.propertyLocation} numberOfLines={1}>
                                        {item.location}
                                    </ThemedText>
                                </View>
                            </View>

                            <View style={styles.cardFooter}>
                                <View style={styles.featuresRow}>
                                    {item.area ? (
                                        <View style={styles.featureItem}>
                                            <IconSymbol name="square.dashed" size={14} color="#8E8E93" />
                                            <ThemedText style={styles.featureText}>{item.area}</ThemedText>
                                        </View>
                                    ) : (
                                        <View style={styles.featureItem}>
                                            <IconSymbol name="bed.double.fill" size={14} color="#8E8E93" />
                                            <ThemedText style={styles.featureText}>3</ThemedText>
                                        </View>
                                    )}
                                    <View style={styles.featureItem}>
                                        <IconSymbol name="shower.fill" size={14} color="#8E8E93" />
                                        <ThemedText style={styles.featureText}>2</ThemedText>
                                    </View>
                                </View>

                                <View style={styles.footerActions}>
                                    <Pressable
                                        style={[styles.smallActionButton, { backgroundColor: '#F2F2F7' }]}
                                        onPress={() => handleContact(item.ownerId, item.id, item.title)}
                                    >
                                        <IconSymbol name="message.fill" size={16} color="#000" />
                                    </Pressable>
                                    <Pressable
                                        style={[styles.detailsButton, { backgroundColor: colors.tint }]}
                                        onPress={() => router.push({ pathname: '/properties/[id]', params: { id: item.id } })}
                                    >
                                        <ThemedText style={styles.detailsButtonText}>{t('Details')}</ThemedText>
                                        <IconSymbol name="chevron.right" size={12} color="#FFF" />
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </Pressable>
                )}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyIconWrapper}>
                            <IconSymbol name="house.fill" size={48} color={colors.icon} style={{ opacity: 0.2 }} />
                        </View>
                        <ThemedText style={styles.emptyTitle}>No properties found</ThemedText>
                        <ThemedText style={styles.emptySubtitle}>Try adjusting your filters or category</ThemedText>
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
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
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
        borderRadius: 16, // Use colors from theme
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
        borderRadius: 20,
        marginBottom: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
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
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.1)',
        justifyContent: 'space-between',
        padding: 12,
    },
    badgeRow: {
        position: 'absolute',
        top: 12,
        left: 12,
        right: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    typeBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    typeBadgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    favoriteButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    floatingPrice: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        backgroundColor: '#000',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 2,
    },
    priceContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 2,
        position: 'absolute',
        bottom: 12,
        left: 12,
    },
    priceSymbol: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '600',
    },
    priceText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '800',
    },
    cardContent: {
        padding: 16,
    },
    cardInfo: {
        marginBottom: 12,
    },
    propertyTitle: {
        fontSize: 16,
        fontWeight: '800',
        marginBottom: 4,
        letterSpacing: -0.3,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    propertyLocation: {
        fontSize: 12,
        fontWeight: '500',
        color: '#8E8E93',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F2F2F7',
    },
    featuresRow: {
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
        fontWeight: '600',
        color: '#8E8E93',
    },
    footerActions: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
    },
    smallActionButton: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailsButton: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
    },
    detailsButtonText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 13,
    },
    emptyContainer: {
        marginTop: 100,
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyIconWrapper: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#F2F2F7',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#8E8E93',
        textAlign: 'center',
        fontWeight: '500',
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
