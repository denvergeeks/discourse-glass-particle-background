# Twinkling Dot Grid Background (Discourse Theme Component)

A lightweight 2D canvas background for Discourse that renders a subtle, uniform grid of tiny square dots with independent, gentle star-like fading (twinkling). Zero mouse tracking or interactive ripple effects.

## Features

- **Autonomous Twinkling:** Each grid dot pulses smoothly on its own random sine-wave phase and frequency.
- **Pure 2D Canvas:** Zero external libraries (no Three.js, WebGL shaders, or bundle overhead).
- **Zero Mouse Interactions:** Completely non-interactive and pointer-events transparent.
- **Configurable in Discourse Admin:** Dot size, grid gap, min/max opacity, twinkle speed, dot color, and density.
- **Mobile & Battery Friendly:** Automatically pauses when the browser tab is hidden or when `prefers-reduced-motion` is active.

## Settings

| Setting | Default | Description |
|---|---|---|
| `enabled` | `true` | Toggle the entire background component. |
| `dot_color` | `#000000` | Hex color of the dots (`#000000` for light theme, `#ffffff` for dark). |
| `backdrop_color` | `transparent` | Optional solid or tinted background under the grid. |
| `dot_size` | `2` | Size of each dot in pixels. |
| `grid_gap` | `14` | Distance between grid points in pixels. |
| `min_opacity` | `0.04` | Baseline resting opacity for all grid dots. |
| `max_opacity` | `0.35` | Peak opacity when a dot reaches full twinkle. |
| `twinkle_speed` | `0.4` | Speed multiplier for the fade cycle. |
| `twinkle_density` | `0.15` | Portion of grid dots (0.01 - 1.0) that actively pulse. |
