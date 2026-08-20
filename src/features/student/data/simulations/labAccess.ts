export const ADVANCED_LAB_COSTS: Record<string, number> = {
  'privesc-005': 150,
  'privesc-009': 150,
  'privesc-010': 150,
  'sqli-time-1': 200,
  'sqli-second-1': 200,
  'osint-full-1': 200,
  'kc-web-1': 300,
  'pwd-crack-shadow-extract': 150,
  'pwd-crack-multi-hash': 150,
};

export const getLabCpCost = (scenarioId: string): number | null => {
  return ADVANCED_LAB_COSTS[scenarioId] ?? null;
};

export const isAdvancedLab = (scenarioId: string): boolean => {
  return scenarioId in ADVANCED_LAB_COSTS;
};
