import type { AOSRegistryItem } from './aos-types';

export class AOSRegistry {
    private readonly items = new Map<HTMLElement, AOSRegistryItem>();

    public set(item: AOSRegistryItem): void {
        this.items.set(item.node, item);
    }

    public get(node: HTMLElement): AOSRegistryItem | undefined {
        return this.items.get(node);
    }

    public delete(node: HTMLElement): AOSRegistryItem | undefined {
        const item = this.items.get(node);

        this.items.delete(node);

        return item;
    }

    public values(): IterableIterator<AOSRegistryItem> {
        return this.items.values();
    }

    public clear(): void {
        this.items.clear();
    }
}
