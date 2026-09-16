import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DocuMind SLM — Local Document Intelligence & Anomaly Engine',
  description: '100% Local, Layout-Aware Document AI Powered by Open-Weights SLMs (DPDP Act 2023 Compliant)',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
