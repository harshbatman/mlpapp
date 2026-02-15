import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../config/firebase';

type ProfileData = {
    name: string;
    phone: string;
    email: string;
    address: string;
    image: string | null;
    isLoggedIn: boolean;
};

type ProfileContextType = {
    profile: ProfileData;
    loading: boolean;
    updateProfile: (data: Partial<ProfileData>) => void;
    setLoggedInManually: (isLoggedIn: boolean) => void;
    logout: () => Promise<void>;
};

const defaultProfile: ProfileData = {
    name: 'Guest User',
    phone: '',
    email: '',
    address: '',
    image: null,
    isLoggedIn: false,
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
    const [profile, setProfile] = useState<ProfileData>(defaultProfile);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // User is signed in, fetch from Firestore
                const userDoc = doc(db, 'users', user.uid);

                // Set up a listener for the user document
                const unsubscribeDoc = onSnapshot(userDoc, (docSnap) => {
                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        setProfile({
                            name: userData.name || 'User',
                            phone: userData.phone || '',
                            email: user.email || '',
                            address: userData.address || '',
                            image: userData.image || null,
                            isLoggedIn: true,
                        });
                    }
                    setLoading(false);
                });

                return () => unsubscribeDoc();
            } else {
                // User is signed out
                setProfile(defaultProfile);
                setLoading(false);
            }
        });

        return () => unsubscribeAuth();
    }, []);

    const updateProfile = async (data: Partial<ProfileData>) => {
        setProfile(prev => ({ ...prev, ...data }));
        // In a real app, we would also update Firestore here if user is logged in
    };

    const setLoggedInManually = (isLoggedIn: boolean) => {
        setProfile(prev => ({ ...prev, isLoggedIn }));
        if (isLoggedIn) setLoading(false);
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setProfile(defaultProfile);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <ProfileContext.Provider value={{ profile, loading, updateProfile, setLoggedInManually, logout }}>
            {children}
        </ProfileContext.Provider>
    );
}

export function useProfile() {
    const context = useContext(ProfileContext);
    if (context === undefined) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
}
