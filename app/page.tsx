'use client';

import dynamic from 'next/dynamic';

// Dynamically import the Terminal component to avoid SSR issues with xterm.js
const Terminal = dynamic(() => import('@/components/terminal/Terminal'), {
  ssr: false,
  loading: () => (
    <div 
      style={{ 
        width: '100%', 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#1a1b26',
        color: '#a9b1d6',
        fontFamily: 'monospace',
      }}
    >
      Loading terminal...
    </div>
  ),
});

export default function Home() {
  return (
    <main 
      style={{ 
        width: '100vw', 
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <Terminal />
    </main>
  );
}
