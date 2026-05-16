export interface AppConfig {
  deploymentId: string;
  appName: string;
  orgName: string;
  brandColour: string;
  logoUrl: string | null;
  systemPrompt: string;
  capabilities: string[];
  status?: 'ACTIVE' | 'PILOT' | 'EXPIRED' | 'PAUSED';
  pilotEndsAt?: string | null;
  isConfigured: boolean;
}

const DEFAULTS: AppConfig = {
  deploymentId: 'local',
  appName: 'Compose',
  orgName: 'Your Organisation',
  brandColour: '#d97757',
  logoUrl: null,
  systemPrompt: 'You are a professional writing assistant.',
  capabilities: ['document-generation'],
  status: 'ACTIVE',
  isConfigured: false,
};

let cached: AppConfig | null = null;

/** @internal test-only: reset module-level cache between tests */
export function _clearCache() { cached = null; }

export async function loadConfig(): Promise<AppConfig> {
  if (cached) return cached;
  const id = import.meta.env.VITE_DEPLOYMENT_ID;
  if (!id) {
    cached = DEFAULTS;
    return DEFAULTS;
  }
  try {
    const res = await fetch(`https://app.jobgraph.com/api/apps/${id}/config`);
    if (!res.ok) {
      const fallback: AppConfig = { ...DEFAULTS, deploymentId: id };
      cached = fallback;
      return fallback;
    }
    const result: AppConfig = { ...DEFAULTS, ...(await res.json()), deploymentId: id, isConfigured: true };
    cached = result;
    return result;
  } catch {
    const fallback: AppConfig = { ...DEFAULTS, deploymentId: id };
    cached = fallback;
    return fallback;
  }
}
