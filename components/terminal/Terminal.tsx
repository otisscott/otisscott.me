'use client';

import { useRef, useCallback, useLayoutEffect } from 'react';
import { init as initGhostty, Terminal as XTerm, FitAddon } from 'ghostty-web';
import { themes, ColorMode } from '@/lib/theme/themes';
import {
  generatePromptInfo,
  generatePromptSymbol,
  lsCommand,
  pwdCommand,
  catCommand,
  whoamiCommand,
  cowsayCommand,
  dateCommand,
  historyCommand,
  loadAliases,
  getFortune,
  figletCommand,
  lolcat,
  setExitCode,
} from '@/components/commands/handlers';
import type { Job } from '@/components/commands/handlers';
import {
  runCommand,
  resolveAlias,
  getCompletions,
  isLinkable,
  TAKEOVER,
} from '@/components/commands/dispatch';
import type { CommandContext } from '@/components/commands/dispatch';
import { startBgJob, startKonami, startScreensaver, stopAllAnimations } from '@/components/commands/interactive';
import { ANSI, padEndVisible, stripAnsi, visibleLength } from '@/lib/filesystem/types';

const HISTORY_KEY = 'otisscott-terminal-history';
const HISTORY_LIMIT = 500;

function loadHistory(): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]');
    return Array.isArray(parsed)
      ? parsed.filter((entry): entry is string => typeof entry === 'string').slice(-HISTORY_LIMIT)
      : [];
  } catch {
    return [];
  }
}

function saveHistory(history: string[]) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {
    return;
  }
}

const KEY_BAR = [
  { label: 'Tab', text: 'Tab', data: '\t' },
  { label: 'Esc', text: 'Esc', data: '\x1b' },
  { label: 'Up arrow', text: '↑', data: '\x1b[A' },
  { label: 'Down arrow', text: '↓', data: '\x1b[B' },
  { label: 'Left arrow', text: '←', data: '\x1b[D' },
  { label: 'Right arrow', text: '→', data: '\x1b[C' },
  { label: 'Control C', text: '^C', data: '\x03' },
];

export default function Terminal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const inputBufferRef = useRef('');
  const commandHistoryRef = useRef<string[]>([]);
  const historyIndexRef = useRef(-1);
  const cursorPositionRef = useRef(0);
  const ghostTextRef = useRef('');
  const currentThemeRef = useRef('tokyo-night');
  const colorModeRef = useRef<ColorMode>('dark');
  const interactiveModeRef = useRef<((data: string) => void) | null>(null);
  const loadTimeRef = useRef<number | null>(null);
  const aliasesRef = useRef<Record<string, string>>({});
  const jobsRef = useRef<Job[]>([]);
  const nextJobIdRef = useRef(1);
  const lineCursorRef = useRef(0);
  const konamiRef = useRef<string[]>([]);
  const lastActivityRef = useRef<number | null>(null);
  const sendKeyRef = useRef<((data: string) => void) | null>(null);

  const getPromptInfo = useCallback(() => {
    const cols = xtermRef.current?.cols ?? 80;
    return generatePromptInfo(cols < 56);
  }, []);

  const writePrompt = useCallback(() => {
    if (xtermRef.current) {
      xtermRef.current.write('\r\n' + getPromptInfo() + '\r\n' + generatePromptSymbol());
      lineCursorRef.current = visibleLength(generatePromptSymbol());
    }
  }, [getPromptInfo]);

  const writeOutput = useCallback((output: string) => {
    if (xtermRef.current && output) {
      xtermRef.current.write('\r\n' + output.replace(/\n/g, '\r\n'));
    }
  }, []);

  const renderLine = useCallback((ghost = '') => {
    const term = xtermRef.current;
    if (!term) return;
    const cols = term.cols;
    const symbol = generatePromptSymbol();
    const input = inputBufferRef.current;
    const up = Math.floor(lineCursorRef.current / cols);
    let seq = (up > 0 ? `\x1b[${up}A` : '') + '\r\x1b[J' + symbol + input;
    if (ghost) seq += `${ANSI.dim}${ghost}${ANSI.reset}`;
    const end = visibleLength(symbol) + input.length + ghost.length;
    if (end % cols === 0) seq += ' \r';
    const target = visibleLength(symbol) + cursorPositionRef.current;
    const rowsBack = Math.floor(end / cols) - Math.floor(target / cols);
    if (rowsBack > 0) seq += `\x1b[${rowsBack}A`;
    seq += `\x1b[${(target % cols) + 1}G`;
    term.write(seq);
    lineCursorRef.current = target;
  }, []);

  const handleTabCompletion = useCallback(() => {
    const input = inputBufferRef.current;
    const { completions, prefix, isCommand } = getCompletions(input);
    if (completions.length === 0) return;

    const head = input.slice(0, input.length - prefix.length);
    const setInput = (value: string) => {
      inputBufferRef.current = value;
      cursorPositionRef.current = value.length;
    };

    if (completions.length === 1) {
      const done = completions[0];
      setInput(head + done + (isCommand || !done.endsWith('/') ? ' ' : ''));
      return;
    }

    const lcp = completions.reduce((p, c) => {
      while (!c.startsWith(p)) p = p.slice(0, -1);
      return p;
    }, completions[0]);

    if (lcp.length > prefix.length) {
      setInput(head + lcp);
    } else if (xtermRef.current) {
      const display = completions.map(c => {
        const slash = c.lastIndexOf('/', c.length - 2);
        return slash >= 0 ? c.slice(slash + 1) : c;
      });
      cursorPositionRef.current = input.length;
      renderLine();
      xtermRef.current.write('\r\n' + display.join('  ') + '\r\n');
      lineCursorRef.current = 0;
    }
  }, [renderLine]);

  const computeGhostText = useCallback((): string => {
    const input = inputBufferRef.current;
    if (!input || cursorPositionRef.current !== input.length) return '';

    for (let i = commandHistoryRef.current.length - 1; i >= 0; i--) {
      const histCmd = commandHistoryRef.current[i];
      if (histCmd.startsWith(input) && histCmd !== input) {
        return histCmd.slice(input.length);
      }
    }

    const { completions, prefix, isCommand } = getCompletions(input);
    if (completions.length === 1 && prefix) {
      const done = completions[0];
      return done.slice(prefix.length) + (isCommand ? ' ' : '');
    }
    return '';
  }, []);

  const getTerminalContext = useCallback(() => ({
    term: xtermRef.current!,
    setInteractiveMode: (handler: ((data: string) => void) | null) => {
      interactiveModeRef.current = handler;
    },
    resetInput: () => {
      inputBufferRef.current = '';
      cursorPositionRef.current = 0;
    },
    writePrompt,
  }), [writePrompt]);

  const applyTheme = useCallback((themeName: string, mode: ColorMode) => {
    const theme = themes[themeName];
    if (!theme || !xtermRef.current) return;
    const variant = theme[mode];
    xtermRef.current.options.theme = variant.xterm;
    document.documentElement.style.setProperty('--bg-primary', variant.css.bgPrimary);
    document.documentElement.style.setProperty('--bg-secondary', variant.css.bgSecondary);
    document.documentElement.style.setProperty('--bg-tertiary', variant.css.bgTertiary);
  }, []);

  const handleCommand = useCallback((command: string) => {
    const trimmedCommand = command.trim();

    if (trimmedCommand) {
      commandHistoryRef.current.push(trimmedCommand);
      if (commandHistoryRef.current.length > HISTORY_LIMIT) {
        commandHistoryRef.current.splice(0, commandHistoryRef.current.length - HISTORY_LIMIT);
      }
      saveHistory(commandHistoryRef.current);
      historyIndexRef.current = commandHistoryRef.current.length;

      // Resolve aliases (single-pass)
      const resolved = resolveAlias(trimmedCommand, aliasesRef.current);

      // Pipes: <producer> | <filter> [| <filter> ...]
      // e.g. fortune | cowsay | lolcat, figlet otis | lolcat, history | grep ls
      if (resolved.includes('|')) {
        const cols = xtermRef.current?.cols ?? 80;
        const segments = resolved.split('|').map(s => s.trim()).filter(Boolean);
        const [first, ...filters] = segments;
        const [pCmd, ...pArgs] = first.split(' ');

        let out: string | null;
        switch (pCmd) {
          case 'fortune': out = getFortune(); break;
          case 'echo': out = pArgs.join(' '); break;
          case 'figlet': out = figletCommand(pArgs, cols); break;
          case 'cowsay': out = cowsayCommand(pArgs, cols); break;
          case 'whoami': out = whoamiCommand(); break;
          case 'date': out = dateCommand(); break;
          case 'pwd': out = pwdCommand(); break;
          case 'cat': out = catCommand(pArgs); break;
          case 'ls': out = lsCommand(pArgs); break;
          case 'history': out = historyCommand(commandHistoryRef.current); break;
          default: out = null;
        }

        if (out === null) {
          writeOutput(`${ANSI.red}zsh: '${pCmd}' can't start a pipe here${ANSI.reset}\n${ANSI.dim}Pipeable: fortune, echo, figlet, cowsay, cat, ls, history, whoami, date, pwd${ANSI.reset}`);
        } else {
          let piped: string = out;
          for (const seg of filters) {
            const [fCmd, ...fArgs] = seg.split(' ');
            if (fCmd === 'lolcat') {
              piped = lolcat(piped);
            } else if (fCmd === 'cowsay') {
              piped = cowsayCommand([stripAnsi(piped).replace(/\s*\n\s*/g, ' ')], cols);
            } else if (fCmd === 'grep') {
              const pattern = fArgs.join(' ');
              if (!pattern) {
                piped = `${ANSI.red}usage: ... | grep <pattern>${ANSI.reset}`;
                break;
              }
              const matched = piped.split('\n').filter(line =>
                stripAnsi(line).toLowerCase().includes(pattern.toLowerCase())
              );
              piped = matched.length > 0 ? matched.join('\n') : `${ANSI.dim}No matches for "${pattern}"${ANSI.reset}`;
            } else {
              piped = `${ANSI.red}zsh: '${fCmd}' is not a valid pipe target${ANSI.reset}\n${ANSI.dim}Try: cowsay, lolcat, grep${ANSI.reset}`;
              break;
            }
          }
          writeOutput(piped);
        }

        setExitCode(0);
        inputBufferRef.current = '';
        cursorPositionRef.current = 0;
        writePrompt();
        return;
      }

      // Trailing & detection: background job
      if (resolved.endsWith(' &') || (resolved.endsWith('&') && resolved.length > 1)) {
        const bgCmd = resolved.replace(/\s*&$/, '').trim();
        if (bgCmd && jobsRef.current.length < 5) {
          const jobId = nextJobIdRef.current++;
          const job: Job = { id: jobId, name: bgCmd, progress: 0, done: false, intervalId: 0 };
          jobsRef.current.push(job);
          const pid = 1000 + Math.floor(Math.random() * 9000);
          job.intervalId = startBgJob(
            bgCmd,
            (progress) => { job.progress = progress; },
            () => { job.done = true; },
          );
          writeOutput(`[${jobId}] ${pid} Running   ${bgCmd} &`);
          inputBufferRef.current = '';
          cursorPositionRef.current = 0;
          writePrompt();
          return;
        }
      }

      const parts = resolved.split(' ');
      const cmd = parts[0];
      const args = parts.slice(1);

      setExitCode(0);

      const ctx: CommandContext = {
        args,
        term: xtermRef.current!,
        cols: xtermRef.current?.cols ?? 80,
        loadTime: loadTimeRef.current ?? Date.now(),
        history: commandHistoryRef.current,
        jobs: jobsRef.current,
        out: writeOutput,
        interactive: getTerminalContext(),
        theme: {
          current: currentThemeRef.current,
          mode: colorModeRef.current,
          set: (name: string) => {
            currentThemeRef.current = name;
            applyTheme(name, colorModeRef.current);
          },
        },
        reloadAliases: () => { aliasesRef.current = loadAliases(); },
      };

      // A command that seized the terminal drives its own prompt
      if (runCommand(cmd, ctx) === TAKEOVER) return;
    }

    inputBufferRef.current = '';
    cursorPositionRef.current = 0;
    writePrompt();
  }, [writePrompt, writeOutput, getTerminalContext, applyTheme]);

  useLayoutEffect(() => {
    if (!terminalRef.current || xtermRef.current) return;

    // ghostty-web loads its WASM module before a Terminal can be constructed,
    // so setup is async and the effect can be torn down mid-load.
    let cancelled = false;
    let teardown: (() => void) | null = null;

    const setup = (wrapper: HTMLDivElement) => {
      loadTimeRef.current = Date.now();
      lastActivityRef.current = Date.now();

      // Detect system color scheme
      const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const initialMode: ColorMode = darkQuery.matches ? 'dark' : 'light';
      colorModeRef.current = initialMode;
      const initialVariant = themes['tokyo-night'][initialMode];

      const term = new XTerm({
        theme: initialVariant.xterm,
        fontFamily: '"SF Mono", "Fira Code", "JetBrains Mono", "Consolas", "Monaco", "Courier New", monospace',
        fontSize: window.matchMedia('(max-width: 480px)').matches ? 12 : 14,
        cursorBlink: true,
        cursorStyle: 'block',
        scrollback: 10000,
      });

      // Set initial CSS vars
      document.documentElement.style.setProperty('--bg-primary', initialVariant.css.bgPrimary);
      document.documentElement.style.setProperty('--bg-secondary', initialVariant.css.bgSecondary);
      document.documentElement.style.setProperty('--bg-tertiary', initialVariant.css.bgTertiary);

      const fitAddon = new FitAddon();
      fitAddonRef.current = fitAddon;
      term.loadAddon(fitAddon);

      // Open terminal (ghostty-web renders to its own canvas — no WebGL addon).
      // open() registers the OSC 8 and bare-URL link providers itself, so
      // there is nothing to add here; ctrl/cmd-click activates them.
      term.open(wrapper);

      // Load aliases from localStorage
      aliasesRef.current = loadAliases();
      commandHistoryRef.current = loadHistory();
      historyIndexRef.current = commandHistoryRef.current.length;

      // Write welcome message (adapts to terminal width)
      const writeWelcome = () => {
        const cols = term.cols;
        term.writeln('');

        if (cols >= 50) {
          // Boxed welcome for wide screens
          const W = Math.min(56, cols - 4);
          const brow = (content: string) =>
            `${ANSI.cyan}  |${ANSI.reset}${padEndVisible(content, W)}${ANSI.cyan}|${ANSI.reset}`;

          term.writeln(`${ANSI.cyan}  +${'-'.repeat(W)}+${ANSI.reset}`);
          term.writeln(brow(''));
          term.writeln(brow(`   Welcome to ${ANSI.magenta}otisscott.me${ANSI.reset}`));
          term.writeln(brow(''));
          term.writeln(brow(`   Type ${ANSI.green}help${ANSI.reset} for commands`));
          term.writeln(brow(`   Try ${ANSI.green}neofetch${ANSI.reset} or ${ANSI.green}cowsay${ANSI.reset}`));
          term.writeln(brow(''));
          term.writeln(`${ANSI.cyan}  +${'-'.repeat(W)}+${ANSI.reset}`);
        } else {
          // Borderless welcome for narrow screens
          term.writeln(` Welcome to ${ANSI.magenta}otisscott.me${ANSI.reset}`);
          term.writeln('');
          term.writeln(` Type ${ANSI.green}help${ANSI.reset} for commands`);
        }

        term.write(getPromptInfo() + '\r\n' + generatePromptSymbol());
        lineCursorRef.current = visibleLength(generatePromptSymbol());
      };

      // Fit terminal using FitAddon (which properly measures char dimensions)
      const fitTerminal = () => {
        if (fitAddonRef.current && xtermRef.current) {
          const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
          document.documentElement.style.setProperty('--app-height', `${viewportHeight}px`);
          fitAddonRef.current.fit();
          xtermRef.current.scrollToBottom();
        }
      };

      const runFromHash = () => {
        let cmd: string;
        try {
          cmd = decodeURIComponent(window.location.hash.slice(1));
        } catch {
          return;
        }
        if (!isLinkable(cmd) || interactiveModeRef.current) return;
        cmd = cmd.split('|').map(seg => seg.trim()).join(' | ');
        inputBufferRef.current = cmd;
        cursorPositionRef.current = cmd.length;
        renderLine();
        handleCommand(cmd);
      };

      // Initialize terminal after fonts load
      const initTerminal = () => {
        // Fit first so term.cols reflects actual screen width
        fitTerminal();
        // Then write welcome (adapts to cols)
        writeWelcome();
        runFromHash();
        // Scroll to show the prompt at the bottom once layout settles
        setTimeout(() => xtermRef.current?.scrollToBottom(), 0);
      };

      if (typeof document !== 'undefined' && document.fonts) {
        document.fonts.ready.then(() => {
          initTerminal();
          // Refit after layout settles
          setTimeout(fitTerminal, 100);
        }).catch(() => {
          initTerminal();
        });
      } else {
        requestAnimationFrame(initTerminal);
      }

      let trailingFit: number | undefined;
      const handleViewportResize = () => {
        fitTerminal();
        window.clearTimeout(trailingFit);
        trailingFit = window.setTimeout(fitTerminal, 75);
      };

      window.addEventListener('resize', handleViewportResize);
      window.addEventListener('hashchange', runFromHash);
      window.visualViewport?.addEventListener('resize', handleViewportResize);
      window.visualViewport?.addEventListener('scroll', handleViewportResize);

      const handleTerminalFocus = () => {
        requestAnimationFrame(() => {
          fitTerminal();
          xtermRef.current?.scrollToBottom();
        });
      };
      wrapper.addEventListener('focusin', handleTerminalFocus);

      // Idle screensaver — only kicks in at an empty prompt
      const IDLE_MS = 3 * 60 * 1000;
      const idleInterval = window.setInterval(() => {
        if (
          Date.now() - (lastActivityRef.current ?? Date.now()) > IDLE_MS &&
          !interactiveModeRef.current &&
          inputBufferRef.current === ''
        ) {
          lastActivityRef.current = Date.now();
          startScreensaver(getTerminalContext());
        }
      }, 10000);

      // Listen for system color scheme changes
      const handleColorSchemeChange = (e: MediaQueryListEvent) => {
        const newMode: ColorMode = e.matches ? 'dark' : 'light';
        colorModeRef.current = newMode;
        applyTheme(currentThemeRef.current, newMode);
      };
      darkQuery.addEventListener('change', handleColorSchemeChange);

      const handleData = (data: string) => {
        lastActivityRef.current = Date.now();

        // Interactive mode intercept (e.g., vim command buffer)
        if (interactiveModeRef.current) {
          interactiveModeRef.current(data);
          return;
        }

        // Konami code detection — only at the shell prompt
        const konamiToken =
          data === '\x1b[A' ? 'U' :
          data === '\x1b[B' ? 'D' :
          data === '\x1b[C' ? 'R' :
          data === '\x1b[D' ? 'L' :
          data.length === 1 ? data.toLowerCase() : '?';
        konamiRef.current.push(konamiToken);
        if (konamiRef.current.length > 10) konamiRef.current.shift();
        if (konamiRef.current.join('') === 'UUDDLRLRba') {
          konamiRef.current = [];
          startKonami(getTerminalContext());
          return;
        }

        const ghost = ghostTextRef.current;
        ghostTextRef.current = '';
        const buf = inputBufferRef.current;
        const pos = cursorPositionRef.current;
        const atEnd = pos === buf.length;
        const history = commandHistoryRef.current;
        const set = (value: string, cursor = value.length) => {
          inputBufferRef.current = value;
          cursorPositionRef.current = cursor;
        };
        const abandonLine = () => {
          cursorPositionRef.current = buf.length;
          renderLine();
        };

        switch (data) {
          case '\r':
            abandonLine();
            handleCommand(buf);
            return;
          case '\x03':
            abandonLine();
            term.write('^C');
            set('');
            historyIndexRef.current = history.length;
            writePrompt();
            return;
          case '\x04':
            if (!buf) {
              historyIndexRef.current = history.length;
              writePrompt();
              return;
            }
            set(buf.slice(0, pos) + buf.slice(pos + 1), pos);
            break;
          case '\x0c':
            term.write('\x1b[H\x1b[2J' + getPromptInfo() + '\r\n');
            lineCursorRef.current = 0;
            break;
          case '\x7f':
          case '\b':
            if (pos > 0) set(buf.slice(0, pos - 1) + buf.slice(pos), pos - 1);
            break;
          case '\x1b[3~':
            set(buf.slice(0, pos) + buf.slice(pos + 1), pos);
            break;
          case '\x1b[A':
            if (historyIndexRef.current > 0) set(history[--historyIndexRef.current]);
            break;
          case '\x1b[B':
            if (historyIndexRef.current < history.length - 1) {
              set(history[++historyIndexRef.current]);
            } else {
              historyIndexRef.current = history.length;
              set('');
            }
            break;
          case '\x1b[C':
          case '\x05':
          case '\x1b[F':
          case '\x1bOF':
          case '\x1b[4~':
          case '\t':
            if (atEnd && ghost) set(buf + ghost);
            else if (data === '\t') handleTabCompletion();
            else if (data === '\x1b[C') set(buf, Math.min(pos + 1, buf.length));
            else set(buf);
            break;
          case '\x1b[D':
            set(buf, Math.max(pos - 1, 0));
            break;
          case '\x01':
          case '\x1b[H':
          case '\x1bOH':
          case '\x1b[1~':
            set(buf, 0);
            break;
          case '\x0b':
            set(buf.slice(0, pos), pos);
            break;
          case '\x15':
            set(buf.slice(pos), 0);
            break;
          case '\x17': {
            const kept = buf.slice(0, pos).replace(/\S+\s*$/, '');
            set(kept + buf.slice(pos), kept.length);
            break;
          }
          default: {
            const text = data.startsWith('\x1b') ? '' : data.replace(/[^\x20-\x7e]/g, '');
            if (!text) {
              ghostTextRef.current = ghost;
              return;
            }
            set(buf.slice(0, pos) + text + buf.slice(pos), pos + text.length);
          }
        }

        const next = computeGhostText();
        ghostTextRef.current = next;
        renderLine(next);
      };

      term.onData(handleData);
      sendKeyRef.current = handleData;
      xtermRef.current = term;

      return () => {
        window.removeEventListener('resize', handleViewportResize);
        window.removeEventListener('hashchange', runFromHash);
        window.visualViewport?.removeEventListener('resize', handleViewportResize);
        window.visualViewport?.removeEventListener('scroll', handleViewportResize);
        wrapper.removeEventListener('focusin', handleTerminalFocus);
        darkQuery.removeEventListener('change', handleColorSchemeChange);
        clearInterval(idleInterval);
        window.clearTimeout(trailingFit);
        // Must precede dispose(): a running animation would keep writing to a
        // freed terminal, which ghostty-web throws on once per tick.
        stopAllAnimations();
        interactiveModeRef.current = null;
        sendKeyRef.current = null;
        term.dispose();
        xtermRef.current = null;
      };
    };

    initGhostty()
      .then(() => {
        if (cancelled || !terminalRef.current || xtermRef.current) return;
        teardown = setup(terminalRef.current);
      })
      .catch((err) => {
        console.error('ghostty-web failed to initialise', err);
        document.documentElement.classList.remove('js');
      });

    return () => {
      cancelled = true;
      teardown?.();
    };
  }, [handleCommand, handleTabCompletion, computeGhostText, renderLine, writePrompt, applyTheme, getPromptInfo, getTerminalContext]);

  return (
    <div
      ref={containerRef}
      className="terminal-container"
    >
      <div
        ref={terminalRef}
        className="terminal-wrapper"
      />
      <div className="key-bar" role="toolbar" aria-label="Terminal keys">
        {KEY_BAR.map(key => (
          <button
            key={key.label}
            type="button"
            className="key-bar-key"
            aria-label={key.label}
            onPointerDown={e => e.preventDefault()}
            onMouseDown={e => e.preventDefault()}
            onClick={() => sendKeyRef.current?.(key.data)}
          >
            {key.text}
          </button>
        ))}
      </div>
    </div>
  );
}
