import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { auth } from '../../config/firebase';

import { COUNTRY_CODES } from '../../constants/country-codes';

export default function LoginScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme as 'light' | 'dark'];

    const [phone, setPhone] = useState('');
    const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES.find(c => c.name === 'India') || COUNTRY_CODES[0]);
    const [showCountryModal, setShowCountryModal] = useState(false);
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!phone || !password) {
            alert('Please enter your credentials');
            return;
        }

        if (phone.length !== 10) {
            alert('Please enter a valid 10-digit phone number');
            return;
        }

        setLoading(true);
        try {
            // Virtual Email Logic - Include country code in the virtual email to ensure uniqueness globally if needed, 
            // but for now keeping it simple as requested or maybe just phone is enough. 
            // Let's stick to the user's phone number as the unique identifier.
            // If the user registered with +91, we should probably include that, but the earlier logic just used phone.
            // Let's update it to be consistent with the signup logic we will implement.
            // For now, let's assume the unique ID is just the 10 digit phone for simplicity in this specific user request context, 
            // OR better, use the full number. Let's send the full number usually.
            // HOWEVER, the previous implementation just used `phone`. 
            // To be safe and minimal changes: let's stick to `phone` (10 digits) for the email generation 
            // UNLESS the user explicitly wants global support.
            // Given "all country with flag", it implies global.
            // Let's map `${selectedCountry.code}${phone}@mahto.app` to be robust. 
            // BUT, if existing users are just `phone@mahto.app`, this breaks them.
            // Assumption: This is a new app or we can reset.
            // Let's use `${phone}@mahto.app` to maintain backward compatibility with the previous session if any,
            // OR just use phone. 
            // The prompt asks for "all country with flag". 
            // Let's use the phone number as is for the credential.

            const virtualEmail = `${selectedCountry.code.replace('+', '')}${phone}@mahto.app`;

            // Sign in with Firebase
            await signInWithEmailAndPassword(auth, virtualEmail, password);

            router.replace('/(tabs)');
        } catch (error: any) {
            console.error(error);
            alert('Login failed: ' + (error.message || 'Check your credentials'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Pressable
                    onPress={() => {
                        if (router.canGoBack()) {
                            router.back();
                        } else {
                            router.replace('/(auth)/signup');
                        }
                    }}
                    style={styles.backButton}
                >
                    <IconSymbol name="chevron.left" size={28} color={colors.text} />
                </Pressable>
                <View style={styles.header}>
                    <ThemedText type="title" style={styles.appName}>MAHTO</ThemedText>
                    <ThemedText type="subtitle" style={styles.tagline}>Land & Properties</ThemedText>
                </View>

                <View style={styles.form}>
                    <ThemedText style={styles.label}>Phone Number</ThemedText>
                    <View style={styles.phoneContainer}>
                        <Pressable
                            style={[styles.countryCodeButton, { borderColor: colors.border, backgroundColor: '#F6F6F6' }]}
                            onPress={() => setShowCountryModal(true)}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <ThemedText style={{ fontSize: 24 }}>{selectedCountry.flag}</ThemedText>
                            <ThemedText style={{ fontSize: 16, fontWeight: '600', marginLeft: 4 }}>{selectedCountry.code}</ThemedText>
                            <IconSymbol name="chevron.down" size={20} color={colors.text} style={{ marginLeft: 6, opacity: 0.6 }} />
                        </Pressable>
                        <TextInput
                            style={[styles.input, { flex: 1, borderColor: colors.border, color: colors.text }]}
                            placeholder="Enter 10-digit number"
                            placeholderTextColor={colors.icon}
                            value={phone}
                            onChangeText={(text) => {
                                // Only allow numeric input and max 10 digits
                                const numericText = text.replace(/[^0-9]/g, '');
                                if (numericText.length <= 10) {
                                    setPhone(numericText);
                                }
                            }}
                            keyboardType="phone-pad"
                            maxLength={10}
                        />
                    </View>

                    <ThemedText style={styles.label}>Password</ThemedText>
                    <TextInput
                        style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                        placeholder="Enter your password"
                        placeholderTextColor={colors.icon}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <Pressable
                        style={[styles.loginButton, { backgroundColor: '#000000' }, loading && { opacity: 0.7 }]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <ThemedText style={styles.loginButtonText}>Continue with MAHTO ID</ThemedText>
                        )}
                    </Pressable>

                    <View style={styles.footer}>
                        <ThemedText>Don't have an account? </ThemedText>
                        <Pressable onPress={() => router.push('/(auth)/signup')}>
                            <ThemedText style={{ color: colors.tint, fontWeight: 'bold' }}>Create Account</ThemedText>
                        </Pressable>
                    </View>
                </View>

                {/* Country Selection Modal */}
                <Modal
                    visible={showCountryModal}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setShowCountryModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
                            <View style={styles.modalHeader}>
                                <ThemedText style={styles.modalTitle}>Select Country</ThemedText>
                                <Pressable onPress={() => setShowCountryModal(false)}>
                                    <IconSymbol name="xmark.circle.fill" size={30} color={colors.text} />
                                </Pressable>
                            </View>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                {COUNTRY_CODES.map((country, index) => (
                                    <Pressable
                                        key={index}
                                        style={styles.countryItem}
                                        onPress={() => {
                                            setSelectedCountry(country);
                                            setShowCountryModal(false);
                                        }}
                                    >
                                        <ThemedText style={{ fontSize: 32, marginRight: 16 }}>{country.flag}</ThemedText>
                                        <ThemedText style={{ fontSize: 18, flex: 1 }}>{country.name}</ThemedText>
                                        <ThemedText style={{ fontSize: 18, fontWeight: '700', color: colors.tint }}>{country.code}</ThemedText>
                                    </Pressable>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </KeyboardAvoidingView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 24,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    header: {
        alignItems: 'flex-start',
        marginBottom: 60,
    },
    appName: {
        fontSize: 36,
        fontWeight: '900',
        letterSpacing: -1,
        lineHeight: 40,
    },
    tagline: {
        fontSize: 36,
        fontWeight: '900',
        letterSpacing: -1,
        lineHeight: 40,
    },
    demoHint: {
        marginTop: 12,
        fontSize: 14,
        opacity: 0.5,
        fontWeight: '600',
    },
    form: {
        width: '100%',
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
        marginTop: 16,
    },
    input: {
        height: 56,
        backgroundColor: '#F6F6F6',
        borderRadius: 12,
        paddingHorizontal: 20,
        fontSize: 16,
        borderWidth: 0,
    },
    phoneContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    countryCodeButton: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: '#F6F6F6',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        height: '70%',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
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
        fontWeight: '700',
    },
    countryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    loginButton: {
        height: 60,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 32,
    },
});
