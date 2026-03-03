import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Nav from '@/components/Nav';
import SolanaProvider from '@/components/SolanaProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans-var' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono-var' });

export const metadata: Metadata = {
  title: 'MERIK — Your Standing on Solana',
  description: 'Solana wallet reputation and achievement system. Connect wallet, get scored, earn badges, share your profile.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="bg-surface text-primary font-sans antialiased">
        <SolanaProvider>
          <Nav />
          <main>{children}</main>
          <footer className="border-t border-border py-10 text-center text-xs text-muted">
            MERIK &mdash; Solana Reputation &amp; Achievement System
          </footer>
        </SolanaProvider>
      </body>
    </html>
  );
}
