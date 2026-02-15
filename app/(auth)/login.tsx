import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { auth } from '../../config/firebase';

export default function LoginScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme as 'light' | 'dark'];

    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!phone || !password) {
            alert('Please enter your credentials');
            return;
        }

        setLoading(true);
        try {
            // Virtual Email Logic
            const virtualEmail = `${phone}@mahto.app`;

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
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <IconSymbol name="chevron.left" size={28} color={colors.text} />
                </Pressable>
                <View style={styles.header}>
                    <ThemedText type="title" style={styles.appName}>MAHTO</ThemedText>
                    <ThemedText type="subtitle" style={styles.tagline}>Land & Properties</ThemedText>
                </View>

                <View style={styles.form}>
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
