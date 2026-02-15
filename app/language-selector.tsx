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
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <IconSymbol name="chevron.left" size={24} color={colors.text} />
                </Pressable>
                <ThemedText type="subtitle" style={styles.headerTitle}>{t('Language')}</ThemedText>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.section}>
                    {LANGUAGES.map((lang) => (
                        <Pressable
                            key={lang.code}
                            style={[
                                styles.langItem,
                                { borderBottomColor: colors.border },
                                i18n.language === lang.code && { backgroundColor: colors.tint + '10' }
                            ]}
                            onPress={() => handleLanguageChange(lang.code)}
                        >
                            <View style={styles.langInfo}>
                                <ThemedText style={styles.langNativeName}>{lang.nativeName}</ThemedText>
                                <ThemedText style={styles.langName}>{lang.name}</ThemedText>
                            </View>
                            {i18n.language === lang.code && (
                                <IconSymbol name="checkmark.circle.fill" size={24} color={colors.tint} />
                            )}
                        </Pressable>
                    ))}
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
    scrollContent: { paddingBottom: 40 },
    section: {
        paddingTop: 10,
    },
    langItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
    },
    langInfo: {
        flex: 1,
    },
    langNativeName: {
        fontSize: 18,
        fontWeight: '600',
    },
    langName: {
        fontSize: 14,
        opacity: 0.5,
        marginTop: 2,
    }
});
