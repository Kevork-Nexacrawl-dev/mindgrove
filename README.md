# 🌿 mindgrove

> Analyze, classify, and auto-link any markdown vault. Role detection, sophistication scoring, and bidirectional similarity linking — for knowledge bases at scale.

[![npm version](https://img.shields.io/npm/v/mindgrove.svg)](https://www.npmjs.com/package/mindgrove)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## Why this exists

When your markdown vault hits 500+ files, it becomes a graveyard. Notes pile up with no metadata, no connections, no way to know what's related to what.

**mindgrove** crawls your vault, analyzes every file, and does three things automatically:

1. **Tags** — injects rich YAML frontmatter: role, domain, sophistication score, capabilities, techniques
2. **Scores** — rates each note's complexity from `standard` → `elite` using a weighted scoring engine
3. **Links** — builds a similarity matrix across all files and writes bidirectional `[[wikilinks]]` between related notes

Built from a real workflow used to manage **1,300+ AI system prompts** in Obsidian. Extracted into a universal library with zero vault-specific assumptions.

---

## Install

```bash
npm install -g mindgrove
```

Or as a library in your project:

```bash
npm install mindgrove
```

---

## CLI Usage

```bash
# Analyze a vault folder
mindgrove analyze ./my-vault

# With custom options
mindgrove analyze ./my-vault --threshold 20 --max-connections 8

# Dry run (analyze only, no file writes)
mindgrove analyze ./my-vault --dry-run

# Skip linking (just tag files)
mindgrove analyze ./my-vault --no-linking
```

---

## Library Usage

```js
import { analyzeVault } from 'mindgrove';

const result = await analyzeVault('./my-vault', {
  similarityThreshold: 15,
  maxConnectionsPerFile: 12,
  enableLinking: true,

  // Extend with your own patterns
  customRoles: {
    'finance-agent': /trading|portfolio|equity/i,
  },
  customDomains: {
    'fintech': /\bfinance\b|\btrading\b|\bstocks\b/i,
  },
});

console.log(`Processed: ${result.processed} files`);
console.log(`Connections: ${result.connections} links written`);
```

---

## What gets written to your files

Each markdown file gets a YAML frontmatter block injected (or updated):

```yaml
---
type: note
analyzed: 2026-04-18 21:00
role: prompt-engineer
domain: ai-ml
sophistication: advanced
size-category: large
char-count: 4821
token-estimate: 1206
capabilities:
  - reasoning
  - code-generation
  - optimization
techniques:
  - chain-of-thought
  - role-playing
  - constraints
tools:
  - web-search
  - code-execution
Connected Notes:
  - "[[RAG Specialist Agent]] (score: 22 | chain-of-thought, ai-ml)"
  - "[[Meta Orchestrator]] (score: 18 | role-playing)"
status: active
---
```

---

## Configuration

| Option | Default | Description |
|---|---|---|
| `similarityThreshold` | `15` | Min score to create a link |
| `maxConnectionsPerFile` | `12` | Cap links per file |
| `enableLinking` | `true` | Run Phase 2 similarity linking |
| `excludeFolders` | `['.obsidian', 'Templates', ...]` | Folders to skip |
| `domainDetection` | `'content'` | `'content'` or `'path'` |
| `customRoles` | `{}` | Add your own role patterns |
| `customDomains` | `{}` | Add your own domain patterns |
| `customCapabilities` | `{}` | Add your own capability patterns |
| `customTechniques` | `{}` | Add your own technique patterns |
| `dryRun` | `false` | Analyze without writing files |
| `reportFormat` | `'markdown'` | `'text'`, `'json'`, or `'markdown'` |

---

## Real-world example

This library was extracted from a personal Obsidian vault containing **1,300+ AI system prompts**. Running `mindgrove analyze` on that vault:

- Tagged all 1,300 files with role/domain/sophistication in ~4 minutes
- Found 847 high-quality similarity connections above threshold 15
- Wrote bidirectional `[[wikilinks]]` into every connected pair
- Enabled Obsidian Graph View filtering by `sophistication: elite` to instantly surface the best prompts

---

## License

MIT © [Kevork @ Nexacrawl](https://github.com/Kevork-Nexacrawl-dev)
