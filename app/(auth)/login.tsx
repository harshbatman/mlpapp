import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

export default function LoginScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme as 'light' | 'dark'];

    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // Demo account logic
        if (phone === '1234567890' && password === '123456') {
            router.replace('/(tabs)');
        } else if (phone && password) {
            router.replace('/(tabs)');
        } else {
            alert('Please enter your credentials');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <ThemedText type="title" style={styles.appName}>MAHTO</ThemedText>
                    <ThemedText type="subtitle" style={styles.tagline}>Land & Properties</ThemedText>
                    <ThemedText style={styles.demoHint}>Demo: 1234567890 / 123456</ThemedText>
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

                    <Pressable style={[styles.loginButton, { backgroundColor: '#000000' }]} onPress={handleLogin}>
                        <ThemedText style={styles.loginButtonText}>Continue with MAHTO ID</ThemedText>
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
        paddingTop: Platform.OS === 'ios' ? 80 : 60,
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
        backgroundColor: '#EEEEEE',
        borderRadius: 0, // Uber style is more square
        paddingHorizontal: 16,
        fontSize: 16,
        borderWidth: 0,
    },
    loginButton: {
        height: 60,
        borderRadius: 4,
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
