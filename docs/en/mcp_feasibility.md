# Feasibility of New Relic MCP Integration

## Conclusion: **Highly Feasible**

It is entirely possible to integrate New Relic's Model Context Protocol (MCP) server with n8n. n8n now natively supports MCP, functioning as both a client (to use tools) and a server (to expose tools).

## Is Integration into This Package Required?
**Conclusion: No.**

n8n itself has an "MCP Client" as a standard feature. Therefore, there is no need to add MCP‑specific code to the `n8n-nodes-newrelic` package currently under development.

**Usage Scenarios:**
1. Place the standard n8n "AI Agent" node.
2. Select the "MCP Client" tool within it.
3. Configure the New Relic MCP server URL and API key.
4. The integration is complete.

## Integration Architecture

The configuration involves connecting the **New Relic MCP Server** (provided by New Relic) to the **n8n AI Agent node**.

1.  **New Relic Side**:
    *   Enable the "New Relic AI MCP Server" (currently in preview).
    *   This server exposes tools such as `query_nrql`, `get_alerts`, and `analyze_errors`.

2.  **n8n Side**:
    *   Use the **AI Agent node**.
    *   Add a **Tool** of type "MCP Server".
    *   Connect it to the New Relic MCP Server endpoint.

## Benefits
*   **Natural Language Queries**: Simply ask the n8n AI agent, "Why is CPU usage high?" and let it query and analyze relevant data using MCP tools.
*   **Automated Troubleshooting**: Create workflows where the AI agent is instructed to "diagnose the root cause" based on alert context, utilizing New Relic data for investigation.

## Requirements
*   **New Relic**: An active account with API access and "Public Preview" of MCP enabled.
*   **n8n**: A recent version with the AI Agent and MCP support enabled.

## Setup Overview
1.  Obtain a **New Relic User API Key**.
2.  In n8n, configure the **MCP Client** tool by specifying the New Relic MCP endpoint (typically requires an API key in environment variables).
3.  Add this tool to the AI Agent.
4.  Send a prompt to the agent: "Check the error rate for Application X."

## References
*   [New Relic MCP Setup Guide](https://docs.newrelic.com/jp/docs/agentic-ai/mcp/setup/)
*   [n8n MCP Support Announcement](https://n8n.io/blog/mcp-integration/)
