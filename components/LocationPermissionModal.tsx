import React from 'react';
import { Modal, View, StyleSheet, Pressable } from 'react-native';
import { ThemedText } from './themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import * as ExpoLocation from 'expo-location';

interface LocationPermissionModalProps {
    visible: boolean;
    onClose: () => void;
}

export function LocationPermissionModal({ visible, onClose }: LocationPermissionModalProps) {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme as 'light' | 'dark'];

    const handleAllow = async () => {
        try {
            await ExpoLocation.requestForegroundPermissionsAsync();
        } catch (e) {
            console.log('Error requesting permission', e);
        } finally {
            onClose();
        }
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={[styles.card, { backgroundColor: colors.background }]}>
                    <View style={[styles.iconContainer, { backgroundColor: colors.tint + '15' }]}>
                        <IconSymbol name="location.fill" size={40} color={colors.tint} />
                    </View>

                    <ThemedText style={styles.title}>Enable Location</ThemedText>

                    <ThemedText style={styles.description}>
                        Allow <ThemedText style={{ fontWeight: '700' }}>MAHTO</ThemedText> to access your location to find the best properties and services near you.
                    </ThemedText>

                    <View style={styles.buttonContainer}>
                        <Pressable
                            style={[styles.allowButton, { backgroundColor: colors.tint }]}
                            onPress={handleAllow}
                        >
                            <ThemedText style={styles.allowButtonText}>Allow Location Access</ThemedText>
                        </Pressable>

                        <Pressable style={styles.skipButton} onPress={onClose}>
                            <ThemedText style={[styles.skipButtonText, { color: colors.icon }]}>Maybe Later</ThemedText>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.65)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    card: {
        width: '100%',
        maxWidth: 340,
        borderRadius: 28,
        padding: 32,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.3,
        shadowRadius: 24,
        elevation: 12,
    },
    iconContainer: {
        width: 88,
        height: 88,
        borderRadius: 44,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 26,
        fontWeight: '800',
        marginBottom: 12,
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 36,
        lineHeight: 24,
        opacity: 0.7,
    },
    buttonContainer: {
        width: '100%',
        gap: 12,
    },
    allowButton: {
        width: '100%',
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
    allowButtonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '700',
    },
    skipButton: {
        width: '100%',
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    skipButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});
