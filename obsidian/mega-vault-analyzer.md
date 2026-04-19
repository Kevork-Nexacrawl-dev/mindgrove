# Mega Vault Analyzer — Obsidian Templater Script

This is the original Obsidian Templater script that inspired the `mindgrove` npm package.

It was used to batch-analyze **1,300+ AI system prompts** in an Obsidian vault — injecting YAML frontmatter, detecting roles/capabilities/techniques, scoring sophistication, and building bidirectional similarity links.

The core engine has been extracted and generalized into the `src/` library with zero vault-specific assumptions.

## Original Script

See `scripts/` for the raw Templater `.js` file.

## What was generalized

| Original (vault-specific) | mindgrove (universal) |
|---|---|
| Hardcoded folder paths | Config-driven `excludeFolders` |
| Personal tool names (softwiz, nexus) | `customRoles` option |
| Path-based domain detection | Content-based detection (default) |
| Obsidian `app.vault` API | Node.js `fs` + `glob` |
| Templater runtime | Pure Node.js / npm package |
