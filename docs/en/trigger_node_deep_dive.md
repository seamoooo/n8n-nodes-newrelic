# New Relic Trigger Deep Dive: Security and Data Formatting

This document explores the advantages of creating a custom Trigger node, focusing on **Security (Signature Verification)** and **Data Formatting (Parsing)**.

## 1. Enhanced Security (Signature Verification)

A standard Webhook URL is inherently vulnerable: anyone who knows the URL can send requests to it. A custom Trigger node allows you to implement defense mechanisms.

### Mechanism
1.  **New Relic Side**:
    In the Webhook configuration, add a "Custom Header":
    *   Key: `X‑NewRelic‑Signature` (or `X‑Secret‑Token`, etc.)
    *   Value: `my‑secret‑password‑12345` (a complex random string).
    
2.  **Trigger Node (n8n)**:
    Inside the node implementation, the moment a request is received, the following check is performed:
    ```typescript
    // Pseudo-code
    const receivedToken = header['x-newrelic-signature'];
    const expectedToken = credentials.webhookSecret; // Saved in n8n Credentials
    
    if (receivedToken !== expectedToken) {
        throw new Error('Invalid signature'); // Immediately reject the request
    }
    ```

### Benefits
*   **Impersonation Prevention**: Since any access not originated from New Relic with the correct password is blocked, the risk of a third party injecting fake alerts is eliminated.
*   **Simplified Configuration**: While you can achieve this with a standard Webhook node by adding a "Switch" node to check headers in every workflow, a custom node lets you handle it by simply **selecting the Credentials**.

---

## 2. Data Formatting (JSON Parsing)

New Relic alert payloads are highly informative but can have deep nesting.

### Using the Standard Webhook Node (Before)
The received data is raw JSON:
```json
{
  "incident_id": 12345,
  "condition_name": "High CPU",
  "targets": [
    {
      "id": "9876",
      "name": "Web Server 01",
      "labels": { "env": "prod" }
    }
  ],
  "timestamp": 1700000000
}
```

If you want to use the "Server Name" in n8n, you must write a long expression like `{{ $json.body.targets[0].name }}`. Additionally, since `targets` is an array, you must manually handle loops if multiple targets are alerted simultaneously.

### Using a Custom Trigger Node (After)
The node can convert (normalize) this JSON into a "user‑friendly" format before outputting it.

**Example Output Data:**
```json
// One alert with multiple targets can be automatically split into individual items
[
  {
    "alertId": 12345,
    "serverName": "Web Server 01",
    "environment": "prod",
    "severity": "CRITICAL",
    "url": "https://one.newrelic.com/..."
  }
]
```

### Benefits
*   **Intuitive Use**: When configuring the next node (e.g., Slack notification), you can simply select `serverName` from the variable picker. You don't need to navigate deep hierarchies like `body.targets[0]...`.
*   **Consistency**: New Relic has different alert policy types (Legacy, Workflows, etc.), and their JSON structures vary slightly. A custom node can absorb these differences and **always output the same format**.
