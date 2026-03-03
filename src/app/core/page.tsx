import { PROJECT, MEMO_LOGS, COUNCIL } from '@/lib/constants';

export default function CorePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-center mb-14">
        <h1 className="text-4xl font-bold mb-3">Core Infrastructure</h1>
        <p className="text-muted text-sm">On-chain identity and governance powering the Merik protocol.</p>
      </div>

      {/* Identity */}
      <section className="mb-12">
        <div className="text-xs text-muted uppercase tracking-widest mb-4">Identity</div>
        <div className="bg-surface-card border border-border rounded-2xl overflow-hidden">
          {[
            { label: 'Project Wallet', value: PROJECT.wallet, desc: 'Primary operational wallet' },
            { label: 'Treasury', value: PROJECT.treasury, desc: 'Protocol treasury' },
            { label: 'Multisig (2/3)', value: PROJECT.multisig, desc: 'Council-governed multisig' },
            ...(PROJECT.sns ? [{ label: 'SNS Domain', value: PROJECT.sns, desc: 'Solana Name Service' }] : []),
          ].map((item, i) => (
            <div
              key={item.label}
              className={`flex justify-between items-center px-6 py-5 gap-4 flex-wrap ${
                i % 2 === 0 ? 'bg-surface' : ''
              } ${i > 0 ? 'border-t border-border/50' : ''}`}
            >
              <div>
                <div className="font-medium text-sm">{item.label}</div>
                <div className="text-xs text-muted">{item.desc}</div>
              </div>
              <div className="font-mono text-xs text-right max-w-[400px] break-all">
                {item.value ? (
                  <a
                    href={item.label === 'SNS Domain' ? `https://sns.id/domain/${item.value.replace('.sol', '')}` : `https://solscan.io/account/${item.value}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo hover:underline"
                  >
                    {item.value}
                  </a>
                ) : (
                  <span className="text-muted">Pending...</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Council */}
      {COUNCIL.length > 0 && (
        <section className="mb-12">
          <div className="text-xs text-muted uppercase tracking-widest mb-4">Governance Council</div>
          <div className="grid sm:grid-cols-3 gap-3">
            {COUNCIL.map((c, i) => (
              <div key={c.name} className="bg-surface-card border border-border rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-light text-indigo text-xs font-mono font-bold flex items-center justify-center">
                    {i + 1}
                  </div>
                  <span className="font-medium text-sm">{c.name}</span>
                </div>
                <div className="font-mono text-[10px] text-muted break-all">{c.address}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Memo log */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <div className="text-xs text-muted uppercase tracking-widest">On-chain Log</div>
          <div className="text-xs text-muted">{MEMO_LOGS.length} entries</div>
        </div>

        {MEMO_LOGS.length === 0 ? (
          <div className="bg-surface-card border border-border rounded-2xl p-10 text-center">
            <div className="font-mono text-sm text-muted">// awaiting deployment</div>
          </div>
        ) : (
          <div className="bg-surface-card border border-border rounded-2xl overflow-hidden">
            {MEMO_LOGS.map((m, i) => (
              <div
                key={m.id}
                className={`flex items-center gap-4 px-6 py-4 ${i % 2 === 0 ? 'bg-surface' : ''} ${
                  i > 0 ? 'border-t border-border/50' : ''
                }`}
              >
                <span className="font-mono text-xs text-indigo w-10 flex-shrink-0">{m.id}</span>
                <span className="text-sm text-muted flex-1 truncate">{m.content}</span>
                <a
                  href={`https://solscan.io/tx/${m.signature}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[10px] text-indigo hover:underline whitespace-nowrap"
                >
                  {m.signature.slice(0, 8)}...
                </a>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Scoring algorithm */}
      <section>
        <div className="text-xs text-muted uppercase tracking-widest mb-4">Scoring Algorithm</div>
        <div className="bg-surface-card border border-border rounded-2xl p-8">
          <p className="text-sm text-muted leading-relaxed mb-5">
            The Merik Score is a composite of 12 on-chain dimensions, weighted to reflect genuine blockchain participation and skill.
          </p>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
            {[
              { dim: 'Trading Volume', weight: 15 },
              { dim: 'Win Rate', weight: 15 },
              { dim: 'Wallet Age', weight: 10 },
              { dim: 'Hold Duration', weight: 10 },
              { dim: 'Token Diversity', weight: 8 },
              { dim: 'Consistency', weight: 10 },
              { dim: 'Risk Management', weight: 8 },
              { dim: 'Social Activity', weight: 5 },
              { dim: 'Early Adoption', weight: 5 },
              { dim: 'Survival Rate', weight: 5 },
              { dim: 'Network Effect', weight: 5 },
              { dim: 'On-chain Presence', weight: 4 },
            ].map((d) => (
              <div key={d.dim} className="flex items-center gap-3">
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-xs">{d.dim}</span>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo rounded-full" style={{ width: `${d.weight * 5}%` }} />
                  </div>
                </div>
                <span className="font-mono text-[10px] text-muted w-8 text-right">{d.weight}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
