import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { auth, db } from '@/config/firebase';
import { Colors } from '@/constants/theme';
import { useChat } from '@/context/chat-context';
import { useNotification } from '@/context/notification-context';
import { useProfile } from '@/context/profile-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { arrayRemove, arrayUnion, doc, getDoc, increment, onSnapshot, updateDoc } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Dimensions, Image, Linking, Platform, Pressable, ScrollView, Share, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function PropertyDetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { t } = useTranslation();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme as 'light' | 'dark'];
    const { showProfessionalError, showNotification } = useNotification();
    const { startConversation } = useChat();
    const { profile } = useProfile();
    const insets = useSafeAreaInsets();

    const [property, setProperty] = useState<any>(null);
    const [owner, setOwner] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isFavorited, setIsFavorited] = useState(false);
    const scrollRef = useRef<ScrollView>(null);



    useEffect(() => {
        if (!id) return;

        const docRef = doc(db, 'properties', id as string);
        const unsubscribe = onSnapshot(docRef, async (docSnap) => {
            if (docSnap.exists()) {
                const data = { id: docSnap.id, ...docSnap.data() } as any;
                setProperty(data);

                // Fetch owner details
                if (data.ownerId) {
                    const userSnap = await getDoc(doc(db, 'users', data.ownerId));
                    if (userSnap.exists()) {
                        setOwner(userSnap.data());
                    }
                }

                // Update favorited state from DB
                const currentUid = auth.currentUser?.uid;
                if (currentUid && data.likedBy) {
                    setIsFavorited(data.likedBy.includes(currentUid));
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
            const result = await Share.share({
                message: `Check out this property: ${property.title} for ₹${property.price} on MAHTO.`,
                url: `https://mahto.app/properties/${id}`,
            });

            if (result.action === Share.sharedAction) {
                // Increment share count in Firestore
                const docRef = doc(db, 'properties', id as string);
                await updateDoc(docRef, {
                    shares: increment(1)
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleWhatsAppShare = async () => {
        const message = `Check out this property: *${property.title}* for *₹${property.price}* on MAHTO.\n\nView details: https://mahto.app/properties/${id}`;
        const url = `whatsapp://send?text=${encodeURIComponent(message)}`;

        try {
            const canOpen = await Linking.canOpenURL(url);
            if (canOpen) {
                await Linking.openURL(url);
                // Increment WhatsApp share count in Firestore
                const docRef = doc(db, 'properties', id as string);
                await updateDoc(docRef, {
                    whatsappShares: increment(1)
                });
            } else {
                showNotification('warning', 'App Not Found', "WhatsApp is not installed on your device.");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const scrollToImage = (index: number) => {
        if (index < 0 || index >= (property.images?.length || 0)) return;
        scrollRef.current?.scrollTo({ x: index * width, animated: true });
        setActiveImageIndex(index);
    };

    const handleContact = async () => {
        if (!auth.currentUser) {
            router.push('/(auth)/login');
            return;
        }

        if (auth.currentUser.uid === property.ownerId) {
            showNotification('info', 'My Property', "This is your own property!");
            return;
        }

        try {
            const conversationId = await startConversation(property.ownerId, property.id, property.title);
            router.push(`/chat/${conversationId}`);
        } catch (error) {
            showProfessionalError(error, 'Chat Error');
        }
    };

    const handleCall = () => {
        if (!owner?.phone) {
            showNotification('error', 'Contact Unavailable', "No phone number available for this owner.");
            return;
        }
        Linking.openURL(`tel:${owner.phone}`);
    };


    const toggleFavorite = async () => {
        if (!auth.currentUser) {
            router.push('/(auth)/login');
            return;
        }

        const currentUid = auth.currentUser.uid;
        const docRef = doc(db, 'properties', id as string);

        try {
            if (isFavorited) {
                // Unlike
                await updateDoc(docRef, {
                    likedBy: arrayRemove(currentUid),
                    likes: increment(-1)
                });
            } else {
                // Like
                await updateDoc(docRef, {
                    likedBy: arrayUnion(currentUid),
                    likes: increment(1)
                });
            }
            // State will be updated by the onSnapshot listener
        } catch (error) {
            console.error("Error toggling favorite:", error);
            showProfessionalError(error, 'Error');
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
                        ref={scrollRef}
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

                    {/* Navigation Arrows */}
                    {property.images && property.images.length > 1 && (
                        <>
                            {activeImageIndex > 0 && (
                                <Pressable
                                    onPress={() => scrollToImage(activeImageIndex - 1)}
                                    style={[styles.navBtn, styles.leftNav]}
                                >
                                    <IconSymbol name="chevron.left" size={24} color="#FFF" />
                                </Pressable>
                            )}
                            {activeImageIndex < property.images.length - 1 && (
                                <Pressable
                                    onPress={() => scrollToImage(activeImageIndex + 1)}
                                    style={[styles.navBtn, styles.rightNav]}
                                >
                                    <IconSymbol name="chevron.right" size={24} color="#FFF" />
                                </Pressable>
                            )}
                        </>
                    )}


                    {/* Image Header Actions */}
                    <View style={styles.imageHeader}>
                        <Pressable onPress={() => router.back()} style={styles.iconBtn}>
                            <IconSymbol name="chevron.left" size={24} color="#000" />
                        </Pressable>
                        <View style={styles.headerRight}>
                            <Pressable onPress={handleWhatsAppShare} style={[styles.iconBtn, { backgroundColor: '#25D366' }]}>
                                <FontAwesome name="whatsapp" size={24} color="#FFF" />
                            </Pressable>
                            <Pressable onPress={handleShare} style={styles.iconBtn}>
                                <IconSymbol name="square.and.arrow.up" size={20} color="#000" />
                            </Pressable>
                            <Pressable
                                onPress={toggleFavorite}
                                style={[styles.iconBtn, isFavorited && { backgroundColor: '#FF3B30' }]}
                            >
                                <IconSymbol
                                    name={isFavorited ? "heart.fill" : "heart"}
                                    size={20}
                                    color={isFavorited ? "#FFF" : "#000"}
                                />
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
                        <View style={[styles.typeBadge, { backgroundColor: (property.listingType === 'Sell' || property.listingType === 'Sale') ? '#FF3B30' : colors.tint }]}>
                            <ThemedText style={styles.typeBadgeText}>{t(property.listingType || 'Sale')}</ThemedText>
                        </View>
                        <ThemedText style={styles.title}>{property.title}</ThemedText>
                        <View style={styles.locationRow}>
                            <IconSymbol name="mappin.circle.fill" size={16} color="#8E8E93" />
                            <ThemedText style={styles.location}>{property.location}</ThemedText>
                        </View>

                        <View style={styles.likesRow}>
                            <View style={styles.statsItem}>
                                <IconSymbol name="heart.fill" size={14} color="#FF3B30" />
                                <ThemedText style={styles.statsText}>
                                    {property.likes || 0} {t('likes')}
                                </ThemedText>
                            </View>
                            <View style={styles.statsItem}>
                                <IconSymbol name="square.and.arrow.up" size={14} color="#8E8E93" />
                                <ThemedText style={styles.statsText}>
                                    {property.shares || 0} {t('shares')}
                                </ThemedText>
                            </View>
                            <View style={styles.statsItem}>
                                <FontAwesome name="whatsapp" size={14} color="#25D366" />
                                <ThemedText style={styles.statsText}>
                                    {property.whatsappShares || 0} {t('WhatsApp')}
                                </ThemedText>
                            </View>
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
            <View style={[
                styles.footer,
                {
                    backgroundColor: colors.background,
                    paddingBottom: Math.max(insets.bottom, 24)
                }
            ]}>
                <View style={styles.footerButtons}>
                    <Pressable
                        style={[styles.callBtn, { borderColor: colors.tint }]}
                        onPress={handleCall}
                    >
                        <IconSymbol name="phone.fill" size={20} color="#4CAF50" />
                        <ThemedText style={[styles.callBtnText, { color: colors.tint }]}>{t('Call Owner')}</ThemedText>
                    </Pressable>
                    <Pressable
                        style={[styles.contactBtn, { backgroundColor: colors.tint }]}
                        onPress={handleContact}
                    >
                        <IconSymbol name="message.fill" size={20} color="#FFF" />
                        <ThemedText style={styles.contactBtnText}>{t('Message Owner')}</ThemedText>
                    </Pressable>
                </View>
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
    navBtn: {
        position: 'absolute',
        top: '50%',
        marginTop: -20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    leftNav: {
        left: 10,
    },
    rightNav: {
        right: 10,
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
    likesRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginTop: 8,
    },
    statsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statsText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#8E8E93',
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
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#F2F2F7',
    },
    footerButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    contactBtn: {
        flex: 1.5,
        height: 56,
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    callBtn: {
        flex: 1,
        height: 56,
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        borderWidth: 2,
    },
    contactBtnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
    callBtnText: {
        fontSize: 16,
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

