'use client';

import { useRef, useCallback, useLayoutEffect } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { WebglAddon } from '@xterm/addon-webgl';
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
  TAKEOVER,
} from '@/components/commands/dispatch';
import type { CommandContext } from '@/components/commands/dispatch';
import { startBgJob, startKonami, startScreensaver } from '@/components/commands/interactive';
import { ANSI, padEndVisible, stripAnsi } from '@/lib/filesystem/types';

interface TerminalProps {
  onCommand?: (command: string) => void;
  onData?: (data: string) => void;
}

export default function Terminal({ onCommand, onData }: TerminalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const inputBufferRef = useRef('');
  const commandHistoryRef = useRef<string[]>([]);
  const historyIndexRef = useRef(-1);
  const cursorPositionRef = useRef(0);
  const tabPressCountRef = useRef(0);
  const ghostTextRef = useRef('');
  const currentThemeRef = useRef('tokyo-night');
  const colorModeRef = useRef<ColorMode>('dark');
  const interactiveModeRef = useRef<((data: string) => void) | null>(null);
  const loadTimeRef = useRef<number | null>(null);
  const aliasesRef = useRef<Record<string, string>>({});
  const jobsRef = useRef<Job[]>([]);
  const nextJobIdRef = useRef(1);
  const promptMultilineRef = useRef(false);
  const konamiRef = useRef<string[]>([]);
  const lastActivityRef = useRef<number | null>(null);

  const getPromptInfo = useCallback(() => {
    const cols = xtermRef.current?.cols ?? 80;
    return generatePromptInfo(cols < 56);
  }, []);

  const writePrompt = useCallback(() => {
    if (xtermRef.current) {
      xtermRef.current.write('\r\n' + getPromptInfo() + '\r\n' + generatePromptSymbol());
      promptMultilineRef.current = true;
    }
  }, [getPromptInfo]);

  const writeShortPrompt = useCallback(() => {
    if (xtermRef.current) {
      xtermRef.current.write(generatePromptSymbol());
    }
  }, []);

  const writeOutput = useCallback((output: string) => {
    if (xtermRef.current && output) {
      xtermRef.current.write('\r\n' + output.replace(/\n/g, '\r\n'));
    }
  }, []);

  const handleTabCompletion = useCallback(() => {
    const input = inputBufferRef.current;
    const { completions, prefix } = getCompletions(input);

    if (completions.length === 0) return;

    const parts = input.split(' ');
    const isCmd = parts.length === 1 && !input.includes(' ');

    const updateInput = (value: string) => {
      inputBufferRef.current = value;
      cursorPositionRef.current = value.length;
      if (xtermRef.current) {
        xtermRef.current.write('\r\x1b[K');
        writeShortPrompt();
        xtermRef.current.write(value);
      }
    };

    if (completions.length === 1) {
      // Single match — complete it (completions already include full path)
      if (isCmd) {
        updateInput(completions[0] + ' ');
      } else {
        updateInput(`${parts[0]} ${completions[0]}`);
      }
      tabPressCountRef.current = 0;
      return;
    }

    // Multiple matches — find longest common prefix
    const lcp = completions.reduce((p, c) => {
      while (!c.startsWith(p)) p = p.slice(0, -1);
      return p;
    }, completions[0]);

    if (lcp.length > prefix.length) {
      // Can extend to LCP
      if (isCmd) {
        updateInput(lcp);
      } else {
        updateInput(`${parts[0]} ${lcp}`);
      }
      tabPressCountRef.current = 0;
    } else {
      // Already at LCP — show all options immediately
      if (xtermRef.current) {
        const display = completions.map(c => {
          const slash = c.lastIndexOf('/');
          return slash >= 0 ? c.slice(slash + 1) : c;
        });
        xtermRef.current.writeln('');
        xtermRef.current.writeln(display.join('  '));
        writeShortPrompt();
        xtermRef.current.write(inputBufferRef.current);
      }
      tabPressCountRef.current = 0;
    }
  }, [writeShortPrompt]);

  const computeGhostText = useCallback((): string => {
    const input = inputBufferRef.current;
    if (!input || cursorPositionRef.current !== input.length) return '';

    // Try command history first (most recent match)
    for (let i = commandHistoryRef.current.length - 1; i >= 0; i--) {
      const histCmd = commandHistoryRef.current[i];
      if (histCmd.startsWith(input) && histCmd !== input) {
        return histCmd.slice(input.length);
      }
    }

    // Fall back to single-match completions
    const { completions } = getCompletions(input);
    if (completions.length === 1) {
      const parts = input.split(' ');
      if (parts.length <= 1 && !input.includes(' ')) {
        // Command completion
        return completions[0].slice(input.length) + ' ';
      } else {
        // Path completion — completions already include full path
        const completed = `${parts[0]} ${completions[0]}`;
        if (completed.startsWith(input)) {
          return completed.slice(input.length);
        }
      }
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
      tabPressCountRef.current = 0;
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
      historyIndexRef.current = commandHistoryRef.current.length;

      if (onCommand) {
        onCommand(trimmedCommand);
      }

      // Resolve aliases (single-pass)
      const resolved = resolveAlias(trimmedCommand, aliasesRef.current);

      // Pipes: <producer> | <filter> [| <filter> ...]
      // e.g. fortune | cowsay | lolcat, figlet otis | lolcat, history | grep ls
      if (resolved.includes(' | ')) {
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
              piped = cowsayCommand([stripAnsi(piped)], cols);
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
        tabPressCountRef.current = 0;
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
          tabPressCountRef.current = 0;
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
    tabPressCountRef.current = 0;
    writePrompt();
  }, [onCommand, writePrompt, writeOutput, getTerminalContext, applyTheme]);

  useLayoutEffect(() => {
    if (!terminalRef.current || xtermRef.current) return;

    const wrapper = terminalRef.current;
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
      lineHeight: 1.25,
      cursorBlink: true,
      cursorStyle: 'block',
      scrollback: 10000,
      scrollOnUserInput: true,
    });

    // Set initial CSS vars
    document.documentElement.style.setProperty('--bg-primary', initialVariant.css.bgPrimary);
    document.documentElement.style.setProperty('--bg-secondary', initialVariant.css.bgSecondary);
    document.documentElement.style.setProperty('--bg-tertiary', initialVariant.css.bgTertiary);

    const fitAddon = new FitAddon();
    fitAddonRef.current = fitAddon;
    term.loadAddon(fitAddon);
    term.loadAddon(new WebLinksAddon());

    try {
      term.loadAddon(new WebglAddon());
    } catch {
      // WebGL not supported
    }

    // Open terminal
    term.open(wrapper);

    // Load aliases from localStorage
    aliasesRef.current = loadAliases();

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
      promptMultilineRef.current = true;
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

    // Initialize terminal after fonts load
    const initTerminal = () => {
      // Fit first so term.cols reflects actual screen width
      fitTerminal();
      // Then write welcome (adapts to cols)
      writeWelcome();
      // Scroll viewport to show the prompt at the bottom
      setTimeout(() => {
        const viewport = wrapper.querySelector('.xterm-viewport') as HTMLElement;
        if (viewport) {
          viewport.scrollTop = viewport.scrollHeight;
        }
        xtermRef.current?.scrollToBottom();
      }, 0);
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

    const handleViewportResize = () => {
      fitTerminal();
    };

    window.addEventListener('resize', handleViewportResize);
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

    term.onData((data) => {
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

      const code = data.charCodeAt(0);

      // Save and clear ghost text before processing input
      const hadGhost = ghostTextRef.current;
      if (hadGhost) {
        term.write('\x1b[K');
        ghostTextRef.current = '';
      }

      if (code === 13) {
        handleCommand(inputBufferRef.current);
      } else if (code === 127) {
        if (cursorPositionRef.current > 0) {
          const after = inputBufferRef.current.slice(cursorPositionRef.current);
          inputBufferRef.current = inputBufferRef.current.slice(0, cursorPositionRef.current - 1) + after;
          cursorPositionRef.current--;
          term.write('\b' + after + ' ' + `\x1b[${after.length + 1}D`);
        }
      } else if (code === 27 && data.length === 3) {
        if (data === '\x1b[A') {
          if (historyIndexRef.current > 0) {
            historyIndexRef.current--;
            const prevCommand = commandHistoryRef.current[historyIndexRef.current];
            inputBufferRef.current = prevCommand;
            cursorPositionRef.current = prevCommand.length;
            term.write('\r\x1b[K');
            promptMultilineRef.current = false;
            writeShortPrompt();
            term.write(prevCommand);
          }
        } else if (data === '\x1b[B') {
          if (historyIndexRef.current < commandHistoryRef.current.length - 1) {
            historyIndexRef.current++;
            const nextCommand = commandHistoryRef.current[historyIndexRef.current];
            inputBufferRef.current = nextCommand;
            cursorPositionRef.current = nextCommand.length;
            term.write('\r\x1b[K');
            writeShortPrompt();
            term.write(nextCommand);
          } else {
            historyIndexRef.current = commandHistoryRef.current.length;
            inputBufferRef.current = '';
            cursorPositionRef.current = 0;
            term.write('\r\x1b[K');
            writeShortPrompt();
          }
        } else if (data === '\x1b[C') {
          if (cursorPositionRef.current >= inputBufferRef.current.length && hadGhost) {
            inputBufferRef.current += hadGhost;
            cursorPositionRef.current = inputBufferRef.current.length;
            term.write(hadGhost);
          } else if (cursorPositionRef.current < inputBufferRef.current.length) {
            cursorPositionRef.current++;
            term.write(data);
          }
        } else if (data === '\x1b[D') {
          if (cursorPositionRef.current > 0) {
            cursorPositionRef.current--;
            term.write(data);
          }
        }
      } else if (code === 9) {
        if (hadGhost && cursorPositionRef.current === inputBufferRef.current.length) {
          inputBufferRef.current += hadGhost;
          cursorPositionRef.current = inputBufferRef.current.length;
          term.write(hadGhost);
        } else {
          handleTabCompletion();
        }
      } else if (code === 3) {
        term.write('^C');
        inputBufferRef.current = '';
        cursorPositionRef.current = 0;
        historyIndexRef.current = commandHistoryRef.current.length;
        tabPressCountRef.current = 0;
        writePrompt();
      } else if (code === 4) {
        inputBufferRef.current = '';
        cursorPositionRef.current = 0;
        historyIndexRef.current = commandHistoryRef.current.length;
        tabPressCountRef.current = 0;
        writePrompt();
      } else if (code >= 32 && code < 127) {
        promptMultilineRef.current = false;
        const before = inputBufferRef.current.slice(0, cursorPositionRef.current);
        const after = inputBufferRef.current.slice(cursorPositionRef.current);
        inputBufferRef.current = before + data + after;
        cursorPositionRef.current++;
        term.write(data + after);
        if (after.length > 0) {
          term.write(`\x1b[${after.length}D`);
        }
      }

      // Show ghost suggestion
      if (inputBufferRef.current && cursorPositionRef.current === inputBufferRef.current.length) {
        const ghost = computeGhostText();
        if (ghost) {
          term.write(`${ANSI.dim}${ghost}${ANSI.reset}\x1b[${ghost.length}D`);
          ghostTextRef.current = ghost;
        }
      }

      if (onData) {
        onData(data);
      }
    });

    xtermRef.current = term;

    return () => {
      window.removeEventListener('resize', handleViewportResize);
      window.visualViewport?.removeEventListener('resize', handleViewportResize);
      window.visualViewport?.removeEventListener('scroll', handleViewportResize);
      wrapper.removeEventListener('focusin', handleTerminalFocus);
      darkQuery.removeEventListener('change', handleColorSchemeChange);
      clearInterval(idleInterval);
      term.dispose();
      xtermRef.current = null;
    };
  }, [handleCommand, handleTabCompletion, computeGhostText, onData, writePrompt, writeShortPrompt, applyTheme, getPromptInfo, getTerminalContext]);

  return (
    <div
      ref={containerRef}
      className="terminal-container"
    >
      <div
        ref={terminalRef}
        className="terminal-wrapper"
      />
    </div>
  );
}
