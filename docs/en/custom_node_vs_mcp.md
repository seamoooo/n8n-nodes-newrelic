# Benefits and Drawbacks of Custom Node Development

This analysis addresses the question: *“If the standard n8n MCP (Managed Cloud Platform) integration can handle a task, why create a custom node?”*

## Conclusion
**Custom nodes** excel for **high‑frequency, deterministic, or real‑time automation** (e.g., alert handling). **MCP** shines for **ad‑hoc investigation, analysis, or interactive troubleshooting**. They complement rather than replace each other.

---

## 1. Advantages of Custom Nodes (Pros)

### 1️⃣ Stability and Determinism
- **Predictable execution**: A query that returns a count will always behave the same way.
- **No AI misinterpretation**: MCP (AI Agent) may mis‑interpret prompts, leading to unexpected queries or output formats. For scheduled reports, this variability can be fatal.

### 2️⃣ Performance & Cost
- **Speed**: Direct API calls complete in milliseconds to a few hundred milliseconds.
- **Cost‑effective**: No LLM token fees, which matters for high‑frequency (e.g., per‑minute) workflows.

### 3️⃣ Trigger Capability (Critical)
- **Phase‑2 planned feature**: Receiving a webhook to start a workflow – something MCP cannot normally do. MCP is primarily a *pull* tool; custom nodes enable *push* (instant) reactions to alerts.

### 4️⃣ Usability (UX)
- **GUI configuration**: Region selectors, query input fields, etc., are presented in a user‑friendly UI. No prompt‑engineering required.

---

## 2. Disadvantages of Custom Nodes (Cons)

### 1️⃣ Development & Maintenance Overhead
- **Code required**: Implementation in TypeScript (the work we are doing now).
- **API changes**: When New Relic updates its API, the node must be updated accordingly.

### 2️⃣ Flexibility Limits
- **Feature‑bound**: Only the functionalities you implement are available (e.g., NRQL execution must be explicitly added).
- **MCP flexibility**: MCP can autonomously explore available tools and adapt to new capabilities without code changes.

---

## 3. Comparison Summary

| Aspect | Custom Node (this project) | MCP (AI Agent) |
| :--- | :--- | :--- |
| **Primary Use‑case** | Routine tasks, alert detection, scheduled reports | Incident investigation, log analysis, interactive queries |
| **Execution Speed** | Fast | Slower (LLM inference time) |
| **Cost** | Server cost only | Additional LLM token cost |
| **Reliability** | High (deterministic) | Probabilistic (prompt dependent) |
| **Trigger Support** | ✅ (Webhook) | ❌ (mostly actions) |
| **Maintenance** | Code updates required | Updated automatically on server side |

---

## Recommended Usage Split
- **Custom Node**: Use for "Every morning at 9 AM send transaction counts to Slack" or "When an alert fires, create a ticket" – i.e., solid, repeatable automation.
- **MCP**: Use for "Something looks off, investigate why" – flexible, exploratory queries.
