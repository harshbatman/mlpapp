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
                <ThemedText type="title" style={styles.headerTitle}>{t('Select Language')}</ThemedText>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.heroSection}>
                    <ThemedText style={styles.heroSubtitle}>{t('Choose Language Pref')}</ThemedText>
                </View>

                <View style={styles.listContainer}>
                    {LANGUAGES.map((lang, index) => {
                        const isSelected = i18n.language === lang.code;
                        return (
                            <Pressable
                                key={lang.code}
                                style={[
                                    styles.item,
                                    isSelected && { backgroundColor: colors.tint + '10', borderColor: colors.tint },
                                    index === 0 && styles.firstItem,
                                    index === LANGUAGES.length - 1 && styles.lastItem
                                ]}
                                onPress={() => handleLanguageChange(lang.code)}
                            >
                                <View style={styles.itemContent}>
                                    <View style={[styles.avatar, { backgroundColor: isSelected ? colors.tint : (colorScheme === 'light' ? '#F0F0F0' : '#2C2C2E') }]}>
                                        <ThemedText style={[styles.avatarText, { color: isSelected ? '#FFF' : colors.text }]}>
                                            {lang.nativeName.charAt(0)}
                                        </ThemedText>
                                    </View>
                                    <View style={styles.textContainer}>
                                        <ThemedText style={[styles.nativeName, isSelected && { color: colors.tint }]}>
                                            {lang.nativeName}
                                        </ThemedText>
                                        <ThemedText style={styles.englishName}>{lang.name}</ThemedText>
                                    </View>
                                </View>
                                {isSelected && (
                                    <IconSymbol name="checkmark.circle.fill" size={24} color={colors.tint} />
                                )}
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
        paddingBottom: 15,
        paddingHorizontal: 20,
    },
    backButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 22,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    heroSection: {
        paddingHorizontal: 24,
        marginBottom: 20,
    },
    heroSubtitle: {
        fontSize: 16,
        opacity: 0.5,
        lineHeight: 22,
        fontWeight: '500',
    },
    listContainer: {
        marginHorizontal: 16,
        backgroundColor: Platform.OS === 'ios' ? 'transparent' : 'rgba(0,0,0,0.02)',
        borderRadius: 20,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#FFFFFF10',
        marginBottom: 8,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    firstItem: {
        // can add specific styling
    },
    lastItem: {
        marginBottom: 0,
    },
    itemContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    textContainer: {
        justifyContent: 'center',
    },
    nativeName: {
        fontSize: 18,
        fontWeight: '700',
    },
    englishName: {
        fontSize: 14,
        opacity: 0.5,
        marginTop: 2,
    }
});
