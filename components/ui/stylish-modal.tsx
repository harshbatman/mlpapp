import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

interface StylishModalProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    message: string;
    icon?: keyof typeof Ionicons.glyphMap;
    iconColor?: string;
    primaryActionText?: string;
    onPrimaryAction?: () => void;
    secondaryActionText?: string;
    onSecondaryAction?: () => void;
}

export function StylishModal({
    visible,
    onClose,
    title,
    message,
    icon = 'information-circle',
    iconColor = '#3B82F6',
    primaryActionText,
    onPrimaryAction,
    secondaryActionText,
    onSecondaryAction
}: StylishModalProps) {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <View style={[styles.iconContainer, { backgroundColor: iconColor + '15' }]}>
                        <Ionicons name={icon} size={40} color={iconColor} />
                    </View>

                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.footer}>
                        {secondaryActionText && (
                            <Pressable
                                style={[styles.button, styles.secondaryButton]}
                                onPress={onSecondaryAction || onClose}
                            >
                                <Text style={styles.secondaryButtonText}>{secondaryActionText}</Text>
                            </Pressable>
                        )}

                        <Pressable
                            style={[styles.button, styles.primaryButton, { backgroundColor: iconColor }]}
                            onPress={onPrimaryAction || onClose}
                        >
                            <Text style={styles.primaryButtonText}>{primaryActionText || 'Dismiss'}</Text>
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
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 32,
        padding: 32,
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.2,
                shadowRadius: 20,
            },
            android: {
                elevation: 10,
            },
        }),
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
        color: '#111827',
        textAlign: 'center',
        marginBottom: 12,
        letterSpacing: -0.5,
    },
    message: {
        fontSize: 16,
        color: '#4B5563',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
        fontWeight: '500',
    },
    footer: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    button: {
        flex: 1,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    primaryButton: {
        // backgroundColor set dynamically
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    secondaryButton: {
        backgroundColor: '#F3F4F6',
    },
    secondaryButtonText: {
        color: '#4B5563',
        fontSize: 16,
        fontWeight: '700',
    }
});
