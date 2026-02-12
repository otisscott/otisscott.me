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

// Generate Pure-style prompt
export function generatePrompt(): string {
  const currentPath = fileSystem.getCurrentPath();
  const gitBranch = 'main'; // Simulated git branch
  const errorIndicator = lastExitCode !== 0 ? `${PromptColors.error}✘ ${PromptColors.reset}` : '';

  return `${errorIndicator}${PromptColors.directory}${currentPath}${PromptColors.reset} ${PromptColors.gitBranch}on ${gitBranch}${PromptColors.reset} ${PromptColors.nodeVersion}via ⬢ ${NODE_VERSION}${PromptColors.reset} \r\n${PromptColors.promptSymbol}❯${PromptColors.reset} `;
}

// Generate short prompt (for initial display)
export function generateShortPrompt(): string {
  const currentPath = fileSystem.getCurrentPath();
  const gitBranch = 'main';
  return `${PromptColors.directory}${currentPath}${PromptColors.reset} ${PromptColors.gitBranch}on ${gitBranch}${PromptColors.reset} ${PromptColors.nodeVersion}via ⬢ ${NODE_VERSION}${PromptColors.reset} ${PromptColors.promptSymbol}❯${PromptColors.reset} `;
}

// Help command
export function helpCommand(): string {
  return `${ANSI.bold}Available commands:${ANSI.reset}

  ${ANSI.cyan}Navigation${ANSI.reset}
  ${ANSI.green}ls${ANSI.reset}          - List directory contents
  ${ANSI.green}cd${ANSI.reset}          - Change directory
  ${ANSI.green}pwd${ANSI.reset}         - Print working directory
  ${ANSI.green}cat${ANSI.reset}         - Display file contents
  ${ANSI.green}tree${ANSI.reset}        - Show directory tree
  ${ANSI.green}grep${ANSI.reset}        - Search file contents
  ${ANSI.green}open${ANSI.reset}        - Open URL from file

  ${ANSI.cyan}Portfolio${ANSI.reset}
  ${ANSI.green}whoami${ANSI.reset}      - Display user information
  ${ANSI.green}skills${ANSI.reset}      - Display technical skills
  ${ANSI.green}experience${ANSI.reset}  - List work history
  ${ANSI.green}contact${ANSI.reset}     - Display contact information
  ${ANSI.green}projects${ANSI.reset}    - List all projects

  ${ANSI.cyan}Tools${ANSI.reset}
  ${ANSI.green}help${ANSI.reset}        - Show this help message
  ${ANSI.green}clear${ANSI.reset}       - Clear the terminal
  ${ANSI.green}echo${ANSI.reset}        - Print text to the terminal
  ${ANSI.green}date${ANSI.reset}        - Show current date and time
  ${ANSI.green}history${ANSI.reset}     - Show command history
  ${ANSI.green}ping${ANSI.reset}        - Ping a host
  ${ANSI.green}theme${ANSI.reset}       - Change color theme
  ${ANSI.green}gs${ANSI.reset}          - Show git status
  ${ANSI.green}gl${ANSI.reset}          - Show git log
  ${ANSI.green}neofetch${ANSI.reset}    - Display system info
  ${ANSI.green}cowsay${ANSI.reset}      - ASCII cow says a message

${ANSI.dim}Tip: Use Tab for autocomplete, try ${ANSI.reset}${ANSI.green}sl${ANSI.reset}${ANSI.dim} for a surprise${ANSI.reset}`;
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

// Neofetch command
export function neofetchCommand(): string {
  const loadTime = new Date();
  const now = new Date();
  const uptimeMs = now.getTime() - loadTime.getTime();
  const uptimeSec = Math.floor(uptimeMs / 1000);
  const uptimeMin = Math.floor(uptimeSec / 60);
  const uptimeHours = Math.floor(uptimeMin / 60);
  const uptimeStr = uptimeHours > 0
    ? `${uptimeHours}h ${uptimeMin % 60}m`
    : uptimeMin > 0
    ? `${uptimeMin}m ${uptimeSec % 60}s`
    : `${uptimeSec}s`;

  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown';
  const os = userAgent.includes('Mac') ? 'macOS' :
             userAgent.includes('Win') ? 'Windows' :
             userAgent.includes('Linux') ? 'Linux' : 'Unknown OS';

  const W = 49; // inner width between │ borders
  const row = (content: string) =>
    `${ANSI.cyan}│${ANSI.reset}${padEndVisible(content, W)}${ANSI.cyan}│${ANSI.reset}`;

  return [
    `${ANSI.cyan}╭────────────── ${ANSI.white}otismscott@gmail.com${ANSI.cyan} ──────────────╮${ANSI.reset}`,
    row(''),
    row(`   ${ANSI.blue}╭─────╮${ANSI.reset}  ${ANSI.bold}OS:${ANSI.reset} ${os} / Web Browser`),
    row(`   ${ANSI.blue}│${ANSI.reset}     ${ANSI.blue}│${ANSI.reset}  ${ANSI.bold}Shell:${ANSI.reset} xterm.js`),
    row(`   ${ANSI.blue}│${ANSI.reset}  ${ANSI.white}O${ANSI.reset}  ${ANSI.blue}│${ANSI.reset}  ${ANSI.bold}Terminal:${ANSI.reset} otisscott.me`),
    row(`   ${ANSI.blue}│${ANSI.reset}     ${ANSI.blue}│${ANSI.reset}  ${ANSI.bold}Theme:${ANSI.reset} Tokyo Night`),
    row(`   ${ANSI.blue}╰─────╯${ANSI.reset}  ${ANSI.bold}Uptime:${ANSI.reset} ${uptimeStr}`),
    row(''),
    `${ANSI.cyan}╰${'─'.repeat(W)}╯${ANSI.reset}`,
  ].join('\n');
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

  const urlMatch = content.match(/https?:\/\/[^\s)]+/);
  if (urlMatch) {
    return { output: `${ANSI.green}Opening ${urlMatch[0]}...${ANSI.reset}`, url: urlMatch[0] };
  }

  // Look for partial URLs like github.com/...
  const partialMatch = content.match(/(?:github\.com|linkedin\.com|dataearn\.com)[^\s)]+/);
  if (partialMatch) {
    const url = `https://${partialMatch[0]}`;
    return { output: `${ANSI.green}Opening ${url}...${ANSI.reset}`, url };
  }

  return { output: `${ANSI.dim}No URL found in ${target}${ANSI.reset}` };
}

// Tab completion
export function getCompletions(input: string): { completions: string[]; prefix: string } {
  const trimmed = input.trim();
  const parts = trimmed.split(' ');

  // If we're completing a command
  if (parts.length === 1 && !trimmed.includes(' ')) {
    const commands = [
      'help', 'clear', 'date', 'echo', 'ls', 'cd', 'pwd', 'cat',
      'tree', 'grep', 'open', 'whoami', 'skills', 'experience',
      'contact', 'projects', 'history', 'ping', 'theme',
      'gs', 'gl', 'neofetch', 'cowsay', 'sudo', 'vim', 'exit', 'sl', 'rm',
    ];
    const matches = commands.filter(cmd => cmd.startsWith(trimmed));
    return { completions: matches, prefix: '' };
  }

  // If we're completing a path
  if (parts.length >= 1) {
    const cmd = parts[0];
    const pathArg = parts.slice(1).join(' ') || '';
    const completions = fileSystem.getCompletions(pathArg);
    return { completions, prefix: pathArg };
  }

  return { completions: [], prefix: '' };
}
