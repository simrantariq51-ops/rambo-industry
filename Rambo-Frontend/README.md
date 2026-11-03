# Rambo / M. Nwaz Industry — Website

A modern, premium industrial-corporate website built with React, Vite,
Tailwind CSS and Framer Motion.

## Tech stack

- React 19 + Vite
- Tailwind CSS v4 (via `@tailwindcss/postcss`)
- Framer Motion for animation
- lucide-react for icons

## Getting started

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (typically `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview   # serve the production build locally
```

## Project structure

```
src/
  assets/          Logo and brand image
  data/
    content.js     All site copy, stats, industries, services, projects,
                    testimonials, FAQ, and footer links in one place —
                    edit this file to change content without touching JSX
  components/
    ui/            Reusable primitives: Button, Counter, SectionTag,
                    SocialIcons
    Navbar.jsx      Sticky nav with scroll-shrink + mobile menu
    Hero.jsx        Full-screen hero with animated grid/particles
    Stats.jsx       Animated counters
    About.jsx
    Industries.jsx
    Services.jsx
    Technology.jsx
    Projects.jsx    Filterable case-study grid
    WhyChooseUs.jsx
    QualitySafety.jsx
    Sustainability.jsx
    Clients.jsx
    Testimonials.jsx  Auto-advancing carousel
    Certifications.jsx
    Careers.jsx
    FAQ.jsx         Accordion
    Contact.jsx     Validated quote-request form (client-side only)
    Footer.jsx
  App.jsx           Assembles all sections in order
  index.css         Tailwind import + design tokens (colors, fonts) +
                     shared utility classes (blueprint grid, corner
                     marks, hazard rule)
```

## Design notes

- **Palette**: deep navy/charcoal base pulled from the brand logo, steel
  gray for secondary text, amber for CTAs and highlights, with a warm
  off-white ("paper") for light sections instead of pure white.
- **Signature motif**: thin corner "registration marks" on framed images
  and small monospace `FIG. 01 —` section labels, echoing engineering
  drawings/spec sheets rather than a generic numbered-badge layout.
- **Imagery**: hero and section photography currently point to
  royalty-free Unsplash URLs as placeholders. Swap the `image` fields in
  `src/data/content.js` (and the inline `src` in `Hero.jsx`,
  `About.jsx`, `QualitySafety.jsx`, `Careers.jsx`) for your own
  photography before launch.
- **Contact form**: validates client-side and shows a success/error
  state, but is not wired to a backend or email service yet — connect
  it to your form endpoint of choice (e.g. Formspree, a serverless
  function, or your CRM's API) in `src/components/Contact.jsx`.
- **Map**: the contact section has a placeholder map panel — swap in a
  Google Maps embed or Mapbox widget with your real office coordinates.

## Notes for going further

- Colors, fonts and spacing are all defined as design tokens in
  `src/index.css` under `@theme` — change them there to re-theme the
  whole site.
- All copy lives in `src/data/content.js`, so marketing content can be
  updated without touching component code.
