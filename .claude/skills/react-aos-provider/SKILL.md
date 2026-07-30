---
name: react-aos-provider
description: Adds scroll-triggered ("animate on scroll") animations to React apps using the react-aos-provider npm package — a dependency-free replacement for aos.js built on IntersectionObserver. Use this whenever the user wants elements to fade/zoom/slide/flip in as they scroll, mentions AOS, "animate on scroll", react-aos-provider, or is migrating off the aos/AOS.js jQuery-era library. Also use it when the user's code already imports react-aos-provider and animations aren't firing, when they ask to wrap a Next.js or Vite app with a scroll-animation provider, or when they want per-element control via a hook instead of a wrapper component. Covers install, provider setup, the <AOS> component, the useAOS hook, and Next.js App Router "use client" boundaries.
---

# react-aos-provider

`react-aos-provider` gives React the same animations as the classic `aos` library (fade, zoom, slide, flip — same preset names as `aos@2.3.1`) but with zero dependencies, built on `IntersectionObserver` instead of scroll listeners. There are exactly three things it exports that matter to a consumer: `AOSProvider` (context + observer manager), `<AOS>` (declarative wrapper component), and `useAOS` (hook for custom markup). Reach for the component in the common case; reach for the hook when the caller needs the visibility state itself rather than a wrapping element.

## Install

```bash
npm install react-aos-provider
```

No other packages are needed — `react`/`react-dom` are the only peer deps, and the base CSS ships in the package itself (`dist/index.css`), not a separate library.

## Setup — do these two things once

1. Wrap the app (or the section that should animate) in `AOSProvider`.
2. Import the stylesheet once, anywhere near the root — it defines the `.aos-*` transition classes that `<AOS>` and manual `useAOS` markup rely on. Skipping this import is the single most common reason "nothing animates."

```tsx
import { AOSProvider } from 'react-aos-provider';
import 'react-aos-provider/styles.css';

export default function App() {
  return (
    <AOSProvider duration={800} easing="ease-out-cubic" once>
      {/* rest of the app */}
    </AOSProvider>
  );
}
```

`AOSProvider` also builds and starts the shared `IntersectionObserver` manager — that only happens in an effect, so the provider (or an ancestor of it) must run on the client. See the Next.js section below if the app is server-rendered.

### If nested providers appear

Nested `AOSProvider`s are supported on purpose (e.g. a page-level provider with different defaults inside a global one) — the innermost one only supplies config overrides, while the outermost owns the actual observer instance. Don't warn the user about "duplicate providers" if you see this pattern; it's intentional composition, not a bug.

## `<AOS>` — the default choice

Wrap whatever should animate. `animation` picks the preset; everything else falls back to the provider's config if omitted.

```tsx
import { AOS } from 'react-aos-provider';

<AOS animation="fade-up">
  <h1>Hello world</h1>
</AOS>

<AOS animation="zoom-in" delay={200} duration={500} as="section">
  <p>This fades in as you scroll.</p>
</AOS>
```

Key props:

| Prop        | Type                                                                        | Default     | Notes                                                  |
| ----------- | ---------------------------------------------------------------------------- | ----------- | ------------------------------------------------------- |
| `animation` | see preset list below                                                        | `'fade-up'` | Same names as `aos@2.3.1` — safe to copy from old `data-aos` values |
| `as`        | `'div' \| 'section' \| 'article' \| 'span' \| 'li' \| 'header' \| 'footer'` | `'div'`     | Pick the tag that's semantically correct for the content, not always `div` |
| `duration`, `delay`, `easing`, `once`, `mirror`, `offset`, `disable` | — | inherited from `AOSProvider` | Per-element override; only set these if this element needs to differ from the page default |

Any other prop (`id`, `onClick`, `aria-*`, etc.) passes straight through to the rendered element as normal HTML attributes.

### Animation presets

`fade`, `fade-up`, `fade-down`, `fade-left`, `fade-right`, `fade-up-right`, `fade-up-left`, `fade-down-right`, `fade-down-left`, `zoom-in`, `zoom-in-up`, `zoom-in-down`, `zoom-in-left`, `zoom-in-right`, `zoom-out`, `zoom-out-up`, `zoom-out-down`, `zoom-out-left`, `zoom-out-right`, `slide-up`, `slide-down`, `slide-left`, `slide-right`, `flip-up`, `flip-down`, `flip-left`, `flip-right`.

If a user is migrating from `aos` and has `data-aos="fade-up"` etc. in their markup, this is a near-mechanical conversion: drop the element into `<AOS animation="fade-up">…</AOS>` and remove the `data-aos*` attributes (this package doesn't read them).

## `useAOS` — when you need the visibility state, not just a wrapper

Use this instead of `<AOS>` when the animation needs conditional classes, a third-party component that won't accept arbitrary children, or logic that depends on whether the element is currently visible.

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

`ref` is a callback ref — attach it directly to the DOM node being observed (not a `React.createRef()` result). `useAOS` takes the same config shape as `AOSProvider` (`duration`, `delay`, `easing`, `once`, `mirror`, `offset`, `disable`) as local overrides; it must be called under an `AOSProvider` or it throws.

## `AOSProvider` config reference

All of these are set once on `AOSProvider` as page/app-wide defaults, and any of them can be overridden per-element via `<AOS>` props or `useAOS(options)`:

| Prop          | Type                                                            | Default             | Notes |
| ------------- | ---------------------------------------------------------------- | -------------------- | ----- |
| `duration`    | `number` (ms)                                                    | `600`                | |
| `delay`       | `number` (ms)                                                    | `0`                  | |
| `easing`      | one of the `AOSEasing` strings (`'ease-out-cubic'`, `'ease-in-back'`, …) | `'ease-out-cubic'`   | Same curve names as classic `aos` |
| `once`        | `boolean`                                                        | `true`               | Set `false` if the element should re-animate every time it re-enters view |
| `mirror`      | `boolean`                                                        | `false`              | Animates back out on scroll-up; only meaningful combined with `once: false` |
| `offset`      | `number` (px)                                                    | `80`                 | Distance from the viewport edge that triggers the animation |
| `disable`     | `boolean \| 'phone' \| 'tablet' \| 'mobile' \| (() => boolean)`  | `false`              | Use a predicate for custom breakpoints instead of guessing a media query |
| `autoRefresh` | `(refresh: () => void) => void \| (() => void)`                 | —                    | Wire this to a router's navigation event so newly-rendered elements on route change get re-observed. Return a cleanup function if the subscription needs teardown. |

There is no public `AOS.refresh()`-style function to call manually (unlike classic `aos`) — `AOSProvider` already watches the DOM with a `MutationObserver`/`ResizeObserver`/scroll listener and re-evaluates automatically whenever content changes or the layout shifts. `autoRefresh` exists only for the one case that observer can't see coming: client-side route changes where a router swaps content without a full remount (e.g. wire it to `usePathname()` changes in Next.js, or a router's navigation event elsewhere). If a user migrating from `aos` asks "what replaces my `AOS.refresh()` calls after fetching data?", the answer is usually "nothing — it's automatic," not `autoRefresh`.

## Next.js App Router

`AOSProvider` uses React context, state, and effects, and the stylesheet import has side effects — none of that is safe in a Server Component. Isolate it behind `'use client'`, ideally in its own small providers file rather than marking a whole layout as client:

```tsx
// app/providers.tsx
'use client';

import { AOSProvider } from 'react-aos-provider';
import 'react-aos-provider/styles.css';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AOSProvider duration={800} once>
      {children}
    </AOSProvider>
  );
}
```

```tsx
// app/layout.tsx — stays a Server Component
import { Providers } from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

Individual pages/components using `<AOS>` or `useAOS` also need `'use client'` themselves, same as any component using hooks — this isn't specific to this package, but it's the error users hit most often ("useAOS must be used within an AOSProvider" or a hooks-in-server-component error) if they forget it.

For route-change re-evaluation with the App Router, wire `autoRefresh` to `usePathname()`/`useSearchParams()` changes (e.g. re-run `refresh()` in an effect keyed on the pathname) since there's no global router event to subscribe to the way there is with `next/router` in the Pages Router.

## Troubleshooting

- **Nothing animates / elements are just always visible or always hidden**: check that `import 'react-aos-provider/styles.css'` happened exactly once near the root. Without it there's no `.aos`/`.aos-animate` CSS, so elements either never transition or (if the consumer wrote their own opacity:0 base style) stay invisible forever.
- **"useAOS must be used within an AOSProvider" thrown**: the component calling `useAOS` (directly or via `<AOS>`) renders outside any `AOSProvider` ancestor — check the component tree, and on Next.js check the `'use client'` boundary is above both the provider and the consumer.
- **Animation fires once then never again on repeat visits to the same section**: expected when `once: true` (the default). Set `once={false}` on the provider or the specific `<AOS>` element.
- **Elements pop in already-visible on page load instead of animating**: usually means the element was already within `offset` px of the viewport on mount (before the user scrolls). Increase `offset` or accept that above-the-fold content animates immediately — this matches classic `aos` behavior too.
- **Works in dev, animations missing after `next build`**: almost always a missing `'use client'` directive that dev mode tolerated more loosely, or the stylesheet import living in a Server Component whose CSS side effect gets tree-shaken.
