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
        message: "We couldn't find an account with this number. Please check the number or create a new account."
    },
    'auth/wrong-password': {
        title: 'Authentication Failed',
        message: 'The details you entered are incorrect. Please try again.'
    },
    'auth/invalid-credential': {
        title: 'Authentication Failed',
        message: 'The phone number or password you entered is incorrect. Please try again.'
    },
    'auth/invalid-email': {
        title: 'Invalid Format',
        message: 'Please check the phone number format and try again.'
    },
    'auth/user-disabled': {
        title: 'Account Suspended',
        message: 'This account has been temporarily suspended. Please contact support.'
    },
    'auth/network-request-failed': {
        title: 'Connection Issue',
        message: "We're having trouble connecting. Please check your internet connection."
    },
    'auth/email-already-in-use': {
        title: 'Already Registered',
        message: 'This phone number is already registered. Please log in instead.'
    },
    'auth/too-many-requests': {
        title: 'Too Many Attempts',
        message: 'For your security, please wait a few minutes before trying again.'
    },
    'auth/internal-error': {
        title: 'Service Notice',
        message: 'We encountered a momentary issue. Please try again shortly.'
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
        left: 16,
        right: 16,
        zIndex: 99999,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    card: {
        flexDirection: 'row',
        backgroundColor: 'rgba(25, 25, 25, 0.95)',
        borderRadius: 16,
        padding: 12,
        alignItems: 'center',
        borderWidth: 1,
        minHeight: 70,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
        letterSpacing: 0.3,
    },
    message: {
        color: '#D1D5DB',
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 20,
    },
    closeButton: {
        padding: 6,
        marginLeft: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
    },
});
