import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useProfile } from '@/context/profile-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Modal, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

export default function ProfileScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme as 'light' | 'dark'];
    const { profile } = useProfile();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [confirmPhone, setConfirmPhone] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleLogoutClick = () => {
        setShowLogoutConfirm(true);
    };

    const confirmLogout = () => {
        setShowLogoutConfirm(false);
        router.replace('/(auth)/login');
    };

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        if (confirmPhone === '1234567890' && confirmPassword === '123456') {
            setShowDeleteConfirm(false);
            Alert.alert('Account Deleted', 'Your account has been permanently removed.');
            router.replace('/(auth)/login');
        } else {
            Alert.alert('Invalid Credentials', 'The phone number or password you entered is incorrect.');
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
                            <ThemedText style={{ color: colors.tint, fontWeight: '700', fontSize: 14 }}>Edit Profile</ThemedText>
                        </Pressable>
                    </View>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statBox}>
                        <ThemedText type="subtitle">0</ThemedText>
                        <ThemedText style={styles.statLabel}>My Listings</ThemedText>
                    </View>
                    <View style={[styles.statBox, { borderLeftWidth: 1, borderRightWidth: 1, borderColor: colors.border }]}>
                        <ThemedText type="subtitle">0</ThemedText>
                        <ThemedText style={styles.statLabel}>Saved</ThemedText>
                    </View>
                    <View style={styles.statBox}>
                        <ThemedText type="subtitle">0</ThemedText>
                        <ThemedText style={styles.statLabel}>Views</ThemedText>
                    </View>
                </View>

                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Account & Preferences</ThemedText>
                    <Pressable style={[styles.menuItem, { borderBottomColor: colors.border }]}>
                        <View style={styles.menuItemLeft}>
                            <IconSymbol name="bell.fill" size={22} color={colors.icon} />
                            <ThemedText style={styles.menuItemText}>Notifications</ThemedText>
                        </View>
                        <IconSymbol name="chevron.right" size={20} color={colors.icon} />
                    </Pressable>
                    <Pressable style={[styles.menuItem, { borderBottomColor: colors.border }]}>
                        <View style={styles.menuItemLeft}>
                            <IconSymbol name="globe" size={22} color={colors.icon} />
                            <ThemedText style={styles.menuItemText}>Language</ThemedText>
                        </View>
                        <IconSymbol name="chevron.right" size={20} color={colors.icon} />
                    </Pressable>
                </View>

                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Support & Feedback</ThemedText>
                    <Pressable style={[styles.menuItem, { borderBottomColor: colors.border }]}>
                        <View style={styles.menuItemLeft}>
                            <IconSymbol name="questionmark.circle" size={22} color={colors.icon} />
                            <ThemedText style={styles.menuItemText}>Help Center / FAQ</ThemedText>
                        </View>
                        <IconSymbol name="chevron.right" size={20} color={colors.icon} />
                    </Pressable>
                    <Pressable style={[styles.menuItem, { borderBottomColor: colors.border }]}>
                        <View style={styles.menuItemLeft}>
                            <IconSymbol name="envelope" size={22} color={colors.icon} />
                            <ThemedText style={styles.menuItemText}>Contact Us</ThemedText>
                        </View>
                        <IconSymbol name="chevron.right" size={20} color={colors.icon} />
                    </Pressable>
                    <Pressable style={[styles.menuItem, { borderBottomColor: colors.border }]}>
                        <View style={styles.menuItemLeft}>
                            <IconSymbol name="star" size={22} color={colors.icon} />
                            <ThemedText style={styles.menuItemText}>Rate Us</ThemedText>
                        </View>
                        <IconSymbol name="chevron.right" size={20} color={colors.icon} />
                    </Pressable>
                </View>

                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Information & Legal</ThemedText>
                    <Pressable style={[styles.menuItem, { borderBottomColor: colors.border }]}>
                        <View style={styles.menuItemLeft}>
                            <IconSymbol name="info.circle" size={22} color={colors.icon} />
                            <ThemedText style={styles.menuItemText}>About Us</ThemedText>
                        </View>
                        <IconSymbol name="chevron.right" size={20} color={colors.icon} />
                    </Pressable>
                    <Pressable style={[styles.menuItem, { borderBottomColor: colors.border }]}>
                        <View style={styles.menuItemLeft}>
                            <IconSymbol name="doc.text" size={22} color={colors.icon} />
                            <ThemedText style={styles.menuItemText}>Terms & Conditions</ThemedText>
                        </View>
                        <IconSymbol name="chevron.right" size={20} color={colors.icon} />
                    </Pressable>
                    <Pressable style={[styles.menuItem, { borderBottomColor: colors.border }]}>
                        <View style={styles.menuItemLeft}>
                            <IconSymbol name="lock" size={22} color={colors.icon} />
                            <ThemedText style={styles.menuItemText}>Privacy Policy</ThemedText>
                        </View>
                        <IconSymbol name="chevron.right" size={20} color={colors.icon} />
                    </Pressable>
                    <Pressable style={[styles.menuItem, { borderBottomColor: colors.border }]}>
                        <View style={styles.menuItemLeft}>
                            <IconSymbol name="banknote" size={22} color={colors.icon} />
                            <ThemedText style={styles.menuItemText}>Refund Policy</ThemedText>
                        </View>
                        <IconSymbol name="chevron.right" size={20} color={colors.icon} />
                    </Pressable>
                </View>

                <View style={[styles.section, { marginBottom: 40 }]}>
                    <ThemedText style={styles.sectionTitle}>Account Actions</ThemedText>
                    <Pressable style={[styles.menuItem, { borderBottomColor: colors.border }]} onPress={handleLogoutClick}>
                        <View style={styles.menuItemLeft}>
                            <IconSymbol name="rectangle.portrait.and.arrow.right" size={22} color="#000000" />
                            <ThemedText style={styles.menuItemText}>Logout</ThemedText>
                        </View>
                    </Pressable>
                    <Pressable
                        style={[styles.menuItem, { borderBottomColor: 'transparent' }]}
                        onPress={handleDeleteClick}
                    >
                        <View style={styles.menuItemLeft}>
                            <IconSymbol name="trash.fill" size={22} color="#EF4444" />
                            <ThemedText style={[styles.menuItemText, { color: '#EF4444' }]}>Permanent Delete</ThemedText>
                        </View>
                    </Pressable>
                </View>

                <Modal
                    visible={showLogoutConfirm}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setShowLogoutConfirm(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={[styles.confirmCard, { backgroundColor: colors.background }]}>
                            <ThemedText style={styles.confirmTitle}>Logout</ThemedText>
                            <ThemedText style={styles.confirmSubTitle}>Are you sure you want to logout from MAHTO?</ThemedText>

                            <View style={styles.confirmActions}>
                                <Pressable
                                    style={[styles.confirmButton, styles.noButton, { borderColor: colors.border }]}
                                    onPress={() => setShowLogoutConfirm(false)}
                                >
                                    <ThemedText style={styles.noText}>No</ThemedText>
                                </Pressable>
                                <Pressable
                                    style={[styles.confirmButton, styles.yesButton, { backgroundColor: '#000000' }]}
                                    onPress={confirmLogout}
                                >
                                    <ThemedText style={styles.yesText}>Yes</ThemedText>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>

                <Modal
                    visible={showDeleteConfirm}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setShowDeleteConfirm(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={[styles.confirmCard, { backgroundColor: colors.background }]}>
                            <ThemedText style={[styles.confirmTitle, { color: '#EF4444' }]}>Delete Account</ThemedText>
                            <ThemedText style={styles.confirmSubTitle}>Please enter your details to confirm permanent deletion.</ThemedText>

                            <View style={styles.deleteForm}>
                                <TextInput
                                    style={[styles.deleteInput, { borderColor: colors.border, color: colors.text }]}
                                    placeholder="Phone Number"
                                    placeholderTextColor={colors.icon}
                                    value={confirmPhone}
                                    onChangeText={setConfirmPhone}
                                    keyboardType="phone-pad"
                                />
                                <TextInput
                                    style={[styles.deleteInput, { borderColor: colors.border, color: colors.text }]}
                                    placeholder="Password"
                                    placeholderTextColor={colors.icon}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry
                                />
                            </View>

                            <View style={styles.confirmActions}>
                                <Pressable
                                    style={[styles.confirmButton, styles.noButton, { borderColor: colors.border }]}
                                    onPress={() => setShowDeleteConfirm(false)}
                                >
                                    <ThemedText style={styles.noText}>Cancel</ThemedText>
                                </Pressable>
                                <Pressable
                                    style={[styles.confirmButton, { backgroundColor: '#EF4444', borderColor: '#EF4444' }]}
                                    onPress={confirmDelete}
                                >
                                    <ThemedText style={styles.yesText}>Delete Forever</ThemedText>
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
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    confirmCard: {
        width: '100%',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    confirmTitle: {
        fontSize: 24,
        fontWeight: '800',
        marginBottom: 8,
    },
    confirmSubTitle: {
        fontSize: 16,
        textAlign: 'center',
        opacity: 0.6,
        marginBottom: 24,
    },
    confirmActions: {
        flexDirection: 'row',
        width: '100%',
        gap: 12,
    },
    confirmButton: {
        flex: 1,
        height: 52,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    noButton: {
        backgroundColor: 'transparent',
    },
    yesButton: {
        // backgroundColor handled in component
    },
    noText: {
        fontSize: 16,
        fontWeight: '700',
    },
    yesText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    deleteForm: {
        width: '100%',
        marginBottom: 20,
    },
    deleteInput: {
        height: 52,
        backgroundColor: '#F6F6F6',
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        marginBottom: 12,
        borderWidth: 0,
    },
});
