export type AOSEasing =
    | 'linear'
    | 'ease'
    | 'ease-in'
    | 'ease-out'
    | 'ease-in-out'
    | 'ease-in-back'
    | 'ease-out-back'
    | 'ease-in-out-back'
    | 'ease-in-sine'
    | 'ease-out-sine'
    | 'ease-in-out-sine'
    | 'ease-in-quad'
    | 'ease-out-quad'
    | 'ease-in-out-quad'
    | 'ease-in-cubic'
    | 'ease-out-cubic'
    | 'ease-in-out-cubic'
    | 'ease-in-quart'
    | 'ease-out-quart'
    | 'ease-in-out-quart';

export type AOSDisable =
    boolean | 'phone' | 'tablet' | 'mobile' | (() => boolean);

export interface AOSGlobalConfig {
    duration?: number;
    delay?: number;
    easing?: AOSEasing;
    once?: boolean;
    mirror?: boolean;
    offset?: number;
    disable?: AOSDisable;
}

export type AOSResolvedConfig = Required<AOSGlobalConfig>;

export interface AOSRegistryItem {
    node: HTMLElement;
    options: AOSResolvedConfig;
    isVisible: boolean;
    hasAnimated: boolean;
    timeout: ReturnType<typeof setTimeout> | null;
    isObserved: boolean;
    setVisible: (isVisible: boolean) => void;
}
