---
name: AgroGuardian AI
colors:
  surface: '#0e1511'
  surface-dim: '#0e1511'
  surface-bright: '#333b37'
  surface-container-lowest: '#09100c'
  surface-container-low: '#161d1a'
  surface-container: '#1a211e'
  surface-container-high: '#242c28'
  surface-container-highest: '#2f3632'
  on-surface: '#dde4de'
  on-surface-variant: '#bacbb5'
  inverse-surface: '#dde4de'
  inverse-on-surface: '#2b322e'
  outline: '#849581'
  outline-variant: '#3b4b3a'
  surface-tint: '#00e554'
  primary: '#efffea'
  on-primary: '#00390e'
  primary-container: '#26ff63'
  on-primary-container: '#007125'
  inverse-primary: '#006e24'
  secondary: '#a6e6ff'
  on-secondary: '#003543'
  secondary-container: '#14d1ff'
  on-secondary-container: '#00566b'
  tertiary: '#ecfff1'
  on-tertiary: '#24342b'
  tertiary-container: '#d0e2d5'
  on-tertiary-container: '#55655a'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6dff7f'
  primary-fixed-dim: '#00e554'
  on-primary-fixed: '#002106'
  on-primary-fixed-variant: '#005319'
  secondary-fixed: '#b7eaff'
  secondary-fixed-dim: '#4cd6ff'
  on-secondary-fixed: '#001f28'
  on-secondary-fixed-variant: '#004e60'
  tertiary-fixed: '#d5e7d9'
  tertiary-fixed-dim: '#b9cbbe'
  on-tertiary-fixed: '#101f16'
  on-tertiary-fixed-variant: '#3b4a40'
  background: '#0e1511'
  on-background: '#dde4de'
  surface-variant: '#2f3632'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.0'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-padding: 24px
  gutter: 16px
  stack-sm: 4px
  stack-md: 12px
  stack-lg: 32px
---

## Brand & Style
The design system embodies a "High-Tech Organic" aesthetic, merging the raw vitality of nature with the cold precision of advanced robotics and predictive AI. It is designed for agricultural professionals who manage large-scale automated ecosystems, requiring a UI that feels both authoritative and life-sustaining.

The visual direction utilizes a sophisticated **Glassmorphism** approach. Interfaces are composed of semi-transparent layers that mimic laboratory equipment or advanced greenhouse panes, allowing data to float over deep, organic backgrounds. The emotional response is one of absolute control, intelligent foresight, and sustainable growth.

## Colors
The palette is rooted in the "Midnight Harvest" spectrum. 
- **Primary (Sprout Green):** A high-vibrancy, neon-leaning green used for active growth indicators, healthy vitals, and primary actions.
- **Secondary (Tech Blue):** A precise cyan used exclusively for data streams, connectivity status, and AI-driven insights.
- **Backgrounds:** A tiered system of deep greens (#050B08 to #0B1A12) provides a low-light environment that reduces eye strain during night monitoring and makes glowing data points pop.
- **Alerts:** High-contrast Amber and Red are reserved for emergency overrides, irrigation failures, or biological threats.

## Typography
The system uses a dual-font approach to balance human readability with technical precision.
- **Geist** serves as the primary typeface for communication and navigation. Its clean, geometric shapes feel modern and engineered.
- **JetBrains Mono** is utilized for all telemetry, coordinates, and sensor readings. This monospaced font ensures that fluctuating data values remain vertically aligned and easy to scan in real-time dashboards.
- Use `label-caps` for technical metadata and sensor identifiers to differentiate them from instructional text.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a 12-column structure for desktop. Elements are organized into modular "pods" or "tiles" that can reflow based on the priority of the agricultural data being displayed.

- **Margins:** 24px on mobile, 48px on desktop to provide a sense of expansive space.
- **Gutters:** Tight 16px gutters to maintain a high-density, technical information display.
- **Alignment:** Strictly mathematical. Use the 8px base unit for all component spacing to reinforce the "precision-engineered" feel.

## Elevation & Depth
Depth is created through **Glassmorphism and Glow**, rather than traditional drop shadows.
- **Surface Level 1:** Deepest green background, opaque.
- **Surface Level 2 (Glass):** Semi-transparent (15-25% opacity) with a 20px backdrop blur and a 1px inner border (Sprout Green at 10% opacity) to define the edge.
- **Active Elevation:** When an element is selected or requires attention, it gains an outer glow (box-shadow: 0 0 15px) using the Primary or Secondary color, simulating a powered-on state.

## Shapes
This design system uses a **Level 2 (Rounded)** language. 
- A 0.5rem (8px) radius is the standard for cards and buttons, providing a "soft-tech" feel that avoids the aggression of sharp corners while remaining more structured than pill shapes.
- Use 1px "micro-borders" on all containers to simulate high-precision manufacturing. 
- Interactive elements like sliders and toggles should feature subtle chamfered or notched details in their icons to emphasize the industrial-tech aesthetic.

## Components
- **Buttons:** Primary buttons use a solid Sprout Green fill with black text for maximum contrast. Secondary buttons use a glass background with a Sprout Green stroke.
- **Data Chips:** Small, monospaced labels with a subtle glow background (Secondary Blue) used for soil pH, moisture levels, or drone battery status.
- **Input Fields:** Dark, recessed backgrounds with a glowing bottom border that activates on focus. Placeholder text should use `data-mono`.
- **Status Cards:** Use the Glassmorphism style with a vertical "health bar" on the left edge (Green/Amber/Red) to provide instant visual status of a specific field or sector.
- **Glow Lines:** Use thin, animated SVG paths for connecting data points in maps or diagrams, colored in Secondary Blue to represent active data flow.
- **Telemetry Lists:** High-density lists using JetBrains Mono, with alternating row highlights (5% opacity) for readability.