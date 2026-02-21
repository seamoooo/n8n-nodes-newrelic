# n8n Community Node Submission and Approval Flow

This is the official process for getting your custom node approved so that all n8n users worldwide (including those on the Cloud version) can use it.

## 1. Prerequisites

Before submitting, ensure that your node meets the following criteria:

*   **npm Package Name**: Must start with `n8n-nodes-` (this project is already compliant: `n8n-nodes-newrelic`).
*   **Keywords**: The `keywords` field in `package.json` must include `n8n-community-node-package`.
*   **License**: Must be the MIT License.
*   **Repository**: The GitHub repository must be Public and match the link listed on npm.
*   **Documentation**: The README must clearly explain how to use the node.

## 2. Publish to npm

The n8n review team checks packages published on npm. You must first publish your package there.

```bash
# Finalize the version
npm version 0.1.0

# Log in to npm (if you haven't already)
npm login

# Internal/external publishing
npm publish --access public
```

## 3. Submit to n8n

Once published to npm, you can submit the node via the official n8n portal.

1.  Access the **n8n Creator Portal**:
    *   URL: [https://n8n.io/creators/](https://n8n.io/creators/) (or the link at the bottom of the `integrations` page).
2.  Click **Submit a Node** (or a similar link).
3.  Enter the npm package URL and your GitHub repository details.
4.  Submit the form.

## 4. Review & Approval

*   **Duration**: Typically takes several weeks to a few months, depending on the volume of submissions.
*   **Checklist Items**:
    *   Security (ensuring no unauthorized reading of environment variables, etc.).
    *   Quality (proper error handling, no Linting errors).
    *   Dependencies (avoiding bloated libraries).
*   **Feedback**: If issues are found, the team will contact you. You should then fix the issues and republish (`npm version patch` -> `npm publish`).

## 5. After Verification

Once approved:
*   **n8n Cloud**: The node will appear in the standard node search as a "Community Node."
*   **Verified Badge**: A badge is granted to denote the node as a trusted integration.

---
**Note**: Even before approval, self‑hosted n8n users can manually install and use the node using the `npm install n8n-nodes-newrelic` command.
