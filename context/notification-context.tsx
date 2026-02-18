import { Ionicons } from '@expo/vector-icons';
import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Animated, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StylishModal } from '../components/ui/stylish-modal';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    duration?: number;
}

interface ConfirmProps {
    title: string;
    message: string;
    icon?: keyof typeof Ionicons.glyphMap;
    iconColor?: string;
    primaryActionText?: string;
    onPrimaryAction?: () => void;
    secondaryActionText?: string;
    onSecondaryAction?: () => void;
}

const ERROR_MAPPING: Record<string, { title: string; message: string }> = {
    'auth/user-not-found': {
        title: 'Account Not Found',
        message: "We couldn't find a MAHTO ID with this number. Please check the number or create a new account."
    },
    'auth/wrong-password': {
        title: 'Incorrect Password',
        message: 'The password you entered is incorrect. Please try again.'
    },
    'auth/invalid-email': {
        title: 'ID Format Issue',
        message: 'There was an issue with your MAHTO ID format. Please verify your number.'
    },
    'auth/user-disabled': {
        title: 'Account Disabled',
        message: 'This MAHTO ID has been temporarily disabled for security. Please contact support.'
    },
    'auth/network-request-failed': {
        title: 'Connection Issue',
        message: "We're having trouble connecting to our servers. Please check your internet connection."
    },
    'auth/email-already-in-use': {
        title: 'Already Registered',
        message: 'This phone number is already linked to a MAHTO ID. Please log in instead.'
    },
    'auth/too-many-requests': {
        title: 'Security Notice',
        message: 'Too many attempts. For your security, please wait a moment before trying again.'
    },
    'auth/internal-error': {
        title: 'Service Interruption',
        message: 'We encountered a momentary issue. Please try again in a few seconds.'
    },
    'location-denied': {
        title: 'Permission Required',
        message: 'To show properties near you, we need location access. Please enable it in settings.'
    },
    'location-error': {
        title: 'Location Unavailable',
        message: 'We could not determine your current location. Please select your city manually.'
    }
};

interface NotificationContextType {
    showNotification: (type: NotificationType, title: string, message: string, duration?: number) => void;
    showProfessionalError: (error: any, fallbackTitle?: string) => void;
    hideNotification: () => void;
    showConfirm: (props: ConfirmProps) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notification, setNotification] = useState<Notification | null>(null);
    const [confirmProps, setConfirmProps] = useState<ConfirmProps | null>(null);
    const translateY = useRef(new Animated.Value(-150)).current;
    const insets = useSafeAreaInsets();
    const timerRef = useRef<NodeJS.Timeout | number | null>(null);

    const showNotification = useCallback((type: NotificationType, title: string, message: string, duration = 4000) => {
        if (timerRef.current) clearTimeout(timerRef.current as any);

        const newNotification: Notification = {
            id: Date.now().toString(),
            type,
            title,
            message,
            duration,
        };

        setNotification(newNotification);

        Animated.spring(translateY, {
            toValue: insets.top + 10,
            useNativeDriver: true,
            friction: 8,
            tension: 40,
        }).start();

        if (duration > 0) {
            timerRef.current = setTimeout(() => {
                hideNotification();
            }, duration);
        }
    }, [insets.top]);

    const showProfessionalError = useCallback((error: any, fallbackTitle = 'Something went wrong') => {
        const errorCode = error?.code || error?.message || 'unknown';
        const mapped = ERROR_MAPPING[errorCode];
        const title = mapped?.title || fallbackTitle;
        const message = mapped?.message || 'We encountered an unexpected issue. Our team is looking into it. Please try again.';
        showNotification('error', title, message);
    }, [showNotification]);

    const hideNotification = useCallback(() => {
        Animated.timing(translateY, {
            toValue: -200,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setNotification(null);
        });
    }, []);

    const showConfirm = useCallback((props: ConfirmProps) => {
        setConfirmProps(props);
    }, []);

    const closeConfirm = () => setConfirmProps(null);

    const getIconName = (type: NotificationType): keyof typeof Ionicons.glyphMap => {
        switch (type) {
            case 'success': return 'checkmark-circle';
            case 'error': return 'alert-circle';
            case 'warning': return 'warning';
            case 'info': return 'information-circle';
            default: return 'information-circle';
        }
    };

    const getColors = (type: NotificationType) => {
        switch (type) {
            case 'success': return { bg: '#10B981', border: '#059669' };
            case 'error': return { bg: '#EF4444', border: '#DC2626' };
            case 'warning': return { bg: '#F59E0B', border: '#D97706' };
            case 'info': return { bg: '#3B82F6', border: '#2563EB' };
            default: return { bg: '#3B82F6', border: '#2563EB' };
        }
    };

    return (
        <NotificationContext.Provider value={{ showNotification, showProfessionalError, hideNotification, showConfirm }}>
            {children}

            {notification && (
                <Animated.View style={[styles.container, { transform: [{ translateY }], top: 0 }]}>
                    <View style={[styles.card, {
                        borderColor: getColors(notification.type).border,
                        borderLeftWidth: 4,
                        borderLeftColor: getColors(notification.type).bg
                    }]}>
                        <View style={[styles.iconContainer, { backgroundColor: getColors(notification.type).bg }]}>
                            <Ionicons name={getIconName(notification.type)} size={24} color="#FFFFFF" />
                        </View>
                        <View style={styles.contentContainer}>
                            <Text style={styles.title}>{notification.title}</Text>
                            <Text style={styles.message} numberOfLines={2}>{notification.message}</Text>
                        </View>
                        <TouchableOpacity onPress={hideNotification} style={styles.closeButton}>
                            <Ionicons name="close" size={20} color="#6B7280" />
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            )}

            {confirmProps && (
                <StylishModal
                    visible={!!confirmProps}
                    onClose={closeConfirm}
                    title={confirmProps.title}
                    message={confirmProps.message}
                    icon={confirmProps.icon}
                    iconColor={confirmProps.iconColor}
                    primaryActionText={confirmProps.primaryActionText}
                    onPrimaryAction={() => {
                        confirmProps.onPrimaryAction?.();
                        closeConfirm();
                    }}
                    secondaryActionText={confirmProps.secondaryActionText}
                    onSecondaryAction={() => {
                        confirmProps.onSecondaryAction?.();
                        closeConfirm();
                    }}
                />
            )}
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);
    if (context === undefined) throw new Error('useNotification must be used within a NotificationProvider');
    return context;
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 12,
        right: 12,
        zIndex: 99999,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.25,
                shadowRadius: 16,
            },
            android: {
                elevation: 12,
            },
        }),
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
        minHeight: 70,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        color: '#000000',
        fontSize: 15,
        fontWeight: '800',
        marginBottom: 2,
        letterSpacing: -0.2,
    },
    message: {
        color: '#666666',
        fontSize: 13,
        fontWeight: '600',
        lineHeight: 18,
    },
    closeButton: {
        padding: 8,
        marginLeft: 4,
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
    },
});
