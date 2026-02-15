import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';

export default function PrivacyPolicyScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme as 'light' | 'dark'];

    const sections = [
        {
            title: "1. Information We Collect",
            content: "We collect information you provide directly to us when you create an account, list a property, or communicate with us. This includes your name, email address, phone number, and property details."
        },
        {
            title: "2. How We Use Your Information",
            content: "We use the information we collect to provide, maintain, and improve our services, to process transactions, to send you technical notices, and to communicate with you about products and services."
        },
        {
            title: "3. Sharing of Information",
            content: "We do not share your personal information with third parties except as described in this policy. We may share information with property seekers/owners to facilitate transactions you initiate."
        },
        {
            title: "4. Data Security",
            content: "We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction."
        },
        {
            title: "5. Your Choices",
            content: "You may update, correct, or delete your account information at any time by logging into your account or contacting us. You can also opt-out of receiving promotional communications."
        },
        {
            title: "6. Cookies and Tracking",
            content: "We use cookies and similar tracking technologies to track the activity on our service and hold certain information to improve your user experience."
        },
        {
            title: "7. Changes to this Policy",
            content: "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the 'Last Updated' date."
        }
    ];

    return (
        <ThemedView style={styles.container}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <Pressable
                    onPress={() => {
                        if (router.canGoBack()) {
                            router.back();
                        } else {
                            router.replace('/(tabs)/profile');
                        }
                    }}
                    style={styles.backButton}
                >
                    <IconSymbol name="chevron.left" size={24} color={colors.text} />
                </Pressable>
                <ThemedText type="subtitle" style={styles.headerTitle}>Privacy Policy</ThemedText>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.topSection}>
                    <ThemedText type="title" style={styles.mainTitle}>Your Privacy</ThemedText>
                    <ThemedText style={styles.lastUpdated}>Last Updated: February 15, 2026</ThemedText>
                    <ThemedText style={styles.introText}>
                        At MAHTO Land & Properties, we respect your privacy and are committed to protecting your personal data. This policy explains how we handle your information.
                    </ThemedText>
                </View>

                {sections.map((section, index) => (
                    <View key={index} style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>{section.title}</ThemedText>
                        <ThemedText style={styles.sectionContent}>{section.content}</ThemedText>
                    </View>
                ))}

                <View style={styles.footer}>
                    <ThemedText style={styles.footerText}>
                        For privacy-related inquiries, contact privacy@mahto.com
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
    topSection: { paddingVertical: 30 },
    mainTitle: { fontSize: 32, fontWeight: '800', marginBottom: 8 },
    lastUpdated: { fontSize: 14, opacity: 0.5, marginBottom: 20 },
    introText: { fontSize: 16, lineHeight: 24, opacity: 0.8 },
    section: { marginBottom: 25 },
    sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 10 },
    sectionContent: { fontSize: 15, lineHeight: 22, opacity: 0.7 },
    footer: { marginTop: 20, paddingTop: 30, borderTopWidth: 1, borderTopColor: '#EEEEEE' },
    footerText: { fontSize: 14, textAlign: 'center', opacity: 0.5 },
});
