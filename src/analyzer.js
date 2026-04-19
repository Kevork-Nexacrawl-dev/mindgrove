import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';
import matter from 'gray-matter';
import { DEFAULT_CONFIG } from './config.js';
import { detectRole } from './detectors/role.js';
import { detectCapabilities } from './detectors/capabilities.js';
import { detectTechniques } from './detectors/techniques.js';
import { detectTools } from './detectors/tools.js';
import { detectDomain } from './detectors/domain.js';
import { scoreSophistication } from './detectors/sophistication.js';
import { generateFrontmatter } from './frontmatter.js';
import { buildSimilarityMatrix } from './similarity.js';
import { applyBidirectionalLinks } from './linker.js';

export async function analyzeVault(vaultPath, userConfig = {}) {
  const config = { ...DEFAULT_CONFIG, ...userConfig };
  const startTime = Date.now();

  // ── 1. Collect files ──────────────────────────────────────────────────────
  const pattern = path.join(vaultPath, '**/*.md').replace(/\\/g, '/');
  const allFiles = await glob(pattern, { absolute: true });

  const files = allFiles.filter(f => {
    const rel = path.relative(vaultPath, f);
    return !config.excludeFolders.some(ex => rel.includes(ex));
  });

  if (files.length === 0) {
    return {
      processed: 0,
      errors: 0,
      connections: 0,
      metadata: new Map(),
      durationSeconds: 0,
    };
  }

  // ── 2. Phase 1 — Analyze & tag each file ─────────────────────────────────
  const fileMetadata = new Map();
  let processed = 0;
  let errors = 0;

  for (const filePath of files) {
    try {
      const raw = await fs.readFile(filePath, 'utf8');
      const parsed = matter(raw);
      const content = parsed.content;
      const charCount = content.length;
      const tokenCount = Math.ceil(charCount / 4);

      const sizeCategory =
        tokenCount > 4000 ? 'mega' :
        tokenCount > 2000 ? 'xlarge' :
        tokenCount > 1000 ? 'large' :
        tokenCount > 500  ? 'medium' : 'small';

      const role           = detectRole(content, filePath, config);
      const capabilities   = detectCapabilities(content, config);
      const techniques     = detectTechniques(content, config);
      const tools          = detectTools(content, config);
      const domain         = detectDomain(content, filePath, config);
      const sophistication = scoreSophistication({ techniques, capabilities, tools });

      const meta = {
        filePath,
        basename: path.basename(filePath, '.md'),
        role,
        capabilities,
        techniques,
        tools,
        domain,
        sophistication,
        sizeCategory,
        charCount,
        tokenCount,
      };

      fileMetadata.set(filePath, meta);

      if (!config.dryRun) {
        const newFrontmatter = generateFrontmatter(meta, parsed.data);
        const newContent = matter.stringify(parsed.content, newFrontmatter);
        await fs.writeFile(filePath, newContent, 'utf8');
      }

      processed++;
      if (processed % config.progressInterval === 0) {
        const pct = Math.round((processed / files.length) * 100);
        process.stdout.write(`\r  Phase 1: ${processed}/${files.length} (${pct}%)`);
      }
    } catch (err) {
      errors++;
    }

    if (config.batchDelay > 0) {
      await new Promise(r => setTimeout(r, config.batchDelay));
    }
  }

  process.stdout.write('\n');
  const durationSeconds = Math.round((Date.now() - startTime) / 1000);

  // ── 3. Phase 2 — Similarity matrix & bidirectional links ─────────────────
  let connections = 0;
  if (config.enableLinking && !config.dryRun) {
    const matrix = buildSimilarityMatrix(fileMetadata, config);
    connections = matrix.length;
    await applyBidirectionalLinks(matrix, config);
  }

  return { processed, errors, connections, metadata: fileMetadata, durationSeconds };
}
