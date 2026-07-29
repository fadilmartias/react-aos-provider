import type { AOSRegistryItem } from './aos-types';

export class AOSObserver {
    private observer: IntersectionObserver | null = null;

    public start(onIntersect: (node: HTMLElement) => void): void {
        if (
            typeof window === 'undefined' ||
            !('IntersectionObserver' in window)
        ) {
            return;
        }

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                onIntersect(entry.target as HTMLElement);
            });
        });
    }

    public observe(item: AOSRegistryItem): void {
        if (!this.observer || item.isObserved) {
            return;
        }

        this.observer.observe(item.node);
        item.isObserved = true;
    }

    public unobserve(item: AOSRegistryItem): void {
        if (!this.observer || !item.isObserved) {
            return;
        }

        this.observer.unobserve(item.node);
        item.isObserved = false;
    }

    public reconnect(items: Iterable<AOSRegistryItem>): void {
        this.observer?.disconnect();

        for (const item of items) {
            item.isObserved = false;
            this.observe(item);
        }
    }

    public disconnect(): void {
        this.observer?.disconnect();
        this.observer = null;
    }
}
