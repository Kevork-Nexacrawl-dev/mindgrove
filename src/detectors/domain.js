/**
 * Domain detection — content-based by default.
 * Falls back to path-based if config.domainDetection === 'path'.
 * Users can extend via config.customDomains.
 */

const CONTENT_DOMAINS = {
  'prompt-engineering':   /system prompt|prompt engineer|meta[.\-_]?prompt|\bLLM\b|language model/i,
  'software-engineering': /code review|pull request|\bCI\b|\bCD\b|test suite|\bdeployment\b/i,
  'ai-ml':                /machine learning|neural network|\bAI\b|\bGPT\b|embedding|fine[.\-_]?tun/i,
  'web-dev':              /frontend|backend|\bReact\b|\bAPI\b|\bCSS\b|\bHTML\b|\bNode\b/i,
  'automation':           /workflow|automat|pipeline|\bcron\b|\btrigger\b/i,
  'research-analysis':    /literature review|hypothesis|\bfindings\b|\bstudy\b|citation/i,
  'content-creation':     /blog post|copywriting|SEO|social media|\bcontent\b/i,
  'business':             /revenue|\bROI\b|\bKPI\b|strategy|\bmarket\b|stakeholder/i,
  'education':            /\blearn\b|curriculum|\bstudent\b|\bcourse\b|pedagogy/i,
  'meta-engineering':     /multi[.\-_]?agent|orchestrat|\bMCP\b|tool[.\-_]?call/i,
};

export function detectDomain(content, filePath = '', config = {}) {
  const custom = config.customDomains ?? {};
  const all = { ...CONTENT_DOMAINS, ...custom };

  // Custom domains always win
  for (const [key, pattern] of Object.entries(custom)) {
    if (pattern.test(content)) return key;
  }

  // Content-based (default)
  for (const [key, pattern] of Object.entries(CONTENT_DOMAINS)) {
    if (pattern.test(content)) return key;
  }

  return 'general';
}
