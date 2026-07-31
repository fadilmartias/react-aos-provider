import './aos.css';

export { AOS } from './aos';
export type { AOSAnimation, AOSProps } from './aos';

export {
    AOSProvider,
    useAOSContext,
    useAOSConfig,
    resolveDisabled,
} from './aos-provider';
export type {
    AOSProviderProps,
    AOSDisable,
    AOSEasing,
    AOSGlobalConfig,
} from './aos-provider';

export { useAOS } from './use-aos';
export type { UseAOSOptions } from './use-aos';

export type { AOSResolvedConfig, AOSRegistryItem } from './aos-types';
