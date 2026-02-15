import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { auth, db } from '../../config/firebase';

import { COUNTRY_CODES } from '../../constants/country-codes';

export default function SignUpScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme as 'light' | 'dark'];

    const [name, setName] = useState('harsh');
    const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES.find(c => c.name === 'India') || COUNTRY_CODES[0]);
    const [showCountryModal, setShowCountryModal] = useState(false);
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        if (!name || !phone || !password) {
            alert('Please fill all fields');
            return;
        }

        if (phone.length < 10) {
            alert('Please enter a valid phone number');
            return;
        }

        setLoading(true);
        try {
            // Virtual Email Logic
            const virtualEmail = `${selectedCountry.code.replace('+', '')}${phone}@mahto.app`;

            // Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, virtualEmail, password);
            const user = userCredential.user;

            // Store extra info in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                name,
                phone,
                email: virtualEmail,
                createdAt: Date.now(),
            });

            router.replace('/(tabs)');
        } catch (error: any) {
            console.error(error);
            alert(error.message || 'Signup failed');
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
                <View style={styles.header}>
                    <ThemedText type="title" style={styles.appName}>Join MAHTO</ThemedText>
                    <ThemedText type="subtitle" style={styles.tagline}>Start your property journey</ThemedText>
                </View>

                <View style={styles.form}>
                    <ThemedText style={styles.label}>Full Name</ThemedText>
                    <TextInput
                        style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                        placeholder="Enter your full name"
                        placeholderTextColor={colors.icon}
                        value={name}
                        onChangeText={setName}
                    />

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
                        placeholder="Create a password"
                        placeholderTextColor={colors.icon}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <Pressable
                        style={[styles.signupButton, { backgroundColor: colors.tint }, loading && { opacity: 0.7 }]}
                        onPress={handleSignUp}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <ThemedText style={styles.signupButtonText}>Create Account</ThemedText>
                        )}
                    </Pressable>

                    <View style={styles.divider}>
                        <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                        <ThemedText style={styles.dividerText}>OR</ThemedText>
                        <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                    </View>

                    <View style={styles.footer}>
                        <ThemedText>Already have an account? </ThemedText>
                    </View>

                    <Pressable
                        style={[styles.mahtoIdButton, { backgroundColor: '#000000', borderColor: '#000000' }]}
                        onPress={() => router.push('/(auth)/login')}
                    >
                        <ThemedText style={[styles.mahtoIdButtonText, { color: '#FFFFFF' }]}>Continue with MAHTO ID</ThemedText>
                    </Pressable>
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
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 24,
        paddingTop: Platform.OS === 'ios' ? 80 : 60,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'flex-start',
        marginBottom: 40,
    },
    appName: {
        fontSize: 32,
        fontWeight: '900',
        letterSpacing: -1,
    },
    tagline: {
        fontSize: 24,
        fontWeight: '700',
        marginTop: 4,
        letterSpacing: -0.5,
    },
    form: {
        width: '100%',
    },
    label: {
        fontSize: 16,
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
    signupButton: {
        height: 60,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    signupButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 20,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 32,
    },
    dividerLine: {
        flex: 1,
        height: 1,
    },
    dividerText: {
        marginHorizontal: 16,
        fontSize: 14,
        fontWeight: '700',
        opacity: 0.5,
    },
    mahtoIdButton: {
        height: 60,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mahtoIdButtonText: {
        fontSize: 18,
        fontWeight: '700',
    },
});
