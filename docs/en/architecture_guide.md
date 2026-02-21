# n8n Custom Node Development Guide

This guide is intended for developers who can read TypeScript but are new to creating n8n custom nodes and npm packages. It explains the architecture and development flow.

## 1. Overview

A n8n custom node is essentially an **npm package that implements the interface defined by n8n**. The package contains a TypeScript class that n8n loads.

```mermaid
graph TD
    User[User] -->|drag & drop| n8nUI[n8n Editor]
    n8nUI -->|load node definition| NodeClass[NewRelic.node.ts]
    NodeClass -->|called at runtime| Execute[execute() method]
    Execute -->|HTTP request| NewRelicAPI[New Relic API]
```

## 2. Directory Structure

The repository (`n8n-nodes-newrelic`) follows a standard layout:

| Path | Role | Description |
| :--- | :--- | :--- |
| `package.json` | **Manifest** | Declares the node to n8n via the `n8n` field. |
| `nodes/` | **Node logic** | Contains the implementation (`.node.ts`) for each node. |
| `credentials/` | **Credential definitions** | Defines how API keys etc. are entered (`.credentials.ts`). |
| `dist/` | **Build output** | JavaScript files generated from TypeScript; n8n loads these. |

### The `package.json` secret

n8n reads the `n8n` property at startup:

```json
"n8n": {
  "nodes": [
    "dist/nodes/NewRelic/NewRelic.node.js",
    "dist/nodes/NewRelic/NewRelicTrigger.node.js"
  ],
  "credentials": [
    "dist/credentials/NewRelicApi.credentials.js"
  ]
}
```

If the compiled JS paths are not listed here, n8n will not recognize the node.

## 3. Node Implementation (Class Structure)

All nodes implement the `INodeType` interface.

### Basic Node (`NewRelic.node.ts`)

The node consists of two main parts:

1. **`description` (definition)**:
   * Node name, icon, input/output settings.
   * **UI definition** – the form fields the user sees (e.g., `resource`, `operation`).
2. **`execute()` (runtime logic)**:
   * Called when the workflow reaches this node.
   * Uses `this.getInputData()` to receive data from previous nodes.
   * Uses `this.getNodeParameter()` to read user‑provided values (queries, IDs, etc.).
   * Sends the request to the New Relic API and returns the result.

### Trigger Node (`NewRelicTrigger.node.ts`)

Triggers differ by having a **`webhook()`** method.

1. **`webhook()`**:
   * Invoked instantly when an external HTTP request arrives.
   * Retrieves the request via `this.getRequestObject()` (headers, body).
   * Performs signature verification (security check) and, if valid, forwards data into the workflow.

## 4. How npm Packages Work

Creating an npm package essentially means **bundling the directory (including `package.json`) into a tarball (`.tgz`)**.

### Build & Pack Flow

1. **TypeScript compilation**:
   ```bash
   npm run build
   ```
   Compiles `.ts` files into the `dist` directory.
2. **Package creation**:
   ```bash
   npm pack
   ```
   The `files` field in `package.json` determines what is included (typically `dist/`, `README.md`, `package.json`). The result is a file like `n8n-nodes-newrelic-0.1.0.tgz`.
3. **Installation**:
   The `.tgz` is unpacked on the n8n side and placed where n8n can load it, effectively acting like a `node_modules` entry.

## 5. Development Tips

* **Type definitions** – The `n8n-workflow` package provides excellent typings. Use VS Code’s IntelliSense to explore `INodeType` and related interfaces.
* **Icons** – Use SVG files and reference them in the node definition, e.g., `icon: 'file:newrelic.svg'`.
* **Debugging** – `console.log` outputs to the n8n server logs (Docker logs, etc.).

---
*This guide was originally written in Japanese; the English version aims to preserve the original meaning while adapting terminology for an international audience.*
