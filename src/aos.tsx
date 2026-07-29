import { useAOS } from './use-aos';
import type { UseAOSOptions } from './use-aos';
import { useAOSConfig } from './aos-provider';
import type { AOSEasing } from './aos-provider';
import React from 'react';

export type AOSAnimation =
    | 'fade'
    | 'fade-up'
    | 'fade-down'
    | 'fade-left'
    | 'fade-right'
    | 'fade-up-right'
    | 'fade-up-left'
    | 'fade-down-right'
    | 'fade-down-left'
    | 'zoom-in'
    | 'zoom-in-up'
    | 'zoom-in-down'
    | 'zoom-in-left'
    | 'zoom-in-right'
    | 'zoom-out'
    | 'zoom-out-up'
    | 'zoom-out-down'
    | 'zoom-out-left'
    | 'zoom-out-right'
    | 'slide-up'
    | 'slide-down'
    | 'slide-left'
    | 'slide-right'
    | 'flip-up'
    | 'flip-down'
    | 'flip-left'
    | 'flip-right';

export interface AOSProps
    extends
        UseAOSOptions,
        Omit<
            React.HTMLAttributes<HTMLElement>,
            'children' | 'className' | 'style'
        > {
    children: React.ReactNode;
    /** Jenis animasi, lengkap seperti data-aos di lib aos */
    animation?: AOSAnimation;
    easing?: AOSEasing;
    duration?: number;
    className?: string;
    style?: React.CSSProperties;
    /** Elemen HTML pembungkus, default "div" */
    as?: 'div' | 'section' | 'article' | 'span' | 'li' | 'header' | 'footer';
}

/**
 * Komponen deklaratif — bungkus konten untuk animasi on-scroll.
 * Semua animasi dari lib aos@2.3.1 sudah tersedia lewat prop `animation`.
 *
 *   <AOS animation="flip-left" duration={800} easing="ease-out-back">
 *     <Card />
 *   </AOS>
 */
export function AOS({
    children,
    animation = 'fade-up',
    easing,
    duration,
    delay,
    once,
    mirror,
    offset,
    disable,
    className = '',
    style,
    as = 'div',
    ...htmlAttributes
}: AOSProps) {
    const globalConfig = useAOSConfig();
    const { ref, isVisible } = useAOS<HTMLElement>({
        duration,
        delay,
        easing,
        once,
        mirror,
        offset,
        disable,
    });
    const Tag = as as React.ElementType;
    const resolvedDuration = duration ?? globalConfig.duration;
    const resolvedEasing = easing ?? globalConfig.easing;

    return (
        <Tag
            ref={ref}
            {...htmlAttributes}
            className={[
                'aos',
                `aos-${animation}`,
                isVisible ? 'aos-animate' : '',
                `aos-ease-${resolvedEasing}`,
                className,
            ]
                .filter(Boolean)
                .join(' ')}
            style={{
                transitionDuration: `${resolvedDuration}ms`,
                ...style,
            }}
        >
            {children}
        </Tag>
    );
}
