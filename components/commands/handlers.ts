/**
 * Command Handlers
 * All terminal command implementations
 */

import { fileSystem } from '@/lib/filesystem';
import { ANSI, PromptColors, padEndVisible } from '@/lib/filesystem/types';
import { rootDirectory, fakeCommits, NODE_VERSION } from '@/lib/filesystem/data';
import { DirectoryNode, FileNode } from '@/lib/filesystem/types';

// Track last command exit status
let lastExitCode = 0;

export function setExitCode(code: number) {
  lastExitCode = code;
}

export function getExitCode(): number {
  return lastExitCode;
}

// Prompt info line (path, branch, node version)
export function generatePromptInfo(): string {
  const currentPath = fileSystem.getCurrentPath();
  const gitBranch = 'main';
  const errorIndicator = lastExitCode !== 0 ? `${PromptColors.error}✘ ${PromptColors.reset}` : '';
  return `${errorIndicator}${PromptColors.directory}${currentPath}${PromptColors.reset} ${PromptColors.gitBranch}on ${gitBranch}${PromptColors.reset} ${PromptColors.nodeVersion}via ⬢ ${NODE_VERSION}${PromptColors.reset}`;
}

// Prompt input line (❯ cursor)
export function generatePromptSymbol(): string {
  return `${PromptColors.promptSymbol}❯${PromptColors.reset} `;
}

// ── Command Registry ─────────────────────────────────────────────────
// Single source of truth. Adding a command here wires up help, tab
// completion, and alias resolution automatically.  Hidden commands
// (aliases like gs/gl, easter eggs like sl) omit description so they
// don't clutter help but still complete and resolve.

interface CommandEntry {
  category: 'Navigation' | 'Portfolio' | 'Tools' | 'hidden';
  description?: string;  // omit to hide from help
}

const COMMAND_REGISTRY: Record<string, CommandEntry> = {
  // Navigation
  ls:          { category: 'Navigation', description: 'List directory contents' },
  cd:          { category: 'Navigation', description: 'Change directory' },
  pwd:         { category: 'Navigation', description: 'Print working directory' },
  cat:         { category: 'Navigation', description: 'Display file contents' },
  tree:        { category: 'Navigation', description: 'Show directory tree' },
  grep:        { category: 'Navigation', description: 'Search file contents' },
  open:        { category: 'Navigation', description: 'Open URL from file' },

  // Portfolio
  whoami:      { category: 'Portfolio', description: 'Display user information' },
  skills:      { category: 'Portfolio', description: 'Display technical skills' },
  experience:  { category: 'Portfolio', description: 'List work history' },
  contact:     { category: 'Portfolio', description: 'Display contact information' },
  projects:    { category: 'Portfolio', description: 'List all projects' },

  // Tools
  help:        { category: 'Tools', description: 'Show this help message' },
  clear:       { category: 'Tools', description: 'Clear the terminal' },
  echo:        { category: 'Tools', description: 'Print text to the terminal' },
  date:        { category: 'Tools', description: 'Show current date and time' },
  history:     { category: 'Tools', description: 'Show command history' },
  ping:        { category: 'Tools', description: 'Ping a host' },
  theme:       { category: 'Tools', description: 'Change color theme' },
  git:         { category: 'Tools', description: 'Git commands (log, blame, status...)' },
  traceroute:  { category: 'Tools', description: 'Trace the route to otisscott.me' },
  neofetch:    { category: 'Tools', description: 'Display system info' },
  cowsay:      { category: 'Tools', description: 'ASCII cow says a message' },
  man:         { category: 'Tools', description: 'Display manual pages' },
  cal:         { category: 'Tools', description: 'Show calendar' },
  scp:         { category: 'Tools', description: 'Secure file copy' },
  todo:        { category: 'Tools', description: 'Personal todo list' },
  alias:       { category: 'Tools', description: 'Define command aliases' },
  jobs:        { category: 'Tools', description: 'List background jobs' },

  // Hidden — completable but not in help
  gs:          { category: 'hidden' },
  gl:          { category: 'hidden' },
  vim:         { category: 'hidden' },
  vi:          { category: 'hidden' },
  nano:        { category: 'hidden' },
  sudo:        { category: 'hidden' },
  exit:        { category: 'hidden' },
  quit:        { category: 'hidden' },
  logout:      { category: 'hidden' },
  sl:          { category: 'hidden' },
  rm:          { category: 'hidden' },
  docker:      { category: 'hidden' },
  ssh:         { category: 'hidden' },
  htop:        { category: 'hidden' },
  top:         { category: 'hidden' },
  uptime:      { category: 'hidden' },
  make:        { category: 'hidden' },
  npm:         { category: 'hidden' },
  npx:         { category: 'hidden' },
  bun:         { category: 'hidden' },
  bunx:        { category: 'hidden' },
  uv:          { category: 'hidden' },
  claude:      { category: 'hidden' },
  'claude-code': { category: 'hidden' },
  codex:       { category: 'hidden' },
  opencode:    { category: 'hidden' },
  ncal:        { category: 'hidden' },
  unalias:     { category: 'hidden' },
  fg:          { category: 'hidden' },
  bg:          { category: 'hidden' },
};

// Derived sets — no separate lists to maintain
const BUILTIN_COMMANDS = new Set(Object.keys(COMMAND_REGISTRY));
const COMPLETABLE_COMMANDS = Object.keys(COMMAND_REGISTRY);

// Help command — generated from the registry
export function helpCommand(): string {
  const categories = ['Navigation', 'Portfolio', 'Tools'] as const;
  const sections = categories.map(cat => {
    const cmds = Object.entries(COMMAND_REGISTRY)
      .filter(([, e]) => e.category === cat && e.description)
      .map(([name, e]) => `  ${ANSI.green}${name.padEnd(12)}${ANSI.reset}- ${e.description}`)
      .join('\n');
    return `  ${ANSI.cyan}${cat}${ANSI.reset}\n${cmds}`;
  });

  return `${ANSI.bold}Available commands:${ANSI.reset}\n\n${sections.join('\n\n')}\n\n${ANSI.dim}Tip: Use Tab for autocomplete, try ${ANSI.reset}${ANSI.green}sl${ANSI.reset}${ANSI.dim} for a surprise${ANSI.reset}`;
}

// LS command with flags
export function lsCommand(args: string[]): string {
  const options = {
    all: args.includes('-a') || args.includes('-la') || args.includes('-al'),
    long: args.includes('-l') || args.includes('-la') || args.includes('-al'),
    tree: args.includes('--tree'),
  };

  const pathArg = args.find(arg => !arg.startsWith('-'));
  return fileSystem.listDirectory(pathArg, options);
}

// CD command
export function cdCommand(args: string[]): string {
  const path = args[0] || '~';
  const success = fileSystem.changeDirectory(path);
  if (!success) {
    setExitCode(1);
    return `${ANSI.red}cd: no such file or directory: ${path}${ANSI.reset}`;
  }
  setExitCode(0);
  return '';
}

// PWD command
export function pwdCommand(): string {
  return fileSystem.getCurrentPath().replace('~', '/home/otis');
}

// Cat command with markdown/JSON support
export function catCommand(args: string[]): string {
  if (args.length === 0) {
    setExitCode(1);
    return `${ANSI.red}cat: missing file operand${ANSI.reset}`;
  }

  const path = args[0];
  const content = fileSystem.readFile(path);

  if (content === null) {
    setExitCode(1);
    return `${ANSI.red}cat: ${path}: No such file or directory${ANSI.reset}`;
  }

  setExitCode(0);

  // Check if it's JSON
  if (path.endsWith('.json')) {
    try {
      const parsed = JSON.parse(content);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return content;
    }
  }

  // Check if it's markdown
  if (path.endsWith('.md')) {
    return renderMarkdown(content);
  }

  return content;
}

// Simple markdown renderer
function renderMarkdown(content: string): string {
  return content
    .split('\n')
    .map(line => {
      // Headers
      if (line.startsWith('# ')) {
        return `${ANSI.bold}${ANSI.brightCyan}${line.slice(2)}${ANSI.reset}`;
      }
      if (line.startsWith('## ')) {
        return `${ANSI.bold}${ANSI.cyan}${line.slice(3)}${ANSI.reset}`;
      }
      if (line.startsWith('### ')) {
        return `${ANSI.bold}${line.slice(4)}${ANSI.reset}`;
      }
      // Bold
      line = line.replace(/\*\*(.+?)\*\*/g, `${ANSI.bold}$1${ANSI.reset}${ANSI.white}`);
      // Italic
      line = line.replace(/\*(.+?)\*/g, `${ANSI.italic}$1${ANSI.reset}${ANSI.white}`);
      // Code
      line = line.replace(/`(.+?)`/g, `${ANSI.brightBlack}$1${ANSI.reset}${ANSI.white}`);
      // Markdown links [text](url) → OSC 8 clickable
      line = line.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
        (_, text, url) => `\x1b]8;;${url}\x07${ANSI.cyan}${ANSI.underline}${text}${ANSI.reset}\x1b]8;;\x07`);
      // Bare URLs → OSC 8 clickable (only if not already inside an OSC 8 sequence)
      line = line.replace(/(^|[\s🔗])((https?:\/\/)[^\s"',)]+)/g,
        (_, prefix, url) => `${prefix}\x1b]8;;${url}\x07${ANSI.cyan}${ANSI.underline}${url}${ANSI.reset}\x1b]8;;\x07`);
      return line;
    })
    .join('\n');
}

// Whoami command
export function whoamiCommand(): string {
  return `${ANSI.bold}${ANSI.brightCyan}Otis Scott${ANSI.reset}
${ANSI.dim}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${ANSI.reset}
${ANSI.white}Director of Technology @ Manhattan Wine Company${ANSI.reset}`;
}

// Skills command
export function skillsCommand(): string {
  const skillsContent = fileSystem.readFile('work/skills.json');
  if (!skillsContent) {
    return `${ANSI.red}Error: Could not load skills data${ANSI.reset}`;
  }

  try {
    const skills = JSON.parse(skillsContent);
    let output = `${ANSI.bold}Technical Skills${ANSI.reset}\n${ANSI.dim}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${ANSI.reset}\n\n`;

    for (const [category, data] of Object.entries(skills)) {
      const { icon, items } = data as { icon: string; items: Array<{ name: string; level: string; years: number }> };
      const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
      output += `${icon} ${ANSI.bold}${ANSI.cyan}${categoryName}${ANSI.reset}\n`;

      for (const item of items) {
        const levelColor = item.level === 'expert' ? ANSI.green :
                          item.level === 'proficient' ? ANSI.yellow :
                          item.level === 'learning' ? ANSI.magenta : ANSI.white;
        output += `  ${ANSI.brightBlack}•${ANSI.reset} ${item.name} ${levelColor}(${item.level})${ANSI.reset} ${ANSI.dim}- ${item.years}y${ANSI.reset}\n`;
      }
      output += '\n';
    }

    return output;
  } catch {
    return `${ANSI.red}Error: Could not parse skills data${ANSI.reset}`;
  }
}

// Experience command
export function experienceCommand(): string {
  const expDir = fileSystem.getNodeAtPath('work/experience');
  if (!expDir || expDir.type !== 'directory') {
    return `${ANSI.red}Error: Could not load experience data${ANSI.reset}`;
  }

  let output = `${ANSI.bold}Work Experience${ANSI.reset}\n${ANSI.dim}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${ANSI.reset}\n\n`;

  const files = Array.from((expDir as DirectoryNode).children.values())
    .filter((node): node is FileNode => node.type === 'file')
    .reverse();

  for (const file of files) {
    const content = file.content;
    const lines = content.split('\n');
    const title = lines[0].replace('# ', '');
    const company = lines[1].replace('## ', '');
    const period = lines[3];

    output += `${ANSI.bold}${ANSI.cyan}${title}${ANSI.reset}\n`;
    output += `${ANSI.yellow}${company}${ANSI.reset} ${ANSI.dim}${period}${ANSI.reset}\n\n`;
  }

  output += `${ANSI.dim}Use 'cat work/experience/<file>' to see full details${ANSI.reset}`;
  return output;
}

// Contact command
export function contactCommand(): string {
  let output = `${ANSI.bold}Get In Touch${ANSI.reset}\n${ANSI.dim}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${ANSI.reset}\n\n`;

  output += `${ANSI.cyan}📧 Email${ANSI.reset}\n`;
  output += `   ${ANSI.white}otismscott@gmail.com${ANSI.reset}\n\n`;

  const socialContent = fileSystem.readFile('contact/social.json');
  if (socialContent) {
    try {
      const social = JSON.parse(socialContent);
      output += `${ANSI.cyan}🌐 Social${ANSI.reset}\n`;

      const icons: Record<string, string> = {
        github: '🐙',
        twitter: '🐦',
        linkedin: '💼',
        bluesky: '🦋',
        mastodon: '🐘',
      };

      for (const [platform, data] of Object.entries(social)) {
        const { url, handle, description } = data as { url: string; handle: string; description: string };
        const icon = icons[platform] || '🔗';
        output += `   ${icon} ${ANSI.green}${platform}${ANSI.reset}: ${ANSI.white}${handle}${ANSI.reset}\n`;
        output += `      ${ANSI.dim}${description}${ANSI.reset}\n`;
        output += `      ${ANSI.blue}https://${url}${ANSI.reset}\n\n`;
      }
    } catch {
      // Ignore parse errors
    }
  }

  return output;
}

// Projects command
export function projectsCommand(): string {
  const projectsDir = fileSystem.getNodeAtPath('projects');
  if (!projectsDir || projectsDir.type !== 'directory') {
    return `${ANSI.red}Error: Could not load projects${ANSI.reset}`;
  }

  let output = `${ANSI.bold}Projects${ANSI.reset}\n${ANSI.dim}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${ANSI.reset}\n\n`;

  const files = Array.from((projectsDir as DirectoryNode).children.values())
    .filter((node): node is FileNode => node.type === 'file');

  for (const file of files) {
    const lines = file.content.split('\n');
    const title = lines[0].replace('# ', '');
    const description = lines[2] || '';

    output += `${ANSI.bold}${ANSI.cyan}${title}${ANSI.reset}\n`;
    output += `   ${ANSI.white}${description}${ANSI.reset}\n\n`;
  }

  output += `${ANSI.dim}Use 'cat projects/<file>' to see full details${ANSI.reset}`;
  return output;
}

// Git status command
export function gsCommand(): string {
  return `${ANSI.green}On branch main${ANSI.reset}
Your branch is up to date with 'origin/main'.

${ANSI.green}nothing to commit, working tree clean${ANSI.reset}`;
}

// Git log command
export function glCommand(): string {
  const output: string[] = [];

  for (const commit of fakeCommits.slice(0, 5)) {
    const hash = `${ANSI.yellow}${commit.hash}${ANSI.reset}`;
    const message = `${ANSI.white}${commit.message}${ANSI.reset}`;
    const meta = `${ANSI.dim}${commit.date} - ${commit.author}${ANSI.reset}`;
    output.push(`${hash} ${message}\n    ${meta}`);
  }

  return output.join('\n\n');
}

// Git blame — annotate virtual files with fake commit metadata
function gitBlameCommand(args: string[]): string {
  const filepath = args[0];
  if (!filepath) {
    return `${ANSI.red}usage: git blame <file>${ANSI.reset}`;
  }

  const content = fileSystem.readFile(filepath);
  if (content === null) {
    return `${ANSI.red}fatal: no such path '${filepath}' in HEAD${ANSI.reset}`;
  }

  const lines = content.split('\n');

  // Deterministic hash from string
  const hash = (s: string, seed: number): string => {
    let h = seed;
    for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
    return Math.abs(h).toString(16).padStart(8, '0').slice(0, 8);
  };

  // Authors with commit date ranges — tells a story
  const authors: { name: string; dateBase: number; weight: number }[] = [
    { name: 'Otis Scott', dateBase: Date.parse('2025-11-15'), weight: 60 },
    { name: 'Otis Scott', dateBase: Date.parse('2026-01-20'), weight: 25 },
    { name: 'Claude',     dateBase: Date.parse('2026-02-10'), weight: 15 },
  ];

  const lineNumWidth = String(lines.length).length;

  return lines.map((line, i) => {
    const h = hash(line + filepath, i * 7919);
    // Pick author deterministically from line index
    const pick = (i * 31 + line.length) % 100;
    const author = pick < authors[0].weight ? authors[0]
      : pick < authors[0].weight + authors[1].weight ? authors[1]
      : authors[2];
    // Jitter the date by line index
    const dateMs = author.dateBase + (i * 86400000 * 0.3);
    const date = new Date(dateMs).toISOString().slice(0, 10);
    const lineNum = String(i + 1).padStart(lineNumWidth);
    const authorStr = author.name.padEnd(12);
    return `${ANSI.yellow}${h}${ANSI.reset} ${ANSI.dim}(${authorStr} ${date} ${lineNum})${ANSI.reset} ${line}`;
  }).join('\n');
}

// Git command with subcommands
export function gitCommand(args: string[]): string {
  const sub = args[0];
  if (!sub) {
    return `usage: git <command>

${ANSI.bold}available commands:${ANSI.reset}
  status    Show the working tree status
  log       Show commit logs
  blame     Show what revision and author last modified each line
  branch    List branches
  remote    Show remotes

${ANSI.dim}hint: try 'git log' or 'git blame about/bio.md'${ANSI.reset}`;
  }
  switch (sub) {
    case 'status':
      return gsCommand();
    case 'log':
      return glCommand();
    case 'branch':
      return `* ${ANSI.green}main${ANSI.reset}`;
    case 'remote':
      if (args[1] === '-v') {
        return `origin  https://github.com/otisscott/otisscott.me.git (fetch)\norigin  https://github.com/otisscott/otisscott.me.git (push)`;
      }
      return 'origin';
    case 'blame':
      return gitBlameCommand(args.slice(1));
    case 'push':
      return `${ANSI.red}error: permission denied${ANSI.reset}\n${ANSI.dim}hint: nice try ;)${ANSI.reset}`;
    case 'commit':
      return `${ANSI.red}error: permission denied${ANSI.reset}`;
    default:
      return `git: '${sub}' is not a git command. See 'git' for usage.`;
  }
}

// Neofetch command — OS-specific ASCII art from neofetch source
export function neofetchCommand(loadTime: number, cols: number): string {
  const now = Date.now();
  const uptimeMs = now - loadTime;
  const uptimeSec = Math.floor(uptimeMs / 1000);
  const uptimeMin = Math.floor(uptimeSec / 60);
  const uptimeHours = Math.floor(uptimeMin / 60);
  const uptimeStr = uptimeHours > 0
    ? `${uptimeHours}h ${uptimeMin % 60}m`
    : uptimeMin > 0
    ? `${uptimeMin}m ${uptimeSec % 60}s`
    : `${uptimeSec}s`;

  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown';
  // Android UA contains "Linux", so check it first
  const os = userAgent.includes('Android') ? 'Android' :
             userAgent.includes('Mac') ? 'macOS' :
             userAgent.includes('Win') ? 'Windows' :
             userAgent.includes('Linux') ? 'Linux' : 'Unknown OS';

  const g = ANSI.green;
  const c = ANSI.cyan;
  const y = ANSI.yellow;
  const r = ANSI.red;
  const b = ANSI.blue;
  const m = ANSI.magenta;
  const w = ANSI.white;
  const R = ANSI.reset;

  const compact = cols < 60;

  // Full-size logos for wide terminals (adapted from neofetch)
  const fullLogos: Record<string, string[]> = {
    macOS: [
      `${g}                 c.'`,
      `${g}              ,xNMM.`,
      `${g}            .OMMMMO`,
      `${g}            lMM"`,
      `${g}  .;loddo:.  .olloddol;.`,
      `${g}cKMMMMMMMMMMNWMMMMMMMMM0:`,
      `${y}.KMMMMMMMMMMMMMMMMMMMMMMW.`,
      `${y}XMMMMMMMMMMMMMMMMMMMMMMMX.`,
      `${r};MMMMMMMMMMMMMMMMMMMMMMMM:`,
      `${r}:MMMMMMMMMMMMMMMMMMMMMMMM:`,
      `${m}.MMMMMMMMMMMMMMMMMMMMMMMMX.`,
      `${m} kMMMMMMMMMMMMMMMMMMMMMMMMW`,
      `${b} 'XMMMMMMMMMMMMMMMMMMMMMMM`,
      `${b}   kMMMMMMMMMMMMMMMMMMMMd`,
      `${c}    ;KMMMMMMMWXXWMMMMMk.`,
      `${c}      "cooc*"    "*coo"`,
    ],
    Windows: [
      `${c}                         ..,`,
      `${c}             ....,,:;+ccllll`,
      `${c}  ...,,+:;  cllllllllllllll`,
      `${c},ccllllllll  llllllllllllll`,
      `${c}llllllllllll  lllllllllllll`,
      `${c}llllllllllll  lllllllllllll`,
      `${c}llllllllllll  lllllllllllll`,
      `${c}llllllllllll  lllllllllllll`,
      `${c}`,
      `${c}llllllllllll  lllllllllllll`,
      `${c}llllllllllll  lllllllllllll`,
      `${c}llllllllllll  lllllllllllll`,
      `${c}llllllllllll  lllllllllllll`,
      `${c}\`'ccllllllll  lllllllllllll`,
      `${c}      \`'*::  :ccllllllllll`,
      `${c}                   \`\`'*::c`,
    ],
    Linux: [
      `${w}        #####`,
      `${w}       #######`,
      `${w}       ##${R}O${w}#${R}O${w}##`,
      `${w}       #${y}#####${w}#`,
      `${w}     ##${R}##${y}###${R}##${w}##`,
      `${w}    #${R}##########${w}##`,
      `${w}   #${R}############${w}##`,
      `${w}   #${R}############${w}###`,
      `${y}  ##${w}#${R}###########${w}##${y}#`,
      `${y}######${w}#${R}#######${w}#${y}######`,
      `${y}#######${w}#${R}#####${w}#${y}#######`,
      `${y}  #####${w}#######${y}#####`,
    ],
    Android: [
      `${g}         -o          o-`,
      `${g}          +hydNNNNdyh+`,
      `${g}        +mMMMMMMMMMMMMm+`,
      `${g}      \`dMM.----------.MMb\``,
      `${g}      hMMMMMMMMMMMMMMMMMMh`,
      `${g}      .MMMMMMMMMMMMMMMMMM.`,
      `${g}      :MMMMMMMMMMMMMMMMMM:`,
      `${g}      .MMMMMMMMMMMMMMMMMM.`,
      `${g}      hMMMMMMMMMMMMMMMNsh+`,
      `${g}      \`dMMMMMMMd/--------\``,
      `${g}        +mMMMMMMy--------h`,
      `${g}            +hddMMMMN+----+`,
    ],
  };

  // Compact logos for narrow terminals (~12-16 chars visible)
  const smallLogos: Record<string, string[]> = {
    macOS: [
      `${g}       .:'`,
      `${g}     .:' ':.`,
      `${y}    /:.'  '.:\\`,
      `${r}   |:.'    ':.| `,
      `${m}    \\':....:'/ `,
      `${b}     ':..:' `,
      `${c}       ':'`,
    ],
    Windows: [
      `${c} ####  ####`,
      `${c} ####  ####`,
      `${c}`,
      `${c} ####  ####`,
      `${c} ####  ####`,
    ],
    Linux: [
      `${w}    .--. `,
      `${w}   |${R}o  o${w}|`,
      `${w}   |${y}.__.${w}|`,
      `${w}  / ${R}''''${w} \\`,
      `${y} |  |  |  |`,
      `${y}  \\|__|/`,
    ],
    Android: [
      `${g}  \\  / `,
      `${g} .-''-. `,
      `${g}/ ${w}o  o${g} \\`,
      `${g}|------|`,
      `${g}|      |`,
      `${g} \\____/ `,
    ],
  };

  const logo = compact
    ? (smallLogos[os] || smallLogos['Linux'])
    : (fullLogos[os] || fullLogos['Linux']);

  const info = [
    `${w}${ANSI.bold}otis${R}${w}@${ANSI.bold}otisscott.me${R}`,
    `${ANSI.dim}${'─'.repeat(22)}${R}`,
    `${w}${ANSI.bold}OS${R}: ${os} / Web Browser`,
    `${w}${ANSI.bold}Shell${R}: xterm.js`,
    `${w}${ANSI.bold}Terminal${R}: otisscott.me`,
    `${w}${ANSI.bold}Theme${R}: Tokyo Night`,
    `${w}${ANSI.bold}Uptime${R}: ${uptimeStr}`,
    `${w}${ANSI.bold}Editor${R}: Neovim`,
    '',
    `${r}███${R}${g}███${R}${y}███${R}${b}███${R}${m}███${R}${c}███${R}${w}███${R}`,
  ];

  if (compact) {
    // Stacked layout: logo centered above info
    return [...logo, '', ...info].join('\n');
  }

  // Side-by-side for wide terminals
  const logoWidth = 30;
  const maxLines = Math.max(logo.length, info.length);
  const lines: string[] = [];
  for (let i = 0; i < maxLines; i++) {
    const artLine = i < logo.length ? logo[i] : '';
    const infoLine = i < info.length ? info[i] : '';
    lines.push(`${padEndVisible(artLine, logoWidth)}${R}  ${infoLine}`);
  }

  return lines.join('\n');
}

// Cowsay command
export function cowsayCommand(args: string[]): string {
  const message = args.join(' ') || 'Moo!';
  const lines = message.split('\n');
  const maxLen = Math.max(...lines.map(l => l.length));
  const border = '─'.repeat(maxLen + 2);

  let output = ` ${border}\n`;
  for (const line of lines) {
    output += `| ${line.padEnd(maxLen)} |\n`;
  }
  output += ` ${border}\n`;
  output += `        \\   ^__^\n`;
  output += `         \\  (oo)\\_______\n`;
  output += `            (__)\\       )\\/\\\n`;
  output += `                ||----w |\n`;
  output += `                ||     ||\n`;

  return output;
}

// Echo command
export function echoCommand(args: string[]): string {
  return args.join(' ');
}

// Date command
export function dateCommand(): string {
  return new Date().toString();
}

// Sudo command
export function sudoCommand(args: string[]): string {
  if (args.length === 0) {
    return `${ANSI.red}usage: sudo <command>${ANSI.reset}`;
  }
  return `${ANSI.yellow}[sudo] password for otis: ************
${ANSI.red}otis is not in the sudoers file. This incident will be reported.${ANSI.reset}`;
}

// Vim command
export function vimCommand(): string {
  return `
${ANSI.bold}${ANSI.white}~                                                   ${ANSI.reset}
${ANSI.bold}${ANSI.white}~                                                   ${ANSI.reset}
${ANSI.bold}${ANSI.white}~                 VIM - Vi IMproved                  ${ANSI.reset}
${ANSI.bold}${ANSI.white}~                                                   ${ANSI.reset}
${ANSI.bold}${ANSI.white}~             type :q! to exit${ANSI.reset}${ANSI.dim} (just kidding)${ANSI.reset}
${ANSI.bold}${ANSI.white}~                                                   ${ANSI.reset}
${ANSI.bold}${ANSI.white}~         ${ANSI.reset}${ANSI.green}You've been trapped. There is no escape.${ANSI.reset}
${ANSI.bold}${ANSI.white}~         ${ANSI.reset}${ANSI.dim}Press any key to continue...${ANSI.reset}
${ANSI.bold}${ANSI.white}~                                                   ${ANSI.reset}`;
}

// Exit command
export function exitCommand(): string {
  return `${ANSI.magenta}There is no escape. You live here now.${ANSI.reset}
${ANSI.dim}(This is a website, not a real terminal)${ANSI.reset}`;
}

// Ping command
export function pingCommand(args: string[]): string {
  const host = args[0] || 'otisscott.me';
  const lines: string[] = [];
  lines.push(`PING ${host} (127.0.0.1): 56 data bytes`);
  for (let i = 0; i < 4; i++) {
    const ms = (Math.random() * 15 + 3).toFixed(1);
    lines.push(`64 bytes from 127.0.0.1: icmp_seq=${i} ttl=64 time=${ms} ms`);
  }
  lines.push('');
  lines.push(`--- ${host} ping statistics ---`);
  lines.push(`4 packets transmitted, 4 packets received, 0.0% packet loss`);
  return lines.join('\n');
}

// Tree command
export function treeCommand(args: string[]): string {
  const pathArg = args.find(arg => !arg.startsWith('-'));
  const result = lsCommand(['--tree', ...(pathArg ? [pathArg] : [])]);
  const dirName = pathArg || '.';
  return `${ANSI.cyan}${dirName}${ANSI.reset}\n${result}`;
}

// Grep command
export function grepCommand(args: string[]): string {
  if (args.length < 1) {
    return `${ANSI.red}usage: grep <pattern> [path]${ANSI.reset}`;
  }

  const pattern = args[0];
  const searchPath = args[1];
  const results: string[] = [];

  function searchNode(node: FileNode | DirectoryNode, path: string) {
    if (node.type === 'file') {
      const lines = node.content.split('\n');
      lines.forEach((line, i) => {
        if (line.toLowerCase().includes(pattern.toLowerCase())) {
          const highlighted = line.replace(
            new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'),
            match => `${ANSI.red}${ANSI.bold}${match}${ANSI.reset}`
          );
          results.push(`${ANSI.magenta}${path}${ANSI.reset}:${ANSI.green}${i + 1}${ANSI.reset}: ${highlighted}`);
        }
      });
    } else {
      for (const [name, child] of node.children) {
        if (!name.startsWith('.')) {
          const childPath = path ? `${path}/${name}` : name;
          searchNode(child as FileNode | DirectoryNode, childPath);
        }
      }
    }
  }

  const startNode = searchPath ? fileSystem.getNodeAtPath(searchPath) : fileSystem.getNodeAtPath('.');
  if (!startNode) {
    setExitCode(1);
    return `${ANSI.red}grep: ${searchPath}: No such file or directory${ANSI.reset}`;
  }

  searchNode(startNode as FileNode | DirectoryNode, searchPath === '.' || !searchPath ? '' : searchPath);

  if (results.length === 0) {
    return `${ANSI.dim}No matches found for "${pattern}"${ANSI.reset}`;
  }

  return results.join('\n');
}

// History command
export function historyCommand(history: string[]): string {
  if (history.length === 0) {
    return `${ANSI.dim}No commands in history${ANSI.reset}`;
  }
  return history
    .map((cmd, i) => `  ${ANSI.dim}${String(i + 1).padStart(4)}${ANSI.reset}  ${cmd}`)
    .join('\n');
}

// Open command - returns URL to open or error message
export function openCommand(args: string[]): { output: string; url?: string } {
  if (args.length === 0) {
    return { output: `${ANSI.red}usage: open <file|url>${ANSI.reset}` };
  }

  const target = args[0];

  // Direct URL
  if (target.startsWith('http://') || target.startsWith('https://')) {
    return { output: `${ANSI.green}Opening ${target}...${ANSI.reset}`, url: target };
  }

  // Read file and look for URLs
  const content = fileSystem.readFile(target);
  if (!content) {
    setExitCode(1);
    return { output: `${ANSI.red}open: ${target}: No such file${ANSI.reset}` };
  }

  const urlMatch = content.match(/https?:\/\/[^\s"',)]+/);
  if (urlMatch) {
    return { output: `${ANSI.green}Opening ${urlMatch[0]}...${ANSI.reset}`, url: urlMatch[0] };
  }

  // Look for partial URLs like github.com/...
  const partialMatch = content.match(/(?:github\.com|linkedin\.com|dataearn\.com|theamericanstoragecompany\.com)[^\s"',)]+/);
  if (partialMatch) {
    const url = `https://${partialMatch[0]}`;
    return { output: `${ANSI.green}Opening ${url}...${ANSI.reset}`, url };
  }

  return { output: `${ANSI.dim}No URL found in ${target}${ANSI.reset}` };
}

// AI coding tool easter eggs
const ORANGE = '\x1b[38;5;208m';

export function claudeCommand(cols: number): string {
  const W = Math.max(60, cols - 2); // full width minus outer padding
  const LW = Math.min(34, Math.floor(W * 0.4));
  const RW = W - LW - 1; // -1 for middle divider
  const o = ORANGE;
  const r = ANSI.reset;
  const row = (left: string, right: string) =>
    `${o}│${r}${padEndVisible(left, LW)}${o}│${r}${padEndVisible(right, RW)}${o}│${r}`;

  const titleText = '─── Claude Code v2.1.39 ';
  const topFill = Math.max(0, W - titleText.length - 1);

  return [
    '',
    `${o}╭${titleText}${'─'.repeat(topFill)}╮${r}`,
    row('', ` ${ANSI.bold}Tips for getting started${r}`),
    row(`      ${ANSI.bold}Welcome back, Otis!${r}`, ` Run ${ANSI.cyan}/init${r} to create a CLAUDE.md file`),
    row('', ` with instructions for Claude`),
    row('', ` ${ANSI.dim}${'─'.repeat(RW - 2)}${r}`),
    row(`${' '.repeat(Math.max(0, Math.floor((LW - 7) / 2)))}${ANSI.magenta}▐▛███▜▌${r}`, ` ${ANSI.dim}Recent activity${r}`),
    row(`${' '.repeat(Math.max(0, Math.floor((LW - 9) / 2)))}${ANSI.magenta}▝▜█████▛▘${r}`, ` ${ANSI.dim}No recent activity${r}`),
    row(`${' '.repeat(Math.max(0, Math.floor((LW - 6) / 2)))}${ANSI.magenta}▘▘ ▝▝${r}`, ''),
    row(`${' '.repeat(Math.max(0, Math.floor((LW - 21) / 2)))}${ANSI.dim}Opus 4.6 · Claude Max${r}`, ''),
    row(`${' '.repeat(Math.max(0, Math.floor((LW - 23) / 2)))}${ANSI.dim}~/Projects/otisscott.me${r}`, ''),
    `${o}╰${'─'.repeat(W)}╯${r}`,
  ].join('\n');
}

export function codexCommand(cols: number): string {
  const d = ANSI.dim;
  const r = ANSI.reset;
  const W = Math.max(40, Math.min(58, cols - 4));

  const row = (content: string) =>
    `${d}│${r} ${padEndVisible(content, W)}${d} │${r}`;

  const titleText = '── ';
  const topFill = Math.max(0, W + 2 - titleText.length);

  return [
    '',
    `${d}╭${titleText}${'─'.repeat(topFill)}╮${r}`,
    row(`${d}>_${r} ${ANSI.bold}OpenAI Codex${r} ${d}(v0.1.2503262313)${r}`),
    row(''),
    row(`${d}model:     ${r}gpt-5.3-codex-high   ${d}/model${ANSI.cyan} to change${r}`),
    row(`${d}directory: ${r}~/Projects/otisscott.me`),
    `${d}╰${'─'.repeat(W + 2)}╯${r}`,
  ].join('\n');
}

export function opencodeCommand(cols: number): string {
  const d = ANSI.dim;
  const r = ANSI.reset;
  const gray = '\x1b[90m';
  const shadow1 = '\x1b[38;5;235m';
  const bg1 = '\x1b[48;5;235m';
  const shadow2 = '\x1b[38;5;238m';
  const bg2 = '\x1b[48;5;238m';

  // Render the "open code" logo with shadow effects
  // _ = shadow bg space, ^ = fg char + shadow bg ▀, ~ = shadow fg ▀
  const logoLeft = [
    '                   ',
    '█▀▀█ █▀▀█ █▀▀█ █▀▀▄',
    '█__█ █__█ █^^^ █__█',
    '▀▀▀▀ █▀▀▀ ▀▀▀▀ ▀~~▀',
  ];
  const logoRight = [
    '             ▄     ',
    '█▀▀▀ █▀▀█ █▀▀█ █▀▀█',
    '█___ █__█ █__█ █^^^',
    '▀▀▀▀ ▀▀▀▀ ▀▀▀▀ ▀▀▀▀',
  ];

  const drawLine = (line: string, fg: string, shadow: string, bg: string) => {
    let out = '';
    for (const ch of line) {
      if (ch === '_') { out += `${bg} ${r}`; continue; }
      if (ch === '^') { out += `${fg}${bg}▀${r}`; continue; }
      if (ch === '~') { out += `${shadow}▀${r}`; continue; }
      if (ch === ' ') { out += ' '; continue; }
      out += `${fg}${ch}${r}`;
    }
    return out;
  };

  const logoLines: string[] = [];
  for (let i = 0; i < logoLeft.length; i++) {
    const left = drawLine(logoLeft[i], gray, shadow1, bg1);
    const right = drawLine(logoRight[i], r, shadow2, bg2);
    logoLines.push(left + ' ' + right);
  }

  // Center the logo
  const logoVisibleWidth = 41; // "open" (20) + gap (1) + "code" (20)
  const pad = Math.max(0, Math.floor((cols - logoVisibleWidth) / 2));
  const padStr = ' '.repeat(pad);

  // Status bar
  const dir = '~/Projects/otisscott.me';
  const ver = 'v0.2.22';
  const statusGap = Math.max(1, cols - dir.length - ver.length - 4);

  return [
    '',
    ...logoLines.map(l => padStr + l),
    '',
    `${d}  ${dir}${' '.repeat(statusGap)}${ver}${r}`,
  ].join('\n');
}

// Uptime command
export function uptimeCommand(loadTime: number): string {
  const now = Date.now();
  const diffMs = now - loadTime;
  const totalSec = Math.floor(diffMs / 1000);
  const min = Math.floor(totalSec / 60);
  const hours = Math.floor(min / 60);

  const upStr = hours > 0
    ? `${hours} hour${hours !== 1 ? 's' : ''}, ${min % 60} min`
    : min > 0
    ? `${min} min`
    : `${totalSec} sec`;

  const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return ` ${timeStr} up ${upStr},  1 user,  load average: 0.42, 0.15, 0.08`;
}

// Docker command with subcommands
export function dockerCommand(args: string[], loadTime: number): string {
  const diffMs = Date.now() - loadTime;
  const totalMin = Math.floor(diffMs / 60000);
  const upStr = totalMin > 0 ? `Up ${totalMin} minute${totalMin !== 1 ? 's' : ''}` : 'Up Less than a minute';

  const sub = args[0];
  if (!sub) {
    return `Usage: docker [command]

${ANSI.bold}Commands:${ANSI.reset}
  ps          List containers
  images      List images
  run         Run a container
  compose     Docker Compose

${ANSI.dim}hint: try 'docker ps' or 'docker images'${ANSI.reset}`;
  }

  switch (sub) {
    case 'ps':
      return `${ANSI.bold}CONTAINER ID   IMAGE                  STATUS                  NAMES${ANSI.reset}
${ANSI.green}a1b2c3d4e5f6${ANSI.reset}   otisscott-me:latest    ${upStr.padEnd(22)}  ${ANSI.cyan}portfolio${ANSI.reset}
${ANSI.green}f6e5d4c3b2a1${ANSI.reset}   theme-engine:1.0       ${upStr.padEnd(22)}  ${ANSI.cyan}theme-engine${ANSI.reset}
${ANSI.green}1a2b3c4d5e6f${ANSI.reset}   xterm-renderer:3.2     ${upStr.padEnd(22)}  ${ANSI.cyan}xterm-renderer${ANSI.reset}`;
    case 'images':
      return `${ANSI.bold}REPOSITORY          TAG       SIZE${ANSI.reset}
otisscott-me        latest    42MB
theme-engine        1.0       8MB
xterm-renderer      3.2       15MB
${ANSI.dim}cowsay              moo       1MB${ANSI.reset}`;
    case 'run':
      return `${ANSI.red}Error: permission denied${ANSI.reset}\n${ANSI.dim}hint: you can look, but you can't touch${ANSI.reset}`;
    case 'compose':
      if (args[1] === 'up') {
        return `${ANSI.green}[+] Running 3/3${ANSI.reset}
 ${ANSI.green}✔${ANSI.reset} Container portfolio       ${ANSI.green}Started${ANSI.reset}
 ${ANSI.green}✔${ANSI.reset} Container theme-engine    ${ANSI.green}Started${ANSI.reset}
 ${ANSI.green}✔${ANSI.reset} Container xterm-renderer  ${ANSI.green}Started${ANSI.reset}
${ANSI.dim}Everything's already running. You're on the site.${ANSI.reset}`;
      }
      if (args[1] === 'down') {
        return `${ANSI.red}[+] Stopping 3/3${ANSI.reset}
 ${ANSI.red}✔${ANSI.reset} Container xterm-renderer  ${ANSI.red}Stopped${ANSI.reset}
 ${ANSI.red}✔${ANSI.reset} Container theme-engine    ${ANSI.red}Stopped${ANSI.reset}
 ${ANSI.red}✔${ANSI.reset} Container portfolio       ${ANSI.red}Stopped${ANSI.reset}
${ANSI.dim}Just kidding. You can't shut down the site from the site.${ANSI.reset}`;
      }
      if (args[1] === 'ps') {
        return `${ANSI.bold}NAME              IMAGE                  STATUS${ANSI.reset}
portfolio         otisscott-me:latest    ${ANSI.green}${upStr}${ANSI.reset}
theme-engine      theme-engine:1.0       ${ANSI.green}${upStr}${ANSI.reset}
xterm-renderer    xterm-renderer:3.2     ${ANSI.green}${upStr}${ANSI.reset}`;
      }
      return `Usage: docker compose [up|down|ps]`;
    default:
      return `docker: '${sub}' is not a docker command. See 'docker' for usage.`;
  }
}

// Package manager easter eggs
export function packageManagerCommand(cmd: string): string {
  const msgs: Record<string, string> = {
    npm: `${ANSI.red}npm${ANSI.reset} ${ANSI.dim}ERR!${ANSI.reset} This is a website, not a Node.js environment.
${ANSI.red}npm${ANSI.reset} ${ANSI.dim}ERR!${ANSI.reset} But if it were, we'd be using ${ANSI.bold}bun${ANSI.reset}.`,
    npx: `${ANSI.red}npm${ANSI.reset} ${ANSI.dim}ERR!${ANSI.reset} npx: command not available in browser.
${ANSI.red}npm${ANSI.reset} ${ANSI.dim}ERR!${ANSI.reset} Try ${ANSI.bold}bunx${ANSI.reset} instead. ${ANSI.dim}(Just kidding, this is a website.)${ANSI.reset}`,
    bun: `${ANSI.bold}bun${ANSI.reset} ${ANSI.dim}v1.2.x${ANSI.reset}
${ANSI.green}✓${ANSI.reset} Speed is everything. ${ANSI.dim}That's why this site uses it.${ANSI.reset}
${ANSI.dim}But you can't run it here — this is a terminal portfolio, not a runtime.${ANSI.reset}`,
    bunx: `${ANSI.bold}bun${ANSI.reset} ${ANSI.dim}v1.2.x${ANSI.reset}
${ANSI.green}✓${ANSI.reset} Speed is everything. ${ANSI.dim}That's why this site uses it.${ANSI.reset}
${ANSI.dim}But you can't run it here — this is a terminal portfolio, not a runtime.${ANSI.reset}`,
    uv: `${ANSI.bold}${ANSI.green}uv${ANSI.reset} ${ANSI.dim}An extremely fast Python package manager.${ANSI.reset}
${ANSI.green}✓${ANSI.reset} Preferred over pip in this household.
${ANSI.dim}No Python environment here though — just vibes.${ANSI.reset}`,
  };
  return msgs[cmd] || `${ANSI.red}${cmd}: command not found${ANSI.reset}`;
}

// Man command — looks up pages from man-pages.ts
import { manPages } from './man-pages';

export function manCommand(args: string[]): string {
  const page = args[0];
  if (!page) {
    return `What manual page do you want?`;
  }
  return manPages[page] || `No manual entry for ${page}`;
}

// Cal command — display current month calendar
export function calCommand(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const header = `${monthNames[month]} ${year}`;
  const dayHeader = 'Su Mo Tu We Th Fr Sa';

  // Center the month/year header over the day header (20 chars wide)
  const pad = Math.max(0, Math.floor((20 - header.length) / 2));
  let output = ' '.repeat(pad) + header + '\n' + dayHeader + '\n';

  // First day of month (0=Sun, 6=Sat)
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let line = '   '.repeat(firstDay);
  for (let d = 1; d <= daysInMonth; d++) {
    const dayStr = String(d).padStart(2);
    if (d === today) {
      line += `\x1b[7m${dayStr}\x1b[27m`;
    } else {
      line += dayStr;
    }

    if ((firstDay + d) % 7 === 0) {
      output += line + '\n';
      line = '';
    } else {
      line += ' ';
    }
  }
  if (line.trim()) {
    output += line;
  }

  return output;
}

// Todo command — localStorage-backed todo list
interface TodoItem { text: string; done: boolean }

function loadTodos(): TodoItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('otisscott-terminal-todos');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveTodos(todos: TodoItem[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('otisscott-terminal-todos', JSON.stringify(todos));
}

export function todoCommand(args: string[]): string {
  const sub = args[0];

  if (!sub || sub === 'list') {
    const todos = loadTodos();
    if (todos.length === 0) {
      return `${ANSI.dim}No todos yet. Add one with: todo add <text>${ANSI.reset}`;
    }
    return todos.map((t, i) => {
      if (t.done) {
        return `  ${ANSI.dim}${i + 1}. ${ANSI.green}☑${ANSI.reset} ${ANSI.dim}${ANSI.strikethrough}${t.text}${ANSI.reset}`;
      }
      return `  ${i + 1}. ☐ ${t.text}`;
    }).join('\n');
  }

  if (sub === 'add') {
    const text = args.slice(1).join(' ');
    if (!text) return `${ANSI.red}usage: todo add <text>${ANSI.reset}`;
    const todos = loadTodos();
    todos.push({ text, done: false });
    saveTodos(todos);
    return `${ANSI.green}Added:${ANSI.reset} ${text}`;
  }

  if (sub === 'done') {
    const idx = parseInt(args[1]) - 1;
    const todos = loadTodos();
    if (isNaN(idx) || idx < 0 || idx >= todos.length) {
      return `${ANSI.red}Invalid index. Use 'todo' to see the list.${ANSI.reset}`;
    }
    todos[idx].done = true;
    saveTodos(todos);
    return `${ANSI.green}☑${ANSI.reset} ${ANSI.dim}${ANSI.strikethrough}${todos[idx].text}${ANSI.reset}`;
  }

  if (sub === 'rm') {
    const idx = parseInt(args[1]) - 1;
    const todos = loadTodos();
    if (isNaN(idx) || idx < 0 || idx >= todos.length) {
      return `${ANSI.red}Invalid index. Use 'todo' to see the list.${ANSI.reset}`;
    }
    const removed = todos.splice(idx, 1)[0];
    saveTodos(todos);
    return `${ANSI.red}Removed:${ANSI.reset} ${removed.text}`;
  }

  if (sub === 'clear') {
    const todos = loadTodos().filter(t => !t.done);
    const cleared = loadTodos().length - todos.length;
    saveTodos(todos);
    return cleared > 0
      ? `${ANSI.green}Cleared ${cleared} completed item${cleared !== 1 ? 's' : ''}.${ANSI.reset}`
      : `${ANSI.dim}No completed items to clear.${ANSI.reset}`;
  }

  return `${ANSI.red}usage: todo [list|add|done|rm|clear]${ANSI.reset}`;
}

// Alias helpers — localStorage-backed aliases
export function loadAliases(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem('otisscott-terminal-aliases');
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveAliases(aliases: Record<string, string>): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('otisscott-terminal-aliases', JSON.stringify(aliases));
}

export function aliasCommand(args: string[]): string {
  if (args.length === 0) {
    const aliases = loadAliases();
    const keys = Object.keys(aliases);
    if (keys.length === 0) {
      return `${ANSI.dim}No aliases defined. Set one with: alias name='command'${ANSI.reset}`;
    }
    return keys.map(k => `alias ${k}='${aliases[k]}'`).join('\n');
  }

  // Parse alias name='expansion' or name="expansion"
  const input = args.join(' ');
  const match = input.match(/^(\w+)=(['"])(.*)\2$/);
  if (!match) {
    // Try without quotes: alias name=command
    const simpleMatch = input.match(/^(\w+)=(.+)$/);
    if (!simpleMatch) {
      return `${ANSI.red}usage: alias name='command'${ANSI.reset}`;
    }
    const aliases = loadAliases();
    aliases[simpleMatch[1]] = simpleMatch[2];
    saveAliases(aliases);
    return `${ANSI.green}alias ${simpleMatch[1]}='${simpleMatch[2]}'${ANSI.reset}`;
  }

  const aliases = loadAliases();
  aliases[match[1]] = match[3];
  saveAliases(aliases);
  return `${ANSI.green}alias ${match[1]}='${match[3]}'${ANSI.reset}`;
}

export function unaliasCommand(args: string[]): string {
  if (args.length === 0) {
    return `${ANSI.red}usage: unalias <name>${ANSI.reset}`;
  }
  const aliases = loadAliases();
  const name = args[0];
  if (!(name in aliases)) {
    return `${ANSI.red}unalias: ${name}: not found${ANSI.reset}`;
  }
  delete aliases[name];
  saveAliases(aliases);
  return `${ANSI.green}Removed alias '${name}'${ANSI.reset}`;
}

// Resolve aliases (single-pass, no recursion to avoid loops)
export function resolveAlias(command: string, aliases: Record<string, string>): string {
  const parts = command.split(' ');
  const cmd = parts[0];
  // Don't override builtins
  if (BUILTIN_COMMANDS.has(cmd)) return command;
  if (cmd in aliases) {
    return aliases[cmd] + (parts.length > 1 ? ' ' + parts.slice(1).join(' ') : '');
  }
  return command;
}

// Jobs command — display background job table
export interface Job {
  id: number;
  name: string;
  progress: number;
  done: boolean;
  intervalId: number;
}

export function jobsCommand(jobs: Job[]): string {
  if (jobs.length === 0) {
    return `${ANSI.dim}No background jobs.${ANSI.reset}`;
  }
  return jobs.map(j => {
    const status = j.done
      ? `${ANSI.green}Done${ANSI.reset}`
      : `${ANSI.yellow}Running${ANSI.reset}`;
    const pct = j.done ? '' : `  (${Math.round(j.progress)}%)`;
    const marker = j.id === jobs[jobs.length - 1].id ? '+' : ' ';
    return `[${j.id}]${marker} ${status.padEnd(20)} ${j.name} &${pct}`;
  }).join('\n');
}

export function fgCommand(args: string[], jobs: Job[]): string {
  if (jobs.length === 0) {
    return `fg: no current job`;
  }
  const targetId = args[0] ? parseInt(args[0]) : jobs[jobs.length - 1].id;
  const job = jobs.find(j => j.id === targetId);
  if (!job) {
    return `fg: %${targetId}: no such job`;
  }
  if (job.done) {
    return `[${job.id}]  Done                    ${job.name}`;
  }
  job.progress = 100;
  job.done = true;
  if (job.intervalId) clearInterval(job.intervalId);
  return `${job.name}: completed.`;
}

export function bgCommand(): string {
  return `bg: no stopped jobs`;
}

// Tab completion — driven by COMMAND_REGISTRY + filesystem
export function getCompletions(input: string): { completions: string[]; prefix: string } {
  const trimmed = input.trim();
  const parts = trimmed.split(' ');

  // Completing a command name
  if (parts.length === 1 && !trimmed.includes(' ')) {
    const matches = COMPLETABLE_COMMANDS.filter(cmd => cmd.startsWith(trimmed));
    return { completions: matches, prefix: '' };
  }

  // Completing a path argument
  if (parts.length >= 1) {
    const pathArg = parts.slice(1).join(' ') || '';
    const completions = fileSystem.getCompletions(pathArg);
    return { completions, prefix: pathArg };
  }

  return { completions: [], prefix: '' };
}
