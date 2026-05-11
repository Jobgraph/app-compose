export interface AppConfig {
  deploymentId: string;
  appName: string;
  orgName: string;
  brandColour: string;
  logoUrl: string | null;
  systemPrompt: string;
  capabilities: string[];
  isConfigured: boolean;
}

const DEFAULTS: AppConfig = {
  deploymentId: 'local',
  appName: 'Compose',
  orgName: 'Your Organisation',
  brandColour: '#6366f1',
  logoUrl: null,
  systemPrompt: 'You are a professional writing assistant.',
  capabilities: ['document-generation'],
  isConfigured: false,
};

export async function loadConfig(): Promise<AppConfig> {
  const id = import.meta.env.VITE_DEPLOYMENT_ID;
  if (!id) return { ...DEFAULTS, isConfigured: true };
  try {
    const res = await fetch(`https://app.jobgraph.com/api/apps/${id}/config`);
    if (!res.ok) return { ...DEFAULTS, deploymentId: id };
    return { ...DEFAULTS, ...await res.json(), deploymentId: id };
  } catch {
    return { ...DEFAULTS, deploymentId: id };
  }
}
