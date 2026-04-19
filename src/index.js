/**
 * mindgrove
 * Public API — import this in your own Node.js scripts
 */
export { analyzeVault } from './analyzer.js';
export { buildSimilarityMatrix } from './similarity.js';
export { applyBidirectionalLinks } from './linker.js';
export { generateFrontmatter } from './frontmatter.js';
export { detectRole } from './detectors/role.js';
export { detectCapabilities } from './detectors/capabilities.js';
export { detectTechniques } from './detectors/techniques.js';
export { detectTools } from './detectors/tools.js';
export { detectDomain } from './detectors/domain.js';
export { scoreSophistication } from './detectors/sophistication.js';
export { DEFAULT_CONFIG } from './config.js';
