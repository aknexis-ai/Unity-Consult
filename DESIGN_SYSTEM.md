# Unity Consult Design System

## Tokens

| Token | Value | Usage |
| --- | --- | --- |
| `--space-1` | `4px` | Fine gaps, icon offsets |
| `--space-2` | `8px` | Tight inline spacing |
| `--space-3` | `12px` | Small card rhythm |
| `--space-4` | `16px` | Form and button spacing |
| `--space-6` | `24px` | Card padding and grid gaps |
| `--space-8` | `32px` | Section internal blocks |
| `--space-12` | `48px` | Desktop section rhythm |
| `--space-16` | `64px` | Hero and large section rhythm |

## Typography

| Role | Rule |
| --- | --- |
| Hero | `clamp(3.8rem, 8vw, 7.4rem)`, tight tracking, line-height near `0.9` |
| H2 | `clamp(2.15rem, 4vw, 4rem)`, strong hierarchy |
| H3 | `1.25rem` to `1.75rem`, section-card title |
| Body | `1rem` to `1.08rem`, high contrast on dark surfaces |
| Label | Uppercase eyebrow, letter-spaced, accent blue |
| Meta | Muted text, never below readable contrast |

## Cards

| Card Type | Radius | Padding | Depth |
| --- | --- | --- | --- |
| Standard | `28px` | `clamp(1.25rem, 3vw, 2rem)` | Soft border and low shadow |
| Premium visual | `30px` | Image + body split | Strong shadow, accent glow |
| Dashboard | `24px` | `1rem - 1.5rem` | Compact, data-first |
| Form | `24px` | `1rem` | Clear field hierarchy |

## Icon Rules

Use Lucide icons only. Navigation icons must have visible labels. Feature icons use `24px`; inline action icons use `16px`; status icons use `18px`. Icons must support the label, not replace it.

## Motion Rules

| Motion | Rule |
| --- | --- |
| Scroll reveal | `420ms ease`, `28px` vertical travel |
| Counter | `1200ms`, ease-out cubic |
| Hover | `150ms - 220ms`, transform only when it improves affordance |
| Marquee | Linear, pause on hover when interactive |
| Reduced motion | All reveal transforms disabled under `prefers-reduced-motion` |

## Responsive Rules

Mobile is single-column by default. Tablet moves to two-column where content remains readable. Desktop can use three-column grids only when cards contain short comparable content. Touch targets must be at least `44px`; inputs must be full-width and at least `48px` tall on mobile.

## Page Composition

Every public page should include at least one meaningful visual anchor, a clear conversion action, and a proof signal. Repeated card grids must be broken up with editorial layouts, visual frames, proof strips, or timeline sections.
