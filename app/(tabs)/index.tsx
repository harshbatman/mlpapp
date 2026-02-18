import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { INDIAN_LOCATIONS } from '@/constants/locations';
import { Colors } from '@/constants/theme';
import { useNotification } from '@/context/notification-context';
import { useProfile } from '@/context/profile-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import * as ExpoLocation from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Dimensions, Image, Modal, Platform, Pressable, Text as RNText, ScrollView, StyleSheet, TextInput, View } from 'react-native';

const { width, height } = Dimensions.get('window');

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
    fontSize: 16,
    fontWeight: '700',
    marginRight: 4,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  topHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  profileIconPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileTextContainer: {
    marginLeft: 12,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  profileGreeting: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginRight: 4,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
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
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumSearchCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 20, // Increased to provide space from header
    marginBottom: 20, // Added to prevent overlap with reward banner
    padding: 16,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    zIndex: 100,
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    height: 56,
    borderRadius: 20,
    paddingHorizontal: 16,
  },
  premiumSearchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  locationPinButton: {
    width: 56,
    height: 56,
    backgroundColor: '#000000', // Fill color black
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterToggles: {
    flexDirection: 'row',
    gap: 10,
  },
  toggleButton: {
    flex: 1,
    height: 50,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F2F2F7',
  },
  activeToggleButton: {
    backgroundColor: '#000000', // Active background black
    borderColor: '#000000',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8E8E93',
  },
  activeToggleText: {
    color: '#FFFFFF',
  },
  filterButton: {
    display: 'none', // Hide the old filter button
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
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
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
    marginTop: 10, // Added small top margin for air
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
  freeBadge: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  freeText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    textTransform: 'uppercase',
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
  const { t } = useTranslation();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme as 'light' | 'dark'];
  const [city, setCity] = useState(t('Select Location'));
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<any>(null);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [mainFilterModalVisible, setMainFilterModalVisible] = useState(false);
  const { showNotification, showProfessionalError, showConfirm } = useNotification();
  const { profile } = useProfile();
  const [activeType, setActiveType] = useState('Buy');

  const indianStates = INDIAN_LOCATIONS;

  const popularCities = [
    { name: 'Delhi NCR', image: require('@/assets/images/cities/delhi.png'), color: 'special' },
    { name: 'Hyderabad', image: require('@/assets/images/cities/hyderabad.png'), color: 'standard' },
    { name: 'Mumbai', image: require('@/assets/images/cities/mumbai.png'), color: 'standard' },
    { name: 'Bengaluru', image: require('@/assets/images/cities/bengaluru.png'), color: 'standard' },
    { name: 'Pune', image: require('@/assets/images/cities/pune.png'), color: 'standard' },
    { name: 'Gurugram', image: require('@/assets/images/cities/gurugram.png'), color: 'standard' },
    { name: 'Navi Mumbai', image: require('@/assets/images/cities/navimumbai.png'), color: 'standard' },
    { name: 'Ahmedabad', image: require('@/assets/images/cities/ahmedabad.png'), color: 'standard' },
    { name: 'Chennai', image: require('@/assets/images/cities/chennai.png'), color: 'standard' },
    { name: 'Patna', image: require('@/assets/images/cities/patna.png'), color: 'standard' },
    { name: 'Indore', image: require('@/assets/images/cities/indore.png'), color: 'standard' },
    { name: 'Lucknow', image: require('@/assets/images/cities/lucknow.png'), color: 'standard' },
    { name: 'Begusarai', image: require('@/assets/images/cities/begusarai.png'), color: 'standard' },
    { name: 'Rohtak', image: require('@/assets/images/cities/rohtak.png'), color: 'standard' },
    { name: 'Jaipur', image: require('@/assets/images/cities/jaipur.png'), color: 'standard' },
    { name: 'Guwahati', image: require('@/assets/images/cities/guwahati.png'), color: 'standard' },
    { name: 'Kolkata', image: require('@/assets/images/cities/kolkata.png'), color: 'standard' },
    { name: 'Noida', image: require('@/assets/images/cities/noida.png'), color: 'standard' },
    { name: 'Chandigarh', image: require('@/assets/images/cities/chandigarh.png'), color: 'standard' },
    { name: 'Varanasi', image: require('@/assets/images/cities/varanasi.png'), color: 'standard' },
    { name: 'Kochi', image: require('@/assets/images/cities/kochi.png'), color: 'standard' },
    { name: 'Srinagar', image: require('@/assets/images/cities/srinagar.png'), color: 'standard' },
    { name: 'Shimla', image: require('@/assets/images/cities/shimla.png'), color: 'standard' },
    { name: 'Dehradun', image: require('@/assets/images/cities/dehradun.png'), color: 'standard' },
    { name: 'Shillong', image: require('@/assets/images/cities/shillong.png'), color: 'standard' },
    { name: 'Gangtok', image: require('@/assets/images/cities/gangtok.png'), color: 'standard' },
    { name: 'Bhubaneswar', image: require('@/assets/images/cities/bhubaneswar.png'), color: 'standard' },
  ];

  const handleLocationRequest = async () => {
    showConfirm({
      title: t('Location Access'),
      message: t('Allow MAHTO to access your location to find the best properties and services near you.'),
      icon: 'location',
      iconColor: colors.tint,
      primaryActionText: t('Allow Access'),
      secondaryActionText: t('Maybe Later'),
      onPrimaryAction: async () => {
        setLoadingLocation(true);
        try {
          // 1. Check if location services are enabled
          const servicesEnabled = await ExpoLocation.hasServicesEnabledAsync();
          if (!servicesEnabled) {
            showProfessionalError({ code: 'location-services-disabled', message: t('Please enable location services on your device.') });
            setLoadingLocation(false);
            return;
          }

          let { status } = await ExpoLocation.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            showProfessionalError({ code: 'location-denied', message: t('Location permission is required to find properties near you.') });
            return;
          }

          // Try to get the last known position first (faster)
          let location = await ExpoLocation.getLastKnownPositionAsync({});

          // If no last known position or if user wants fresh data, try current position with timeout
          if (!location) {
            try {
              // Create a promise that rejects after 5 seconds to prevent indefinite hanging
              const timeoutPromise = new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error('LOCATION_TIMEOUT')), 5000)
              );

              // Use Low accuracy for faster results (sufficient for City/Region level)
              const locationPromise = ExpoLocation.getCurrentPositionAsync({
                accuracy: ExpoLocation.Accuracy.Low,
              });

              location = await Promise.race([locationPromise, timeoutPromise]) as ExpoLocation.LocationObject;
            } catch (err: any) {
              if (err.message === 'LOCATION_TIMEOUT') {
                // If it timed out, try one last time with Lowest accuracy before giving up
                console.log("Location timed out, trying lowest accuracy...");
                location = await ExpoLocation.getCurrentPositionAsync({
                  accuracy: ExpoLocation.Accuracy.Lowest,
                });
              } else {
                throw err;
              }
            }
          }

          if (location) {
            const reverseGeocode = await ExpoLocation.reverseGeocodeAsync({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            });

            if (reverseGeocode.length > 0) {
              const address = reverseGeocode[0];
              // Prioritize city, then district, then region, then subregion
              const cityName = address.city || address.district || address.region || address.subregion || t('Unknown Location');
              setCity(cityName);
              showNotification('success', t('Location Updated'), `${t('Found you in')} ${cityName}`);
            } else {
              showNotification('warning', t('Location Found'), t('Could not determine city name from coordinates.'));
            }
          } else {
            throw new Error("Could not fetch location");
          }

        } catch (error: any) {
          console.log("Location error:", error);
          // Fallback if specific error known
          if (error.code === 'E_LOCATION_TIMEOUT' || error.message === 'LOCATION_TIMEOUT') {
            showNotification('warning', t('Location Timeout'), t('Taking too long to find you. Please select location manually.'));
            // Open manual selector as fallback
            setLocationModalVisible(true);
          } else {
            showProfessionalError(error, t('Location Error'));
          }
        } finally {
          setLoadingLocation(false);
        }
      }
    });
  };

  const categories = [
    { name: t('Homes'), image: require('@/assets/images/categories/home.png') },
    { name: t('Lands'), image: require('@/assets/images/categories/lands.png') },
    { name: t('Commercial'), image: require('@/assets/images/categories/commercial.png') },
    { name: t('Rentals'), image: require('@/assets/images/categories/rentals.png') },
  ];

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

  const toggleDistrict = (districtName: string) => {
    setSelectedDistricts(prev =>
      prev.includes(districtName)
        ? prev.filter(d => d !== districtName)
        : [...prev, districtName]
    );
  };

  const handleApplySelection = () => {
    let newCity = 'Select Location';
    if (selectedDistricts.length === 0) {
      newCity = 'Select Location';
    } else if (selectedDistricts.length === 1) {
      newCity = selectedDistricts[0];
    } else {
      newCity = `${selectedDistricts.length} locations`;
    }

    setCity(newCity);
    if (newCity !== 'Select Location') {
      showNotification('success', 'Location Updated', `Now showing properties in ${newCity}`);
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

              <Pressable
                onPress={() => {
                  setSelectedDistricts([]);
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
        <View style={styles.topHeader}>
          <Pressable
            style={styles.profileSection}
            onPress={() => router.push('/(tabs)/profile')}
          >
            {profile.image ? (
              <Image source={{ uri: profile.image }} style={styles.profileImage} />
            ) : (
              <View style={styles.profileIconPlaceholder}>
                <IconSymbol name="person.fill" size={24} color={colors.icon} />
              </View>
            )}
            <View style={styles.profileTextContainer}>
              <ThemedText style={styles.profileGreeting}>{t('Hi')},</ThemedText>
              <ThemedText style={styles.profileName} numberOfLines={1}>
                {profile.name}
              </ThemedText>
            </View>
          </Pressable>

          <View style={styles.topHeaderRight}>
            <Pressable
              style={styles.notificationBell}
              onPress={() => router.push('/notifications')}
            >
              <IconSymbol name="bell.fill" size={22} color={colors.icon} />
            </Pressable>
            <Pressable
              style={styles.notificationBell}
              onPress={() => router.push('/messages')}
            >
              <IconSymbol name="message.fill" size={22} color={colors.icon} />
            </Pressable>
          </View>
        </View>



        <View style={styles.premiumSearchCard}>
          <View style={styles.searchBarWrapper}>
            <View style={styles.searchInputContainer}>
              <IconSymbol name="magnifyingglass" size={20} color="#8E8E93" />
              <TextInput
                placeholder={t('Search city, land, property...')}
                placeholderTextColor="#ABE"
                style={styles.premiumSearchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <Pressable
              style={styles.locationPinButton}
              onPress={handleLocationRequest}
            >
              {loadingLocation ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <IconSymbol name="mappin.and.ellipse" size={24} color="#FFF" />
              )}
            </Pressable>
          </View>

          <View style={styles.filterToggles}>
            {['Buy', 'Rent', 'Sell'].map((type) => (
              <Pressable
                key={type}
                onPress={() => setActiveType(type)}
                style={[
                  styles.toggleButton,
                  activeType === type && styles.activeToggleButton
                ]}
              >
                <ThemedText style={[
                  styles.toggleText,
                  activeType === type && styles.activeToggleText
                ]}>{t(type)}</ThemedText>
              </Pressable>
            ))}
          </View>
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
            <ThemedText style={styles.rewardTag}>{t('LIMITED OFFER')}</ThemedText>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ThemedText style={[styles.rewardTitle, { marginBottom: 0 }]}>Post Now - </ThemedText>
              <View style={styles.freeBadge}>
                <ThemedText style={styles.freeText}>FREE!</ThemedText>
              </View>
              <ThemedText style={[styles.rewardTitle, { marginBottom: 0 }]}> 🎊</ThemedText>
            </View>
            <ThemedText style={styles.rewardSubtitle}>{t('Post Free Desc')}</ThemedText>
          </View>
          <View style={styles.rewardAction}>
            <IconSymbol name="chevron.right" size={20} color="#FFFFFF" />
          </View>
        </Pressable>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle} numberOfLines={1}>
              {t('Categories')}
            </ThemedText>
            <Pressable onPress={() => router.push('/properties')}>
              <ThemedText style={{ color: colors.tint, fontWeight: '700', fontSize: 14 }}>
                {t('See All')}
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
                style={styles.categoryItem}
                onPress={() => {
                  router.push({
                    pathname: '/properties',
                    params: { category: cat.name }
                  });
                }}
              >
                <View style={[styles.categoryIcon, { overflow: 'hidden' }]}>
                  <Image
                    source={cat.image}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="contain"
                  />
                </View>
                <ThemedText style={styles.categoryName}>
                  {cat.name}
                </ThemedText>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>{t('Explore Cities')}</ThemedText>
            <Pressable onPress={() => setLocationModalVisible(true)}>
              <ThemedText style={{ color: colors.tint, fontWeight: '700', fontSize: 14 }}>{t('All India')}</ThemedText>
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
                  showNotification('success', t('Location Updated'), `${t('Exploring properties in')} ${cityItem.name}`);
                  router.push({
                    pathname: '/properties',
                    params: { city: cityItem.name }
                  });
                }}
              >
                <View style={[styles.cityIconContainer, { padding: 0, overflow: 'hidden', borderWidth: 0 }]}>
                  <Image
                    source={cityItem.image}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
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
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>{t('Featured Listings')}</ThemedText>
          </View>

          <View style={styles.emptyState}>
            <IconSymbol name="house.fill" size={60} color={colors.icon} />
            <ThemedText style={styles.emptyText}>{t('No listings yet.')}</ThemedText>
            <ThemedText style={styles.emptySubText}>{t('Be the first one to post!')}</ThemedText>

            <Pressable
              style={[styles.postButton, { backgroundColor: colors.tint }]}
              onPress={() => router.push('/(tabs)/add')}
            >
              <ThemedText style={styles.postButtonText}>{t('Post Now')}</ThemedText>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
