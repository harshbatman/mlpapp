import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

interface TabVisibilityContextType {
    isMinimized: boolean;
    setIsMinimized: (value: boolean) => void;
    handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

const TabVisibilityContext = createContext<TabVisibilityContextType | undefined>(undefined);

export function TabVisibilityProvider({ children }: { children: React.ReactNode }) {
    const [isMinimized, setIsMinimized] = useState(false);
    const lastOffset = useRef(0);

    const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const currentOffset = event.nativeEvent.contentOffset.y;
        const diff = currentOffset - lastOffset.current;

        if (diff > 10 && currentOffset > 100) {
            if (!isMinimized) setIsMinimized(true);
        } else if (diff < -10 || currentOffset < 50) {
            if (isMinimized) setIsMinimized(false);
        }

        lastOffset.current = currentOffset;
    }, [isMinimized]);

    return (
        <TabVisibilityContext.Provider value={{ isMinimized, setIsMinimized, handleScroll }}>
            {children}
        </TabVisibilityContext.Provider>
    );
}

export function useTabVisibility() {
    const context = useContext(TabVisibilityContext);
    if (context === undefined) {
        throw new Error('useTabVisibility must be used within a TabVisibilityProvider');
    }
    return context;
}
