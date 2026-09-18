# Remove AI Label & Metadata from Photos – Free, No Upload

## Mission
Create implementation-ready, token-driven UI guidance for Remove AI Label & Metadata from Photos – Free, No Upload that is optimized for consistency, accessibility, and fast delivery across documentation site.

## Brand
- Product/brand: Remove AI Label & Metadata from Photos – Free, No Upload
- URL: https://removeailabel.com/
- Audience: developers and technical teams
- Product surface: documentation site

## Style Foundations
- Visual style: structured, tokenized, content-first
- Main font style: `font.family.primary=Inter`, `font.family.stack=Inter, Inter Fallback`, `font.size.base=19px`, `font.weight.base=400`, `font.lineHeight.base=28.5px`
- Typography scale: `font.size.xs=14.25px`, `font.size.sm=16.63px`, `font.size.md=17.81px`, `font.size.lg=19px`, `font.size.xl=21.38px`, `font.size.2xl=28.5px`, `font.size.3xl=35.63px`, `font.size.4xl=42.75px`
- Color palette: `color.text.primary=#ebebeb`, `color.text.secondary=oklab(0.928797 -0.00316215 -0.0121768 / 0.8)`, `color.text.tertiary=lab(66.2718 -0.335515 -7.12347)`, `color.text.inverse=lab(57.3317 15.3854 -70.81)`, `color.surface.base=#000000`, `color.surface.muted=lab(16.2244 -0.476554 -13.2095)`, `color.surface.strong=lab(7.77863 1.58628 -14.2877)`, `color.border.default=#666666`, `color.border.muted=lab(36.0651 -0.211209 -9.63474)`, `color.border.strong=oklab(0.709998 -0.00166321 -0.0189102 / 0.25)`
- Spacing scale: `space.1=7.13px`, `space.2=9.5px`, `space.3=14.25px`, `space.4=19px`, `space.5=23.75px`, `space.6=28.5px`, `space.7=38px`, `space.8=57px`
- Radius/shadow/motion tokens: `radius.xs=4px`, `radius.sm=7.13px`, `radius.md=14.25px` | `shadow.1=rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px`, `shadow.2=rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px`, `shadow.3=rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 1px, rgba(0, 0, 0, 0) 0px 0px 0px 0px` | `motion.duration.instant=150ms`, `motion.duration.fast=200ms`

## Accessibility
- Target: WCAG 2.2 AA
- Keyboard-first interactions required.
- Focus-visible rules required.
- Contrast constraints required.

## Writing Tone
Concise, confident, implementation-focused.

## Rules: Do
- Use semantic tokens, not raw hex values, in component guidance.
- Every component must define states for default, hover, focus-visible, active, disabled, loading, and error.
- Component behavior should specify responsive and edge-case handling.
- Interactive components must document keyboard, pointer, and touch behavior.
- Accessibility acceptance criteria must be testable in implementation.

## Rules: Don't
- Do not allow low-contrast text or hidden focus indicators.
- Do not introduce one-off spacing or typography exceptions.
- Do not use ambiguous labels or non-descriptive actions.
- Do not ship component guidance without explicit state rules.

## Guideline Authoring Workflow
1. Restate design intent in one sentence.
2. Define foundations and semantic tokens.
3. Define component anatomy, variants, interactions, and state behavior.
4. Add accessibility acceptance criteria with pass/fail checks.
5. Add anti-patterns, migration notes, and edge-case handling.
6. End with a QA checklist.

## Required Output Structure
- Context and goals.
- Design tokens and foundations.
- Component-level rules (anatomy, variants, states, responsive behavior).
- Accessibility requirements and testable acceptance criteria.
- Content and tone standards with examples.
- Anti-patterns and prohibited implementations.
- QA checklist.

## Component Rule Expectations
- Include keyboard, pointer, and touch behavior.
- Include spacing and typography token requirements.
- Include long-content, overflow, and empty-state handling.
- Include known page component density: links (118), buttons (11), cards (7), navigation (2), lists (2), inputs (1).

- Extraction diagnostics: Audience and product surface inference confidence is low; verify generated brand context.

## Quality Gates
- Every non-negotiable rule must use "must".
- Every recommendation should use "should".
- Every accessibility rule must be testable in implementation.
- Teams should prefer system consistency over local visual exceptions.
