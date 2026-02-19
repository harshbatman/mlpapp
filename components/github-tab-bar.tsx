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
const TAB_BAR_WIDTH_EXPANDED = SCREEN_WIDTH - 48;
const TAB_BAR_WIDTH_MINIMIZED = 52;
const TAB_BAR_HEIGHT = 52;

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
            [26, 26], // Consistent pill shape
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
            paddingHorizontal: 6,
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

    const renderProfileIcon = (isFocused: boolean, size: number = 22) => {
        if (profile.image) {
            return (
                <View style={[
                    styles.tabAvatarContainer,
                    {
                        width: size + 2,
                        height: size + 2,
                        borderRadius: (size + 2) / 2,
                        borderColor: isFocused ? '#FFFFFF' : 'transparent',
                        borderWidth: isFocused ? 1.5 : 0
                    }
                ]}>
                    <Image source={{ uri: profile.image }} style={styles.tabAvatar} />
                </View>
            );
        }
        return <IconSymbol name="person.fill" size={size} color={isFocused ? '#FFFFFF' : '#000000'} />;
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
                                renderProfileIcon(true, 20)
                            ) : (
                                <IconSymbol name={getIconName(activeRouteName, true)} size={20} color="#FFFFFF" />
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
                                    <IconSymbol name="plus" size={20} color="#FFFFFF" />
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
                                        renderProfileIcon(isFocused, 20)
                                    ) : (
                                        <IconSymbol
                                            name={getIconName(route.name, isFocused)}
                                            size={20}
                                            color={isFocused ? '#FFFFFF' : '#000000'}
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
        paddingLeft: 24,
        zIndex: 1000,
    },
    container: {
        height: TAB_BAR_HEIGHT,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 10,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    tabItem: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 26, // Half of TAB_BAR_HEIGHT to make it circular
        overflow: 'hidden',
    },
    iconWrapper: {
        width: 38,
        height: 38,
        borderRadius: 19,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeIconWrapper: {
        backgroundColor: '#000000',
    },
    addButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 4,
    },
    minimizedButton: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    minimizedIconCircle: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#000000',
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
