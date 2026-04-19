const BASE_TOOLS = {
  'web-search':       /search|browse|internet|\bweb\b|google|perplexity/i,
  'code-execution':   /execute|run code|\bpython\b|javascript|\bshell\b|terminal/i,
  'file-operations':  /\bfile\b|\bread\b|\bwrite\b|save|load|upload|download/i,
  'data-analysis':    /\bdata\b|dataset|analyz|visualiz|\bchart\b|\bgraph\b/i,
  'api-calls':        /\bAPI\b|endpoint|\brequest\b|\bfetch\b|\bREST\b|webhook/i,
  'database':         /\bdatabase\b|\bSQL\b|\bquery\b|\btable\b|NoSQL|\bindex\b/i,
  'image-generation': /image|generate.*image|dall[.\-_]?e|stable diffusion|midjourney/i,
  'retrieval':        /retrieve|\blookup\b|\bRAG\b|vector store/i,
  'memory':           /\bmemory\b|remember|recall|\bcontext\b|history/i,
  'mcp-tools':        /\bMCP\b|tool[.\-_]?call/i,
};

export function detectTools(content, config = {}) {
  const custom = config.customTools ?? {};
  const all = { ...BASE_TOOLS, ...custom };
  return Object.entries(all)
    .filter(([, pattern]) => pattern.test(content))
    .map(([key]) => key);
}
