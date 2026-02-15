import { Ionicons } from '@expo/vector-icons';
import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Animated, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    duration?: number;
}

interface NotificationContextType {
    showNotification: (type: NotificationType, title: string, message: string, duration?: number) => void;
    hideNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const NOTIFICATION_HEIGHT = 80;

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notification, setNotification] = useState<Notification | null>(null);
    const translateY = useRef(new Animated.Value(-150)).current;
    const insets = useSafeAreaInsets();
    const timerRef = useRef<NodeJS.Timeout | number | null>(null);

    const showNotification = useCallback((type: NotificationType, title: string, message: string, duration = 4000) => {
        // Clear any existing timer
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        const newNotification: Notification = {
            id: Date.now().toString(),
            type,
            title,
            message,
            duration,
        };

        setNotification(newNotification);

        // Animate in
        Animated.spring(translateY, {
            toValue: insets.top + 10,
            useNativeDriver: true,
            friction: 8,
            tension: 40,
        }).start();

        // Set timer to auto-hide
        if (duration > 0) {
            timerRef.current = setTimeout(() => {
                hideNotification();
            }, duration);
        }
    }, [insets.top]);

    const hideNotification = useCallback(() => {
        Animated.timing(translateY, {
            toValue: -200, // Move completely off screen
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setNotification(null);
        });
    }, []);

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
            case 'success': return { bg: '#10B981', border: '#059669', icon: '#FFFFFF' }; // Emerald Green
            case 'error': return { bg: '#EF4444', border: '#DC2626', icon: '#FFFFFF' };   // Red
            case 'warning': return { bg: '#F59E0B', border: '#D97706', icon: '#FFFFFF' }; // Amber
            case 'info': return { bg: '#3B82F6', border: '#2563EB', icon: '#FFFFFF' };    // Blue
            default: return { bg: '#3B82F6', border: '#2563EB', icon: '#FFFFFF' };
        }
    };

    return (
        <NotificationContext.Provider value={{ showNotification, hideNotification }}>
            {children}
            {notification && (
                <Animated.View
                    style={[
                        styles.container,
                        {
                            transform: [{ translateY }],
                            top: 0, // Positioned relative to the window
                        }
                    ]}
                >
                    <View style={[styles.card, {
                        borderColor: getColors(notification.type).border,
                        borderLeftWidth: 4, // Accent border on the left
                        borderLeftColor: getColors(notification.type).bg
                    }]}>

                        {/* Icon Container */}
                        <View style={[styles.iconContainer, { backgroundColor: getColors(notification.type).bg }]}>
                            <Ionicons name={getIconName(notification.type)} size={24} color="#FFFFFF" />
                        </View>

                        {/* Content */}
                        <View style={styles.contentContainer}>
                            <Text style={styles.title}>{notification.title}</Text>
                            <Text style={styles.message} numberOfLines={2}>{notification.message}</Text>
                        </View>

                        {/* Close Button */}
                        <TouchableOpacity onPress={hideNotification} style={styles.closeButton}>
                            <Ionicons name="close" size={20} color="#6B7280" />
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            )}
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 16,
        right: 16,
        zIndex: 99999, // Ensure it's on top of everything
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
        backgroundColor: 'rgba(25, 25, 25, 0.95)', // Dark, slightly transparent background
        borderRadius: 16,
        padding: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
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
        color: '#D1D5DB', // Gray-300
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
