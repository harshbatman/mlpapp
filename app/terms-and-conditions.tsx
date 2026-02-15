import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';

export default function TermsAndConditionsScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme as 'light' | 'dark'];

    const sections = [
        {
            title: "1. Acceptance of Terms",
            content: "By accessing or using the MAHTO Land & Properties application, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use the application."
        },
        {
            title: "2. Description of Service",
            content: "MAHTO Land & Properties is a property listing and discovery platform. We provide a marketplace for users to list properties for rent or sale and for others to browse these listings. We do not own, sell, or lease any of the properties listed on the platform."
        },
        {
            title: "3. User Accounts",
            content: "To use certain features, you must register for an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate and complete information during registration."
        },
        {
            title: "4. Property Listings",
            content: "Users listing properties are solely responsible for the accuracy and legality of their listings. MAHTO Land & Properties reserves the right to remove any listing that violates our policies or is deemed inappropriate, without prior notice."
        },
        {
            title: "5. Prohibited Conduct",
            content: "You agree not to use the application for any unlawful purpose or in any way that could damage, disable, or impair the service. This includes, but is not limited to, posting fraudulent listings, harassing other users, or attempting to gain unauthorized access to our systems."
        },
        {
            title: "6. Intellectual Property",
            content: "The content, features, and functionality of the MAHTO Land & Properties application are owned by us and protected by copyright, trademark, and other intellectual property laws. You may not use our brand or content without explicit permission."
        },
        {
            title: "7. Limitation of Liability",
            content: "MAHTO Land & Properties is provided 'as is' without warranties of any kind. We are not liable for any damages arising from your use of the application, including interactions with other users or the accuracy of property listings."
        },
        {
            title: "8. Changes to Terms",
            content: "We reserve the right to modify these terms at any time. We will notify users of any significant changes. Your continued use of the application after such changes constitutes acceptance of the new terms."
        },
        {
            title: "9. Termination",
            content: "We may terminate or suspend your account and access to the application at our sole discretion, without notice, for conduct that we believe violates these terms or is harmful to other users."
        },
        {
            title: "10. Governing Law",
            content: "These terms are governed by and construed in accordance with the laws of the jurisdiction in which we operate, without regard to its conflict of law principles."
        }
    ];

    return (
        <ThemedView style={styles.container}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <IconSymbol name="chevron.left" size={24} color={colors.text} />
                </Pressable>
                <ThemedText type="subtitle" style={styles.headerTitle}>Terms & Conditions</ThemedText>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.topSection}>
                    <ThemedText type="title" style={styles.mainTitle}>User Agreement</ThemedText>
                    <ThemedText style={styles.lastUpdated}>Last Updated: February 15, 2026</ThemedText>
                    <ThemedText style={styles.introText}>
                        Please read these terms and conditions carefully before using the MAHTO Land & Properties mobile application operated by our team.
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
                        If you have any questions about these Terms, please contact us at support@mahto.com
                    </ThemedText>
                </View>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 60,
    },
    topSection: {
        paddingVertical: 30,
    },
    mainTitle: {
        fontSize: 32,
        fontWeight: '800',
        marginBottom: 8,
        letterSpacing: -1,
    },
    lastUpdated: {
        fontSize: 14,
        opacity: 0.5,
        marginBottom: 20,
    },
    introText: {
        fontSize: 16,
        lineHeight: 24,
        opacity: 0.8,
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 10,
        color: '#000',
    },
    sectionContent: {
        fontSize: 15,
        lineHeight: 22,
        opacity: 0.7,
    },
    footer: {
        marginTop: 20,
        paddingTop: 30,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
    },
    footerText: {
        fontSize: 14,
        textAlign: 'center',
        opacity: 0.5,
        fontStyle: 'italic',
    },
});
