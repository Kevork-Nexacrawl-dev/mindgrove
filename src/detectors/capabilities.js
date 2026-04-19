const BASE_CAPABILITIES = {
  'code-generation':  /\bcode\b|programming|script|function|syntax/i,
  'analysis':         /analyz|examine|evaluate|assess|investigate/i,
  'writing':          /\bwrite\b|draft|compose|create|author/i,
  'reasoning':        /\breason\b|think|logic|deduce|infer/i,
  'research':         /research|\bfind\b|search|investigate|explore/i,
  'creative':         /creative|imaginative|innovative|brainstorm|ideate/i,
  'teaching':         /\bteach\b|explain|clarify|demonstrate|educate/i,
  'technical':        /technical|engineering|system|infrastructure/i,
  'summarization':    /summariz|condense|\bbrief\b|tl;?dr|synopsis/i,
  'debugging':        /\bdebug\b|\bfix\b|troubleshoot|\berror\b|\bissue\b/i,
  'planning':         /\bplan\b|organize|schedule|roadmap|timeline/i,
  'optimization':     /optimiz|enhance|improve|refine|\btune\b/i,
  'automation':       /automat|workflow|pipeline|\bagent\b/i,
  'multi-agent':      /multi[.\-_]?agent|orchestrat|coordinator/i,
};

export function detectCapabilities(content, config = {}) {
  const custom = config.customCapabilities ?? {};
  const all = { ...BASE_CAPABILITIES, ...custom };
  return Object.entries(all)
    .filter(([, pattern]) => pattern.test(content))
    .map(([key]) => key);
}
