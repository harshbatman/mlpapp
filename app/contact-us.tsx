import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import React from 'react';
import { Linking, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';

export default function ContactUsScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme as 'light' | 'dark'];

    const handleEmail = (email: string) => {
        Linking.openURL(`mailto:${email}`);
    };

    return (
        <ThemedView style={styles.container}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <IconSymbol name="chevron.left" size={24} color={colors.text} />
                </Pressable>
                <ThemedText type="subtitle" style={styles.headerTitle}>Contact Us</ThemedText>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.topSection}>
                    <ThemedText type="title" style={styles.mainTitle}>Get in Touch</ThemedText>
                    <ThemedText style={styles.introText}>
                        Have questions or need assistance? Reach out to our dedicated teams.
                    </ThemedText>
                </View>

                <View style={styles.cardsContainer}>
                    {/* Support Card */}
                    <Pressable
                        style={[styles.card, { backgroundColor: colorScheme === 'light' ? '#F0F7FF' : '#1A2634' }]}
                        onPress={() => handleEmail('support@mahtoji.tech')}
                    >
                        <View style={[styles.iconWrapper, { backgroundColor: '#007AFF20' }]}>
                            <IconSymbol name="envelope.fill" size={28} color="#007AFF" />
                        </View>
                        <View style={styles.cardInfo}>
                            <ThemedText style={styles.cardTitle}>Support Team</ThemedText>
                            <ThemedText style={styles.cardDescription}>For app-related queries, property listing help, or technical support.</ThemedText>
                            <ThemedText style={styles.cardEmail}>support@mahtoji.tech</ThemedText>
                        </View>
                        <View style={styles.arrowWrapper}>
                            <IconSymbol name="chevron.right" size={20} color={colors.icon} />
                        </View>
                    </Pressable>

                    {/* CEO Card */}
                    <Pressable
                        style={[styles.card, { backgroundColor: colorScheme === 'light' ? '#F5EBFF' : '#2D1A3B' }]}
                        onPress={() => handleEmail('harshkumarceo@mahtoji.tech')}
                    >
                        <View style={[styles.iconWrapper, { backgroundColor: '#A855F720' }]}>
                            <IconSymbol name="crown.fill" size={28} color="#A855F7" />
                        </View>
                        <View style={styles.cardInfo}>
                            <ThemedText style={styles.cardTitle}>CEO Office</ThemedText>
                            <ThemedText style={styles.cardDescription}>For business partnerships, major concerns, or direct feedback to leadership.</ThemedText>
                            <ThemedText style={styles.cardEmail}>harshkumarceo@mahtoji.tech</ThemedText>
                        </View>
                        <View style={styles.arrowWrapper}>
                            <IconSymbol name="chevron.right" size={20} color={colors.icon} />
                        </View>
                    </Pressable>
                </View>

                <View style={styles.footer}>
                    <ThemedText style={styles.footerText}>
                        MAHTO Land & Properties
                    </ThemedText>
                </View>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
    },
    backButton: { width: 40, height: 40, justifyContent: 'center' },
    headerTitle: { fontSize: 18, fontWeight: '700' },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 60 },
    topSection: { paddingVertical: 32 },
    mainTitle: { fontSize: 34, fontWeight: '800', marginBottom: 12, letterSpacing: -1 },
    introText: { fontSize: 16, lineHeight: 24, opacity: 0.6 },
    cardsContainer: { gap: 16 },
    card: {
        flexDirection: 'row',
        padding: 20,
        borderRadius: 24,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    iconWrapper: {
        width: 56,
        height: 56,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardInfo: { flex: 1, marginLeft: 16 },
    cardTitle: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
    cardDescription: { fontSize: 13, opacity: 0.6, marginBottom: 8, lineHeight: 18 },
    cardEmail: { fontSize: 15, fontWeight: '600', color: '#007AFF' },
    arrowWrapper: { opacity: 0.3 },
    footer: { marginTop: 40, alignItems: 'center' },
    footerLabel: { fontSize: 14, fontWeight: '600', opacity: 0.4, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 },
    socialRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
    socialIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: { fontSize: 14, opacity: 0.4, fontWeight: '500' },
});
