# Rainbow Twinkling Dot Grid Background (Discourse Theme Component)

A lightweight 2D canvas background for Discourse that renders a subtle, uniform grid of tiny square dots in full rainbow hues with gentle, autonomous twinkling (like colorful stars).

## Features

- **Full Rainbow Palette:** Each grid dot receives a randomized spectral hue across 360° of color.
- **Autonomous Twinkling:** Each dot gently pulses on its own sine-wave phase and frequency.
- **Pure 2D Canvas:** Zero external dependencies (no Three.js or WebGL).
- **Zero Mouse Tracking:** Completely non-interactive and pointer-events transparent.
- **Configurable:** Dot size, grid gap, min/max opacity, twinkle speed, rainbow saturation, and lightness.
- **Mobile & Battery Friendly:** Pauses when the tab is hidden or when reduced motion is preferred.

## Settings

| Setting | Default | Description |
|---|---|---|
| `enabled` | `true` | Toggle the background on/off. |
| `color_mode` | `rainbow` | `rainbow` (full spectrum) or `solid` (uses `dot_color`). |
| `dot_color` | `#000000` | Fallback color when `color_mode` is `solid`. |
| `backdrop_color` | `transparent` | Optional backdrop color under the grid. |
| `dot_size` | `1` | Dot size in pixels. |
| `grid_gap` | `4` | Distance between dots in pixels. |
| `min_opacity` | `0.04` | Baseline resting opacity of dots. |
| `max_opacity` | `0.40` | Peak opacity when dots twinkle. |
| `twinkle_speed` | `0.8` | Speed multiplier for fading cycle. |
| `twinkle_density` | `0.25` | Percentage of dots that twinkle. |
| `rainbow_saturation` | `85` | Saturation % of rainbow dots. |
| `rainbow_lightness` | `50` | Lightness % of rainbow dots (adjust for light/dark themes). |
