# Console Backlog

## Purpose

Tracks the implementation and evolution of the Bernoulli Console frontend.

This project is responsible for:

- consuming the `bernoulli-observability` API
- rendering read-only dashboard views
- presenting telemetry from `bernoulli-gateway`
- keeping UI behavior simple and client-focused for the POC

It does not include backend, gateway, portal, admin, or business-rule
responsibilities.

---

## POC Milestone

- [x] Load telemetry for one configured gateway
- [x] Add refresh-rate selector for polling the API
- [x] Render pump state
- [x] Render three tank summaries
- [x] Render production totals by tank
- [x] Add production charts with an approved charting library

---

## Dashboard Context

The first dashboard is for one example industry with:

- three tanks
- one pump
- one valve per tank
- one flow meter per tank

The telemetry path is:

```text
PLC -> bernoulli-gateway -> bernoulli-observability API -> bernoulli-console
```

The current dashboard polls the API for POC visibility. The next dashboard
iteration should load current state once and then consume live state updates
from the observability API.

There is no company/client model yet. Treat this as one client-specific
dashboard until a configurable dashboard model is justified.

---

## Simulator Tags

These are the current simulator/gateway tags consumed by the POC dashboard.
They are inputs consumed by the console, not implementation tasks for this
project.

Current required tags:

```text
pump
tank_1_valve
tank_1_flow
tank_2_valve
tank_2_flow
tank_3_valve
tank_3_flow
```

Suggested future tags if estimated production is not enough:

```text
tank_1_volume
tank_1_level_percent
tank_1_production_total
tank_2_volume
tank_2_level_percent
tank_2_production_total
tank_3_volume
tank_3_level_percent
tank_3_production_total
production_total
```

---

## Frontend Foundation

- [x] Add telemetry API service in `services/`
- [x] Add telemetry event TypeScript types
- [x] Add tank tag TypeScript types
- [x] Add hook for loading telemetry for one gateway
- [x] Add refresh-rate selector with simple second-based options
- [x] Poll the API using the selected refresh rate
- [x] Allow refresh to be paused or disabled if needed during development
- [x] Add loading, empty, and error states
- [x] Keep gateway id environment-based for the POC
- [x] Keep data preparation out of rendering components

---

## Tank Overview

- [x] Show one section per tank
- [x] Show latest flow rate per tank
- [x] Show valve state per tank
- [x] Show pump state once at page level
- [x] Derive displayed state from latest returned telemetry events
- [ ] Show latest volume per tank when volume tags exist
- [ ] Show optional tank level percent when available

---

## Production Views

- [x] Daily production by tank
- [x] Monthly production by tank
- [x] Total yearly production card
- [x] Monthly overview section
- [x] Clear units and timestamp context
- [x] Empty states for missing or incomplete production tags
- [ ] Replace flow-based production estimates with API aggregates when available

---

## Charts

- [x] Bar chart for daily production per tank
- [x] Bar chart for monthly production per tank
- [x] Pie chart for production share per tank
- [x] Use approved charting library: `recharts`

---

## UI & Architecture Rules

- [x] Keep the dashboard single-page
- [x] Avoid routing until needed
- [x] Avoid global state libraries
- [x] Keep components small and rendering-focused
- [x] Keep API calls inside `services/`
- [x] Keep reusable UI state in hooks
- [x] Use TailwindCSS and `tailwind-merge`
- [x] Use only configured palette colors

---

## API Integration Gaps

- [ ] Use a latest-state endpoint when available to avoid polling full history for
      current values
- [ ] Use a machine-state endpoint when available so the frontend does not own
      tag-to-machine-state business rules.
- [ ] Split dashboard data loading into:
      - current state for cards/status
      - history/aggregates for charts
- [ ] Use backend daily/monthly/yearly production aggregates when available
- [ ] Confirm browser CORS settings for local Vite access to the observability API
- [ ] Revisit the `limit=5000` history cap once production history grows beyond
      the POC data volume

---

## Live State Updates

- [ ] Add a telemetry stream service using `EventSource` when the backend SSE
      endpoint exists.
- [ ] Load current state before opening the stream so refresh/reconnect starts
      from a complete snapshot.
- [ ] Merge incoming live updates into dashboard state without refetching full
      history.
- [ ] Keep manual refresh as a resync action for connection recovery.
- [ ] Show live connection state:
      - connecting
      - live
      - reconnecting
      - stale
      - offline
- [ ] Treat analog values as latest state only; avoid appending every live
      flowmeter update into chart history on the client.
- [ ] Keep fixed-rate polling only as a fallback mode while SSE is unavailable.

---

## Out Of Scope

- [ ] Multi-company support
- [ ] User accounts
- [ ] Authentication and authorization
- [ ] Dashboard builder or configurable layouts
- [ ] Gateway config editor
- [ ] Backend business logic in the frontend
- [ ] WebSocket command/control interactions
- [ ] Alerting
- [ ] Historical report exports
- [ ] Complex chart interactions

---

## Recommended Next Step

Implement the smallest useful vertical slice:

```text
load latest state -> render tank/pump state -> subscribe to live updates -> merge updates into current state
```

After that, move production totals and charts to dedicated history or aggregate
API calls.
