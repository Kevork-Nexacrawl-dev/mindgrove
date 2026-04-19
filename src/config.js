/**
 * Default configuration — fully overridable by the user.
 * Pass a partial config object to analyzeVault() to override any of these.
 */
export const DEFAULT_CONFIG = {
  // Similarity engine
  similarityThreshold: 15,       // minimum score to create a link (1-30)
  maxConnectionsPerFile: 12,     // cap per-file to prevent link spam
  enableLinking: true,           // set false to skip Phase 2 (just tag, don't link)

  // Performance
  batchDelay: 0,                 // ms between file writes (0 = fastest)
  progressInterval: 25,          // log progress every N files

  // Folders to always skip
  excludeFolders: [
    '.obsidian',
    '.trash',
    'Templates',
    'templates',
    'Archive',
    'assets',
  ],

  // Domain detection mode
  // 'content'  — infer domain from file text (default, works for everyone)
  // 'path'     — infer from folder path (power users with structured vaults)
  domainDetection: 'content',

  // Extend or override role/domain patterns
  // e.g. customRoles: { 'finance-agent': /trading|portfolio|equity/i }
  customRoles: {},
  customDomains: {},
  customCapabilities: {},
  customTechniques: {},

  // YAML frontmatter field name for the links section
  linksSectionHeader: 'Connected Notes',

  // Dry run — analyze and score but don't write any files
  dryRun: false,

  // Output format for reports: 'text' | 'json' | 'markdown'
  reportFormat: 'markdown',
};
