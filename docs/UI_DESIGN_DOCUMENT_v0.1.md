# UI Design Document v0.1

## Design Direction

Use the Sahara visual system from the supplied prototype as the starting point: warm minimalism, editorial headings, restrained density, soft borders, and practical product storytelling.

## Principles

- Show the usable product surface first.
- Keep AI framed as a practical workflow layer.
- Prefer source-backed proof over generic capability claims.
- Make sectors, capabilities, projects, and people easy to connect.
- Keep generated/assistant content visually distinct from authored portfolio content.

## Visual Tokens

Colors:

- Background: `#faf5ee`
- Surface: `#fffaf4`
- Surface muted: `#f2eadf`
- Primary: `#c2652a`
- Primary dark: `#8b3f1b`
- Tertiary: `#8c3c3c`
- Text: `#2d2520`
- Muted text: `#71655d`
- Border: `#ded3c8`

Typography:

- Display/headings: Georgia-style editorial serif fallback.
- Body and controls: system sans-serif.
- Labels: uppercase, small, increased letter spacing.

Components:

- Buttons: 8px radius, primary fill or warm outline.
- Cards: 8px radius, single-level only.
- Inputs: white/surface background, warm border, sienna focus.
- Tags: compact pills for sectors and capabilities.
- Assistant answer: rendered as a sourced response card with related records.

## Current Public Pages

Phase 1 implements a single-page shell with sections:

- Home: product suite positioning, capability categories, featured projects.
- Work: searchable/filterable project cards.
- Studio: team profiles and capability matrix.
- Assistant: source-grounded Q&A demo from approved portfolio seed content.

## Future Screen Map

Product 1:

- Public landing page.
- Team overview.
- Person profile.
- Project index.
- Project case study.
- Portfolio assistant drawer/page.
- Admin CMS: team, skills, sectors, projects, case studies, contributions.

Product 2:

- Audit intake wizard.
- Health score summary.
- Audit report.
- Recommendation and roadmap.
- Risk matrix.
- Export preview.

Product 3:

- Idea intake wizard.
- Generated PRD.
- MVP scope planner.
- Feature priority board.
- User stories.
- Launch checklist.

Product 4:

- Upload/paste workspace.
- Document summary.
- Document Q&A.
- Risk and obligation extraction.
- Draft tasks.
- Task approval.
- Export preview.

## Responsive Behavior

- Navigation collapses into stacked links on narrow screens.
- Project and team cards move from multi-column to single-column.
- Hero copy stays compact enough to reveal the next section.
- Filters wrap without overflow.
- Assistant answer and sources stack on smaller viewports.
