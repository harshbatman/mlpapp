import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useNotification } from '@/context/notification-context';
import { useProfile } from '@/context/profile-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Modal, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

export default function ProfileScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { showProfessionalError, showNotification, showConfirm } = useNotification();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme as 'light' | 'dark'];
    const { profile, logout } = useProfile();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [confirmPhone, setConfirmPhone] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleLogoutClick = () => {
        showConfirm({
            title: t('Logout Confirm Title'),
            message: t('Logout Confirm Msg'),
            icon: 'log-out',
            iconColor: '#EF4444',
            primaryActionText: t('Logout'),
            secondaryActionText: t('Stay Logged In'),
            onPrimaryAction: async () => {
                try {
                    await logout();
                    router.replace('/(auth)/login');
                } catch (error) {
                    showProfessionalError(error, t('Logout Failed'));
                }
            }
        });
    };

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        if (confirmPhone === '1234567890' && confirmPassword === '123456') {
            setShowDeleteConfirm(false);
            showNotification('success', t('Account Deleted'), t('Account Deleted Msg'));
            router.replace('/(auth)/login');
        } else {
            showNotification('error', t('Authentication Failed'), t('Auth Failed Msg'));
        }
    };

    return (
        <ThemedView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <View style={[styles.avatarContainer, { backgroundColor: colors.secondary, overflow: 'hidden' }]}>
                        {profile.image ? (
                            <Image source={{ uri: profile.image }} style={{ width: '100%', height: '100%' }} />
                        ) : (
                            <IconSymbol name="person.fill" size={30} color={colors.tint} />
                        )}
                    </View>
                    <View style={styles.headerInfo}>
                        <ThemedText type="title" style={styles.userName}>{profile.name}</ThemedText>
                        <ThemedText style={styles.userEmail}>{profile.email}</ThemedText>

                        <Pressable
                            style={[styles.editButton, { borderColor: colors.tint }]}
                            onPress={() => router.push('/edit-profile')}
                        >
                            <ThemedText style={{ color: colors.tint, fontWeight: '700', fontSize: 14 }}>{t('Edit Profile')}</ThemedText>
                        </Pressable>
                    </View>
                </View>

                <View style={styles.statsRow}>
                    <Pressable style={styles.statBox} onPress={() => router.push('/my-listings')}>
                        <ThemedText type="subtitle">0</ThemedText>
                        <ThemedText style={styles.statLabel}>{t('My Listings')}</ThemedText>
                    </Pressable>
                    <Pressable
                        style={[styles.statBox, { borderLeftWidth: 1, borderRightWidth: 1, borderColor: colors.border }]}
                        onPress={() => router.push('/saved-properties')}
                    >
                        <ThemedText type="subtitle">0</ThemedText>
                        <ThemedText style={styles.statLabel}>{t('Saved')}</ThemedText>
                    </Pressable>
                    <View style={styles.statBox}>
                        <ThemedText type="subtitle">0</ThemedText>
                        <ThemedText style={styles.statLabel}>{t('Views')}</ThemedText>
                    </View>
                </View>

                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>{t('Account Preferences')}</ThemedText>
                    <Pressable
                        style={[styles.menuItem, { borderBottomColor: colors.border }]}
                        onPress={() => router.push('/notifications')}
                    >
                        <View style={styles.menuItemLeft}>
                            <IconSymbol name="bell.fill" size={22} color={colors.icon} />
                            <ThemedText style={styles.menuItemText}>{t('Notifications Inbox')}</ThemedText>
                        </View>
                        <IconSymbol name="chevron.right" size={20} color={colors.icon} />
                    </Pressable>
                    <Pressable
                        style={[styles.menuItem, { borderBottomColor: colors.border }]}
                        onPress={() => router.push('/notification-settings')}
                    >
                        <View style={styles.menuItemLeft}>
                            <IconSymbol name="bell.fill" size={22} color={colors.icon} />
                            <ThemedText style={styles.menuItemText}>{t('Notification Settings')}</ThemedText>
                        </View>
                        <IconSymbol name="chevron.right" size={20} color={colors.icon} />
                    </Pressable>
                    <Pressable
                        style={[styles.menuItem, { borderBottomColor: colors.border }]}
                        onPress={() => router.push('/language-selector')}
                    >
                        <View style={styles.menuItemLeft}>
                            <IconSymbol name="globe" size={22} color={colors.icon} />
                            <ThemedText style={styles.menuItemText}>{t('Language')}</ThemedText>
                        </View>
                        <IconSymbol name="chevron.right" size={20} color={colors.icon} />
                    </Pressable>
                </View>

                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>{t('Support Feedback')}</ThemedText>
                    <Pressable
                        style={[styles.menuItem, { borderBottomColor: colors.border }]}
                        onPress={() => router.push('/help-center')}
                    >
                        <View style={styles.menuItemLeft}>
                            <IconSymbol name="questionmark.circle" size={22} color={colors.icon} />
                            <ThemedText style={styles.menuItemText}>{t('Helping Center')}</ThemedText>
                        </View>
                        <IconSymbol name="chevron.right" size={20} color={colors.icon} />
                    </Pressable>
                    <Pressable
                        style={[styles.menuItem, { borderBottomColor: colors.border }]}
                        onPress={() => router.push('/contact-us')}
                    >
                        <View style={styles.menuItemLeft}>
                            <IconSymbol name="envelope" size={22} color={colors.icon} />
                            <ThemedText style={styles.menuItemText}>{t('Contact Us')}</ThemedText>
                        </View>
                        <IconSymbol name="chevron.right" size={20} color={colors.icon} />
                    </Pressable>
                    <Pressable style={[styles.menuItem, { borderBottomColor: colors.border }]}>
                        <View style={styles.menuItemLeft}>
                            <IconSymbol name="star" size={22} color={colors.icon} />
                            <ThemedText style={styles.menuItemText}>{t('Rate Us')}</ThemedText>
                        </View>
                        <IconSymbol name="chevron.right" size={20} color={colors.icon} />
                    </Pressable>
                </View>

                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>{t('Information Legal')}</ThemedText>
                    <Pressable
                        style={[styles.menuItem, { borderBottomColor: colors.border }]}
                        onPress={() => router.push('/about')}
                    >
                        <View style={styles.menuItemLeft}>
                            <IconSymbol name="info.circle" size={22} color={colors.icon} />
                            <ThemedText style={styles.menuItemText}>{t('About Us')}</ThemedText>
                        </View>
                        <IconSymbol name="chevron.right" size={20} color={colors.icon} />
                    </Pressable>
                    <Pressable
                        style={[styles.menuItem, { borderBottomColor: colors.border }]}
                        onPress={() => router.push('/terms-and-conditions')}
                    >
                        <View style={styles.menuItemLeft}>
                            <IconSymbol name="doc.text" size={22} color={colors.icon} />
                            <ThemedText style={styles.menuItemText}>{t('Terms Conditions')}</ThemedText>
                        </View>
                        <IconSymbol name="chevron.right" size={20} color={colors.icon} />
                    </Pressable>
                    <Pressable
                        style={[styles.menuItem, { borderBottomColor: colors.border }]}
                        onPress={() => router.push('/privacy-policy')}
                    >
                        <View style={styles.menuItemLeft}>
                            <IconSymbol name="lock" size={22} color={colors.icon} />
                            <ThemedText style={styles.menuItemText}>{t('Privacy Policy')}</ThemedText>
                        </View>
                        <IconSymbol name="chevron.right" size={20} color={colors.icon} />
                    </Pressable>
                    <Pressable
                        style={[styles.menuItem, { borderBottomColor: colors.border }]}
                        onPress={() => router.push('/refund-policy')}
                    >
                        <View style={styles.menuItemLeft}>
                            <IconSymbol name="banknote" size={22} color={colors.icon} />
                            <ThemedText style={styles.menuItemText}>{t('Refund Policy')}</ThemedText>
                        </View>
                        <IconSymbol name="chevron.right" size={20} color={colors.icon} />
                    </Pressable>
                </View>

                <View style={[styles.section, { marginBottom: 40 }]}>
                    <ThemedText style={styles.sectionTitle}>{t('Account Actions')}</ThemedText>
                    <Pressable style={[styles.menuItem, { borderBottomColor: colors.border }]} onPress={handleLogoutClick}>
                        <View style={styles.menuItemLeft}>
                            <IconSymbol name="rectangle.portrait.and.arrow.right" size={22} color="#000000" />
                            <ThemedText style={styles.menuItemText}>{t('Logout')}</ThemedText>
                        </View>
                    </Pressable>
                    <Pressable
                        style={[styles.menuItem, { borderBottomColor: 'transparent' }]}
                        onPress={handleDeleteClick}
                    >
                        <View style={styles.menuItemLeft}>
                            <IconSymbol name="trash.fill" size={22} color="#EF4444" />
                            <ThemedText style={[styles.menuItemText, { color: '#EF4444' }]}>{t('Permanent Delete')}</ThemedText>
                        </View>
                    </Pressable>
                </View>



                <Modal
                    visible={showDeleteConfirm}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setShowDeleteConfirm(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={[styles.confirmCard, { backgroundColor: colors.background }]}>
                            <ThemedText style={[styles.confirmTitle, { color: '#EF4444' }]}>{t('Delete Account')}</ThemedText>
                            <ThemedText style={styles.confirmSubTitle}>{t('Delete Confirm Msg')}</ThemedText>

                            <View style={styles.inputGroup}>
                                <TextInput
                                    style={[styles.confirmInput, { borderColor: colors.border, color: colors.text, backgroundColor: colors.secondary }]}
                                    placeholder={t('Phone Number')}
                                    placeholderTextColor={colors.icon}
                                    value={confirmPhone}
                                    onChangeText={setConfirmPhone}
                                    keyboardType="phone-pad"
                                />
                                <TextInput
                                    style={[styles.confirmInput, { borderColor: colors.border, color: colors.text, backgroundColor: colors.secondary }]}
                                    placeholder={t('Password')}
                                    placeholderTextColor={colors.icon}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry
                                />
                            </View>

                            <View style={styles.confirmActions}>
                                <Pressable
                                    style={[styles.confirmButton, { backgroundColor: colors.secondary }]}
                                    onPress={() => setShowDeleteConfirm(false)}
                                >
                                    <ThemedText style={[styles.noText, { color: colors.text }]}>{t('Cancel')}</ThemedText>
                                </Pressable>
                                <Pressable
                                    style={[styles.confirmButton, { backgroundColor: '#EF4444' }]}
                                    onPress={confirmDelete}
                                >
                                    <ThemedText style={styles.yesText}>{t('Delete permanently')}</ThemedText>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? 80 : 60,
        paddingBottom: 32,
        paddingHorizontal: 20,
    },
    avatarContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#EEEEEE',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
    },
    headerInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 24,
        fontWeight: '700',
        letterSpacing: -0.5,
    },
    userEmail: {
        fontSize: 14,
        opacity: 0.6,
        marginTop: 2,
    },
    editButton: {
        marginTop: 12,
        borderWidth: 1,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    statsRow: {
        flexDirection: 'row',
        paddingVertical: 20,
        backgroundColor: '#F6F6F6',
        marginHorizontal: 0,
        borderRadius: 0,
    },
    statBox: {
        flex: 1,
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '600',
        opacity: 0.6,
        marginTop: 4,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    section: {
        marginTop: 24,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
        borderBottomWidth: 1,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuItemText: {
        fontSize: 17,
        marginLeft: 16,
        fontWeight: '500',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    confirmCard: {
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
    confirmTitle: {
        fontSize: 24,
        fontWeight: '900',
        marginBottom: 12,
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    confirmSubTitle: {
        fontSize: 16,
        opacity: 0.7,
        marginBottom: 24,
        textAlign: 'center',
        lineHeight: 22,
    },
    inputGroup: {
        width: '100%',
        marginBottom: 24,
    },
    confirmInput: {
        height: 56,
        borderRadius: 16,
        paddingHorizontal: 16,
        fontSize: 16,
        marginBottom: 12,
        borderWidth: 1,
    },
    confirmActions: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    confirmButton: {
        flex: 1,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noText: {
        fontWeight: '700',
        fontSize: 16,
    },
    yesText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});
