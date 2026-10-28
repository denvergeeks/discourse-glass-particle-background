# Discourse Glass Particle Background

Experimental installable theme component: fixed decorative glass and particle background, no visitor controls, no changes to post/topic/header backgrounds. Standalone demo remains separate. This component has not been compiled or tested in Discourse yet. Preview before enabling on a production theme.

## Install

In Admin > Customize > Themes install from this Git repository and attach the component to a test theme. Preview it before attaching to your active theme. Adjust component settings and reload the page.

## Architecture and dependencies

Uses api.renderInOutlet with above-main-container, a Glimmer component, and destructor cleanup. Loads pinned Three.js 0.160.1 from jsDelivr using Discourse loadScript. This older UMD distribution provides window.THREE without injecting an import map into Discourse. It intentionally differs from the standalone demo's 0.184.0 dependency. The CDN is explicitly allowed in config/settings.yml; never disable CSP. Check the browser console if local CSP policy still blocks it. Other components defining window.THREE may conflict; preview on the target forum. No npm installation or server plugin is required.

## Behavior

Disabled on mobile view, widths below 768px, and reduced-motion preference. Existing animations stop when hidden or when the media query matches. If initially disabled by the media query, reload after changing the viewport/preference to initialize. The canvas uses opacity 0.25 and a negative layer within body isolation to sit above the body background but behind normal forum content. Existing opaque theme surfaces can conceal it. Their transparency is deliberately not changed; do not globally make posts transparent. Theme-specific stacking contexts may require CSS adjustment after preview.

Particles use a lightweight CPU update and square point sprites with color fading at the shield, not the original soft-dot noise dissolve. Refraction is a simplified RGB texture effect. This is an independent approximation, not a pixel-identical copy or redistribution of Moderation API source. Only scene content is refracted, not arbitrary HTML.

## Settings

Enable switch; background opacity; particle count, speed, harmful ratio and colors; glass width; refraction; aberration; ripple. Changes require a reload. Mobile animation is intentionally unavailable in this first version.

## Test before production

Verify no build/console errors; preview latest/categories/topic routes; check clicks, composer, menus and scrolling; navigate between routes and ensure no duplicate canvas; check mobile/reduced motion and hidden-tab behavior; detach the component and verify cleanup. Confirm readability in light and dark schemes. Start with low opacity and particle count. If invisible, inspect stacking and opaque theme surfaces rather than raising the canvas above forum content.

Disable or detach the component to roll back. No live forum settings are modified by this repository commit.
