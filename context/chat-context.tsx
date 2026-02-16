import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    collection,
    query,
    where,
    orderBy,
    addDoc,
    onSnapshot,
    Timestamp,
    doc,
    getDoc,
    updateDoc,
    serverTimestamp
} from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { useProfile } from './profile-context';

export interface Message {
    id: string;
    text: string;
    senderId: string;
    createdAt: any;
    read: boolean;
}

export interface Conversation {
    id: string;
    participants: string[]; // [currentUserId, otherUserId]
    lastMessage: string;
    lastMessageTimestamp: any;
    unreadCount: number;
    propertyId?: string; // Optional: link chat to a specific property
    propertyTitle?: string;
    otherUser?: {
        name: string;
        avatar?: string;
    };
}

interface ChatContextType {
    conversations: Conversation[];
    loading: boolean;
    sendMessage: (conversationId: string, text: string) => Promise<void>;
    startConversation: (otherUserId: string, propertyId?: string, propertyTitle?: string) => Promise<string>;
    markAsRead: (conversationId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType>({
    conversations: [],
    loading: false,
    sendMessage: async () => { },
    startConversation: async () => '',
    markAsRead: async () => { },
});

export const useChat = () => useContext(ChatContext);

export function ChatProvider({ children }: { children: React.ReactNode }) {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(false);
    const { profile } = useProfile();
    const currentUser = auth.currentUser;

    // Listen for conversations
    useEffect(() => {
        if (!currentUser) {
            setConversations([]);
            return;
        }

        const q = query(
            collection(db, 'conversations'),
            where('participants', 'array-contains', currentUser.uid),
            orderBy('lastMessageTimestamp', 'desc')
        );

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const convos: Conversation[] = [];

            for (const docSnapshot of snapshot.docs) {
                const data = docSnapshot.data();
                const otherUserId = data.participants.find((p: string) => p !== currentUser.uid);

                // Fetch other user's details if needed (cache this in production)
                let otherUser = { name: 'User', avatar: undefined };
                if (otherUserId) {
                    try {
                        const userDoc = await getDoc(doc(db, 'users', otherUserId));
                        if (userDoc.exists()) {
                            const userData = userDoc.data();
                            otherUser = {
                                name: userData.name || 'User',
                                avatar: userData.image
                            };
                        }
                    } catch (e) {
                        console.log("Error fetching user data", e);
                    }
                }

                convos.push({
                    id: docSnapshot.id,
                    ...data,
                    otherUser,
                } as Conversation);
            }
            setConversations(convos);
        });

        return () => unsubscribe();
    }, [currentUser]);

    const startConversation = async (otherUserId: string, propertyId?: string, propertyTitle?: string) => {
        if (!currentUser) throw new Error("Must be logged in");

        // Check if conversation already exists
        // Simple check: This doesn't account for property-specific chats perfectly if you want separate chats per property with same user
        // For now, let's assume one chat thread per user-pair.
        // Ideally we query for existing convos with these 2 participants. 
        // Since firestore array-contains is limited, we might just create a new one or do a client-side check if we have the list loaded.

        const existing = conversations.find(c => c.participants.includes(otherUserId));
        if (existing) return existing.id;

        const docRef = await addDoc(collection(db, 'conversations'), {
            participants: [currentUser.uid, otherUserId],
            lastMessage: '',
            lastMessageTimestamp: serverTimestamp(),
            unreadCount: 0,
            propertyId: propertyId || null,
            propertyTitle: propertyTitle || null,
        });

        return docRef.id;
    };

    const sendMessage = async (conversationId: string, text: string) => {
        if (!currentUser) return;

        // Add message to subcollection
        await addDoc(collection(db, 'conversations', conversationId, 'messages'), {
            text,
            senderId: currentUser.uid,
            createdAt: serverTimestamp(),
            read: false,
        });

        // Update conversation summary
        await updateDoc(doc(db, 'conversations', conversationId), {
            lastMessage: text,
            lastMessageTimestamp: serverTimestamp(),
            // In a real app, you'd increment unread count for the OTHER user here
        });
    };

    const markAsRead = async (conversationId: string) => {
        // Logic to mark messages as read would go here
        // For now we just reset local state if we were tracking it
    };

    return (
        <ChatContext.Provider value={{ conversations, loading, sendMessage, startConversation, markAsRead }}>
            {children}
        </ChatContext.Provider>
    );
}
