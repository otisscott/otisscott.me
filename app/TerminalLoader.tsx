'use client';

import dynamic from 'next/dynamic';

const Terminal = dynamic(() => import('@/components/terminal/Terminal'), {
  ssr: false,
  loading: () => <div className="terminal-loading">Loading terminal...</div>,
});

export default function TerminalLoader() {
  return <Terminal />;
}
