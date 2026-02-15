import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { ListingType, PropertyType } from '@/constants/types';
import { useColorScheme } from '@/hooks/use-color-scheme';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

export default function AddPropertyScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme as 'light' | 'dark'];

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [area, setArea] = useState('');
  const [type, setType] = useState<PropertyType>('Home');
  const [listingType, setListingType] = useState<ListingType>('Sell');
  const [isLocating, setIsLocating] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const pickImages = async () => {
    if (images.length >= 5) {
      Alert.alert('Limit Reached', 'You can only add up to 5 images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 5 - images.length,
      quality: 0.8,
    });

    if (!result.canceled) {
      const selectedUris = result.assets.map(asset => asset.uri);
      setImages(prev => [...prev, ...selectedUris].slice(0, 5));
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleGetCurrentLocation = async () => {
    setIsLocating(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Allow location access to fetch the property address.');
        setIsLocating(false);
        return;
      }

      let pos = await Location.getCurrentPositionAsync({});
      let reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        const item = reverseGeocode[0];
        const parts = [
          item.name,
          item.street,
          item.city,
          item.region,
          item.postalCode,
          item.country
        ].filter(Boolean);

        setLocation(parts.join(', '));
      }
    } catch (error) {
      Alert.alert('Error', 'Could not fetch location. Please try manually.');
    } finally {
      setIsLocating(false);
    }
  };

  const handleSubmit = () => {
    // Logic to save property
    console.log({ title, description, price, location, area, type, listingType });
    alert('Listing Posted Successfully!');
    router.replace('/(tabs)');
  };

  const propertyTypes: PropertyType[] = ['Home', 'Apartment', 'Villa', 'Commercial', 'Land'];

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <ThemedText type="subtitle" style={{ color: '#fff' }}>Post New Listing</ThemedText>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText style={styles.label}>Property Images ({images.length}/5)</ThemedText>
        <View style={styles.imageSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.imageScroll}>
            {images.map((uri, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri }} style={styles.imagePreview} />
                <Pressable style={styles.removeImageBtn} onPress={() => removeImage(index)}>
                  <IconSymbol name="trash.fill" size={14} color="#fff" />
                </Pressable>
              </View>
            ))}
            {images.length < 5 && (
              <Pressable style={[styles.imagePicker, { borderColor: colors.border }]} onPress={pickImages}>
                <IconSymbol name="camera.fill" size={24} color={colors.icon} />
                <ThemedText style={styles.imagePickerText}>Add Photo</ThemedText>
              </Pressable>
            )}
          </ScrollView>
        </View>

        <ThemedText style={styles.label}>Listing Title</ThemedText>
        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          placeholder="e.g. 3BHK Luxury Villa"
          placeholderTextColor={colors.icon}
          value={title}
          onChangeText={setTitle}
        />

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <ThemedText style={styles.label}>Category</ThemedText>
            <View style={styles.typeContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {propertyTypes.map((t) => (
                  <Pressable
                    key={t}
                    style={[
                      styles.chip,
                      { borderColor: colors.border },
                      type === t && { backgroundColor: colors.tint, borderColor: colors.tint }
                    ]}
                    onPress={() => setType(t)}
                  >
                    <ThemedText style={[styles.chipText, type === t && { color: '#fff' }]}>{t}</ThemedText>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <ThemedText style={styles.label}>Listing Type</ThemedText>
            <View style={styles.listingTypeToggle}>
              <Pressable
                style={[
                  styles.toggleHalf,
                  listingType === 'Sell' && { backgroundColor: colors.tint }
                ]}
                onPress={() => setListingType('Sell')}
              >
                <ThemedText style={[styles.toggleText, listingType === 'Sell' && { color: '#fff' }]}>Sell</ThemedText>
              </Pressable>
              <Pressable
                style={[
                  styles.toggleHalf,
                  listingType === 'Rent' && { backgroundColor: colors.tint }
                ]}
                onPress={() => setListingType('Rent')}
              >
                <ThemedText style={[styles.toggleText, listingType === 'Rent' && { color: '#fff' }]}>Rent</ThemedText>
              </Pressable>
            </View>
          </View>
        </View>

        <ThemedText style={styles.label}>Price (₹)</ThemedText>
        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          placeholder="Enter price"
          placeholderTextColor={colors.icon}
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />

        <View style={styles.labelRow}>
          <ThemedText style={styles.label}>Location</ThemedText>
          <Pressable
            style={styles.locationButton}
            onPress={handleGetCurrentLocation}
            disabled={isLocating}
          >
            {isLocating ? (
              <ActivityIndicator size="small" color={colors.tint} />
            ) : (
              <>
                <IconSymbol name="mappin.and.ellipse" size={14} color={colors.tint} />
                <ThemedText style={[styles.locationButtonText, { color: colors.tint }]}>Current Location</ThemedText>
              </>
            )}
          </Pressable>
        </View>
        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          placeholder="e.g. Ranchi, Jharkhand"
          placeholderTextColor={colors.icon}
          value={location}
          onChangeText={setLocation}
        />

        <ThemedText style={styles.label}>Area (sqft / Acres)</ThemedText>
        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          placeholder="e.g. 1500 sqft"
          placeholderTextColor={colors.icon}
          value={area}
          onChangeText={setArea}
        />

        <ThemedText style={styles.label}>Description</ThemedText>
        <TextInput
          style={[styles.input, styles.textArea, { borderColor: colors.border, color: colors.text }]}
          placeholder="Describe the property details..."
          placeholderTextColor={colors.icon}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

        <Pressable style={[styles.submitButton, { backgroundColor: colors.tint }]} onPress={handleSubmit}>
          <ThemedText style={styles.submitButtonText}>Post Listing</ThemedText>
        </Pressable>
        <View style={{ height: 40 }} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    alignItems: 'flex-start',
    backgroundColor: '#000',
  },
  scrollContent: {
    padding: 24,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    marginTop: 24,
    letterSpacing: -0.5,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 24,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  input: {
    height: 56,
    backgroundColor: '#F6F6F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 0,
    fontWeight: '500',
  },
  textArea: {
    height: 120,
    paddingTop: 16,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  typeContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F6F6F6',
    marginRight: 10,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listingTypeToggle: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 12,
    backgroundColor: '#F6F6F6',
    padding: 4,
    marginTop: 4,
    overflow: 'hidden',
  },
  toggleHalf: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 48,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  imageSection: {
    marginTop: 4,
  },
  imageScroll: {
    gap: 12,
  },
  imageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 12,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  removeImageBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#EF4444',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  imagePicker: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
  },
  imagePickerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginTop: 4,
  },
});
