# react-aos-provider

[![npm version](https://img.shields.io/npm/v/react-aos-provider.svg)](https://www.npmjs.com/package/react-aos-provider)
[![CI](https://github.com/fadilmartias/react-aos-provider/actions/workflows/ci.yml/badge.svg)](https://github.com/fadilmartias/react-aos-provider/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/react-aos-provider.svg)](./LICENSE)

A lightweight, dependency-free "Animate On Scroll" provider for React. No jQuery, no `aos.js`, just a `Provider`, a `<AOS>` component, and a `useAOS` hook, all built on `IntersectionObserver`.

## Features

- Zero runtime dependencies (only `react`/`react-dom` peer deps)
- Declarative `<AOS>` component or the `useAOS` hook for full control
- All classic `aos` animation presets (fade, zoom, slide, flip)
- Nested `AOSProvider`s share a single observer/manager instance
- Responsive `disable` option (`phone`, `tablet`, `mobile`, boolean, or a predicate)
- Written in TypeScript, ships its own `.d.ts`

## Installation

```bash
npm install react-aos-provider
```

## Usage

Wrap your app (or a section of it) with `AOSProvider`, then import the base stylesheet once:

```tsx
import { AOSProvider, AOS } from 'react-aos-provider';
import 'react-aos-provider/styles.css';

function App() {
    return (
        <AOSProvider duration={800} easing="ease-out-cubic" once>
            <AOS animation="fade-up">
                <h1>Hello world</h1>
            </AOS>
            <AOS animation="zoom-in" delay={200}>
                <p>This fades in as you scroll.</p>
            </AOS>
        </AOSProvider>
    );
}
```

### `useAOS` hook

For full control over the wrapped element:

```tsx
import { useAOS } from 'react-aos-provider';

function Card() {
    const { ref, isVisible } = useAOS<HTMLDivElement>({ offset: 120 });

    return (
        <div ref={ref} className={isVisible ? 'is-visible' : ''}>
            Custom animation driven by isVisible
        </div>
    );
}
```

## API

### `<AOSProvider>` props

| Prop          | Type                                                            | Default            | Description                                               |
| ------------- | --------------------------------------------------------------- | ------------------ | --------------------------------------------------------- |
| `duration`    | `number`                                                        | `600`              | Default transition duration (ms)                          |
| `delay`       | `number`                                                        | `0`                | Default delay before animating (ms)                       |
| `easing`      | `AOSEasing`                                                     | `'ease-out-cubic'` | Default easing curve                                      |
| `once`        | `boolean`                                                       | `true`             | Animate only the first time an element enters             |
| `mirror`      | `boolean`                                                       | `false`            | Animate out again when scrolling back up                  |
| `offset`      | `number`                                                        | `80`               | Trigger offset from the viewport edge (px)                |
| `disable`     | `boolean \| 'phone' \| 'tablet' \| 'mobile' \| (() => boolean)` | `false`            | Disable animations conditionally                          |
| `autoRefresh` | `(refresh: () => void) => void \| (() => void)`                 | -                  | Hook up a router/navigation event to re-evaluate elements |

### `<AOS>` props

Accepts everything from `AOSProvider` (as per-element overrides) plus:

| Prop            | Type                                                                        | Default     | Description                                                                                                                                                      |
| --------------- | --------------------------------------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `animation`     | `AOSAnimation`                                                              | `'fade-up'` | Animation preset, same names as `aos@2.3.1`                                                                                                                      |
| `as`            | `'div' \| 'section' \| 'article' \| 'span' \| 'li' \| 'header' \| 'footer'` | `'div'`     | Wrapper element tag                                                                                                                                              |
| `disableOffset` | `boolean`                                                                   | `false`     | Ignore the configured `offset` for this element only, so it animates as soon as any part of it enters the viewport instead of waiting to clear the offset margin |

### `useAOS(options)`

Returns `{ ref, isVisible }`. `ref` must be attached to the DOM node you want observed; `isVisible` reflects whether it currently satisfies the visibility criteria.

## Using with a coding agent (Claude Code)

This repo ships a [Claude Code](https://claude.com/claude-code) skill at [`.claude/skills/react-aos-provider/SKILL.md`](.claude/skills/react-aos-provider/SKILL.md) that teaches an agent how to install and wire up this package correctly (provider setup, the `<AOS>` component, the `useAOS` hook, Next.js `'use client'` boundaries, and common troubleshooting) — cloning this repo gets it for free.

If you only installed the package via `npm install react-aos-provider` and don't have this repo checked out, copy that file into your own project at `.claude/skills/react-aos-provider/SKILL.md` and Claude Code will pick it up automatically.

## Development

```bash
npm install
npm run build       # bundle with tsup (cjs + esm + d.ts)
npm run test         # run the vitest suite
npm run lint          # eslint
npm run typecheck    # tsc --noEmit
```

## Contributing

Contributions are welcome, see [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[MIT](./LICENSE) © M. Fadil Martias
