import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { auth, db } from '../../config/firebase';

export default function SignUpScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme as 'light' | 'dark'];

    const [name, setName] = useState('Harsh Mahto');
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
            const virtualEmail = `${phone}@mahto.app`;

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
                    <TextInput
                        style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                        placeholder="Enter your phone number"
                        placeholderTextColor={colors.icon}
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                    />

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
                        <ThemedText>Already have an account?</ThemedText>
                    </View>

                    <Pressable
                        style={[styles.mahtoIdButton, { backgroundColor: '#000000', borderColor: '#000000' }]}
                        onPress={() => router.push('/(auth)/login')}
                    >
                        <ThemedText style={[styles.mahtoIdButtonText, { color: '#FFFFFF' }]}>Continue with MAHTO ID</ThemedText>
                    </Pressable>
                </View>
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
