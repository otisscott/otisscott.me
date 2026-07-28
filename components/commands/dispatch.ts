/**
 * Command Dispatch
 *
 * The single source of truth for commands. One entry wires up help text,
 * tab completion, alias shadowing, and execution — there is no second list
 * to keep in sync.
 *
 * Hidden commands (aliases like gs/gl, easter eggs like sl) omit a
 * description so they stay out of `help` while remaining completable.
 */

import { Terminal as XTerm } from '@xterm/xterm';
import { ANSI } from '@/lib/filesystem/types';
import { fileSystem } from '@/lib/filesystem';
import { themes, themeNames, ColorMode } from '@/lib/theme/themes';
import type { TerminalContext } from '@/components/commands/interactive';
import {
  startVim, startSl, startRmRf, startClaude, startCodex, startOpencode,
  startTraceroute, startSsh, startHtop, startMake, startScp, startMatrix,
  startSnake, startWeather, startYes, startScreensaver, startAquarium,
} from '@/components/commands/interactive';
import {
  wrapWords, lsCommand, cdCommand, pwdCommand, catCommand, whoamiCommand,
  skillsCommand, experienceCommand, contactCommand, projectsCommand,
  gsCommand, glCommand, gitCommand, neofetchCommand, cowsayCommand,
  echoCommand, dateCommand, sudoCommand, exitCommand, pingCommand,
  treeCommand, grepCommand, historyCommand, openCommand,
  packageManagerCommand, uptimeCommand, dockerCommand, manCommand,
  calCommand, todoCommand, aliasCommand, unaliasCommand, jobsCommand,
  fgCommand, bgCommand, fortuneCommand, figletCommand, wineCommand,
  momoCommand, lolcat, setExitCode,
} from '@/components/commands/handlers';
import type { Job } from '@/components/commands/handlers';

/** Returned by commands that take over the terminal and drive their own prompt. */
export const TAKEOVER = 'takeover' as const;
export type CommandResult = void | typeof TAKEOVER;

export interface CommandContext {
  args: string[];
  term: XTerm;
  cols: number;
  loadTime: number;
  history: string[];
  jobs: Job[];
  /** Write command output, then the shell writes a fresh prompt. */
  out: (output: string) => void;
  /** Handed to full-screen and animated commands. */
  interactive: TerminalContext;
  theme: {
    current: string;
    mode: ColorMode;
    set: (name: string) => void;
  };
  reloadAliases: () => void;
}

interface CommandEntry {
  category: 'Navigation' | 'Portfolio' | 'Tools' | 'hidden';
  description?: string;  // omit to hide from help
  run: (ctx: CommandContext) => CommandResult;
}

export const COMMANDS: Record<string, CommandEntry> = {
  // ── Navigation ──────────────────────────────────────────────────────
  ls: {
    category: 'Navigation', description: 'List directory contents',
    run: c => c.out(lsCommand(c.args)),
  },
  cd: {
    category: 'Navigation', description: 'Change directory',
    run: c => {
      const result = cdCommand(c.args);
      if (result) c.out(result);
    },
  },
  pwd: {
    category: 'Navigation', description: 'Print working directory',
    run: c => c.out(pwdCommand()),
  },
  cat: {
    category: 'Navigation', description: 'Display file contents',
    run: c => c.out(catCommand(c.args)),
  },
  tree: {
    category: 'Navigation', description: 'Show directory tree',
    run: c => c.out(treeCommand(c.args)),
  },
  grep: {
    category: 'Navigation', description: 'Search file contents',
    run: c => c.out(grepCommand(c.args)),
  },
  open: {
    category: 'Navigation', description: 'Open URL from file',
    run: c => {
      const result = openCommand(c.args);
      c.out(result.output);
      if (result.url) window.open(result.url, '_blank');
    },
  },

  // ── Portfolio ───────────────────────────────────────────────────────
  whoami: {
    category: 'Portfolio', description: 'Display user information',
    run: c => c.out(whoamiCommand()),
  },
  skills: {
    category: 'Portfolio', description: 'Display technical skills',
    run: c => c.out(skillsCommand()),
  },
  experience: {
    category: 'Portfolio', description: 'List work history',
    run: c => c.out(experienceCommand()),
  },
  contact: {
    category: 'Portfolio', description: 'Display contact information',
    run: c => c.out(contactCommand()),
  },
  projects: {
    category: 'Portfolio', description: 'List all projects',
    run: c => c.out(projectsCommand()),
  },

  // ── Tools ───────────────────────────────────────────────────────────
  help: {
    category: 'Tools', description: 'Show this help message',
    run: c => c.out(helpCommand(c.cols)),
  },
  clear: {
    category: 'Tools', description: 'Clear the terminal',
    run: c => { c.term.clear(); },
  },
  echo: {
    category: 'Tools', description: 'Print text to the terminal',
    run: c => c.out(echoCommand(c.args)),
  },
  date: {
    category: 'Tools', description: 'Show current date and time',
    run: c => c.out(dateCommand()),
  },
  history: {
    category: 'Tools', description: 'Show command history',
    run: c => {
      // Support `history grep <pattern>` as a shortcut for the piped form
      if (c.args[0] === 'grep' && c.args.length > 1) {
        const pattern = c.args.slice(1).join(' ');
        const filtered = historyCommand(c.history)
          .split('\n')
          .filter(line => line.toLowerCase().includes(pattern.toLowerCase()));
        c.out(filtered.length > 0
          ? filtered.join('\n')
          : `${ANSI.dim}No matches for "${pattern}"${ANSI.reset}`);
      } else {
        c.out(historyCommand(c.history));
      }
    },
  },
  ping: {
    category: 'Tools', description: 'Ping a host',
    run: c => c.out(pingCommand(c.args)),
  },
  theme: {
    category: 'Tools', description: 'Change color theme',
    run: c => {
      const name = c.args[0];
      if (!name) {
        let list = `${ANSI.bold}Available themes:${ANSI.reset} ${ANSI.dim}(${c.theme.mode} mode)${ANSI.reset}\n\n`;
        for (const t of themeNames) {
          const marker = t === c.theme.current ? ` ${ANSI.green}(active)${ANSI.reset}` : '';
          list += `  ${ANSI.cyan}${t}${ANSI.reset}${marker}\n`;
        }
        list += `\n${ANSI.dim}Usage: theme <name>${ANSI.reset}`;
        c.out(list);
      } else if (themes[name]) {
        c.theme.set(name);
        c.out(`${ANSI.green}Switched to ${themes[name].name} (${c.theme.mode})${ANSI.reset}`);
      } else {
        setExitCode(1);
        c.out(`${ANSI.red}theme: unknown theme '${name}'. Try 'theme' to list.${ANSI.reset}`);
      }
    },
  },
  git: {
    category: 'Tools', description: 'Git commands (log, blame, status...)',
    run: c => c.out(gitCommand(c.args)),
  },
  traceroute: {
    category: 'Tools', description: 'Trace the route to otisscott.me',
    run: c => { startTraceroute(c.interactive); return TAKEOVER; },
  },
  neofetch: {
    category: 'Tools', description: 'Display system info',
    run: c => c.out(neofetchCommand(c.loadTime, c.cols)),
  },
  cowsay: {
    category: 'Tools', description: 'ASCII cow says a message',
    run: c => c.out(cowsayCommand(c.args, c.cols)),
  },
  man: {
    category: 'Tools', description: 'Display manual pages',
    run: c => c.out(manCommand(c.args)),
  },
  cal: {
    category: 'Tools', description: 'Show calendar',
    run: c => c.out(calCommand()),
  },
  scp: {
    category: 'Tools', description: 'Secure file copy',
    run: c => {
      if (c.args.length === 0) {
        c.out(`${ANSI.red}usage: scp [user@]host:file dest${ANSI.reset}`);
        return;
      }
      startScp(c.interactive);
      return TAKEOVER;
    },
  },
  todo: {
    category: 'Tools', description: 'Personal todo list',
    run: c => c.out(todoCommand(c.args)),
  },
  alias: {
    category: 'Tools', description: 'Define command aliases',
    run: c => { c.out(aliasCommand(c.args)); c.reloadAliases(); },
  },
  jobs: {
    category: 'Tools', description: 'List background jobs',
    run: c => c.out(jobsCommand(c.jobs)),
  },
  fortune: {
    category: 'Tools', description: 'Print a random fortune',
    run: c => c.out(fortuneCommand(c.cols)),
  },
  figlet: {
    category: 'Tools', description: 'ASCII art banner text',
    run: c => c.out(figletCommand(c.args, c.cols)),
  },
  weather: {
    category: 'Tools', description: 'Live weather report',
    run: c => { startWeather(c.interactive, c.args); return TAKEOVER; },
  },
  snake: {
    category: 'Tools', description: 'Play snake',
    run: c => { startSnake(c.interactive); return TAKEOVER; },
  },

  // ── Hidden — completable but not in help ────────────────────────────
  gs: { category: 'hidden', run: c => c.out(gsCommand()) },
  gl: { category: 'hidden', run: c => c.out(glCommand()) },
  vim: { category: 'hidden', run: c => { startVim(c.interactive, c.args[0]); return TAKEOVER; } },
  vi: { category: 'hidden', run: c => { startVim(c.interactive, c.args[0]); return TAKEOVER; } },
  nano: { category: 'hidden', run: c => { startVim(c.interactive, c.args[0]); return TAKEOVER; } },
  sudo: { category: 'hidden', run: c => c.out(sudoCommand(c.args)) },
  exit: { category: 'hidden', run: c => c.out(exitCommand()) },
  quit: { category: 'hidden', run: c => c.out(exitCommand()) },
  logout: { category: 'hidden', run: c => c.out(exitCommand()) },
  sl: { category: 'hidden', run: c => { startSl(c.interactive); return TAKEOVER; } },
  rm: {
    category: 'hidden',
    run: c => {
      const full = c.args.join(' ');
      if (full.includes('-rf') && (full.includes('/') || full.includes('~'))) {
        startRmRf(c.interactive);
        return TAKEOVER;
      }
      c.out(`${ANSI.red}rm: permission denied${ANSI.reset}`);
    },
  },
  docker: { category: 'hidden', run: c => c.out(dockerCommand(c.args, c.loadTime)) },
  ssh: { category: 'hidden', run: c => { startSsh(c.interactive); return TAKEOVER; } },
  htop: { category: 'hidden', run: c => { startHtop(c.interactive, c.loadTime); return TAKEOVER; } },
  top: { category: 'hidden', run: c => { startHtop(c.interactive, c.loadTime); return TAKEOVER; } },
  uptime: { category: 'hidden', run: c => c.out(uptimeCommand(c.loadTime)) },
  make: { category: 'hidden', run: c => { startMake(c.interactive); return TAKEOVER; } },
  npm: { category: 'hidden', run: c => c.out(packageManagerCommand('npm')) },
  npx: { category: 'hidden', run: c => c.out(packageManagerCommand('npx')) },
  bun: { category: 'hidden', run: c => c.out(packageManagerCommand('bun')) },
  bunx: { category: 'hidden', run: c => c.out(packageManagerCommand('bunx')) },
  uv: { category: 'hidden', run: c => c.out(packageManagerCommand('uv')) },
  claude: { category: 'hidden', run: c => { startClaude(c.interactive); return TAKEOVER; } },
  'claude-code': { category: 'hidden', run: c => { startClaude(c.interactive); return TAKEOVER; } },
  codex: { category: 'hidden', run: c => { startCodex(c.interactive); return TAKEOVER; } },
  opencode: { category: 'hidden', run: c => { startOpencode(c.interactive); return TAKEOVER; } },
  ncal: { category: 'hidden', run: c => c.out(calCommand()) },
  unalias: { category: 'hidden', run: c => { c.out(unaliasCommand(c.args)); c.reloadAliases(); } },
  fg: { category: 'hidden', run: c => c.out(fgCommand(c.args, c.jobs)) },
  bg: { category: 'hidden', run: c => c.out(bgCommand()) },
  matrix: { category: 'hidden', run: c => { startMatrix(c.interactive); return TAKEOVER; } },
  cmatrix: { category: 'hidden', run: c => { startMatrix(c.interactive); return TAKEOVER; } },
  wine: { category: 'hidden', run: c => c.out(wineCommand(c.args, c.cols)) },
  momo: { category: 'hidden', run: c => c.out(momoCommand(c.args)) },
  lolcat: {
    category: 'hidden',
    run: c => c.out(`${ANSI.dim}usage: <command> | lolcat${ANSI.reset}\n${lolcat('Try: figlet otis | lolcat')}`),
  },
  yes: { category: 'hidden', run: c => { startYes(c.interactive, c.args); return TAKEOVER; } },
  asciiquarium: { category: 'hidden', run: c => { startAquarium(c.interactive); return TAKEOVER; } },
  aquarium: { category: 'hidden', run: c => { startAquarium(c.interactive); return TAKEOVER; } },
  konami: {
    category: 'hidden',
    run: c => c.out(`${ANSI.dim}That's not how cheat codes work. Use the actual buttons:${ANSI.reset}\n${ANSI.bold}↑ ↑ ↓ ↓ ← → ← → B A${ANSI.reset}`),
  },
  screensaver: { category: 'hidden', run: c => { startScreensaver(c.interactive); return TAKEOVER; } },
};

// Derived from the table — nothing separate to maintain
const COMMAND_NAMES = Object.keys(COMMANDS);

/**
 * Run a command. Returns TAKEOVER when the command has seized the terminal
 * and the shell should not write a prompt.
 */
export function runCommand(cmd: string, ctx: CommandContext): CommandResult {
  const entry = COMMANDS[cmd];
  if (!entry) {
    setExitCode(1);
    ctx.out(`${ANSI.red}zsh: command not found: ${cmd}${ANSI.reset}`);
    return;
  }
  return entry.run(ctx);
}

/** Help text, generated from the table. */
export function helpCommand(cols = 80): string {
  const categories = ['Navigation', 'Portfolio', 'Tools'] as const;
  const sections = categories.map(cat => {
    const descriptionWidth = Math.max(18, cols - 17);
    const cmds = Object.entries(COMMANDS)
      .filter(([, e]) => e.category === cat && e.description)
      .map(([name, e]) => {
        const [first, ...rest] = wrapWords(e.description ?? '', descriptionWidth);
        const wrapped = rest.map(line => `  ${' '.repeat(13)}  ${line}`).join('\n');
        return `  ${ANSI.green}${name.padEnd(12)}${ANSI.reset}- ${first}${wrapped ? `\n${wrapped}` : ''}`;
      })
      .join('\n');
    return `  ${ANSI.cyan}${cat}${ANSI.reset}\n${cmds}`;
  });

  const tip = wrapWords('Tip: Use Tab for autocomplete, try sl or fortune | cowsay', Math.max(24, cols - 2)).join('\n');
  return `${ANSI.bold}Available commands:${ANSI.reset}\n\n${sections.join('\n\n')}\n\n${ANSI.dim}${tip.replace('sl', `${ANSI.reset}${ANSI.green}sl${ANSI.reset}${ANSI.dim}`)}${ANSI.reset}`;
}

/** Tab completion — driven by the table plus the virtual filesystem. */
export function getCompletions(input: string): { completions: string[]; prefix: string } {
  const trimmed = input.trim();
  const parts = trimmed.split(' ');

  // Completing a command name
  if (parts.length === 1 && !trimmed.includes(' ')) {
    return { completions: COMMAND_NAMES.filter(cmd => cmd.startsWith(trimmed)), prefix: '' };
  }

  // Completing a path argument
  if (parts.length >= 1) {
    const pathArg = parts.slice(1).join(' ') || '';
    return { completions: fileSystem.getCompletions(pathArg), prefix: pathArg };
  }

  return { completions: [], prefix: '' };
}

/** Expand a user alias, unless it would shadow a builtin. */
export function resolveAlias(command: string, aliases: Record<string, string>): string {
  const parts = command.split(' ');
  const cmd = parts[0];
  if (cmd in COMMANDS) return command;
  if (cmd in aliases) {
    return aliases[cmd] + (parts.length > 1 ? ' ' + parts.slice(1).join(' ') : '');
  }
  return command;
}
