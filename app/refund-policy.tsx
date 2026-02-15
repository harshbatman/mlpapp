import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';

export default function RefundPolicyScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme as 'light' | 'dark'];

    const sections = [
        {
            title: "1. Listing Fees",
            content: "Fees paid for property listings on MAHTO Land & Properties are generally non-refundable once the listing is live. We encourage users to review their listings carefully before payment."
        },
        {
            title: "2. Eligibility for Refunds",
            content: "Refunds may be considered in specific cases, such as technical errors where a payment was processed but the service was not rendered, or if a duplicate payment was made for the same service."
        },
        {
            title: "3. Refund Request Process",
            content: "To request a refund, please contact our support team at payments@mahto.com within 7 days of the transaction. You must provide the transaction ID and a detailed reason for the request."
        },
        {
            title: "4. Processing Time",
            content: "Approved refunds will be processed within 5-10 business days and credited back to the original payment method used during the transaction."
        },
        {
            title: "5. Subscription Cancellations",
            content: "If you have a recurring subscription, you can cancel it at any time. The cancellation will take effect at the end of the current billing cycle. No partial refunds are provided for the remaining period."
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
                <ThemedText type="subtitle" style={styles.headerTitle}>Refund Policy</ThemedText>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.topSection}>
                    <ThemedText type="title" style={styles.mainTitle}>Refunds & Returns</ThemedText>
                    <ThemedText style={styles.lastUpdated}>Last Updated: February 15, 2026</ThemedText>
                    <ThemedText style={styles.introText}>
                        Our goal is to ensure you are satisfied with our services at MAHTO Land & Properties. Please read our refund guidelines below.
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
                        For payment issues, contact payments@mahto.com
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
