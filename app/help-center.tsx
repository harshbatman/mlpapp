import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { LayoutAnimation, Linking, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';

const FAQ_DATA = [
    {
        question: "How do I list my property?",
        answer: "To list a property, navigate to the 'Add' tab in the bottom menu. Fill in the details including title, price, location, and photos, then hit submit."
    },
    {
        question: "Is there a fee for listing?",
        answer: "MAHTO Land & Properties offers both free and premium listing options. Check our Refund Policy for details on paid listings."
    },
    {
        question: "How do I edit my profile?",
        answer: "Go to the 'Profile' tab and tap the 'Edit Profile' button near your name. You can update your name, email, and profile picture there."
    },
    {
        question: "What should I do if I find a fraudulent listing?",
        answer: "Please report it immediately to our support team at support@mahtoji.tech with the listing ID or link."
    }
];

export default function HelpCenterScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme as 'light' | 'dark'];
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const toggleExpand = (index: number) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    const handleEmail = (email: string, subject: string = '') => {
        const url = `mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;
        Linking.openURL(url);
    };

    return (
        <ThemedView style={styles.container}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <IconSymbol name="chevron.left" size={24} color={colors.text} />
                </Pressable>
                <ThemedText type="subtitle" style={styles.headerTitle}>Help Center / FAQ</ThemedText>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.topSection}>
                    <ThemedText type="title" style={styles.mainTitle}>How can we help?</ThemedText>
                    <ThemedText style={styles.introText}>
                        Find answers to frequently asked questions or get in touch with our team.
                    </ThemedText>
                </View>

                {/* Support Notice Card */}
                <View style={[styles.noticeCard, { backgroundColor: colorScheme === 'light' ? '#F0F9FF' : '#1E293B' }]}>
                    <View style={styles.noticeHeader}>
                        <IconSymbol name="info.circle" size={20} color="#0EA5E9" />
                        <ThemedText style={styles.noticeTitle}>Reporting an Issue?</ThemedText>
                    </View>
                    <ThemedText style={styles.noticeText}>
                        For faster resolution, please <ThemedText style={{ fontWeight: '700' }}>attach a screenshot</ThemedText> of the issue you are facing.
                    </ThemedText>
                    <View style={styles.timeBadge}>
                        <IconSymbol name="paperplane.fill" size={12} color="#0EA5E9" />
                        <ThemedText style={styles.timeText}>Typical response time: 24-48 hrs</ThemedText>
                    </View>
                </View>

                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Frequently Asked Questions</ThemedText>
                    {FAQ_DATA.map((item, index) => (
                        <Pressable
                            key={index}
                            style={[styles.faqItem, { borderBottomColor: colors.border }]}
                            onPress={() => toggleExpand(index)}
                        >
                            <View style={styles.faqHeader}>
                                <ThemedText style={styles.faqQuestion}>{item.question}</ThemedText>
                                <IconSymbol
                                    name={expandedIndex === index ? "chevron.left" : "chevron.right"}
                                    size={20}
                                    color={colors.icon}
                                    style={{ transform: [{ rotate: expandedIndex === index ? '90deg' : '0deg' }] }}
                                />
                            </View>
                            {expandedIndex === index && (
                                <View style={styles.faqAnswerContainer}>
                                    <ThemedText style={styles.faqAnswer}>{item.answer}</ThemedText>
                                </View>
                            )}
                        </Pressable>
                    ))}
                </View>

                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Feature Request</ThemedText>
                    <Pressable
                        style={[styles.stylishCard, { backgroundColor: colorScheme === 'light' ? '#FFFBEB' : '#453015' }]}
                        onPress={() => handleEmail('support@mahtoji.tech', 'Feature Request - MAHTO Land & Properties')}
                    >
                        <View style={[styles.iconWrapper, { backgroundColor: '#F59E0B20' }]}>
                            <IconSymbol name="lightbulb.fill" size={24} color="#F59E0B" />
                        </View>
                        <View style={styles.cardInfo}>
                            <ThemedText style={styles.cardTitle}>Suggest a Feature</ThemedText>
                            <ThemedText style={styles.cardDescription}>Have an idea to make MAHTO Land & Properties better? We'd love to hear it!</ThemedText>
                        </View>
                        <IconSymbol name="chevron.right" size={20} color={colors.icon} style={{ opacity: 0.3 }} />
                    </Pressable>
                </View>

                <View style={[styles.contactSection, { marginTop: 32 }]}>
                    <ThemedText style={styles.sectionTitle}>Still need help?</ThemedText>
                    <View style={styles.contactGrid}>
                        {/* Support Card */}
                        <Pressable
                            style={[styles.stylishCard, { backgroundColor: colorScheme === 'light' ? '#F0F7FF' : '#1A2634' }]}
                            onPress={() => handleEmail('support@mahtoji.tech')}
                        >
                            <View style={[styles.iconWrapper, { backgroundColor: '#007AFF20' }]}>
                                <IconSymbol name="envelope.fill" size={24} color="#007AFF" />
                            </View>
                            <View style={styles.cardInfo}>
                                <ThemedText style={styles.cardTitle}>Support Team</ThemedText>
                                <ThemedText style={styles.cardEmail}>support@mahtoji.tech</ThemedText>
                            </View>
                            <IconSymbol name="chevron.right" size={20} color={colors.icon} style={{ opacity: 0.3 }} />
                        </Pressable>

                        {/* CEO Card */}
                        <Pressable
                            style={[styles.stylishCard, { backgroundColor: colorScheme === 'light' ? '#F5EBFF' : '#2D1A3B' }]}
                            onPress={() => handleEmail('harshkumarceo@mahtoji.tech')}
                        >
                            <View style={[styles.iconWrapper, { backgroundColor: '#A855F720' }]}>
                                <IconSymbol name="crown.fill" size={24} color="#A855F7" />
                            </View>
                            <View style={styles.cardInfo}>
                                <ThemedText style={styles.cardTitle}>CEO Office</ThemedText>
                                <ThemedText style={styles.cardEmail}>harshkumarceo@mahtoji.tech</ThemedText>
                            </View>
                            <IconSymbol name="chevron.right" size={20} color={colors.icon} style={{ opacity: 0.3 }} />
                        </Pressable>
                    </View>
                </View>

                <View style={styles.footer}>
                    <ThemedText style={styles.footerText}>MAHTO Land & Properties</ThemedText>
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
    noticeCard: {
        padding: 20,
        borderRadius: 20,
        marginBottom: 32,
    },
    noticeHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
    noticeTitle: { fontSize: 16, fontWeight: '700', color: '#0EA5E9' },
    noticeText: { fontSize: 14, lineHeight: 20, opacity: 0.8, marginBottom: 12 },
    timeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#0EA5E915',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8
    },
    timeText: { fontSize: 12, fontWeight: '600', color: '#0EA5E9' },
    section: { marginBottom: 32 },
    sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
    faqItem: { paddingVertical: 18, borderBottomWidth: 1 },
    faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    faqQuestion: { fontSize: 16, fontWeight: '600', flex: 1, marginRight: 16 },
    faqAnswerContainer: { marginTop: 12 },
    faqAnswer: { fontSize: 15, lineHeight: 22, opacity: 0.6 },
    contactSection: { marginBottom: 40 },
    contactGrid: { gap: 12 },
    stylishCard: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 20,
        alignItems: 'center',
    },
    iconWrapper: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardInfo: { flex: 1, marginLeft: 12 },
    cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
    cardDescription: { fontSize: 13, opacity: 0.5, lineHeight: 18 },
    cardEmail: { fontSize: 13, fontWeight: '600', color: '#007AFF', opacity: 0.8 },
    footer: { marginTop: 20, alignItems: 'center' },
    footerText: { fontSize: 14, opacity: 0.3, fontWeight: '600' },
});
