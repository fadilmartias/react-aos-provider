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
});
