import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';

const LANGUAGES = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
    { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
    { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
    { code: 'ne', name: 'Nepali', nativeName: 'नेपाली' },
    { code: 'bho', name: 'Bhojpuri', nativeName: 'भोजपुरी' },
    { code: 'har', name: 'Haryanvi', nativeName: 'हरियाणवी' },
    { code: 'raj', name: 'Rajasthani', nativeName: 'राजस्थानी' },
    { code: 'mai', name: 'Maithili', nativeName: 'मैथिली' },
    { code: 'ks', name: 'Kashmiri', nativeName: 'کٲشُر / कश्मीरी' }
];

export default function LanguageSelectorScreen() {
    const router = useRouter();
    const { i18n, t } = useTranslation();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme as 'light' | 'dark'];

    const handleLanguageChange = async (code: string) => {
        try {
            await i18n.changeLanguage(code);
            await AsyncStorage.setItem('user-language', code);
            router.back();
        } catch (error) {
            console.error('Failed to change language:', error);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <IconSymbol name="chevron.left" size={28} color={colors.text} />
                </Pressable>
                <ThemedText type="title" style={styles.headerTitle}>Language</ThemedText>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.heroSection}>
                    <View style={[styles.glow, { backgroundColor: colors.tint + '10' }]} />
                    <ThemedText style={styles.heroTitle}>Choose your language</ThemedText>
                    <ThemedText style={styles.heroSubtitle}>Select the language that helps you build better with MAHTO.</ThemedText>
                </View>

                <View style={styles.grid}>
                    {LANGUAGES.map((lang) => {
                        const isSelected = i18n.language === lang.code;
                        return (
                            <Pressable
                                key={lang.code}
                                style={[
                                    styles.card,
                                    {
                                        backgroundColor: isSelected ? colors.tint + '10' : (colorScheme === 'light' ? '#FFFFFF' : '#1C1C1E'),
                                        borderColor: isSelected ? colors.tint : (colorScheme === 'light' ? '#F0F0F0' : '#2C2C2E'),
                                    }
                                ]}
                                onPress={() => handleLanguageChange(lang.code)}
                            >
                                <View style={styles.cardHeader}>
                                    <View style={[styles.langInitialBox, { backgroundColor: isSelected ? colors.tint : (colorScheme === 'light' ? '#F5F5F5' : '#2C2C2E') }]}>
                                        <ThemedText style={[styles.langInitial, { color: isSelected ? '#FFFFFF' : colors.text }]}>
                                            {lang.nativeName.charAt(0)}
                                        </ThemedText>
                                    </View>
                                    {isSelected && (
                                        <IconSymbol name="checkmark.circle.fill" size={22} color={colors.tint} />
                                    )}
                                </View>

                                <View style={styles.cardInfo}>
                                    <ThemedText style={[styles.langNativeName, isSelected && { color: colors.tint }]}>
                                        {lang.nativeName}
                                    </ThemedText>
                                    <ThemedText style={styles.langName}>
                                        {lang.name}
                                    </ThemedText>
                                </View>
                            </Pressable>
                        );
                    })}
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
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    backButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.02)',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    heroSection: {
        paddingHorizontal: 24,
        marginBottom: 32,
        position: 'relative',
    },
    glow: {
        position: 'absolute',
        top: -40,
        left: -20,
        width: 150,
        height: 150,
        borderRadius: 75,
        filter: 'blur(40px)',
    },
    heroTitle: {
        fontSize: 32,
        fontWeight: '900',
        lineHeight: 38,
        letterSpacing: -1,
        marginBottom: 8,
    },
    heroSubtitle: {
        fontSize: 16,
        opacity: 0.6,
        lineHeight: 22,
        fontWeight: '500',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        gap: 12,
    },
    card: {
        width: '48%',
        padding: 16,
        borderRadius: 24,
        borderWidth: 2,
        // iOS Shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        // Android Shadow
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    langInitialBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    langInitial: {
        fontSize: 20,
        fontWeight: '700',
    },
    cardInfo: {
        marginTop: 4,
    },
    langNativeName: {
        fontSize: 17,
        fontWeight: '700',
        marginBottom: 2,
    },
    langName: {
        fontSize: 13,
        opacity: 0.5,
        fontWeight: '600',
    }
});
