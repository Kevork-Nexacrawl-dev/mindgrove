/**
 * Detect the primary role of a markdown file based on its content.
 * Fully generic — no vault-specific paths or names.
 * Users can extend via config.customRoles.
 */

const SPECIFIC_ROLES = {
  'system-prompt-analyzer':    /sp[.\-_]?analyz|prompt[.\-_]?analyz|analyze[.\-_]?prompt|prompt[.\-_]?review/i,
  'system-prompt-optimizer':   /sp[.\-_]?optim|prompt[.\-_]?optim|optimize[.\-_]?prompt|prompt[.\-_]?enhanc/i,
  'meta-orchestrator':         /orchestrat.*meta|meta.*orchestrat|multi[.\-_]?agent[.\-_]?coord/i,
  'coding-agent':              /coding[.\-_]?agent|code[.\-_]?assist|programming[.\-_]?agent/i,
  'research-agent':            /research[.\-_]?agent|investigat[.\-_]?agent/i,
  'prompt-engineer':           /prompt[.\-_]?engineer|prompt[.\-_]?craft|prompt[.\-_]?design/i,
  'workflow-automator':        /workflow.*automat|automation.*expert|process.*automat/i,
  'rag-specialist':            /\brag\b|retrieval[.\-_]?augment|vector[.\-_]?search|\bembed/i,
  'documentation-specialist':  /document[.\-_]?assist|doc[.\-_]?agent/i,
};

const GENERIC_ROLES = {
  'meta-agent':   /meta[.\-_]?agent|orchestrat|multi[.\-_]?agent|coordinator/i,
  'expert':       /\bexpert\b|specialist|master|authority/i,
  'analyst':      /analyz|research|investigate|examine/i,
  'developer':    /\bcode\b|develop|program|engineer|software/i,
  'architect':    /architect|system[.\-_]?design|framework/i,
  'optimizer':    /optimiz|enhance|improve|refine/i,
  'strategist':   /strateg|\bplan\b|tactical/i,
  'researcher':   /research|scholar|investigate/i,
  'advisor':      /advis|consult|recommend|guide|mentor/i,
};

// Known AI platforms — used for sub-role tagging
const PLATFORM_PATTERNS = {
  'perplexity': /perplexity/i,
  'cursor':     /\bcursor\b/i,
  'copilot':    /copilot|github[.\-_]?copilot/i,
  'claude':     /\bclaude\b/i,
  'windsurf':   /windsurf/i,
  'roo-code':   /roo[.\-_]?code|roo[.\-_]?mastery/i,
  'bolt':       /bolt\.new|\bbolt\b/i,
  'gemini':     /\bgemini\b/i,
  'openai':     /\bgpt\b|openai/i,
  'replit':     /replit/i,
};

export function detectRole(content, filePath = '', config = {}) {
  const custom = config.customRoles ?? {};

  // Custom roles take priority
  for (const [key, pattern] of Object.entries(custom)) {
    if (pattern.test(content)) return key;
  }

  // Specific roles
  for (const [key, pattern] of Object.entries(SPECIFIC_ROLES)) {
    if (pattern.test(content)) return key;
  }

  // Generic roles
  for (const [key, pattern] of Object.entries(GENERIC_ROLES)) {
    if (pattern.test(content)) return key;
  }

  return 'assistant';
}

export function detectPlatform(content, filePath = '') {
  const lower = content.toLowerCase();
  const pathLower = filePath.toLowerCase();
  for (const [key, pattern] of Object.entries(PLATFORM_PATTERNS)) {
    if (pattern.test(lower) || pattern.test(pathLower)) return key;
  }
  return 'agnostic';
}
