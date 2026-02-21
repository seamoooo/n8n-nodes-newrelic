# Future Implementation Plan (Phase 2)

This document outlines the planned feature expansions for the New Relic n8n node.

## 1. API Feature Expansion (NewRelic Node)

We will add new "Resources" and "Operations" to the existing `NewRelic` node to increase its versatility as a management and observability tool for New Relic.

### Planned Resources

*   **Entity (`entity`)**
    *   `get`: Retrieve details of a specific entity by its GUID.
    *   `search`: Search for entities by name, domain, or type.
    *   `tags`: Retrieve or set tags for an entity.

*   **Application (`application`)** (Wrapper for Entity)
    *   `getAll`: Retrieve a list of all APM applications.
    *   `getHealth`: Check the health status of applications.

*   **Deployment (`deployment`)**
    *   `create`: Record a deployment marker for an application (useful in CI/CD pipelines).

### Implementation Strategy
All these operations will continue to use the **NerdGraph API** (`https://api.newrelic.com/graphql`). We will implement them by constructing different GraphQL query strings based on the user's selection.

---

## 2. New Relic Trigger Node (Webhook)

To respond to New Relic alerts in real‑time, we will create a **Trigger Node**.

### Design

*   **Name**: `NewRelicTrigger`
*   **Type**: Webhook interface
*   **Mechanism**: "Push" (Real‑time). This is not polling.

### How It Works
1.  **n8n side**: When the user adds a `NewRelicTrigger` node, n8n issues a unique Webhook URL.
2.  **New Relic side**: The user creates a **Webhook Destination** pointing to that URL.
3.  **Flow**:
    *   `Alert Triggered` -> `New Relic Webhook` -> `n8n Trigger Node` -> `Workflow Execution`

### Why Webhooks?
*   **Low Latency**: Reacts immediately when an alert occurs.
*   **Efficiency**: Eliminates the need for repeated polling requests that consume API limits.
*   **Standardized**: New Relic's alerting system is designed for push notifications via Webhooks, Slack, PagerDuty, etc.

## 3. Deployment and Release

*   **npm package**: `n8n-nodes-newrelic`
*   **Versioning**: Increment to `0.2.0` upon Phase 2 release.
