import React, { useEffect, useState, useRef } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TextInput,
    View,
    FlatList,
    Pressable,
    ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { collection, query, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';
import { useChat, Message } from '@/context/chat-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { format } from 'date-fns';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ChatScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { sendMessage } = useChat();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(true);
    const [otherUserName, setOtherUserName] = useState('Chat');

    const flatListRef = useRef<FlatList>(null);
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme as 'light' | 'dark'];
    const currentUser = auth.currentUser;
    const insets = useSafeAreaInsets();

    useEffect(() => {
        if (!id || typeof id !== 'string') return;

        // 1. Fetch conversation details to get other user's name
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
                            setOtherUserName(userSnap.data().name || 'User');
                        }
                    }
                }
            } catch (e) {
                console.error("Error fetching chat details", e);
            }
        };
        fetchDetails();

        // 2. Listen for messages
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

    const renderMessage = ({ item }: { item: Message }) => {
        const isMe = item.senderId === currentUser?.uid;
        return (
            <View style={[
                styles.messageBubble,
                isMe ? styles.myMessage : styles.theirMessage,
                { backgroundColor: isMe ? colors.tint : colors.secondary }
            ]}>
                <ThemedText style={{ color: isMe ? '#FFF' : colors.text }}>
                    {item.text}
                </ThemedText>
                <ThemedText style={[
                    styles.timestamp,
                    { color: isMe ? 'rgba(255,255,255,0.7)' : colors.icon }
                ]}>
                    {item.createdAt?.toDate ? format(item.createdAt.toDate(), 'HH:mm') : 'Just now'}
                </ThemedText>
            </View>
        );
    };

    return (
        <ThemedView style={styles.container}>
            <Stack.Screen options={{ title: otherUserName }} />

            <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.background }]}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <IconSymbol name="chevron.left" size={28} color={colors.text} />
                </Pressable>
                <View>
                    <ThemedText style={styles.headerTitle}>{otherUserName}</ThemedText>
                    <ThemedText style={styles.headerStatus}>Online</ThemedText>
                </View>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator />
                </View>
            ) : (
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={item => item.id}
                    inverted
                    contentContainerStyle={styles.listContent}
                />
            )}

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View style={[
                    styles.inputContainer,
                    {
                        backgroundColor: colors.background,
                        borderTopColor: colors.border,
                        paddingBottom: Math.max(insets.bottom, 16)
                    }
                ]}>
                    <TextInput
                        style={[styles.input, { backgroundColor: colors.secondary, color: colors.text }]}
                        placeholder="Type a message..."
                        placeholderTextColor={colors.icon}
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                    />
                    <Pressable
                        onPress={handleSend}
                        style={[styles.sendButton, { backgroundColor: colors.tint, opacity: inputText.trim() ? 1 : 0.5 }]}
                        disabled={!inputText.trim()}
                    >
                        <IconSymbol name="paperplane.fill" size={22} color="#FFF" />
                    </Pressable>
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
        paddingTop: 60,
        paddingBottom: 16,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        zIndex: 10,
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    headerStatus: {
        fontSize: 12,
        color: '#00C805', // Online green
        fontWeight: '600',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 20,
        marginBottom: 8,
    },
    myMessage: {
        alignSelf: 'flex-end',
        borderBottomRightRadius: 4,
    },
    theirMessage: {
        alignSelf: 'flex-start',
        borderBottomLeftRadius: 4,
    },
    timestamp: {
        fontSize: 10,
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 16,
        borderTopWidth: 1,
        alignItems: 'flex-end',
    },
    input: {
        flex: 1,
        minHeight: 40,
        maxHeight: 100,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 10,
        fontSize: 16,
        marginRight: 10,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
