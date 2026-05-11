# AGENTS.md

## Purpose

Defines how AI agents must operate in this frontend project.

---

## Core Rule

This is a **read-only visualization layer**.

Do not introduce backend or business logic here.

---

## Architecture Rules

### Separation of Concerns

- components → rendering only
- hooks → logic and state
- services → API calls

Never mix these responsibilities.

---

## Component Rules

- components must be reusable
- components must be small and focused
- no API calls inside components
- no complex logic inside components

---

## Styling Rules

- use TailwindCSS
- use `tailwind-merge` for class composition
- avoid long unreadable class strings

### Color Rules

- never hardcode colors
- use predefined color palette
- use semantic naming where possible

---

## Code Quality Rules

- code must be easy to read
- avoid nested logic
- avoid unnecessary abstractions
- prefer clarity over cleverness

---

## Data Fetching Rules

- all API calls go through `services/`
- hooks wrap services for UI usage
- no direct fetch/axios in components

---

## State Rules

- prefer local state
- use hooks for reuse
- do not introduce global state libraries unless approved

---

## Library Rules

Do NOT introduce without approval:

- state management libraries
- UI frameworks
- charting libraries

If needed:

1. explain why
2. compare options
3. wait for approval

---

## Prettier & Formatting

- code must be formatted with Prettier
- Tailwind classes must remain readable
- avoid class duplication (use tailwind-merge)

---

## Commit Rules

Format:

```text id="fe602"
type: message
```

Examples:

- feat: add telemetry table
- fix: correct timestamp formatting
- refactor: extract chart hook

---

## Definition of Done

A task is complete when:

- UI behaves correctly
- data flow is clear
- code is readable
- no architectural rules are broken
- no unnecessary complexity was introduced

---

## Self-Validation

Before finishing:

- check separation of concerns
- check readability
- check no business logic leaked into UI
- check styles follow palette rules
- check no hardcoded values were introduced
