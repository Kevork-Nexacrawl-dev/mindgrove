/**
 * Example: Analyzing an AI system prompt vault
 * This mirrors how mindgrove was originally used on 1,300+ prompts in Obsidian.
 */
import { analyzeVault } from '../src/index.js';

const result = await analyzeVault('./my-ai-prompts', {
  similarityThreshold: 15,
  maxConnectionsPerFile: 12,
  enableLinking: true,

  // These are YOUR domain-specific patterns — the library has none hardcoded
  customRoles: {
    'perplexity-agent': /perplexity/i,
    'cursor-agent':     /\bcursor\b/i,
    'roo-code':         /roo[.\-_]?code/i,
  },

  customDomains: {
    'platform-specific': /perplexity|cursor|windsurf|copilot/i,
  },

  // Skip your dashboard and template folders
  excludeFolders: ['.obsidian', 'Templates', 'Dashboard', 'MOCs'],
});

console.log(`
✅ mindgrove complete
   Files processed : ${result.processed}
   Errors          : ${result.errors}
   Links written   : ${result.connections}
   Duration        : ${result.durationSeconds}s
`);
