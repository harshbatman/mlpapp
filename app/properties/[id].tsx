import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { auth, db } from '@/config/firebase';
import { Colors } from '@/constants/theme';
import { useChat } from '@/context/chat-context';
import { useNotification } from '@/context/notification-context';
import { useProfile } from '@/context/profile-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Dimensions, Image, Platform, Pressable, ScrollView, Share, StyleSheet, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function PropertyDetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { t } = useTranslation();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme as 'light' | 'dark'];
    const { showProfessionalError } = useNotification();
    const { startConversation } = useChat();
    const { profile } = useProfile();

    const [property, setProperty] = useState<any>(null);
    const [owner, setOwner] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    useEffect(() => {
        if (!id) return;

        const docRef = doc(db, 'properties', id as string);
        const unsubscribe = onSnapshot(docRef, async (docSnap) => {
            if (docSnap.exists()) {
                const data = { id: docSnap.id, ...docSnap.data() };
                setProperty(data);

                // Fetch owner details
                if (data.ownerId) {
                    const userSnap = await getDoc(doc(db, 'users', data.ownerId));
                    if (userSnap.exists()) {
                        setOwner(userSnap.data());
                    }
                }
            } else {
                showProfessionalError({ code: 'not-found', message: 'Property not found' });
                router.back();
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching property details:", error);
            showProfessionalError(error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [id]);

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out this property: ${property.title} for ₹${property.price} on MAHTO.`,
                url: `https://mahto.app/properties/${id}`,
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleContact = async () => {
        if (!auth.currentUser) {
            router.push('/(auth)/login');
            return;
        }

        if (auth.currentUser.uid === property.ownerId) {
            alert("This is your own property!");
            return;
        }

        try {
            const conversationId = await startConversation(property.ownerId, property.id, property.title);
            router.push(`/chat/${conversationId}`);
        } catch (error) {
            showProfessionalError(error, 'Chat Error');
        }
    };

    if (loading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.tint} />
            </View>
        );
    }

    if (!property) return null;

    return (
        <ThemedView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Image Slider */}
                <View style={styles.imageSection}>
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={(e) => {
                            const offset = e.nativeEvent.contentOffset.x;
                            setActiveImageIndex(Math.round(offset / width));
                        }}
                        scrollEventThrottle={16}
                    >
                        {property.images && property.images.length > 0 ? (
                            property.images.map((img: string, index: number) => (
                                <Image key={index} source={{ uri: img }} style={styles.propertyImage} />
                            ))
                        ) : (
                            <View style={[styles.imagePlaceholder, { backgroundColor: colors.secondary }]}>
                                <IconSymbol name="house.fill" size={80} color={colors.icon} />
                            </View>
                        )}
                    </ScrollView>

                    {/* Image Header Actions */}
                    <View style={styles.imageHeader}>
                        <Pressable onPress={() => router.back()} style={styles.iconBtn}>
                            <IconSymbol name="chevron.left" size={24} color="#000" />
                        </Pressable>
                        <View style={styles.headerRight}>
                            <Pressable onPress={handleShare} style={styles.iconBtn}>
                                <IconSymbol name="square.and.arrow.up" size={20} color="#000" />
                            </Pressable>
                            <Pressable style={styles.iconBtn}>
                                <IconSymbol name="heart" size={20} color="#000" />
                            </Pressable>
                        </View>
                    </View>

                    {/* Image Indicator */}
                    {property.images && property.images.length > 1 && (
                        <View style={styles.indicatorContainer}>
                            {property.images.map((_: any, i: number) => (
                                <View
                                    key={i}
                                    style={[
                                        styles.indicator,
                                        { backgroundColor: i === activeImageIndex ? '#FFF' : 'rgba(255,255,255,0.5)' }
                                    ]}
                                />
                            ))}
                        </View>
                    )}
                </View>

                {/* Content Section */}
                <View style={styles.content}>
                    <View style={styles.mainInfo}>
                        <View style={[styles.typeBadge, { backgroundColor: colors.tint }]}>
                            <ThemedText style={styles.typeBadgeText}>{t(property.listingType || 'Sale')}</ThemedText>
                        </View>
                        <ThemedText style={styles.title}>{property.title}</ThemedText>
                        <View style={styles.locationRow}>
                            <IconSymbol name="mappin.circle.fill" size={16} color="#8E8E93" />
                            <ThemedText style={styles.location}>{property.location}</ThemedText>
                        </View>
                    </View>

                    <View style={styles.priceContainer}>
                        <ThemedText style={styles.priceLabel}>{t('Asking Price')}</ThemedText>
                        <View style={styles.priceRow}>
                            <ThemedText style={styles.priceSymbol}>₹</ThemedText>
                            <ThemedText style={styles.priceValue}>{property.price}</ThemedText>
                        </View>
                    </View>

                    {/* Key Features */}
                    <View style={styles.featuresContainer}>
                        <View style={[styles.featureBox, { backgroundColor: colors.secondary }]}>
                            <IconSymbol name="square.dashed" size={20} color={colors.tint} />
                            <ThemedText style={styles.featureLabel}>{t('Area')}</ThemedText>
                            <ThemedText style={styles.featureValue}>{property.area || t('N/A')}</ThemedText>
                        </View>
                        <View style={[styles.featureBox, { backgroundColor: colors.secondary }]}>
                            <IconSymbol name="house.fill" size={20} color={colors.tint} />
                            <ThemedText style={styles.featureLabel}>{t('Type')}</ThemedText>
                            <ThemedText style={styles.featureValue}>{t(property.type || property.category || 'Home')}</ThemedText>
                        </View>
                    </View>

                    {/* Description */}
                    <View style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>{t('Description')}</ThemedText>
                        <ThemedText style={styles.description}>{property.description || t('No description provided.')}</ThemedText>
                    </View>

                    {/* Owner Info */}
                    <View style={[styles.ownerCard, { backgroundColor: colors.secondary }]}>
                        <View style={styles.ownerInfo}>
                            {owner?.image ? (
                                <Image source={{ uri: owner.image }} style={styles.ownerAvatar} />
                            ) : (
                                <View style={[styles.ownerAvatar, { backgroundColor: colors.border, justifyContent: 'center', alignItems: 'center' }]}>
                                    <IconSymbol name="person.fill" size={24} color={colors.icon} />
                                </View>
                            )}
                            <View>
                                <ThemedText style={styles.ownerName}>{owner?.name || t('MAHTO User')}</ThemedText>
                                <ThemedText style={styles.ownerLabel}>{t('Property Owner')}</ThemedText>
                            </View>
                        </View>
                        <Pressable
                            style={[styles.chatBtn, { borderColor: colors.tint }]}
                            onPress={handleContact}
                        >
                            <IconSymbol name="message.fill" size={18} color={colors.tint} />
                        </Pressable>
                    </View>
                </View>

                {/* Bottom padding for floating footer */}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Sticky Floating Footer */}
            <View style={[styles.footer, { backgroundColor: colors.background }]}>
                <Pressable
                    style={[styles.contactBtn, { backgroundColor: colors.tint }]}
                    onPress={handleContact}
                >
                    <IconSymbol name="message.fill" size={20} color="#FFF" />
                    <ThemedText style={styles.contactBtnText}>{t('Contact Owner')}</ThemedText>
                </Pressable>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    propertyImage: {
        width: width,
        height: 400,
        resizeMode: 'cover',
    },
    imageSection: {
        position: 'relative',
    },
    imageHeader: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 60 : 40,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerRight: {
        flexDirection: 'row',
        gap: 12,
    },
    iconBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    indicatorContainer: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        flexDirection: 'row',
        gap: 6,
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    content: {
        padding: 24,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        marginTop: -32,
        backgroundColor: '#FFF', // Always white for clean premium feel
    },
    mainInfo: {
        marginBottom: 20,
    },
    typeBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        marginBottom: 12,
    },
    typeBadgeText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        letterSpacing: -0.5,
        marginBottom: 8,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    location: {
        fontSize: 14,
        color: '#8E8E93',
        fontWeight: '500',
    },
    priceContainer: {
        marginVertical: 24,
    },
    priceLabel: {
        fontSize: 14,
        color: '#8E8E93',
        fontWeight: '600',
        marginBottom: 4,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
    },
    priceSymbol: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000',
    },
    priceValue: {
        fontSize: 32,
        fontWeight: '900',
        color: '#000',
    },
    featuresContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 32,
    },
    featureBox: {
        flex: 1,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    featureLabel: {
        fontSize: 12,
        color: '#8E8E93',
        marginTop: 8,
        marginBottom: 2,
    },
    featureValue: {
        fontSize: 14,
        fontWeight: '700',
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: '#484848',
    },
    ownerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 20,
    },
    ownerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    ownerAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    ownerName: {
        fontSize: 16,
        fontWeight: '700',
    },
    ownerLabel: {
        fontSize: 12,
        color: '#8E8E93',
    },
    chatBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
        borderTopWidth: 1,
        borderTopColor: '#F2F2F7',
    },
    contactBtn: {
        height: 60,
        borderRadius: 18,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    contactBtnText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
    },
    imagePlaceholder: {
        width: width,
        height: 400,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        backgroundColor: '#000', // Matches image section background
    }
});
