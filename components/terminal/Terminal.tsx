'use client';

import { useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { WebglAddon } from '@xterm/addon-webgl';
import { xtermTheme } from '@/lib/theme/tokyo-night';
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
  getCompletions,
  setExitCode,
} from '@/components/commands/handlers';
import { ANSI } from '@/lib/filesystem/types';

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
          xtermRef.current?.writeln('');
          xtermRef.current?.writeln(helpCommand());
          break;
        case 'clear':
          xtermRef.current?.clear();
          break;
        case 'date':
          xtermRef.current?.writeln('');
          xtermRef.current?.writeln(dateCommand());
          break;
        case 'pwd':
          xtermRef.current?.writeln('');
          xtermRef.current?.writeln(pwdCommand());
          break;
        case 'whoami':
          xtermRef.current?.writeln('');
          xtermRef.current?.writeln(whoamiCommand());
          break;
        case 'ls':
          xtermRef.current?.writeln('');
          xtermRef.current?.writeln(lsCommand(args));
          break;
        case 'cd':
          const cdResult = cdCommand(args);
          if (cdResult) {
            xtermRef.current?.writeln('');
            xtermRef.current?.writeln(cdResult);
          }
          break;
        case 'cat':
          xtermRef.current?.writeln('');
          xtermRef.current?.writeln(catCommand(args));
          break;
        case 'echo':
          xtermRef.current?.writeln('');
          xtermRef.current?.writeln(echoCommand(args));
          break;
        case 'skills':
          xtermRef.current?.writeln('');
          xtermRef.current?.writeln(skillsCommand());
          break;
        case 'experience':
          xtermRef.current?.writeln('');
          xtermRef.current?.writeln(experienceCommand());
          break;
        case 'contact':
          xtermRef.current?.writeln('');
          xtermRef.current?.writeln(contactCommand());
          break;
        case 'projects':
          xtermRef.current?.writeln('');
          xtermRef.current?.writeln(projectsCommand());
          break;
        case 'gs':
          xtermRef.current?.writeln('');
          xtermRef.current?.writeln(gsCommand());
          break;
        case 'gl':
          xtermRef.current?.writeln('');
          xtermRef.current?.writeln(glCommand());
          break;
        case 'neofetch':
          xtermRef.current?.writeln('');
          xtermRef.current?.writeln(neofetchCommand());
          break;
        case 'cowsay':
          xtermRef.current?.writeln('');
          xtermRef.current?.writeln(cowsayCommand(args));
          break;
        default:
          setExitCode(1);
          xtermRef.current?.writeln('');
          xtermRef.current?.writeln(`${ANSI.red}zsh: command not found: ${cmd}${ANSI.reset}`);
      }
    }

    inputBufferRef.current = '';
    cursorPositionRef.current = 0;
    tabPressCountRef.current = 0;
    writePrompt();
  }, [onCommand, writePrompt]);

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

    // Write welcome message
    const writeWelcome = () => {
      term.writeln('');
      term.writeln(`${ANSI.cyan}  +--------------------------------------------------------+${ANSI.reset}`);
      term.writeln(`${ANSI.cyan}  |                                                        |${ANSI.reset}`);
      term.writeln(`${ANSI.cyan}  |${ANSI.reset}   Welcome to ${ANSI.magenta}otisscott.me${ANSI.reset} - Terminal Portfolio      ${ANSI.cyan}|${ANSI.reset}`);
      term.writeln(`${ANSI.cyan}  |                                                        |${ANSI.reset}`);
      term.writeln(`${ANSI.cyan}  |${ANSI.reset}   Type ${ANSI.green}help${ANSI.reset} to see available commands                ${ANSI.cyan}|${ANSI.reset}`);
      term.writeln(`${ANSI.cyan}  |${ANSI.reset}   Try ${ANSI.green}neofetch${ANSI.reset} or ${ANSI.green}cowsay${ANSI.reset} for some fun!               ${ANSI.cyan}|${ANSI.reset}`);
      term.writeln(`${ANSI.cyan}  |                                                        |${ANSI.reset}`);
      term.writeln(`${ANSI.cyan}  +--------------------------------------------------------+${ANSI.reset}`);
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
      // First write welcome (this creates the content)
      writeWelcome();
      // Then fit to container
      fitTerminal();
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
      const code = data.charCodeAt(0);

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
          if (cursorPositionRef.current < inputBufferRef.current.length) {
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
        handleTabCompletion();
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
  }, [handleCommand, handleTabCompletion, onData, writePrompt, writeShortPrompt]);

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
