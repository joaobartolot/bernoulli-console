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

- [ ] Confirm dashboard tag contract with `bernoulli-gateway`
- [ ] Confirm dashboard API shape with `bernoulli-observability`
- [ ] Load telemetry for one configured gateway
- [ ] Add refresh-rate selector for polling the API
- [ ] Render pump state
- [ ] Render three tank summaries
- [ ] Render production totals by tank
- [ ] Add simple production charts after chart requirements are clear

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

Telemetry is cycle-based at the gateway. The console should poll the API on a
selected interval instead of treating the data as real time.

There is no company/client model yet. Treat this as one client-specific
dashboard until a configurable dashboard model is justified.

---

## Gateway Tag Contract

- [ ] Define stable tag names in `gateway.yaml`
- [ ] Document required tank tags
- [ ] Document optional tank tags
- [ ] Decide where units and display labels live for the POC
- [ ] Keep missing optional tags from breaking the UI

Suggested required tags:

```text
tank_1_volume
tank_1_flow_rate
tank_1_valve_open
tank_2_volume
tank_2_flow_rate
tank_2_valve_open
tank_3_volume
tank_3_flow_rate
tank_3_valve_open
pump_running
```

Optional tags:

```text
tank_1_level_percent
tank_2_level_percent
tank_3_level_percent
production_total
```

---

## API Integration

- [ ] Confirm telemetry history endpoint
- [ ] Confirm latest-state endpoint availability or derive latest state locally
- [ ] Confirm filtering by `gateway_id`
- [ ] Confirm filtering by `tag_name`
- [ ] Confirm filtering by time range
- [ ] Confirm bounded query support with `limit`
- [ ] Use `source_timestamp` as preferred event time
- [ ] Fallback to `collected_at` when `source_timestamp` is missing

---

## Frontend Foundation

- [ ] Add telemetry API service in `services/`
- [ ] Add telemetry event TypeScript types
- [ ] Add tank tag TypeScript types
- [ ] Add hook for loading telemetry for one gateway
- [ ] Add refresh-rate selector with simple second-based options
- [ ] Poll the API using the selected refresh rate
- [ ] Allow refresh to be paused or disabled if needed during development
- [ ] Add loading, empty, and error states
- [ ] Keep gateway id hardcoded or environment-based for the POC
- [ ] Keep data preparation out of rendering components

---

## Tank Overview

- [ ] Show one section per tank
- [ ] Show latest volume per tank
- [ ] Show latest flow rate per tank
- [ ] Show valve state per tank
- [ ] Show optional tank level percent when available
- [ ] Show pump state once at page level
- [ ] Derive displayed state from latest returned telemetry events

---

## Production Views

- [ ] Daily production by tank
- [ ] Monthly production by tank
- [ ] Total yearly production card
- [ ] Monthly overview section
- [ ] Clear units and timestamp context
- [ ] Empty states for missing or incomplete production tags

---

## Charts

- [ ] Bar chart for daily production per tank
- [ ] Bar chart for monthly production per tank
- [ ] Pie chart for production share per tank
- [ ] Avoid adding a charting library until requirements are clear
- [ ] Compare charting options and get approval before adding a dependency

---

## UI & Architecture Rules

- [ ] Keep the dashboard single-page
- [ ] Avoid routing until needed
- [ ] Avoid global state libraries
- [ ] Keep components small and rendering-focused
- [ ] Keep API calls inside `services/`
- [ ] Keep reusable UI state in hooks
- [ ] Use TailwindCSS and `tailwind-merge`
- [ ] Use only configured palette colors

---

## Out Of Scope

- [ ] Multi-company support
- [ ] User accounts
- [ ] Authentication and authorization
- [ ] Dashboard builder or configurable layouts
- [ ] Gateway config editor
- [ ] Backend business logic in the frontend
- [ ] WebSocket, SSE, or true real-time updates
- [ ] Alerting
- [ ] Historical report exports
- [ ] Complex chart interactions

---

## Recommended Next Step

Implement the smallest useful vertical slice:

```text
poll telemetry on selected interval -> derive tank/pump latest state -> render three tank summaries
```

After that, add production totals and charts once the event shape and aggregation
strategy are clear.
