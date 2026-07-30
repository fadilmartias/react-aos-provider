import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AOSProvider } from './aos-provider';
import { AOS } from './aos';

describe('AOSProvider', () => {
    it('renders children', () => {
        render(
            <AOSProvider>
                <p>hello world</p>
            </AOSProvider>,
        );

        expect(screen.getByText('hello world')).toBeInTheDocument();
    });

    it('throws when useAOS is used outside of an AOSProvider', () => {
        const consoleError = console.error;
        console.error = () => {};

        expect(() => render(<AOS>content</AOS>)).toThrow(
            /useAOS must be used within an AOSProvider/,
        );

        console.error = consoleError;
    });

    it('applies the base and animation classes to the wrapped element', () => {
        render(
            <AOSProvider>
                <AOS animation="zoom-in" data-testid="box">
                    content
                </AOS>
            </AOSProvider>,
        );

        const el = screen.getByTestId('box');
        expect(el).toHaveClass('aos', 'aos-zoom-in');
    });

    it('bypasses the configured offset for an element when disableOffset is set', () => {
        const originalGetBoundingClientRect =
            HTMLElement.prototype.getBoundingClientRect;
        const originalScrollHeight = Object.getOwnPropertyDescriptor(
            document.documentElement,
            'scrollHeight',
        );

        // Simulate an element sitting right at the bottom edge of a tall
        // page, well outside the 200px offset — but already partially in view.
        HTMLElement.prototype.getBoundingClientRect = () =>
            ({
                top: 750,
                bottom: 760,
                left: 0,
                right: 0,
                width: 100,
                height: 10,
                x: 0,
                y: 0,
                toJSON: () => ({}),
            }) as DOMRect;
        Object.defineProperty(document.documentElement, 'scrollHeight', {
            value: 5000,
            configurable: true,
        });
        Object.defineProperty(window, 'innerHeight', {
            value: 800,
            configurable: true,
        });

        render(
            <AOSProvider offset={200}>
                <AOS animation="fade-up" data-testid="normal">
                    normal
                </AOS>
                <AOS animation="fade-up" disableOffset data-testid="bypassed">
                    bypassed
                </AOS>
            </AOSProvider>,
        );

        expect(screen.getByTestId('normal')).not.toHaveClass('aos-animate');
        expect(screen.getByTestId('bypassed')).toHaveClass('aos-animate');

        HTMLElement.prototype.getBoundingClientRect =
            originalGetBoundingClientRect;

        if (originalScrollHeight) {
            Object.defineProperty(
                document.documentElement,
                'scrollHeight',
                originalScrollHeight,
            );
        }
    });
});
