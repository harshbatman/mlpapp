import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { INDIAN_LOCATIONS } from '@/constants/locations';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import * as ExpoLocation from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Modal, Platform, Pressable, Text as RNText, ScrollView, StyleSheet, TextInput, View } from 'react-native';

const { width, height } = Dimensions.get('window');

// Styles moved to top to avoid initialization issues
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: '#000000',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationInfo: {
    flex: 1,
  },
  locationLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cityText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginRight: 4,
  },
  greetingContainer: {
    marginTop: 20,
  },
  greeting: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 30,
  },
  subGreeting: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 30,
  },
  notificationBell: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#F6F6F6',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 18,
    fontWeight: '500',
  },
  searchLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  scrollContent: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 100,
  },
  section: {
    marginTop: 8,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    flex: 1,
  },
  categoriesScroll: {
    marginHorizontal: -20,
  },
  categoriesContent: {
    paddingHorizontal: 20,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 90,
  },
  categoryIcon: {
    width: 72,
    height: 72,
    borderRadius: 8, // Square with slight rounding
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  cityCard: {
    width: 110,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 12,
    marginRight: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cityIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  cityName: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  specialBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF3B30',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  specialBadgeText: {
    color: '#FFF',
    fontSize: 8,
    fontWeight: '900',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: '#F6F6F6',
    borderRadius: 8,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  postButton: {
    marginTop: 24,
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 4,
  },
  postButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  rewardCard: {
    backgroundColor: '#000000', // Sleek Black Premium look
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  rewardIconContainer: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    overflow: 'hidden',
  },
  rewardTextContainer: {
    flex: 1,
  },
  rewardTag: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  rewardTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  rewardSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
  },
  rewardAction: {
    marginLeft: 8,
    opacity: 0.8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: height * 0.85,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  closeButton: {
    padding: 4,
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
    fontWeight: '500',
  },
  modalList: {
    flex: 1,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    marginBottom: 16,
  },
  modalOptionText: {
    marginLeft: 12,
    fontSize: 16,
  },
  stateGroup: {
    marginBottom: 24,
  },
  stateHeader: {
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    opacity: 0.5,
    marginBottom: 12,
  },
  districtGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  districtItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 4,
  },
  districtText: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalFooter: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  applyButton: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  applyButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  filterSection: {
    marginBottom: 32,
  },
  filterSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  filterSectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },
});



export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme as 'light' | 'dark'];
  const [city, setCity] = useState('Select Location');
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<any>(null);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [mainFilterModalVisible, setMainFilterModalVisible] = useState(false);

  const indianStates = INDIAN_LOCATIONS;

  const popularCities = [
    { name: 'Delhi NCR', icon: 'mappin.circle.fill', color: 'special' },
    { name: 'Mumbai', icon: 'building.2.fill', color: 'standard' },
    { name: 'Bengaluru', icon: 'sparkles', color: 'standard' },
    { name: 'Pune', icon: 'house.fill', color: 'standard' },
    { name: 'Gurugram', icon: 'building.2.fill', color: 'standard' },
    { name: 'Navi Mumbai', icon: 'apartment.fill', color: 'standard' },
    { name: 'Ahmedabad', icon: 'map.fill', color: 'standard' },
    { name: 'Chennai', icon: 'house.fill', color: 'standard' },
    { name: 'Patna', icon: 'mappin.circle.fill', color: 'standard' },
  ];

  const handleLocationRequest = async () => {
    setLoadingLocation(true);
    let { status } = await ExpoLocation.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setLoadingLocation(false);
      Alert.alert('Permission Denied', 'Allow location access to find properties near you.');
      return;
    }

    try {
      let location = await ExpoLocation.getCurrentPositionAsync({
        accuracy: ExpoLocation.Accuracy.Balanced,
      });

      const reverseGeocode = await ExpoLocation.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        const cityName = address.city || address.district || address.region || 'Unknown Location';
        setCity(cityName);
      }
    } catch (error) {
      Alert.alert('Error', 'Could not fetch your location. Please try manually.');
    } finally {
      setLoadingLocation(false);
    }
  };

  const categories = [
    { name: 'Homes', icon: 'house.fill' },
    { name: 'Lands', icon: 'mountain.2.fill' },
    { name: 'Commercial', icon: 'building.2.fill' },
    { name: 'Rentals', icon: 'apartment.fill' },
  ];

  // Optimization: Memoize filtered states or districts based on selection
  const filteredList = React.useMemo(() => {
    if (selectedState) {
      const districts = selectedState.districts;
      return districts.filter((d: string) =>
        searchQuery === '' || d.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return indianStates.filter(state =>
      searchQuery === '' ||
      state.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      state.districts.some((d: string) => d.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, selectedState, indianStates]);

  // Optimization: Memoize filtered categories (if needed for search)
  const filteredCategories = React.useMemo(() => {
    return categories.filter(cat =>
      searchQuery === '' || cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, categories]);

  const toggleCategory = (catName: string) => {
    setSelectedCategories(prev =>
      prev.includes(catName)
        ? prev.filter(c => c !== catName)
        : [...prev, catName]
    );
  };

  const handleApplyCategories = () => {
    setCategoryModalVisible(false);
    setSearchQuery('');
    router.push({
      pathname: '/properties',
      params: {
        category: selectedCategories.join(','),
        multiSelect: 'true'
      }
    });
  };

  const toggleDistrict = (districtName: string) => {
    setSelectedDistricts(prev =>
      prev.includes(districtName)
        ? prev.filter(d => d !== districtName)
        : [...prev, districtName]
    );
  };

  const handleApplySelection = () => {
    if (selectedDistricts.length === 0) {
      setCity('Select Location');
    } else if (selectedDistricts.length === 1) {
      setCity(selectedDistricts[0]);
    } else {
      setCity(`${selectedDistricts.length} locations`);
    }
    setLocationModalVisible(false);
    setSelectedState(null);
    setSearchQuery('');
  };

  const handleBackToStates = () => {
    setSelectedState(null);
    setSearchQuery('');
  };

  return (
    <ThemedView style={styles.container}>
      {/* Optimized Location Selector Modal */}
      <Modal
        visible={locationModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setLocationModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
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
                setSearchQuery('');
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
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <ScrollView
              style={styles.modalList}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="always"
              removeClippedSubviews={Platform.OS === 'android'}
            >
              {!selectedState && (
                <Pressable
                  style={styles.modalOption}
                  onPress={handleLocationRequest}
                >
                  <IconSymbol name="location.fill" size={20} color={colors.tint} />
                  <ThemedText style={[styles.modalOptionText, { color: colors.tint, fontWeight: '700' }]}>Detect My Location</ThemedText>
                </Pressable>
              )}
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
                        <IconSymbol name="checkmark.circle.fill" size={16} color="#FFF" style={{ marginLeft: 4 }} />
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
                      setSearchQuery('');
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
                onPress={handleApplySelection}
              >
                <ThemedText style={styles.applyButtonText}>
                  Apply {selectedDistricts.length > 0 ? `(${selectedDistricts.length})` : ''}
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Optimized Category Selector Modal */}
      <Modal
        visible={categoryModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Select Categories</ThemedText>
              <Pressable onPress={() => {
                setCategoryModalVisible(false);
                setSearchQuery('');
              }} style={styles.closeButton}>
                <IconSymbol name="plus.circle.fill" size={24} color={colors.text} style={{ transform: [{ rotate: '45deg' }] }} />
              </Pressable>
            </View>

            <View style={[styles.modalSearch, { backgroundColor: colors.secondary }]}>
              <IconSymbol name="magnifyingglass" size={18} color={colors.icon} />
              <TextInput
                placeholder="Search categories..."
                placeholderTextColor={colors.icon}
                style={[styles.modalSearchInput, { color: colors.text }]}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <ScrollView
              style={styles.modalList}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="always"
            >
              <View style={styles.districtGrid}>
                {filteredCategories.map((cat, index) => (
                  <Pressable
                    key={index}
                    style={[
                      styles.districtItem,
                      {
                        backgroundColor: selectedCategories.includes(cat.name) ? colors.tint : colors.secondary,
                        width: '48%',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        height: 60,
                        paddingHorizontal: 16
                      }
                    ]}
                    onPress={() => toggleCategory(cat.name)}
                  >
                    <ThemedText style={[styles.districtText, { color: selectedCategories.includes(cat.name) ? '#FFF' : colors.text }]}>
                      {cat.name}
                    </ThemedText>
                    {selectedCategories.includes(cat.name) && (
                      <IconSymbol name="checkmark.circle.fill" size={18} color="#FFF" />
                    )}
                  </Pressable>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <Pressable
                style={[styles.applyButton, { backgroundColor: colors.tint }]}
                onPress={handleApplyCategories}
              >
                <ThemedText style={styles.applyButtonText}>
                  Apply {selectedCategories.length > 0 ? `(${selectedCategories.length})` : ''}
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Unified Search Filter Modal */}
      <Modal
        visible={mainFilterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setMainFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background, height: height * 0.9 }]}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Search Filters</ThemedText>
              <Pressable onPress={() => setMainFilterModalVisible(false)} style={styles.closeButton}>
                <IconSymbol name="plus.circle.fill" size={24} color={colors.text} style={{ transform: [{ rotate: '45deg' }] }} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
              {/* Location Section */}
              <View style={styles.filterSection}>
                <View style={styles.filterSectionHeader}>
                  <ThemedText style={styles.filterSectionTitle}>Location</ThemedText>
                  <Pressable onPress={() => {
                    setMainFilterModalVisible(false);
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

              {/* Category Section */}
              <View style={styles.filterSection}>
                <ThemedText style={styles.filterSectionTitle}>Categories</ThemedText>
                <View style={styles.districtGrid}>
                  {categories.map((cat, i) => (
                    <Pressable
                      key={i}
                      style={[
                        styles.districtItem,
                        { backgroundColor: selectedCategories.includes(cat.name) ? colors.tint : colors.secondary }
                      ]}
                      onPress={() => toggleCategory(cat.name)}
                    >
                      <ThemedText style={[
                        styles.districtText,
                        { color: selectedCategories.includes(cat.name) ? '#FFF' : colors.text }
                      ]}>{cat.name}</ThemedText>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Reset All */}
              <Pressable
                onPress={() => {
                  setSelectedDistricts([]);
                  setSelectedCategories([]);
                  setCity('Select Location');
                }}
                style={{ marginTop: 20, alignItems: 'center' }}
              >
                <ThemedText style={{ color: '#FF3B30', fontWeight: '700' }}>Reset All Filters</ThemedText>
              </Pressable>
            </ScrollView>

            <View style={styles.modalFooter}>
              <Pressable
                style={[styles.applyButton, { backgroundColor: colors.tint }]}
                onPress={() => {
                  handleApplySelection();
                  setMainFilterModalVisible(false);
                }}
              >
                <ThemedText style={styles.applyButtonText}>Apply Filters</ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.header, { backgroundColor: colors.tint }]}>
          <View style={styles.headerTop}>
            <Pressable
              style={styles.locationInfo}
              onPress={() => setLocationModalVisible(true)}
            >
              <ThemedText style={styles.locationLabel}>Current Location</ThemedText>
              <View style={styles.cityRow}>
                <ThemedText style={styles.cityText}>{city}</ThemedText>
                <IconSymbol name="chevron.right" size={16} color="rgba(255,255,255,0.6)" />
              </View>
            </Pressable>
            <Pressable
              style={styles.notificationBell}
              onPress={handleLocationRequest}
              disabled={loadingLocation}
            >
              {loadingLocation ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <IconSymbol name="location.fill" size={24} color="#fff" />
              )}
            </Pressable>
          </View>

          <View style={styles.greetingContainer}>
            <ThemedText style={styles.greeting}>Find your dream</ThemedText>
            <ThemedText style={styles.subGreeting}>Property</ThemedText>
          </View>
        </View>

        <View style={styles.searchRow}>
          <View style={[styles.searchContainer, { backgroundColor: colors.background }]}>
            <IconSymbol name="magnifyingglass" size={20} color={colors.icon} />
            <TextInput
              placeholder="Search properties, land..."
              placeholderTextColor={colors.icon}
              style={[styles.searchInput, { color: colors.text }]}
            />
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.filterButton,
              {
                backgroundColor: colors.tint,
                opacity: pressed ? 0.7 : 1,
                transform: [{ scale: pressed ? 0.96 : 1 }]
              }
            ]}
            onPress={() => setMainFilterModalVisible(true)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <IconSymbol name="slider.horizontal.3" size={24} color="#FFF" />
          </Pressable>
        </View>

        {/* Promo Reward Card */}
        <Pressable
          style={styles.rewardCard}
          onPress={() => router.push('/(tabs)/add')}
        >
          <View style={styles.rewardIconContainer}>
            <RNText style={{
              fontSize: 32,
              lineHeight: 45,
              includeFontPadding: false,
              textAlign: 'center',
              color: '#fff'
            }}>✨</RNText>
          </View>
          <View style={styles.rewardTextContainer}>
            <ThemedText style={styles.rewardTag}>LIMITED OFFER</ThemedText>
            <ThemedText style={styles.rewardTitle}>Post Now - It's Free! 🎊</ThemedText>
            <ThemedText style={styles.rewardSubtitle}>List your property today and reach thousands of buyers instantly.</ThemedText>
          </View>
          <View style={styles.rewardAction}>
            <IconSymbol name="chevron.right" size={20} color="#FFFFFF" />
          </View>
        </Pressable>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle} numberOfLines={1}>
              Categories {selectedCategories.length > 0 ? `(${selectedCategories.length})` : ''}
            </ThemedText>
            <Pressable onPress={() => setCategoryModalVisible(true)}>
              <ThemedText style={{ color: colors.tint, fontWeight: '700', fontSize: 14 }}>
                {selectedCategories.length > 0 ? 'Edit Filter' : 'Filter All'}
              </ThemedText>
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
            contentContainerStyle={styles.categoriesContent}
          >
            {categories.map((cat, index) => (
              <Pressable
                key={index}
                onPress={() => {
                  router.push({
                    pathname: '/properties',
                    params: { category: cat.name }
                  });
                }}
              >
                <View style={[styles.categoryIcon, { backgroundColor: colors.secondary }]}>
                  <IconSymbol
                    name={cat.icon as any}
                    size={32}
                    color={colors.tint}
                  />
                </View>
                <ThemedText style={styles.categoryName}>
                  {cat.name}
                </ThemedText>
              </Pressable>
            ))}
          </ScrollView>
        </View >

        <View style={styles.section} >
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Explore Cities</ThemedText>
            <Pressable onPress={() => setLocationModalVisible(true)}>
              <ThemedText style={{ color: colors.tint, fontWeight: '700', fontSize: 14 }}>All India</ThemedText>
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
            contentContainerStyle={styles.categoriesContent}
          >
            {popularCities.map((cityItem, index) => (
              <Pressable
                key={index}
                style={styles.cityCard}
                onPress={() => {
                  setCity(cityItem.name);
                  router.push({
                    pathname: '/properties',
                    params: { city: cityItem.name }
                  });
                }}
              >
                <View style={[styles.cityIconContainer, { backgroundColor: cityItem.color === 'special' ? colors.tint : colors.secondary }]}>
                  <IconSymbol
                    name={cityItem.icon}
                    size={28}
                    color={cityItem.color === 'special' ? '#FFF' : colors.tint}
                  />
                </View>
                <ThemedText style={styles.cityName}>{cityItem.name}</ThemedText>
                {cityItem.color === 'special' && (
                  <View style={styles.specialBadge}>
                    <ThemedText style={styles.specialBadgeText}>HOT</ThemedText>
                  </View>
                )}
              </Pressable>
            ))}
          </ScrollView>
        </View >

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Featured Listings</ThemedText>
          </View>

          <View style={styles.emptyState}>
            <IconSymbol name="house.fill" size={60} color={colors.icon} />
            <ThemedText style={styles.emptyText}>No listings yet.</ThemedText>
            <ThemedText style={styles.emptySubText}>Be the first one to post a property!</ThemedText>

            <Pressable
              style={[styles.postButton, { backgroundColor: colors.tint }]}
              onPress={() => router.push('/(tabs)/add')}
            >
              <ThemedText style={styles.postButtonText}>Post Now</ThemedText>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}


