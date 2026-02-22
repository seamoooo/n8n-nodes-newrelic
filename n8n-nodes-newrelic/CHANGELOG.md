# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - 2024-02-22

### Added
- **Initial Release:** Developed the foundational custom n8n node for New Relic.
- **NerdGraph API Support:** Integrated core endpoints for New Relic's GraphQL NerdGraph API list.
- **Resources & Operations:**
  - **Account:** Ability to get consumption metrics and hierarchical account structures.
  - **Entity:** Ability to search the entity catalog by domains and names, get relationships (dependencies), and fetch tags.
  - **User Management:** Support for retrieving authentication domains and creating new users (Basic, Core, Full) with Identity Provider limitations documented via a node UI warning.
  - **NRQL:** Direct execution capability for custom New Relic Query Language (NRQL) strings against any account.
- **Trigger Node:** Implemented a dedicated `New Relic Trigger` node for secure integration with New Relic webhook alerts, fully supporting Payload Signature Verification via custom secret tokens.
