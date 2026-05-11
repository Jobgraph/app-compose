import { useState, useEffect } from 'react';
import { type AppConfig, loadConfig } from './config';

const MOCK_RESPONSE = `Dear Mr. Johnson,

Thank you for your enquiry regarding our enterprise licensing options. I'm pleased to provide the following overview.

Our Enterprise plan includes:
- Unlimited user seats
- Priority support with 4-hour SLA
- Custom integrations and API access
- Dedicated account manager
- Annual security audit and compliance reporting

Based on your team size of 50 users, I'd recommend our Enterprise Growth tier at £2,400/month (billed annually). This includes all features above plus quarterly business reviews.

I'd be happy to schedule a call to discuss your specific requirements in more detail. Please let me know your availability this week.

Best regards,
[Your name]
[Your title]`;

export default function App() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [brief, setBrief] = useState('');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { loadConfig().then(setConfig); }, []);
  if (!config) return null;

  async function generate() {
    setLoading(true);
    setResult('');
    setError('');
    try {
      if (config!.deploymentId === 'local') {
        await new Promise((r) => setTimeout(r, 1500));
        setResult(MOCK_RESPONSE);
      } else {
        const res = await fetch(
          `https://app.jobgraph.com/api/apps/${config!.deploymentId}/process`,
          { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ input: brief, type: 'compose', tone, length }) }
        );
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        const data = await res.json();
        setResult(data.output ?? '');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally { setLoading(false); }
  }

  function copy() {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-white/10 px-6 py-4 flex items-center gap-3">
        {config.logoUrl && <img src={config.logoUrl} alt="" className="h-8 w-8 rounded" />}
        <h1 className="text-xl font-semibold">{config.appName}</h1>
        <span className="text-sm text-white/50">{config.orgName}</span>
      </header>
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-8 space-y-6">
        <textarea
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          placeholder="What do you need written?"
          className="w-full min-h-[160px] bg-white/5 border border-white/10 rounded-lg p-4 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div className="flex gap-4">
          <select value={tone} onChange={(e) => setTone(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="formal">Formal</option>
            <option value="casual">Casual</option>
          </select>
          <select value={length} onChange={(e) => setLength(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
            <option value="short">Short</option>
            <option value="medium">Medium</option>
            <option value="long">Long</option>
          </select>
        </div>
        <button onClick={generate} disabled={loading || !brief.trim()} style={{ backgroundColor: config.brandColour }} className="px-6 py-2.5 rounded-lg font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity">
          {loading ? 'Generating...' : 'Generate document'}
        </button>
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">{error}</div>
        )}
        {result && (
          <div className="space-y-4 pt-4">
            <section className="bg-white/5 border border-white/10 rounded-lg p-5">
              <h2 className="text-lg font-semibold mb-2">Generated Document</h2>
              <textarea readOnly value={result} className="w-full min-h-[200px] bg-black/30 border border-white/10 rounded p-3 text-white/80 resize-y" />
            </section>
            <button onClick={copy} className="px-4 py-2 bg-white/10 hover:bg-white/15 rounded-lg text-sm transition-colors">
              {copied ? '✓ Copied!' : 'Copy to clipboard'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
