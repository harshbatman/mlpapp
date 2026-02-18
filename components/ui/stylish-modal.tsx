import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');

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
    icon = 'sparkles',
    iconColor = '#000000',
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
                    {/* Top Decorative bar */}
                    <View style={[styles.glowBar, { backgroundColor: iconColor }]} />

                    <View style={styles.content}>
                        <View style={[styles.iconContainer, { backgroundColor: iconColor }]}>
                            <Ionicons name={icon} size={32} color="#FFFFFF" />
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
                                style={[styles.button, styles.primaryButton, { backgroundColor: '#000000' }]}
                                onPress={onPrimaryAction || onClose}
                            >
                                <Text style={styles.primaryButtonText}>{primaryActionText || 'Dismiss'}</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 28,
        width: '100%',
        maxWidth: 360,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 20 },
                shadowOpacity: 0.3,
                shadowRadius: 30,
            },
            android: {
                elevation: 15,
            },
        }),
    },
    glowBar: {
        height: 6,
        width: '100%',
        opacity: 0.8,
    },
    content: {
        padding: 32,
        alignItems: 'center',
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        color: '#000000',
        textAlign: 'center',
        marginBottom: 10,
        letterSpacing: -0.5,
    },
    message: {
        fontSize: 15,
        color: '#666666',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 28,
        fontWeight: '500',
    },
    footer: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    button: {
        flex: 1,
        height: 54,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    primaryButton: {
        // backgroundColor set to black
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
