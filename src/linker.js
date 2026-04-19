import fs from 'fs/promises';
import matter from 'gray-matter';
import { DEFAULT_CONFIG } from './config.js';

/**
 * Write bidirectional wikilinks into each file's frontmatter
 * under the config.linksSectionHeader key.
 */
export async function applyBidirectionalLinks(matrix, config = DEFAULT_CONFIG) {
  // Group all links per file
  const linkMap = new Map();

  for (const conn of matrix) {
    const addLink = (from, to, score, shared) => {
      if (!linkMap.has(from.filePath)) linkMap.set(from.filePath, []);
      linkMap.get(from.filePath).push({
        basename: to.basename,
        score,
        shared,
      });
    };
    addLink(conn.fileA, conn.fileB, conn.score, conn.shared);
    addLink(conn.fileB, conn.fileA, conn.score, conn.shared);
  }

  // Write links into each file
  for (const [filePath, links] of linkMap.entries()) {
    try {
      const raw = await fs.readFile(filePath, 'utf8');
      const parsed = matter(raw);

      // Format: [[Note Name]] (score: 18 | techs: chain-of-thought)
      parsed.data[config.linksSectionHeader] = links
        .sort((a, b) => b.score - a.score)
        .map(l => {
          const hint = [
            ...l.shared.techs.slice(0, 2),
            ...l.shared.caps.slice(0, 1),
          ].join(', ');
          return `[[${l.basename}]] (score: ${l.score}${hint ? ' | ' + hint : ''})`;
        });

      const newContent = matter.stringify(parsed.content, parsed.data);
      await fs.writeFile(filePath, newContent, 'utf8');
    } catch (err) {
      // skip file on error
    }
  }
}
