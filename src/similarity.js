import { DEFAULT_CONFIG } from './config.js';

/**
 * Build a scored similarity matrix across all analyzed files.
 * Returns an array of { fileA, fileB, score, shared } pairs above threshold.
 */
export function buildSimilarityMatrix(fileMetadata, config = DEFAULT_CONFIG) {
  const metaArray = Array.from(fileMetadata.values());
  const connections = [];

  for (let i = 0; i < metaArray.length; i++) {
    for (let j = i + 1; j < metaArray.length; j++) {
      const a = metaArray[i];
      const b = metaArray[j];
      let score = 0;

      // Role match
      if (a.role === b.role) score += 3;

      // Shared capabilities (2pts each)
      const sharedCaps = a.capabilities.filter(c => b.capabilities.includes(c));
      score += sharedCaps.length * 2;

      // Shared techniques (4pts each — highest signal)
      const sharedTechs = a.techniques.filter(t => b.techniques.includes(t));
      score += sharedTechs.length * 4;

      // Shared tools (1pt each)
      const sharedTools = a.tools.filter(t => b.tools.includes(t));
      score += sharedTools.length * 1;

      // Same sophistication level
      if (a.sophistication === b.sophistication) score += 2;

      // Same domain
      if (a.domain === b.domain && a.domain !== 'general') score += 3;

      if (score >= config.similarityThreshold) {
        connections.push({
          fileA: a,
          fileB: b,
          score,
          shared: { caps: sharedCaps, techs: sharedTechs, tools: sharedTools },
        });
      }
    }
  }

  // Cap connections per file
  return limitConnectionsPerFile(connections, config.maxConnectionsPerFile);
}

function limitConnectionsPerFile(connections, maxPerFile) {
  const fileConnMap = new Map();

  for (const conn of connections) {
    for (const key of [conn.fileA.filePath, conn.fileB.filePath]) {
      if (!fileConnMap.has(key)) fileConnMap.set(key, []);
      fileConnMap.get(key).push(conn);
    }
  }

  const limited = new Set();
  const result = [];
  const seen = new Set();

  for (const [, conns] of fileConnMap.entries()) {
    const sorted = conns.sort((a, b) => b.score - a.score).slice(0, maxPerFile);
    for (const c of sorted) {
      const key = [c.fileA.filePath, c.fileB.filePath].sort().join('||');
      if (!seen.has(key)) {
        result.push(c);
        seen.add(key);
      }
    }
  }

  return result;
}
