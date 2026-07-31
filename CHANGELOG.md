# react-aos-provider

## 1.0.2

### Patch Changes

- Move the `aos.css` side-effect import from `AOSProvider` to the package entry point, and widen `<AOS as>` to accept any HTML element tag instead of a fixed list.

## 1.0.1

### Patch Changes

- Remove unnecessary comments; no functional change.

## 1.0.0

### Major Changes

- First stable release. Adds the `disableOffset` option to `<AOS>`/`useAOS` so an individual element can ignore the configured `offset` margin and animate as soon as any part of it enters the viewport.

## 0.2.0

### Minor Changes

- eadac22: Initial public release: `AOSProvider`, `<AOS>` component, and `useAOS` hook for scroll-triggered animations built on `IntersectionObserver`.
