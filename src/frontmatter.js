/**
 * Generate a clean YAML frontmatter object from analyzed metadata.
 * Preserves any existing user-defined fields (performance-rating, usage-count, etc.)
 */
export function generateFrontmatter(meta, existingFrontmatter = {}) {
  return {
    // Preserve user fields
    ...existingFrontmatter,

    // Overwrite mindgrove fields
    type: existingFrontmatter.type ?? 'note',
    analyzed: new Date().toISOString().slice(0, 16).replace('T', ' '),
    role: meta.role,
    domain: meta.domain,
    sophistication: meta.sophistication,
    'size-category': meta.sizeCategory,
    'char-count': meta.charCount,
    'token-estimate': meta.tokenCount,
    capabilities: meta.capabilities.length ? meta.capabilities : ['general'],
    techniques: meta.techniques.length ? meta.techniques : ['standard'],
    tools: meta.tools.length ? meta.tools : ['none'],
    status: existingFrontmatter.status ?? 'active',
  };
}
