import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useNotification } from '@/context/notification-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { useProfile } from '@/context/profile-context';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';

export default function EditProfileScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme as 'light' | 'dark'];
    const { profile, updateProfile } = useProfile();
    const { showNotification, showConfirm, showProfessionalError } = useNotification();

    const [name, setName] = useState(profile.name);
    const [phone, setPhone] = useState(profile.phone);
    const [email, setEmail] = useState(profile.email);
    const [address, setAddress] = useState(profile.address);
    const [image, setImage] = useState(profile.image);
    const [isLocating, setIsLocating] = useState(false);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleGetCurrentLocation = async () => {
        setIsLocating(true);
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                showNotification('warning', 'Permission Denied', 'Allow location access to fetch your address.');
                setIsLocating(false);
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            let reverseGeocode = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
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

                setAddress(parts.join(', '));
            }
        } catch (error) {
            showProfessionalError(error, 'Location Error');
        } finally {
            setIsLocating(false);
        }
    };

    const handleSave = () => {
        updateProfile({ name, phone, email, address, image });
        showConfirm({
            title: 'Profile Updated',
            message: 'Your changes have been saved successfully.',
            icon: 'checkmark-circle',
            iconColor: '#10B981',
            primaryActionText: 'Great!',
            onPrimaryAction: () => router.back()
        });
    };

    return (
        <ThemedView style={styles.container}>
            <View style={[styles.appBar, { borderBottomColor: colors.border }]}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <IconSymbol name="chevron.left" size={28} color={colors.text} />
                </Pressable>
                <ThemedText style={styles.appBarTitle}>Edit Profile</ThemedText>
                <Pressable onPress={handleSave}>
                    <ThemedText style={[styles.saveText, { color: colors.tint }]}>Save</ThemedText>
                </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.avatarSection}>
                    <View style={styles.avatarWrapper}>
                        <Pressable onPress={pickImage} style={[styles.avatarContainer, { backgroundColor: colors.secondary }]}>
                            {image ? (
                                <Image source={{ uri: image }} style={styles.avatarImage} />
                            ) : (
                                <IconSymbol name="person.fill" size={80} color={colors.tint} />
                            )}
                        </Pressable>
                        <Pressable style={[styles.cameraBadge, { backgroundColor: colors.tint }]} onPress={pickImage}>
                            <IconSymbol name="camera.fill" size={18} color="#FFFFFF" />
                        </Pressable>
                    </View>
                    <Pressable style={styles.changePhotoButton} onPress={pickImage}>
                        <ThemedText style={{ color: colors.tint, fontWeight: '600' }}>Change Photo</ThemedText>
                    </Pressable>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <ThemedText style={styles.label}>Full Name</ThemedText>
                        <TextInput
                            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter your name"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <ThemedText style={styles.label}>Phone Number</ThemedText>
                        <TextInput
                            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                            placeholder="Enter your phone"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <ThemedText style={styles.label}>Email Address</ThemedText>
                        <TextInput
                            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholder="Enter your email"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <View style={styles.labelRow}>
                            <ThemedText style={styles.label}>Address</ThemedText>
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
                                        <ThemedText style={[styles.locationButtonText, { color: colors.tint }]}>Use Current Location</ThemedText>
                                    </>
                                )}
                            </Pressable>
                        </View>
                        <TextInput
                            style={[styles.input, styles.textArea, { borderColor: colors.border, color: colors.text }]}
                            value={address}
                            onChangeText={setAddress}
                            multiline
                            numberOfLines={3}
                            placeholder="Enter your address"
                        />
                    </View>
                </View>

                <Pressable style={[styles.saveButton, { backgroundColor: '#000000' }]} onPress={handleSave}>
                    <ThemedText style={styles.saveButtonText}>Save Changes</ThemedText>
                </Pressable>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    appBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
    },
    appBarTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    backButton: {
        padding: 4,
    },
    saveText: {
        fontSize: 16,
        fontWeight: '700',
    },
    scrollContent: {
        padding: 20,
    },
    avatarSection: {
        alignItems: 'center',
        marginVertical: 32,
    },
    avatarWrapper: {
        position: 'relative',
    },
    avatarContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    cameraBadge: {
        position: 'absolute',
        bottom: 16,
        right: 0,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#FFFFFF',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
    changePhotoButton: {
        padding: 8,
    },
    form: {
        marginTop: 8,
    },
    inputGroup: {
        marginBottom: 24,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        opacity: 0.6,
    },
    locationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    locationButtonText: {
        fontSize: 12,
        fontWeight: '700',
    },
    input: {
        height: 56,
        backgroundColor: '#F6F6F6',
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    textArea: {
        height: 100,
        paddingTop: 16,
        paddingBottom: 16,
        textAlignVertical: 'top',
    },
    saveButton: {
        height: 60,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 40,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
});
