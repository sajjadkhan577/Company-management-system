---
name: Modern Corporate SaaS
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45464d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#111c2d'
  on-tertiary-container: '#79849a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#d8e3fb'
  tertiary-fixed-dim: '#bcc7de'
  on-tertiary-fixed: '#111c2d'
  on-tertiary-fixed-variant: '#3c475a'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  sidebar-width: 280px
  container-max-width: 1440px
  gutter: 24px
  margin-desktop: 32px
  margin-tablet: 24px
  margin-mobile: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
---

## Brand & Style
This design system is engineered for high-performance enterprise environments, emphasizing clarity, authority, and streamlined workflows. The brand personality is rooted in **Corporate Modernism**, blending the traditional stability of institutional finance with the agility of contemporary software.

The target audience consists of executives, HR managers, and operations leads who require a tool that feels both powerful and easy to navigate. By utilizing a minimalist foundation punctuated by glassmorphic depth, the UI evokes an emotional response of organized control and professional transparency. The aesthetic is crisp and functional, prioritizing information density without sacrificing visual breathing room.

## Colors
The palette is dominated by "Midnight Navy" (#0F172A), used to anchor the navigation and primary brand elements, ensuring a sense of permanence and trust. "Emerald Green" (#10B981) is reserved for primary actions, success states, and growth indicators, providing a high-contrast focal point against the dark neutrals.

Backgrounds utilize a "Cool Slate" (#F8FAFC) to reduce eye strain during long work sessions, while white (#FFFFFF) is used strictly for elevated surfaces and card containers. This hierarchy ensures that the most important data—the content within the cards—is always the most luminous element on the screen.

## Typography
Inter is the exclusive typeface for this design system, chosen for its exceptional legibility in data-heavy interfaces. The typographic scale is built on a tight ratio to maintain a compact, professional feel. 

Headlines utilize a bold weight and slight negative letter-spacing to appear more authoritative and cohesive. Body text remains at standard tracking for maximum readability. Labels and "Small" variants are used for metadata, table headers, and sidebar items, often employing a medium or semi-bold weight to maintain hierarchy at smaller scales.

## Layout & Spacing
The design system employs a **Sidebar-led Fluid Grid**. The navigation remains fixed to the left at 280px, while the main content area expands to a maximum width of 1440px to prevent line lengths from becoming unreadable on ultra-wide monitors.

A 12-column grid is used for dashboard layouts, with a 24px gutter ensuring clear separation between data widgets. Spacing follows an 8px base unit (4, 8, 16, 24, 32, 48, 64) to create a consistent vertical rhythm. On mobile devices, the sidebar collapses into a hidden drawer, and margins tighten to 16px to maximize screen real estate.

## Elevation & Depth
Depth is created through a "Layered Glass" approach. Instead of traditional heavy shadows, this design system uses:

1.  **The Base:** The Cool Slate (#F8FAFC) background.
2.  **The Canvas:** White cards with a very subtle 1px border (#E2E8F0) and a soft ambient shadow (Y: 4px, Blur: 6px, Opacity: 4%).
3.  **The Overlay (Glassmorphism):** Modals and dropdown menus utilize a semi-transparent white background (80% opacity) with a 12px backdrop blur. This maintains context of the data underneath while focusing the user's attention.
4.  **The Interactive Layer:** Elements like buttons and active sidebar items use a slight "lift" on hover, achieved by increasing the shadow spread and slightly lightening the background color.

## Shapes
The shape language is "Rounded," utilizing a 0.5rem (8px) corner radius for most standard components like cards, input fields, and buttons. This strikes a balance between the rigid "sharp" corners of legacy enterprise software and the overly "bubbly" feel of consumer apps. 

Large containers and modal windows should use `rounded-xl` (1.5rem) to emphasize their role as distinct architectural layers. Secondary elements like tags or "status pills" should use full rounding (pill-shaped) to distinguish them from interactive buttons.

## Components

-   **Buttons:** Primary buttons are Emerald (#10B981) with white text. Secondary buttons use a transparent background with a Midnight Navy (#0F172A) outline. Use `rounded-md` for all button shapes.
-   **Stat Cards:** These are the core of the dashboard. They should feature a white background, a subtle border, and the primary metric in `headline-lg`. A small trend indicator (using Emerald for up, and a soft red for down) should be tucked in the bottom right.
-   **Input Fields:** Use a light gray background (#F1F5F9) for the input area to make the field identifiable on white cards. On focus, the border transitions to Emerald.
-   **Sidebar:** The sidebar uses a dark theme (#0F172A) to contrast with the light content area. Active states should be indicated by an Emerald left-accent bar and a subtle background tint (#1E293B).
-   **Data Tables:** Clean, no-border rows with a light gray header. Use `body-sm` for table content to maximize data density. Use alternating row stripes (zebra striping) only for tables exceeding 10 rows.
-   **Status Chips:** Small, pill-shaped indicators. "Success" uses Emerald; "Pending" uses a muted Amber; "Critical" uses a soft Coral. Text within chips should always be `label-sm`.