import { useAOSContext } from './aos-provider';
import type { AOSGlobalConfig, AOSResolvedConfig } from './aos-types';
import { useCallback, useMemo, useRef, useState } from 'react';

export type UseAOSOptions = AOSGlobalConfig;

interface UseAOSResult<T extends HTMLElement> {
    ref: (node: T | null) => void;
    isVisible: boolean;
}

export function useAOS<T extends HTMLElement = HTMLDivElement>(
    localOptions: UseAOSOptions = {},
): UseAOSResult<T> {
    const { config: globalConfig, manager } = useAOSContext();
    const [isVisible, setIsVisible] = useState(false);
    const nodeRef = useRef<T | null>(null);
    const options = useMemo<AOSResolvedConfig>(
        () => ({
            duration: localOptions.duration ?? globalConfig.duration,
            delay: localOptions.delay ?? globalConfig.delay,
            easing: localOptions.easing ?? globalConfig.easing,
            once: localOptions.once ?? globalConfig.once,
            mirror: localOptions.mirror ?? globalConfig.mirror,
            offset: localOptions.offset ?? globalConfig.offset,
            disable: localOptions.disable ?? globalConfig.disable,
        }),
        [
            globalConfig,
            localOptions.duration,
            localOptions.delay,
            localOptions.easing,
            localOptions.once,
            localOptions.mirror,
            localOptions.offset,
            localOptions.disable,
        ],
    );

    const ref = useCallback(
        (node: T | null): void => {
            if (!node) {
                if (nodeRef.current) {
                    manager.unregister(nodeRef.current);
                    nodeRef.current = null;
                }

                return;
            }

            nodeRef.current = node;
            manager.register(node, options, setIsVisible);
        },
        [manager, options],
    );

    return { ref, isVisible };
}
