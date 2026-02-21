# Remote Server Verification Procedures

These procedures are for verifying the functionality of this custom node on an n8n instance running on a remote server (such as a VPS or cloud instance).

## Prerequisites

*   `node` and `npm` installed in your local environment.
*   SSH access to the remote server.
*   n8n running on the remote server (either via npm or Docker).

## Method 1: Installation via `npm pack` (Recommended)

This method involves bundling the locally built package into a `.tgz` file, transferring it to the remote server, and installing it into n8n.

### 1. Build the Package Locally

Run the following commands in the project's root directory (`n8n-nodes-newrelic`) to build and pack the node:

```bash
cd n8n-nodes-newrelic
npm install
npm run build
npm pack
```

This will generate a file named `n8n-nodes-newrelic-0.1.0.tgz` (the version number may vary).

### 2. Transfer the Package to the Remote Server

Use `scp` or a similar tool to transfer the `.tgz` file to the remote server:

```bash
scp n8n-nodes-newrelic-0.1.0.tgz user@remote-server:/path/to/upload/
```

### 3. Install on the Remote Server

#### For npm‑based n8n

Install the package either in the directory where n8n is installed or globally. Usually, you manage this by creating a `custom` directory directly under `~/.n8n` or installing it in the global environment of the user running n8n.

The most reliable way is to create a custom node directory (`~/.n8n/custom`) and install it there:

```bash
# On the remote server
mkdir -p ~/.n8n/custom
cd ~/.n8n/custom
npm install /path/to/upload/n8n-nodes-newrelic-0.1.0.tgz
```

#### For Docker‑based n8n

To make n8n inside a Docker container recognize the custom node, you can either create a custom image or use a volume mount.

**Volume Mount Installation Steps:**

1.  Prepare a directory on the host machine (e.g., `~/n8n-custom-nodes`).
2.  Run `npm install /path/to/upload/n8n-nodes-newrelic-0.1.0.tgz` within that directory.
3.  Mount this directory to `/home/node/.n8n/custom` when starting the Docker container.

```bash
docker run -d \
  --name n8n \
  -p 5678:5678 \
  -v ~/n8n-custom-nodes:/home/node/.n8n/custom \
  n8nio/n8n
```
*Note: You may encounter permission issues within the container; use `chown` or similar commands as needed.*

### 4. Restart n8n

Restart n8n to load the new node:

```bash
# For npm version (if using pm2)
pm2 restart n8n

# For Docker version
docker restart n8n
```

### 5. Verify Operation

1.  Open the n8n editor (e.g., `http://your-server:5678`).
2.  Search for the `New Relic` node in the workflow canvas.
3.  If the node appears, the installation was successful.
4.  Configure the **Credentials** and verify that you can successfully execute a query.
