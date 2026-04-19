/**
 * Score a file's sophistication based on detected attributes.
 * Returns: 'elite' | 'advanced' | 'sophisticated' | 'intermediate' | 'standard'
 */
export function scoreSophistication({ techniques = [], capabilities = [], tools = [], constraints = [] }) {
  const score =
    techniques.length * 2 +
    constraints.length * 1.5 +
    capabilities.length * 1 +
    tools.length * 1;

  if (score >= 25) return 'elite';
  if (score >= 18) return 'advanced';
  if (score >= 12) return 'sophisticated';
  if (score >= 6)  return 'intermediate';
  return 'standard';
}
