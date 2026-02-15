import { useProfile } from '@/context/profile-context';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
    const { profile, loading } = useProfile();

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    if (profile.isLoggedIn) {
        return <Redirect href="/(tabs)" />;
    }

    return <Redirect href="/(auth)/signup" />;
}
