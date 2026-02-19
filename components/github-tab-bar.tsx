import { IconSymbol } from '@/components/ui/icon-symbol';
import { useProfile } from '@/context/profile-context';
import { useTabVisibility } from '@/context/tab-visibility-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useEffect } from 'react';
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TAB_BAR_WIDTH_EXPANDED = SCREEN_WIDTH - 40;
const TAB_BAR_WIDTH_MINIMIZED = 64;
const TAB_BAR_HEIGHT = 64;

export function GitHubTabBar({ state, descriptors, navigation }: any) {
    const insets = useSafeAreaInsets();
    const { isMinimized, setIsMinimized } = useTabVisibility();
    const { profile } = useProfile();
    const colorScheme = useColorScheme() ?? 'light';

    const expansion = useSharedValue(1);

    useEffect(() => {
        expansion.value = withSpring(isMinimized ? 0 : 1, {
            damping: 18,
            stiffness: 100,
        });
    }, [isMinimized]);

    const animatedContainerStyle = useAnimatedStyle(() => {
        const width = interpolate(
            expansion.value,
            [0, 1],
            [TAB_BAR_WIDTH_MINIMIZED, TAB_BAR_WIDTH_EXPANDED],
            Extrapolate.CLAMP
        );

        const borderRadius = interpolate(
            expansion.value,
            [0, 1],
            [32, 24],
            Extrapolate.CLAMP
        );

        return {
            width,
            borderRadius,
        };
    });

    const animatedIconContainerStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(expansion.value, [0.8, 1], [0, 1], Extrapolate.CLAMP),
            flexDirection: 'row',
            flex: 1,
            paddingHorizontal: 8,
            justifyContent: 'space-around',
            alignItems: 'center',
            pointerEvents: isMinimized ? 'none' : 'auto',
        };
    });

    const animatedMinimizedIconStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(expansion.value, [0, 0.2], [1, 0], Extrapolate.CLAMP),
            position: 'absolute',
            width: TAB_BAR_WIDTH_MINIMIZED,
            height: TAB_BAR_HEIGHT,
            justifyContent: 'center',
            alignItems: 'center',
            pointerEvents: isMinimized ? 'auto' : 'none',
            transform: [
                { scale: interpolate(expansion.value, [0, 0.2], [1, 0.8], Extrapolate.CLAMP) }
            ]
        };
    });

    const activeRouteName = state.routes[state.index].name;

    const renderProfileIcon = (isFocused: boolean, size: number = 24) => {
        if (profile.image) {
            return (
                <View style={[
                    styles.tabAvatarContainer,
                    {
                        width: size + 4,
                        height: size + 4,
                        borderRadius: (size + 4) / 2,
                        borderColor: isFocused ? '#000000' : 'transparent',
                        borderWidth: isFocused ? 2 : 0
                    }
                ]}>
                    <Image source={{ uri: profile.image }} style={styles.tabAvatar} />
                </View>
            );
        }
        return <IconSymbol name="person.fill" size={size} color={isFocused ? '#000000' : 'rgba(255,255,255,0.6)'} />;
    };

    return (
        <View style={[styles.outerContainer, { bottom: insets.bottom + 16 }]}>
            <Animated.View style={[styles.container, animatedContainerStyle]}>
                {/* Minimized View (Current Active Icon) */}
                <Animated.View style={animatedMinimizedIconStyle}>
                    <TouchableOpacity
                        onPress={() => setIsMinimized(false)}
                        style={styles.minimizedButton}
                        activeOpacity={0.7}
                    >
                        <View style={styles.minimizedIconCircle}>
                            {activeRouteName === 'profile' ? (
                                renderProfileIcon(true, 24)
                            ) : (
                                <IconSymbol name={getIconName(activeRouteName, true)} size={24} color="#000000" />
                            )}
                        </View>
                    </TouchableOpacity>
                </Animated.View>

                {/* Expanded View (All Tabs) */}
                <Animated.View style={animatedIconContainerStyle}>
                    {state.routes.map((route: any, index: number) => {
                        const isFocused = state.index === index;

                        const onPress = () => {
                            const event = navigation.emit({
                                type: 'tabPress',
                                target: route.key,
                                canPreventDefault: true,
                            });

                            if (!isFocused && !event.defaultPrevented) {
                                navigation.navigate(route.name);
                            }
                        };

                        // Custom handle for "Add" button
                        if (route.name === 'add') {
                            return (
                                <TouchableOpacity
                                    key={route.key}
                                    onPress={onPress}
                                    style={styles.addButton}
                                    activeOpacity={0.8}
                                >
                                    <IconSymbol name="plus" size={20} color="#000000" />
                                </TouchableOpacity>
                            );
                        }

                        return (
                            <TouchableOpacity
                                key={route.key}
                                onPress={onPress}
                                style={styles.tabItem}
                                activeOpacity={0.7}
                            >
                                <View style={[
                                    styles.iconWrapper,
                                    isFocused && styles.activeIconWrapper
                                ]}>
                                    {route.name === 'profile' ? (
                                        renderProfileIcon(isFocused, 24)
                                    ) : (
                                        <IconSymbol
                                            name={getIconName(route.name, isFocused)}
                                            size={24}
                                            color={isFocused ? '#000000' : 'rgba(255,255,255,0.6)'}
                                        />
                                    )}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </Animated.View>
            </Animated.View>
        </View>
    );
}

function getIconName(routeName: string, isFocused: boolean) {
    switch (routeName) {
        case 'index': return isFocused ? 'house.fill' : 'house';
        case 'search': return 'magnifyingglass';
        case 'saved': return isFocused ? 'heart.fill' : 'heart';
        case 'profile': return isFocused ? 'person.fill' : 'person';
        default: return 'circle';
    }
}

const styles = StyleSheet.create({
    outerContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        alignItems: 'flex-start',
        paddingLeft: 20,
        zIndex: 1000,
    },
    container: {
        height: TAB_BAR_HEIGHT,
        backgroundColor: '#000000',
        flexDirection: 'row',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 15,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    tabItem: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconWrapper: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeIconWrapper: {
        backgroundColor: '#FFFFFF',
    },
    addButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 4,
        shadowColor: '#FFF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    minimizedButton: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    minimizedIconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabAvatarContainer: {
        overflow: 'hidden',
    },
    tabAvatar: {
        width: '100%',
        height: '100%',
    }
});
