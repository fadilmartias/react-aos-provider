import { AOSManager } from './aos-manager';
import type {
    AOSDisable,
    AOSGlobalConfig,
    AOSResolvedConfig,
} from './aos-types';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import './aos.css';

export type { AOSDisable, AOSEasing, AOSGlobalConfig } from './aos-types';

const defaultConfig: AOSResolvedConfig = {
    duration: 600,
    delay: 0,
    easing: 'ease-out-cubic',
    once: true,
    mirror: false,
    offset: 80,
    disable: false,
};

interface AOSContextValue {
    config: AOSResolvedConfig;
    manager: AOSManager;
}

const AOSContext = createContext<AOSContextValue | null>(null);

// Definisikan tipe untuk properti yang diterima oleh Provider
export type AOSProviderProps = AOSGlobalConfig & {
    children: ReactNode;
    autoRefresh?: (refresh: () => void) => void | (() => void);
};

export function AOSProvider({
    children,
    autoRefresh,
    ...config
}: AOSProviderProps): ReactNode {
    const parentContext = useContext(AOSContext);
    const [localManager] = useState(() => new AOSManager());
    const manager = parentContext?.manager ?? localManager;
    const isManagerOwner = parentContext === null;
    const inheritedConfig = parentContext?.config ?? defaultConfig;

    const merged = useMemo<AOSResolvedConfig>(
        () => ({
            duration: config.duration ?? inheritedConfig.duration,
            delay: config.delay ?? inheritedConfig.delay,
            easing: config.easing ?? inheritedConfig.easing,
            once: config.once ?? inheritedConfig.once,
            mirror: config.mirror ?? inheritedConfig.mirror,
            offset: config.offset ?? inheritedConfig.offset,
            disable: config.disable ?? inheritedConfig.disable,
        }),
        [
            config.duration,
            config.delay,
            config.easing,
            config.once,
            config.mirror,
            config.offset,
            config.disable,
            inheritedConfig,
        ],
    );

    useEffect(() => {
        if (!isManagerOwner) {
            return;
        }

        manager.start();

        const cleanupAutoRefresh = autoRefresh
            ? autoRefresh(manager.refresh)
            : undefined;

        return () => {
            // Eksekusi cleanup jika autoRefresh me-return sebuah fungsi (contoh: router.on)
            if (typeof cleanupAutoRefresh === 'function') {
                cleanupAutoRefresh();
            }
            manager.stop();
        };
    }, [isManagerOwner, manager, autoRefresh]);

    const value = useMemo<AOSContextValue>(
        () => ({ config: merged, manager }),
        [manager, merged],
    );

    return <AOSContext.Provider value={value}>{children}</AOSContext.Provider>;
}

export function useAOSContext(): AOSContextValue {
    const context = useContext(AOSContext);

    if (!context) {
        throw new Error('useAOS must be used within an AOSProvider.');
    }

    return context;
}

export function useAOSConfig(): AOSResolvedConfig {
    return useAOSContext().config;
}

export function resolveDisabled(disable: AOSDisable): boolean {
    if (typeof disable === 'boolean') {
        return disable;
    }

    if (typeof disable === 'function') {
        return disable();
    }

    if (typeof window === 'undefined') {
        return false;
    }

    const width = window.innerWidth;

    if (disable === 'phone') {
        return width < 576;
    }

    return (disable === 'tablet' || disable === 'mobile') && width < 768;
}
