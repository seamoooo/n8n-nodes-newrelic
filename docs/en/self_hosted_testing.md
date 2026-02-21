# Self‑Hosted Testing Guide

This guide describes how to verify the functionality of your custom node on your own server (e.g., VPS or Docker environment) before publishing to npm. You will use the `npm pack` command to create and deploy an installable package file.

## 1. Create the Package (Local)

Generate an npm package file (`.tgz`) on your development machine:

```bash
# Navigate to the project directory
cd n8n-nodes-newrelic

# Build and pack
npm run build
npm pack
```

This will create a file named `n8n-nodes-newrelic-0.1.0.tgz` (or similar, depending on the version). This file contains everything that will eventually be published to npm.

## 2. Upload to the Server

Transfer the generated `.tgz` file to the server where n8n is running:

```bash
# Example: Using the scp command
scp n8n-nodes-newrelic-0.1.0.tgz user@your-server-ip:/tmp/
```

*Note: If you are using Docker, place the file in a location on the host machine that is accessible by the container (e.g., a volume‑mounted directory).*

## 3. Install on the Server

Install the package into n8n's custom node directory on the server (or inside the Docker container).

### For Docker Compose (Recommended)

Typically, n8n data is persisted in a volume (e.g., `n8n_data` or a host directory). Custom nodes are generally installed in `/home/node/.n8n/custom`.

1.  **Enter the container**:
    ```bash
    docker exec -it -u root n8n /bin/sh
    ```
    (Adjust the container name `n8n` to match your environment, like `n8n_main`).

2.  **Navigate to the custom directory**:
    ```bash
    cd /home/node/.n8n/custom
    ```
    *If the directory does not exist, create it with `mkdir -p /home/node/.n8n/custom`.*

3.  **Install the package**:
    Specify the path to the uploaded file to install it:
    ```bash
    npm install /path/to/uploaded/n8n-nodes-newrelic-0.1.0.tgz
    ```
    (Make sure to use the path as seen from *inside* the container).

4.  **Restart n8n**:
    Restart the container to apply the changes:
    ```bash
    # On the host machine
    docker restart n8n
    ```

### For Direct Installation (Non‑Docker)

1.  **Navigate to the custom directory**:
    ```bash
    cd ~/.n8n/custom
    ```

2.  **Install**:
    ```bash
    npm install /path/to/n8n-nodes-newrelic-0.1.0.tgz
    ```

3.  **Restart n8n**:
    ```bash
    pm2 restart n8n
    # Or systemctl restart n8n, etc.
    ```

## 4. Verification

Open n8n in your browser. Search for "New Relic" in the node creation menu. If it appears, the installation was successful!
