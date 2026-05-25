# Bernoulli Frontend

## Overview

Bernoulli Frontend is the visualization layer of the Bernoulli platform.

It consumes telemetry data from the backend API and presents it through dashboards, logs, and time-series visualizations.

The goal is to provide clear and simple operational visibility into industrial telemetry.

---

## Responsibilities

- Fetch telemetry data from the backend API
- Display latest readings per gateway
- Display recent updates (log-style)
- Display time-series charts for selected tags
- Provide filtering by tag and time range

---

## Principles

- **Simple first**: avoid unnecessary abstractions
- **Read-only UI**: frontend does not own business logic
- **Data-driven**: UI reflects backend state directly
- **Predictable**: explicit data flow, no hidden logic
- **Reusable components**: build UI pieces that can scale

---

## Tech Stack

- React
- TypeScript
- TailwindCSS
- Tailwind Merge (class management)
- Prettier (formatting)

---

## Running the Project

Install dependencies:

```bash id="fe402"
npm install
```

Run development server:

```bash id="fe403"
npm run dev
```

App runs at:

```text id="fe404"
http://localhost:5173
```

Run with Docker Compose:

```bash
docker compose up
```

The container serves the production build at:

```text
http://localhost:5173
```

---

## Build

```bash id="fe405"
npm run build
```

Preview build:

```bash id="fe406"
npm run preview
```

---

## Project Structure

```text id="fe407"
src/
├── app/          # app setup (providers, root)
├── components/   # reusable UI components
├── features/     # domain logic (telemetry, charts, etc.)
├── services/     # API layer
├── hooks/        # reusable logic hooks
├── types/        # TypeScript types
└── utils/        # helpers
```

---

## Styling

The project uses TailwindCSS with:

- `tailwind-merge` for class composition
- predefined color palette (no hardcoded colors)
- consistent spacing and layout rules

---

## Data Model

The frontend consumes telemetry events:

```json id="fe408"
{
  "event_id": "uuid",
  "gateway_id": "gateway-001",
  "tag_name": "pressure",
  "value": 12.5,
  "collected_at": "timestamp",
  "source_timestamp": "timestamp",
  "quality": "GOOD"
}
```

---

## Notes

This project is part of the Bernoulli observability pipeline.

It focuses only on visualization.

All data integrity, validation, and ingestion logic belong to the backend.
