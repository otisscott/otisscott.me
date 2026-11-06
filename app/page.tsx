import Profile from './Profile';
import TerminalLoader from './TerminalLoader';

export default function Home() {
  return (
    <main className="home">
      <Profile />
      <div className="terminal-host">
        <TerminalLoader />
      </div>
    </main>
  );
}
