import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

type ProfileData = {
    name: string;
    phone: string;
    email: string;
    address: string;
    image: string | null;
};

type ProfileContextType = {
    profile: ProfileData;
    updateProfile: (data: Partial<ProfileData>) => void;
};

const defaultProfile: ProfileData = {
    name: 'Harsh Batman',
    phone: '1234567890',
    email: 'harsh@example.com',
    address: '',
    image: null,
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
    const [profile, setProfile] = useState<ProfileData>(defaultProfile);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const saved = await AsyncStorage.getItem('mahto_profile');
            if (saved) {
                setProfile(JSON.parse(saved));
            }
        } catch (e) {
            console.error('Failed to load profile', e);
        }
    };

    const updateProfile = async (data: Partial<ProfileData>) => {
        const newProfile = { ...profile, ...data };
        setProfile(newProfile);
        try {
            await AsyncStorage.setItem('mahto_profile', JSON.stringify(newProfile));
        } catch (e) {
            console.error('Failed to save profile', e);
        }
    };

    return (
        <ProfileContext.Provider value={{ profile, updateProfile }}>
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
