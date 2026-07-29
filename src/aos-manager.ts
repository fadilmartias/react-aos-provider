import { AOSObserver } from './aos-observer';
import { AOSRegistry } from './aos-registry';
import type { AOSRegistryItem, AOSResolvedConfig } from './aos-types';

export class AOSManager {
    private readonly registry = new AOSRegistry();
    private readonly observer = new AOSObserver();
    private resizeObserver: ResizeObserver | null = null;
    private mutationObserver: MutationObserver | null = null;
    private refreshFrame: number | null = null;
    private started = false;

    public start(): void {
        if (this.started || typeof window === 'undefined') {
            return;
        }

        this.started = true;
        this.observer.start((node) => this.evaluateNode(node));

        if ('ResizeObserver' in window) {
            this.resizeObserver = new ResizeObserver(() =>
                this.scheduleRefresh(),
            );
            this.resizeObserver.observe(document.documentElement);
        }

        if ('MutationObserver' in window) {
            this.mutationObserver = new MutationObserver(() => {
                this.cleanupDetachedNodes();
                this.scheduleRefresh();
            });
            this.mutationObserver.observe(document.body, {
                childList: true,
                subtree: true,
            });
        }

        window.addEventListener('scroll', this.scheduleRefresh, {
            passive: true,
        });
        window.addEventListener('resize', this.scheduleRefresh, {
            passive: true,
        });

        this.refresh();
    }

    public register(
        node: HTMLElement,
        options: AOSResolvedConfig,
        setVisible: (isVisible: boolean) => void,
    ): void {
        this.unregister(node);

        const item: AOSRegistryItem = {
            node,
            options,
            isVisible: false,
            hasAnimated: false,
            timeout: null,
            isObserved: false,
            setVisible,
        };

        this.registry.set(item);
        setVisible(false);

        if (!this.shouldAnimate(options)) {
            this.show(item);

            return;
        }

        if (this.started) {
            this.resizeObserver?.observe(node);
            this.observer.observe(item);
            this.evaluate(item);
        }
    }

    public unregister(node: HTMLElement): void {
        const item = this.registry.delete(node);

        if (!item) {
            return;
        }

        this.clearTimeout(item);
        this.observer.unobserve(item);
        this.resizeObserver?.unobserve(node);
    }

    public refresh = (): void => {
        if (!this.started) {
            return;
        }

        this.cleanupDetachedNodes();
        this.observer.reconnect(this.registry.values());

        for (const item of this.registry.values()) {
            this.resizeObserver?.observe(item.node);
            this.evaluate(item);
        }
    };

    public stop(): void {
        if (typeof window !== 'undefined') {
            window.removeEventListener('scroll', this.scheduleRefresh);
            window.removeEventListener('resize', this.scheduleRefresh);

            if (this.refreshFrame !== null) {
                window.cancelAnimationFrame(this.refreshFrame);
            }
        }

        for (const item of this.registry.values()) {
            this.clearTimeout(item);
        }

        this.resizeObserver?.disconnect();
        this.mutationObserver?.disconnect();
        this.observer.disconnect();
        this.resizeObserver = null;
        this.mutationObserver = null;
        this.refreshFrame = null;
        this.started = false;
    }

    public destroy(): void {
        this.stop();
        this.registry.clear();
    }

    private scheduleRefresh = (): void => {
        if (
            !this.started ||
            this.refreshFrame !== null ||
            typeof window === 'undefined'
        ) {
            return;
        }

        this.refreshFrame = window.requestAnimationFrame(() => {
            this.refreshFrame = null;
            this.refresh();
        });
    };

    private evaluateNode(node: HTMLElement): void {
        const item = this.registry.get(node);

        if (item) {
            this.evaluate(item);
        }
    }

    private evaluate(item: AOSRegistryItem): void {
        if (!this.shouldAnimate(item.options) || item.hasAnimated) {
            return;
        }

        const rect = item.node.getBoundingClientRect();
        const isPastOffset =
            rect.top < window.innerHeight - item.options.offset &&
            rect.bottom > 0;
        const remainingScroll = Math.max(
            0,
            document.documentElement.scrollHeight -
                (window.scrollY + window.innerHeight),
        );
        const isVisibleAtDocumentEnd =
            remainingScroll <= item.options.offset &&
            rect.top < window.innerHeight &&
            rect.bottom > 0;
        const isVisibleInFixedLayer =
            this.isWithinFixedLayer(item.node) &&
            rect.top < window.innerHeight &&
            rect.bottom > 0;
        const isInView =
            isPastOffset || isVisibleAtDocumentEnd || isVisibleInFixedLayer;

        if (isInView) {
            this.show(item);

            return;
        }

        if (!this.observeOnce(item.options)) {
            this.clearTimeout(item);

            if (item.isVisible) {
                item.isVisible = false;
                item.setVisible(false);
            }
        }
    }

    private show(item: AOSRegistryItem): void {
        if (item.isVisible || item.timeout) {
            return;
        }

        const setVisible = (): void => {
            item.timeout = null;
            item.isVisible = true;
            item.setVisible(true);

            if (this.observeOnce(item.options)) {
                item.hasAnimated = true;
                this.observer.unobserve(item);
            }
        };

        if (item.options.delay > 0) {
            item.timeout = setTimeout(setVisible, item.options.delay);

            return;
        }

        setVisible();
    }

    private cleanupDetachedNodes(): void {
        for (const item of this.registry.values()) {
            if (!item.node.isConnected) {
                this.unregister(item.node);
            }
        }
    }

    private clearTimeout(item: AOSRegistryItem): void {
        if (!item.timeout) {
            return;
        }

        clearTimeout(item.timeout);
        item.timeout = null;
    }

    private isWithinFixedLayer(node: HTMLElement): boolean {
        let currentNode: HTMLElement | null = node;

        while (currentNode) {
            if (window.getComputedStyle(currentNode).position === 'fixed') {
                return true;
            }

            currentNode = currentNode.parentElement;
        }

        return false;
    }

    private observeOnce(options: AOSResolvedConfig): boolean {
        return options.once && !options.mirror;
    }

    private shouldAnimate(options: AOSResolvedConfig): boolean {
        if (typeof window === 'undefined') {
            return false;
        }

        if (
            typeof options.disable === 'function'
                ? options.disable()
                : options.disable
        ) {
            return false;
        }

        const width = window.innerWidth;

        if (options.disable === 'phone' && width < 576) {
            return false;
        }

        if (
            (options.disable === 'tablet' || options.disable === 'mobile') &&
            width < 768
        ) {
            return false;
        }

        return true;
    }
}
