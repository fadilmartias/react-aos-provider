import { describe, expect, it } from 'vitest';
import { AOSRegistry } from './aos-registry';
import type { AOSRegistryItem } from './aos-types';

function createItem(node: HTMLElement): AOSRegistryItem {
    return {
        node,
        options: {
            duration: 600,
            delay: 0,
            easing: 'ease-out-cubic',
            once: true,
            mirror: false,
            offset: 80,
            disable: false,
        },
        isVisible: false,
        hasAnimated: false,
        timeout: null,
        isObserved: false,
        setVisible: () => {},
    };
}

describe('AOSRegistry', () => {
    it('stores and retrieves an item by node', () => {
        const registry = new AOSRegistry();
        const node = document.createElement('div');
        const item = createItem(node);

        registry.set(item);

        expect(registry.get(node)).toBe(item);
    });

    it('deletes an item and returns it', () => {
        const registry = new AOSRegistry();
        const node = document.createElement('div');
        const item = createItem(node);

        registry.set(item);
        const deleted = registry.delete(node);

        expect(deleted).toBe(item);
        expect(registry.get(node)).toBeUndefined();
    });

    it('returns undefined when deleting a node that was never registered', () => {
        const registry = new AOSRegistry();
        const node = document.createElement('div');

        expect(registry.delete(node)).toBeUndefined();
    });

    it('iterates over all stored values', () => {
        const registry = new AOSRegistry();
        const itemA = createItem(document.createElement('div'));
        const itemB = createItem(document.createElement('span'));

        registry.set(itemA);
        registry.set(itemB);

        expect(Array.from(registry.values())).toEqual([itemA, itemB]);
    });

    it('clears all stored items', () => {
        const registry = new AOSRegistry();
        registry.set(createItem(document.createElement('div')));

        registry.clear();

        expect(Array.from(registry.values())).toHaveLength(0);
    });
});
