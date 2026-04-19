const BASE_TECHNIQUES = {
  'chain-of-thought':    /step[.\-_]?by[.\-_]?step|let's think|chain of thought|think through|\breasoning\b/i,
  'few-shot':            /here's an example|for instance|such as\.|example:/i,
  'role-playing':        /you are|act as|\bpersona\b|assume the role/i,
  'meta-prompting':      /\bprompt\b|\binstruction\b|\bguideline\b|\bdirective\b/i,
  'tree-of-thought':     /tree of thought|multiple paths|explore options|\bbranch\b/i,
  'decomposition':       /break down|decompose|\bdivide\b|sub[.\-_]?task/i,
  'retrieval-augmented': /\bRAG\b|retrieval[.\-_]?augment|knowledge base/i,
  'constraints':         /\bmust\b|\balways\b|\bnever\b|\bdon't\b|avoid|do not|\brequired\b/i,
  'output-formatting':   /\bformat\b|\bstructure\b|\btemplate\b|\bJSON\b|\bmarkdown\b|\bYAML\b/i,
  'iterative':           /iterative|\brefine\b|improve|\brevise\b|\biterate\b/i,
  'self-consistency':    /multiple answers|verify|cross[.\-_]?check|validate/i,
  'zero-shot':           /without examples|no prior|from scratch|\bfresh\b/i,
};

export function detectTechniques(content, config = {}) {
  const custom = config.customTechniques ?? {};
  const all = { ...BASE_TECHNIQUES, ...custom };
  return Object.entries(all)
    .filter(([, pattern]) => pattern.test(content))
    .map(([key]) => key);
}
