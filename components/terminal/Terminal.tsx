'use client';

import { useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { WebglAddon } from '@xterm/addon-webgl';
import { xtermTheme } from '@/lib/theme/tokyo-night';
import { themes, themeNames } from '@/lib/theme/themes';
import {
  generatePrompt,
  generateShortPrompt,
  helpCommand,
  lsCommand,
  cdCommand,
  pwdCommand,
  catCommand,
  whoamiCommand,
  skillsCommand,
  experienceCommand,
  contactCommand,
  projectsCommand,
  gsCommand,
  glCommand,
  neofetchCommand,
  cowsayCommand,
  echoCommand,
  dateCommand,
  sudoCommand,
  exitCommand,
  pingCommand,
  treeCommand,
  grepCommand,
  historyCommand,
  openCommand,
  getCompletions,
  setExitCode,
} from '@/components/commands/handlers';
import { startVim, startSl, startRmRf } from '@/components/commands/interactive';
import { ANSI, padEndVisible } from '@/lib/filesystem/types';

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
  const lastTabInputRef = useRef('');
  const ghostTextRef = useRef('');
  const currentThemeRef = useRef('tokyo-night');
  const interactiveModeRef = useRef<((data: string) => void) | null>(null);

  const writePrompt = useCallback(() => {
    if (xtermRef.current) {
      const prompt = generatePrompt();
      xtermRef.current.write('\r\n' + prompt);
    }
  }, []);

  const writeShortPrompt = useCallback(() => {
    if (xtermRef.current) {
      const prompt = generateShortPrompt();
      xtermRef.current.write(prompt);
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

    if (completions.length === 0) {
      return;
    }

    if (completions.length === 1) {
      const parts = input.split(' ');
      if (parts.length === 1) {
        inputBufferRef.current = completions[0] + ' ';
        cursorPositionRef.current = inputBufferRef.current.length;
      } else {
        const cmd = parts[0];
        const rest = parts.slice(1).join(' ');
        const lastSlashIndex = rest.lastIndexOf('/');
        const dirPart = lastSlashIndex >= 0 ? rest.slice(0, lastSlashIndex + 1) : '';
        inputBufferRef.current = `${cmd} ${dirPart}${completions[0]}`;
        cursorPositionRef.current = inputBufferRef.current.length;
      }

      if (xtermRef.current) {
        xtermRef.current.write('\r\x1b[K');
        writeShortPrompt();
        xtermRef.current.write(inputBufferRef.current);
      }
      tabPressCountRef.current = 0;
    } else {
      if (tabPressCountRef.current === 0 || lastTabInputRef.current !== input) {
        tabPressCountRef.current = 1;
        lastTabInputRef.current = input;
        if (xtermRef.current) {
          xtermRef.current.write('\x07');
        }
      } else {
        tabPressCountRef.current = 0;
        if (xtermRef.current) {
          xtermRef.current.writeln('');
          xtermRef.current.writeln(completions.join('  '));
          writeShortPrompt();
          xtermRef.current.write(inputBufferRef.current);
        }
      }
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
        // Path completion
        const cmd = parts[0];
        const rest = parts.slice(1).join(' ');
        const lastSlashIndex = rest.lastIndexOf('/');
        const dirPart = lastSlashIndex >= 0 ? rest.slice(0, lastSlashIndex + 1) : '';
        const completed = `${cmd} ${dirPart}${completions[0]}`;
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

  const handleCommand = useCallback((command: string) => {
    const trimmedCommand = command.trim();

    if (trimmedCommand) {
      commandHistoryRef.current.push(trimmedCommand);
      historyIndexRef.current = commandHistoryRef.current.length;

      if (onCommand) {
        onCommand(trimmedCommand);
      }

      const parts = trimmedCommand.split(' ');
      const cmd = parts[0];
      const args = parts.slice(1);

      setExitCode(0);

      switch (cmd) {
        case 'help':
          writeOutput(helpCommand());
          break;
        case 'clear':
          xtermRef.current?.clear();
          break;
        case 'date':
          writeOutput(dateCommand());
          break;
        case 'pwd':
          writeOutput(pwdCommand());
          break;
        case 'whoami':
          writeOutput(whoamiCommand());
          break;
        case 'ls':
          writeOutput(lsCommand(args));
          break;
        case 'cd':
          const cdResult = cdCommand(args);
          if (cdResult) {
            writeOutput(cdResult);
          }
          break;
        case 'cat':
          writeOutput(catCommand(args));
          break;
        case 'echo':
          writeOutput(echoCommand(args));
          break;
        case 'skills':
          writeOutput(skillsCommand());
          break;
        case 'experience':
          writeOutput(experienceCommand());
          break;
        case 'contact':
          writeOutput(contactCommand());
          break;
        case 'projects':
          writeOutput(projectsCommand());
          break;
        case 'gs':
          writeOutput(gsCommand());
          break;
        case 'gl':
          writeOutput(glCommand());
          break;
        case 'neofetch':
          writeOutput(neofetchCommand());
          break;
        case 'cowsay':
          writeOutput(cowsayCommand(args));
          break;
        case 'sudo':
          writeOutput(sudoCommand(args));
          break;
        case 'vim':
        case 'vi':
        case 'nano':
          if (xtermRef.current) {
            startVim(getTerminalContext());
            return;
          }
          break;
        case 'exit':
        case 'quit':
        case 'logout':
          writeOutput(exitCommand());
          break;
        case 'ping':
          writeOutput(pingCommand(args));
          break;
        case 'tree':
          writeOutput(treeCommand(args));
          break;
        case 'grep':
          writeOutput(grepCommand(args));
          break;
        case 'history':
          writeOutput(historyCommand(commandHistoryRef.current));
          break;
        case 'open': {
          const result = openCommand(args);
          writeOutput(result.output);
          if (result.url) {
            window.open(result.url, '_blank');
          }
          break;
        }
        case 'theme': {
          const themeName = args[0];
          if (!themeName) {
            const current = currentThemeRef.current;
            let list = `${ANSI.bold}Available themes:${ANSI.reset}\n\n`;
            for (const name of themeNames) {
              const marker = name === current ? ` ${ANSI.green}(active)${ANSI.reset}` : '';
              list += `  ${ANSI.cyan}${name}${ANSI.reset}${marker}\n`;
            }
            list += `\n${ANSI.dim}Usage: theme <name>${ANSI.reset}`;
            writeOutput(list);
          } else if (themes[themeName]) {
            const t = themes[themeName];
            if (xtermRef.current) {
              xtermRef.current.options.theme = t.xterm;
            }
            document.documentElement.style.setProperty('--bg-primary', t.css.bgPrimary);
            document.documentElement.style.setProperty('--bg-secondary', t.css.bgSecondary);
            document.documentElement.style.setProperty('--bg-tertiary', t.css.bgTertiary);
            currentThemeRef.current = themeName;
            writeOutput(`${ANSI.green}Switched to ${t.name}${ANSI.reset}`);
          } else {
            setExitCode(1);
            writeOutput(`${ANSI.red}theme: unknown theme '${themeName}'. Try 'theme' to list.${ANSI.reset}`);
          }
          break;
        }
        case 'rm': {
          const fullArgs = args.join(' ');
          if (fullArgs.includes('-rf') && (fullArgs.includes('/') || fullArgs.includes('~'))) {
            if (xtermRef.current) {
              startRmRf(getTerminalContext());
              return;
            }
          } else {
            writeOutput(`${ANSI.red}rm: permission denied${ANSI.reset}`);
          }
          break;
        }
        case 'sl':
          if (xtermRef.current) {
            startSl(getTerminalContext());
            return;
          }
          break;
        default:
          setExitCode(1);
          writeOutput(`${ANSI.red}zsh: command not found: ${cmd}${ANSI.reset}`);
      }
    }

    inputBufferRef.current = '';
    cursorPositionRef.current = 0;
    tabPressCountRef.current = 0;
    writePrompt();
  }, [onCommand, writePrompt, writeOutput, getTerminalContext]);

  useLayoutEffect(() => {
    if (!terminalRef.current || xtermRef.current) return;

    const wrapper = terminalRef.current;

    const term = new XTerm({
      theme: xtermTheme,
      fontFamily: '"SF Mono", "Fira Code", "JetBrains Mono", "Consolas", "Monaco", "Courier New", monospace',
      fontSize: 14,
      cursorBlink: true,
      cursorStyle: 'block',
      scrollback: 10000,
    });

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

      term.writeln('');
      writeShortPrompt();
    };

    // Fit terminal using FitAddon (which properly measures char dimensions)
    const fitTerminal = () => {
      if (fitAddonRef.current && xtermRef.current) {
        fitAddonRef.current.fit();
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

    // Window resize handler
    const handleWindowResize = () => {
      fitTerminal();
    };

    window.addEventListener('resize', handleWindowResize);

    term.onData((data) => {
      // Interactive mode intercept (e.g., vim command buffer)
      if (interactiveModeRef.current) {
        interactiveModeRef.current(data);
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
          inputBufferRef.current = inputBufferRef.current.slice(0, cursorPositionRef.current - 1) +
                                   inputBufferRef.current.slice(cursorPositionRef.current);
          cursorPositionRef.current--;
          term.write('\b \b');
        }
      } else if (code === 27 && data.length === 3) {
        if (data === '\x1b[A') {
          if (historyIndexRef.current > 0) {
            historyIndexRef.current--;
            const prevCommand = commandHistoryRef.current[historyIndexRef.current];
            inputBufferRef.current = prevCommand;
            cursorPositionRef.current = prevCommand.length;
            term.write('\r\x1b[K');
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
        writePrompt();
      } else if (code === 4) {
        inputBufferRef.current = '';
        cursorPositionRef.current = 0;
        writePrompt();
      } else if (code >= 32 && code < 127) {
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
      window.removeEventListener('resize', handleWindowResize);
      term.dispose();
      xtermRef.current = null;
    };
  }, [handleCommand, handleTabCompletion, computeGhostText, onData, writePrompt, writeShortPrompt]);

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
