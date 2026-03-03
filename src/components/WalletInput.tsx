'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WalletInput() {
  const [value, setValue] = useState('');
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed.length >= 32) {
      router.push(`/profile?wallet=${trimmed}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="fade-up fade-up-d3 max-w-xl mx-auto">
      <div className="flex gap-3 bg-white border border-border rounded-2xl p-2 shadow-lg shadow-black/5">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Paste any Solana wallet address..."
          className="flex-1 bg-transparent px-4 py-2.5 text-sm font-mono outline-none placeholder:text-gray-400 min-w-0"
        />
        <button
          type="submit"
          disabled={value.trim().length < 32}
          className="bg-indigo text-white px-6 py-2.5 rounded-xl font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-40 shadow-md shadow-indigo/20 whitespace-nowrap"
        >
          Analyze
        </button>
      </div>
    </form>
  );
}
