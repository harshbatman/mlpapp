import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';

export default function AboutScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme as 'light' | 'dark'];

    const ecosystem = [
        {
            id: 1,
            title: 'MAHTO Marketplace',
            desc: 'Worker, Contractor & Shops Marketplace',
            icon: 'cart.fill',
            color: '#FF9500'
        },
        {
            id: 2,
            title: 'Mine (by MAHTO)',
            desc: 'Full-stack Construction & Renovation Services',
            icon: 'hammer.fill',
            color: '#FF3B30'
        },
        {
            id: 3,
            title: 'MAHTO Home Loans',
            desc: 'Home Loans Marketplace',
            icon: 'banknote.fill',
            color: '#34C759'
        },
        {
            id: 4,
            title: 'MAHTO Land & Properties',
            desc: 'Land & Property Listings',
            icon: 'house.fill',
            color: '#007AFF'
        }
    ];

    return (
        <ThemedView style={styles.container}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <IconSymbol name="chevron.left" size={24} color={colors.text} />
                </Pressable>
                <ThemedText type="subtitle" style={styles.headerTitle}>About MAHTO</ThemedText>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.heroSection}>
                    <ThemedText style={styles.brandTag}>BUILDING THE FUTURE</ThemedText>
                    <ThemedText type="title" style={styles.mainTitle}>Home Building OS</ThemedText>
                    <ThemedText style={styles.heroDescription}>
                        MAHTO is the operating system for home building. We are building one unified system that brings together everything required to build a home.
                    </ThemedText>
                </View>

                <View style={[styles.manifestoCard, { backgroundColor: colorScheme === 'light' ? '#F9F9F9' : '#1C1C1E' }]}>
                    <ThemedText style={styles.manifestoText}>
                        Today, building a home means dealing with fragmented vendors, contractors, workers, and middlemen.
                        {"\n\n"}
                        <ThemedText style={{ fontWeight: '700', color: colors.tint }}>MAHTO simplifies this entire journey</ThemedText> into a single, integrated platform — end to end.
                    </ThemedText>
                </View>

                <View style={styles.section}>
                    <ThemedText style={styles.sectionLabel}>WHAT WE'RE BUILDING</ThemedText>
                    <ThemedText type="subtitle" style={styles.sectionTitle}>MAHTO Ecosystem</ThemedText>

                    <View style={styles.grid}>
                        {ecosystem.map((item) => (
                            <View key={item.id} style={[styles.ecoCard, { backgroundColor: colorScheme === 'light' ? '#FFFFFF' : '#2C2C2E', borderColor: colors.border }]}>
                                <View style={[styles.iconBox, { backgroundColor: `${item.color}15` }]}>
                                    <IconSymbol name={item.icon as any} size={24} color={item.color} />
                                </View>
                                <ThemedText style={styles.ecoTitle}>{item.title}</ThemedText>
                                <ThemedText style={styles.ecoDesc}>{item.desc}</ThemedText>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={[styles.highlightSection, { backgroundColor: colors.tint + '10' }]}>
                    <View style={styles.quoteLine} />
                    <ThemedText style={styles.highlightText}>
                        "Full-stack" at MAHTO means from <ThemedText style={{ fontWeight: '800' }}>land to lending</ThemedText> — not just design to construction.
                    </ThemedText>
                </View>

                <View style={styles.visionMissionRow}>
                    <View style={styles.vmCard}>
                        <ThemedText style={styles.vmLabel}>OUR MISSION</ThemedText>
                        <ThemedText style={styles.vmTitle}>"Sabka sar apni chhaat."</ThemedText>
                        <ThemedText style={styles.vmDesc}>A roof over every head — not a roof, but own roof.</ThemedText>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.vmCard}>
                        <ThemedText style={styles.vmLabel}>OUR VISION</ThemedText>
                        <ThemedText style={styles.vmTitle}>Global OS</ThemedText>
                        <ThemedText style={styles.vmDesc}>To raise living standards by becoming the global operating system for home building.</ThemedText>
                    </View>
                </View>

                <View style={styles.footer}>
                    <ThemedText style={styles.footerBrand}>MAHTO</ThemedText>
                    <ThemedText style={styles.footerVersion}>Version 1.0.0</ThemedText>
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
    scrollContent: { paddingBottom: 60 },
    heroSection: {
        paddingHorizontal: 24,
        paddingVertical: 40,
        alignItems: 'center',
    },
    brandTag: {
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 2,
        color: '#8E8E93',
        marginBottom: 8,
    },
    mainTitle: {
        fontSize: 40,
        fontWeight: '900',
        textAlign: 'center',
        letterSpacing: -1,
        lineHeight: 44,
    },
    heroDescription: {
        fontSize: 17,
        textAlign: 'center',
        lineHeight: 24,
        opacity: 0.6,
        marginTop: 16,
    },
    manifestoCard: {
        marginHorizontal: 24,
        padding: 24,
        borderRadius: 32,
        marginBottom: 40,
    },
    manifestoText: {
        fontSize: 18,
        lineHeight: 28,
        textAlign: 'center',
        fontWeight: '500',
    },
    section: {
        paddingHorizontal: 24,
        marginBottom: 40,
    },
    sectionLabel: {
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 1.5,
        color: '#8E8E93',
        marginBottom: 4,
    },
    sectionTitle: {
        fontSize: 28,
        fontWeight: '800',
        marginBottom: 20,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    ecoCard: {
        width: '48%',
        padding: 20,
        borderRadius: 24,
        borderWidth: 1,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    ecoTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 6,
    },
    ecoDesc: {
        fontSize: 12,
        lineHeight: 16,
        opacity: 0.5,
        fontWeight: '500',
    },
    highlightSection: {
        marginHorizontal: 24,
        padding: 24,
        borderRadius: 24,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 40,
    },
    quoteLine: {
        width: 4,
        height: '100%',
        backgroundColor: '#000',
        borderRadius: 2,
        marginRight: 16,
    },
    highlightText: {
        flex: 1,
        fontSize: 17,
        lineHeight: 24,
    },
    visionMissionRow: {
        paddingHorizontal: 24,
        marginBottom: 60,
    },
    vmCard: {
        paddingVertical: 20,
    },
    vmLabel: {
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 1,
        color: '#8E8E93',
        marginBottom: 8,
    },
    vmTitle: {
        fontSize: 24,
        fontWeight: '800',
        marginBottom: 4,
    },
    vmDesc: {
        fontSize: 15,
        lineHeight: 22,
        opacity: 0.6,
    },
    divider: {
        height: 1,
        backgroundColor: '#EEEEEE',
        marginVertical: 10,
    },
    footer: {
        alignItems: 'center',
        paddingBottom: 40,
    },
    footerBrand: {
        fontSize: 24,
        fontWeight: '900',
        letterSpacing: 4,
        opacity: 0.1,
    },
    footerVersion: {
        fontSize: 12,
        opacity: 0.3,
        marginTop: 4,
    }
});
