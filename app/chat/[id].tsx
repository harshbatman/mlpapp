import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { Message, useChat } from '@/context/chat-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { format, isSameDay } from 'date-fns';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { collection, doc, getDoc, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    TextInput,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { auth, db } from '../../config/firebase';

const { width } = Dimensions.get('window');

export default function ChatScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { sendMessage } = useChat();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(true);
    const [otherUser, setOtherUser] = useState<any>(null);

    const flatListRef = useRef<FlatList>(null);
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme as 'light' | 'dark'];
    const currentUser = auth.currentUser;
    const insets = useSafeAreaInsets();

    useEffect(() => {
        if (!id || typeof id !== 'string') return;

        const fetchDetails = async () => {
            try {
                const docRef = doc(db, 'conversations', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const otherUserId = data.participants.find((p: string) => p !== currentUser?.uid);
                    if (otherUserId) {
                        const userSnap = await getDoc(doc(db, 'users', otherUserId));
                        if (userSnap.exists()) {
                            setOtherUser({ id: userSnap.id, ...userSnap.data() });
                        }
                    }
                }
            } catch (e) {
                console.error("Error fetching chat details", e);
            }
        };
        fetchDetails();

        const q = query(
            collection(db, 'conversations', id, 'messages'),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs: Message[] = [];
            snapshot.forEach((doc) => {
                msgs.push({ id: doc.id, ...doc.data() } as Message);
            });
            setMessages(msgs);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [id, currentUser]);

    const handleSend = async () => {
        if (!inputText.trim() || !id || typeof id !== 'string') return;

        const text = inputText.trim();
        setInputText('');

        try {
            await sendMessage(id, text);
        } catch (error) {
            console.error("Failed to send message", error);
        }
    };

    const renderMessage = ({ item, index }: { item: Message, index: number }) => {
        const isMe = item.senderId === currentUser?.uid;
        const showDate = index === messages.length - 1 ||
            (item.createdAt && messages[index + 1]?.createdAt &&
                !isSameDay(item.createdAt.toDate(), messages[index + 1].createdAt.toDate()));

        return (
            <View>
                {showDate && item.createdAt && (
                    <View style={styles.dateSeparator}>
                        <View style={[styles.dateLine, { backgroundColor: colors.border }]} />
                        <ThemedText style={styles.dateText}>
                            {format(item.createdAt.toDate(), 'MMMM d, yyyy')}
                        </ThemedText>
                        <View style={[styles.dateLine, { backgroundColor: colors.border }]} />
                    </View>
                )}
                <View style={[
                    styles.messageBubble,
                    isMe ? styles.myMessage : styles.theirMessage,
                    { backgroundColor: isMe ? colors.tint : colors.secondary }
                ]}>
                    <ThemedText style={[styles.messageText, { color: isMe ? '#FFF' : colors.text }]}>
                        {item.text}
                    </ThemedText>
                    <ThemedText style={[
                        styles.timestamp,
                        { color: isMe ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.4)' }
                    ]}>
                        {item.createdAt?.toDate ? format(item.createdAt.toDate(), 'HH:mm') : 'Just now'}
                    </ThemedText>
                </View>
            </View>
        );
    };

    return (
        <ThemedView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={[
                styles.header,
                {
                    backgroundColor: colors.background,
                    paddingTop: Math.max(insets.top, 40),
                    borderBottomColor: colors.border
                }
            ]}>
                <View style={styles.headerContent}>
                    <Pressable onPress={() => router.back()} style={styles.backButton}>
                        <IconSymbol name="chevron.left" size={28} color={colors.text} />
                    </Pressable>
                    <View style={styles.userInfo}>
                        {otherUser?.avatar ? (
                            <Image source={{ uri: otherUser.avatar }} style={styles.headerAvatar} />
                        ) : (
                            <View style={[styles.headerAvatarPlaceholder, { backgroundColor: colors.secondary }]}>
                                <IconSymbol name="person.fill" size={20} color={colors.icon} />
                            </View>
                        )}
                        <View style={styles.nameContainer}>
                            <ThemedText style={styles.headerTitle}>{otherUser?.name || 'Chat'}</ThemedText>
                            <View style={styles.statusRow}>
                                <View style={styles.statusDot} />
                                <ThemedText style={styles.headerStatus}>Online</ThemedText>
                            </View>
                        </View>
                    </View>
                    <View style={styles.headerActions}>
                        <Pressable style={styles.actionIcon}>
                            <IconSymbol name="phone.fill" size={20} color={colors.text} />
                        </Pressable>
                        <Pressable style={styles.actionIcon}>
                            <IconSymbol name="video.fill" size={20} color={colors.text} />
                        </Pressable>
                    </View>
                </View>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator color={colors.tint} />
                </View>
            ) : (
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={item => item.id}
                    inverted
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={0}
            >
                <View style={[
                    styles.inputWrapper,
                    {
                        backgroundColor: colors.background,
                        paddingBottom: Math.max(insets.bottom, 16)
                    }
                ]}>
                    <View style={[styles.inputContainer, { backgroundColor: colors.secondary }]}>
                        <Pressable style={styles.attachButton}>
                            <IconSymbol name="paperclip" size={20} color={colors.icon} />
                        </Pressable>
                        <TextInput
                            style={[styles.input, { color: colors.text, maxHeight: 120 }]}
                            placeholder="Message..."
                            placeholderTextColor="#8E8E93"
                            value={inputText}
                            onChangeText={setInputText}
                            multiline
                        />
                        <Pressable
                            onPress={handleSend}
                            style={[
                                styles.sendButton,
                                {
                                    backgroundColor: colors.tint,
                                    opacity: inputText.trim() ? 1 : 0.6
                                }
                            ]}
                            disabled={!inputText.trim()}
                        >
                            <IconSymbol name="arrow.up" size={20} color="#FFF" />
                        </Pressable>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        borderBottomWidth: 1,
        paddingBottom: 15,
        zIndex: 10,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    backButton: {
        marginRight: 12,
    },
    userInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerAvatar: {
        width: 44,
        height: 44,
        borderRadius: 15,
        marginRight: 12,
    },
    headerAvatarPlaceholder: {
        width: 44,
        height: 44,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    nameContainer: {
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '800',
        letterSpacing: -0.3,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 1,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4CAF50',
        marginRight: 6,
    },
    headerStatus: {
        fontSize: 12,
        color: '#8E8E93',
        fontWeight: '600',
    },
    headerActions: {
        flexDirection: 'row',
        gap: 16,
    },
    actionIcon: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 20,
        paddingTop: 10,
    },
    dateSeparator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    dateLine: {
        flex: 1,
        height: 1,
        opacity: 0.5,
    },
    dateText: {
        fontSize: 11,
        fontWeight: '800',
        paddingHorizontal: 12,
        opacity: 0.4,
        textTransform: 'uppercase',
    },
    messageBubble: {
        maxWidth: width * 0.75,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 22,
        marginBottom: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    myMessage: {
        alignSelf: 'flex-end',
        borderBottomRightRadius: 4,
    },
    theirMessage: {
        alignSelf: 'flex-start',
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 22,
    },
    timestamp: {
        fontSize: 10,
        marginTop: 4,
        alignSelf: 'flex-end',
        fontWeight: '600',
    },
    inputWrapper: {
        paddingTop: 12,
        paddingHorizontal: 16,
        borderTopWidth: 0,
    },
    inputContainer: {
        flexDirection: 'row',
        borderRadius: 30,
        paddingLeft: 12,
        paddingRight: 6,
        paddingVertical: 6,
        alignItems: 'flex-end',
    },
    attachButton: {
        padding: 8,
        marginBottom: 2,
    },
    input: {
        flex: 1,
        minHeight: 40,
        paddingHorizontal: 12,
        paddingTop: 10,
        paddingBottom: 10,
        fontSize: 16,
        fontWeight: '500',
    },
    sendButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 1,
    },
});

