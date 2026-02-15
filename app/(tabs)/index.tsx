import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import * as ExpoLocation from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Platform, Pressable, Text as RNText, ScrollView, StyleSheet, TextInput, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme as 'light' | 'dark'];
  const [city, setCity] = useState('Select Location');
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const indianStates = [
    { name: 'Delhi NCR', districts: ['Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi', 'South Delhi', 'Gurugram', 'Noida', 'Faridabad', 'Ghaziabad'] },
    { name: 'Maharashtra', districts: ['Mumbai', 'Navi Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad'] },
    { name: 'Karnataka', districts: ['Bengaluru', 'Mysuru', 'Hubballi', 'Mangaluru', 'Belagavi'] },
    { name: 'Uttar Pradesh', districts: ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Prayagraj', 'Meerut'] },
    { name: 'Gujarat', districts: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'] },
    { name: 'Tamil Nadu', districts: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'] },
    { name: 'Bihar', districts: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia'] },
    { name: 'West Bengal', districts: ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri'] },
    { name: 'Rajasthan', districts: ['Jaipur', 'Jodhpur', 'Kota', 'Ajmer', 'Bikaner'] },
    { name: 'Haryana', districts: ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Karnal'] },
    { name: 'Punjab', districts: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda'] },
    { name: 'Telangana', districts: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar'] },
    { name: 'Madhya Pradesh', districts: ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain'] },
  ];

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
    { name: 'Homes', icon: 'home' },
    { name: 'Lands', icon: 'landscape' },
    { name: 'Commercial', icon: 'business' },
    { name: 'Rentals', icon: 'apartment' },
  ];

  const filteredStates = indianStates.filter(state =>
    state.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    state.districts.some(d => d.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <ThemedView style={styles.container}>
      {/* Location Selector Modal */}
      <View style={{ flex: 1 }}>
        {locationModalVisible && (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000 }]}>
            <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
              <View style={styles.modalHeader}>
                <ThemedText style={styles.modalTitle}>Select Location</ThemedText>
                <Pressable onPress={() => setLocationModalVisible(false)} style={styles.closeButton}>
                  <IconSymbol name="plus.circle.fill" size={24} color={colors.text} style={{ transform: [{ rotate: '45deg' }] }} />
                </Pressable>
              </View>

              <View style={[styles.modalSearch, { backgroundColor: colors.secondary }]}>
                <IconSymbol name="magnifyingglass" size={18} color={colors.icon} />
                <TextInput
                  placeholder="Search state or district..."
                  placeholderTextColor={colors.icon}
                  style={[styles.modalSearchInput, { color: colors.text }]}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>

              <ScrollView style={styles.modalList} showsVerticalScrollIndicator={false}>
                <Pressable
                  style={styles.modalOption}
                  onPress={handleLocationRequest}
                >
                  <IconSymbol name="location.fill" size={20} color={colors.tint} />
                  <ThemedText style={[styles.modalOptionText, { color: colors.tint, fontWeight: '700' }]}>Detect My Location</ThemedText>
                </Pressable>

                {filteredStates.map((state, sIndex) => (
                  <View key={sIndex} style={styles.stateGroup}>
                    <ThemedText style={styles.stateHeader}>{state.name}</ThemedText>
                    <View style={styles.districtGrid}>
                      {state.districts
                        .filter(d => searchQuery === '' || d.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((district, dIndex) => (
                          <Pressable
                            key={dIndex}
                            style={[styles.districtItem, { backgroundColor: colors.secondary }]}
                            onPress={() => {
                              setCity(district);
                              setLocationModalVisible(false);
                            }}
                          >
                            <ThemedText style={styles.districtText}>{district}</ThemedText>
                          </Pressable>
                        ))}
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        )}

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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

          <View style={[styles.searchContainer, { backgroundColor: colors.background }]}>
            <View style={styles.searchLeft}>
              <IconSymbol name="magnifyingglass" size={20} color={colors.icon} />
              <TextInput
                placeholder="Search properties, land..."
                placeholderTextColor={colors.icon}
                style={[styles.searchInput, { color: colors.text }]}
              />
            </View>
            <Pressable
              style={[styles.filterButton, { backgroundColor: colors.tint }]}
              onPress={() => setLocationModalVisible(true)}
            >
              <IconSymbol name="slider.horizontal.3" size={18} color="#FFF" />
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
              <ThemedText type="subtitle" style={styles.sectionTitle} numberOfLines={1}>Categories</ThemedText>
              <Pressable>
                <ThemedText style={{ color: colors.tint, fontWeight: '700', fontSize: 14 }}>See All</ThemedText>
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
                  onPress={() => router.push({
                    pathname: '/properties',
                    params: { category: cat.name }
                  })}
                >
                  <View style={[styles.categoryIcon, { backgroundColor: colors.secondary }]}>
                    <IconSymbol
                      name={
                        cat.name === 'Lands' ? 'mountain.2.fill' :
                          cat.name === 'Commercial' ? 'building.2.fill' :
                            cat.name === 'Rentals' ? 'apartment.fill' :
                              'house.fill'
                      }
                      size={24}
                      color={colors.tint}
                    />
                  </View>
                  <ThemedText style={styles.categoryName}>{cat.name}</ThemedText>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Explore Cities Section */}
          <View style={styles.section}>
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
          </View>

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
        </ScrollView >
      </View>
    </ThemedView >
  );
}

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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
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
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
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
  // Modal Styles
  modalContent: {
    flex: 1,
    marginTop: 60,
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
});
