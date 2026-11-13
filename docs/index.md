---
layout: home
title: Tunewind
order: 0

hero:
  name: tunewind
  text: Bring design system standards to Tailwind
  tagline: A highly configurable, strongly constrained and extensible atomic CSS solution and design system.
  actions:
    - theme: brand
      text: Get Started
      link: ./guide/getting-started.md
    - theme: alt
      text: Concepts
      link: ./guide/concepts.md
    - theme: alt
      text: GitHub
      link: https://github.com/Twisuki/tunewind

features:
  - title: Tailwind compatible
    details: Class syntax, variants and breakpoints follow Tailwind, so existing markup keeps working; constraints apply only to color and size values.
  - title: Color whitelist
    details: Colors and opacities are declared in config, and undeclared combinations produce no styles; changing the primary color is a single config edit.
  - title: Size units
    details: Numeric sizes are computed from units and ranges, so out-of-range numbers have no effect and one class can follow a different basis per breakpoint.
  - title: Strict mode
    details: Arbitrary values and raw color families can be disabled per check, with an escape prefix for real exceptions.
  - title: Diagnostics
    details: Removed classes can warn or fail the build, which lets CI reject violations.
---
