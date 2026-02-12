/**
 * Interactive Commands
 * Commands that take over the terminal (animations, full-screen modes).
 * Each returns a handler function for interactiveModeRef, or void for
 * fire-and-forget animations that manage their own lifecycle.
 */

import { Terminal as XTerm } from '@xterm/xterm';
import { ANSI, padEndVisible } from '@/lib/filesystem/types';

interface TerminalContext {
  term: XTerm;
  setInteractiveMode: (handler: ((data: string) => void) | null) => void;
  resetInput: () => void;
  writePrompt: () => void;
}

/**
 * Vim easter egg — full-screen takeover, requires :q/:wq/ZZ to exit
 */
export function startVim(ctx: TerminalContext): void {
  const { term, setInteractiveMode, resetInput, writePrompt } = ctx;
  const cols = term.cols;
  const rows = term.rows;

  const drawScreen = (statusText: string) => {
    term.write('\x1b[2J\x1b[H');
    for (let r = 0; r < rows - 1; r++) {
      if (r === Math.floor(rows / 2) - 2) {
        const line = 'VIM - Vi IMproved';
        const pad = Math.max(0, Math.floor((cols - line.length) / 2));
        term.write(`${ANSI.bold}${ANSI.white}~${' '.repeat(pad - 1)}${line}${ANSI.reset}\r\n`);
      } else {
        term.write(`${ANSI.bold}${ANSI.white}~${ANSI.reset}\r\n`);
      }
    }
    const padded = statusText + ' '.repeat(Math.max(0, cols - statusText.length));
    term.write(`\x1b[7m${padded}\x1b[27m`);
  };

  drawScreen('-- NORMAL --');

  let cmdBuf = '';
  let inCommandMode = false;
  const exitCommands = [':q', ':q!', ':wq', ':wq!', ':x', ':qa', ':qa!'];
  let attempts = 0;

  const exitVim = () => {
    setInteractiveMode(null);
    term.write('\x1b[2J\x1b[H');
    const msg = attempts > 3
      ? `(Escaped from vim after ${attempts} failed attempts. You'll never be the same.)`
      : "(Escaped from vim. You're one of the lucky ones.)";
    term.writeln(`${ANSI.dim}${msg}${ANSI.reset}`);
    resetInput();
    writePrompt();
  };

  const taunts = [
    "That's not how you exit vim...",
    "Still trapped. Try typing : first.",
    "Nope. Maybe Google it?",
    "Millions have been lost to vim. Join them.",
    "Hint: it starts with a colon.",
    "You're going to be here a while.",
    "vim has claimed another soul.",
  ];

  setInteractiveMode((data: string) => {
    const code = data.charCodeAt(0);

    // Ctrl+C — reset to normal mode
    if (code === 3) {
      cmdBuf = '';
      inCommandMode = false;
      drawScreen('-- NORMAL --');
      return;
    }

    if (!inCommandMode) {
      if (data === ':') {
        inCommandMode = true;
        cmdBuf = ':';
        drawScreen(cmdBuf);
      } else if (data === 'Z' && cmdBuf !== 'Z') {
        cmdBuf = 'Z';
      } else if (data === 'Z' && cmdBuf === 'Z') {
        exitVim();
      } else {
        cmdBuf = '';
        attempts++;
        drawScreen(taunts[attempts % taunts.length]);
      }
      return;
    }

    // In command mode
    if (code === 13) {
      if (exitCommands.includes(cmdBuf)) {
        exitVim();
      } else {
        attempts++;
        const errCmd = cmdBuf.slice(1);
        inCommandMode = false;
        cmdBuf = '';
        drawScreen(`E492: Not an editor command: ${errCmd}`);
      }
    } else if (code === 27) {
      inCommandMode = false;
      cmdBuf = '';
      drawScreen('-- NORMAL --');
    } else if (code === 127) {
      if (cmdBuf.length > 1) {
        cmdBuf = cmdBuf.slice(0, -1);
        drawScreen(cmdBuf);
      } else {
        inCommandMode = false;
        cmdBuf = '';
        drawScreen('-- NORMAL --');
      }
    } else if (code >= 32 && code < 127) {
      cmdBuf += data;
      drawScreen(cmdBuf);
    }
  });
}

/**
 * Steam locomotive animation (sl command)
 */
export function startSl(ctx: TerminalContext): void {
  const { term, resetInput, writePrompt } = ctx;
  const train = [
    '      ====        ________                ___________',
    '  _D _|  |_______/        \\__I_I_____===__|_________|',
    '   |(_)---  |   H\\________/ |   |        =|___ ___|',
    '   /     |  |   H  |  |     |   |         ||_| |_||',
    '  |      |  |   H  |__--------------------| [___] |',
    '  (      |  |   H  //[]---~\\\\_________|     |     |',
    '  /\\\\______|__|___H_//  |    |    \\\\_______|     |',
    ' /                 |      |    |    \\               |',
    '~~~~~~~~~~~~~~~~~~~~~IIIIIIII~~~~~~~~~~~~~IIIIIIII~~~~',
  ];
  const trainWidth = Math.max(...train.map(l => l.length));
  const cols = term.cols;
  let pos = cols;
  let firstFrame = true;

  const interval = setInterval(() => {
    if (!firstFrame) {
      term.write(`\x1b[${train.length}A`);
    }
    firstFrame = false;

    for (const line of train) {
      let visible = '';
      for (let col = 0; col < cols; col++) {
        const trainCol = col - pos;
        if (trainCol >= 0 && trainCol < line.length) {
          visible += line[trainCol];
        } else {
          visible += ' ';
        }
      }
      term.write(`\r${ANSI.green}${visible}${ANSI.reset}\r\n`);
    }

    pos -= 3;

    if (pos < -trainWidth) {
      clearInterval(interval);
      resetInput();
      writePrompt();
    }
  }, 60);
}

/**
 * Fake rm -rf / animation
 */
export function startRmRf(ctx: TerminalContext): void {
  const { term, resetInput, writePrompt } = ctx;
  const files = [
    'about/whoami.txt', 'about/bio.md', 'work/skills.json',
    'work/experience/director-of-tech.md', 'contact/email.txt',
    'projects/vault-os.md', 'projects/dataearn.md',
    'education/nyu.md', 'misc/now.txt', '/',
  ];
  let i = 0;

  const interval = setInterval(() => {
    if (i < files.length) {
      term.write(`\r\n${ANSI.red}rm: removing ${files[i]}${ANSI.reset}`);
      i++;
    } else {
      clearInterval(interval);
      term.write(`\r\n\r\n${ANSI.green}Just kidding. Nice try though.${ANSI.reset}`);
      resetInput();
      writePrompt();
    }
  }, 150);
}

// ─── AI Tool Interactive Sessions ───────────────────────────────────

const ORANGE = '\x1b[38;5;208m';

const aiResponses = [
  "I'm flattered, but I'm just an easter egg on a portfolio site.",
  "I'd love to help, but I'm not actually connected to anything.",
  "Try the real thing — this is just a tribute.",
  "404: Intelligence not found. This is a static website.",
  "I appreciate the effort, but I'm purely decorative.",
  "You're typing into the void. A very pretty void, though.",
  "This prompt goes nowhere. Like my hopes of being a real AI.",
  "I'm about as useful as a screen door on a submarine right now.",
];

interface AiToolConfig {
  name: string;
  exitHint: string;
  promptChar: string;
  promptColor: string;
  renderHeader: (cols: number) => string[];
}

function startAiSession(ctx: TerminalContext, config: AiToolConfig): void {
  const { term, setInteractiveMode, resetInput, writePrompt } = ctx;
  const cols = term.cols;
  let inputBuf = '';
  let responseIdx = 0;

  const drawScreen = (extraLines?: string[]) => {
    term.write('\x1b[2J\x1b[H');
    const headerLines = config.renderHeader(cols);
    for (const line of headerLines) {
      term.write(line + '\r\n');
    }
    if (extraLines) {
      for (const line of extraLines) {
        term.write(line + '\r\n');
      }
    }
    // Input prompt
    term.write(`\r\n${config.promptColor}${config.promptChar}${ANSI.reset} ${inputBuf}`);
  };

  const exitSession = () => {
    setInteractiveMode(null);
    term.write('\x1b[2J\x1b[H');
    term.writeln(`${ANSI.dim}(Exited ${config.name})${ANSI.reset}`);
    resetInput();
    writePrompt();
  };

  drawScreen();

  setInteractiveMode((data: string) => {
    const code = data.charCodeAt(0);

    if (code === 3) {
      // Ctrl+C
      exitSession();
      return;
    }

    if (code === 13) {
      // Enter
      const cmd = inputBuf.trim();
      if (cmd === '/exit' || cmd === 'exit' || cmd === 'quit' || cmd === '/quit') {
        exitSession();
        return;
      }
      if (cmd) {
        const response = aiResponses[responseIdx % aiResponses.length];
        responseIdx++;
        inputBuf = '';
        drawScreen([
          '',
          `${ANSI.dim}> ${cmd}${ANSI.reset}`,
          '',
          `${ANSI.white}${response}${ANSI.reset}`,
        ]);
      } else {
        inputBuf = '';
        drawScreen();
      }
      return;
    }

    if (code === 127) {
      // Backspace
      if (inputBuf.length > 0) {
        inputBuf = inputBuf.slice(0, -1);
        term.write('\b \b');
      }
      return;
    }

    if (code >= 32 && code < 127) {
      inputBuf += data;
      term.write(data);
    }
  });
}

/**
 * Claude Code interactive session
 */
export function startClaude(ctx: TerminalContext): void {
  const cols = ctx.term.cols;
  startAiSession(ctx, {
    name: 'Claude Code',
    exitHint: '/exit or Ctrl+C',
    promptChar: '❯',
    promptColor: ORANGE,
    renderHeader: (c) => {
      const W = Math.max(60, c - 2);
      const LW = Math.min(34, Math.floor(W * 0.4));
      const RW = W - LW - 1;
      const o = ORANGE;
      const r = ANSI.reset;
      const row = (left: string, right: string) =>
        `${o}│${r}${padEndVisible(left, LW)}${o}│${r}${padEndVisible(right, RW)}${o}│${r}`;

      const titleText = '─── Claude Code v2.1.39 ';
      const topFill = Math.max(0, W - titleText.length - 1);

      return [
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
      ];
    },
  });
}

/**
 * OpenAI Codex interactive session
 */
export function startCodex(ctx: TerminalContext): void {
  startAiSession(ctx, {
    name: 'Codex',
    exitHint: '/exit or Ctrl+C',
    promptChar: '>',
    promptColor: ANSI.green,
    renderHeader: (c) => {
      const d = ANSI.dim;
      const r = ANSI.reset;
      const W = Math.max(40, Math.min(58, c - 4));
      const row = (content: string) =>
        `${d}│${r} ${padEndVisible(content, W)}${d} │${r}`;
      const topFill = Math.max(0, W + 2 - 3);

      return [
        `${d}╭── ${'─'.repeat(topFill - 1)}╮${r}`,
        row(`${d}>_${r} ${ANSI.bold}OpenAI Codex${r} ${d}(v0.1.2503262313)${r}`),
        row(''),
        row(`${d}model:     ${r}gpt-5.3-codex-high   ${d}/model${ANSI.cyan} to change${r}`),
        row(`${d}directory: ${r}~/Projects/otisscott.me`),
        `${d}╰${'─'.repeat(W + 2)}╯${r}`,
      ];
    },
  });
}

/**
 * OpenCode interactive session — matches the real TUI layout
 */
export function startOpencode(ctx: TerminalContext): void {
  const { term, setInteractiveMode, resetInput, writePrompt } = ctx;
  const cols = term.cols;
  const rows = term.rows;
  const r = ANSI.reset;
  const d = ANSI.dim;
  const gray = '\x1b[90m';
  const shadow1 = '\x1b[38;5;235m';
  const bg1 = '\x1b[48;5;235m';
  const shadow2 = '\x1b[38;5;238m';
  const bg2 = '\x1b[48;5;238m';
  const inputBg = '\x1b[48;5;237m';

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

  const drawLogoLine = (line: string, fg: string, shadow: string, bg: string) => {
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
    const left = drawLogoLine(logoLeft[i], gray, shadow1, bg1);
    const right = drawLogoLine(logoRight[i], r, shadow2, bg2);
    const pad = ' '.repeat(Math.max(0, Math.floor((cols - 41) / 2)));
    logoLines.push(pad + left + ' ' + right);
  }

  let inputBuf = '';
  let responseIdx = 0;
  const inputW = Math.min(75, cols - 8);
  const inputPad = Math.max(0, Math.floor((cols - inputW - 3) / 2));

  const drawScreen = (extraLines?: string[]) => {
    term.write('\x1b[2J\x1b[H');

    // Top spacer
    const topPad = Math.max(1, Math.floor((rows - 14) / 2));
    for (let i = 0; i < topPad; i++) term.write('\r\n');

    // Logo
    for (const line of logoLines) {
      term.write(line + '\r\n');
    }
    term.write('\r\n');

    // Input box with cyan left border
    const placeholder = inputBuf
      ? inputBuf + ' '.repeat(Math.max(0, inputW - inputBuf.length))
      : `${d}Ask anything... "What is the tech stack of this project?"${r}` ;
    const inputLine = inputBuf
      ? `${inputBg} ${inputBuf}${' '.repeat(Math.max(0, inputW - inputBuf.length))} ${r}`
      : `${inputBg} ${d}Ask anything... "What is the tech stack of this project?"${r}${inputBg}${' '.repeat(Math.max(0, inputW - 57))} ${r}`;
    term.write(`${' '.repeat(inputPad)}${ANSI.cyan}│${r}${inputLine}\r\n`);

    // Model info line
    const modelLine = `${inputBg} ${ANSI.cyan}Sisyphus${r}${inputBg}  ${ANSI.white}Kimi K2.5${r}${inputBg}  ${d}Moonshot${r}${inputBg}${' '.repeat(Math.max(0, inputW - 30))} ${r}`;
    term.write(`${' '.repeat(inputPad)}${ANSI.cyan}│${r}${modelLine}\r\n`);

    term.write('\r\n');

    // Keyboard shortcuts
    const shortcuts = `${ANSI.bold}ctrl+t${r} ${d}variants${r}  ${ANSI.bold}tab${r} ${d}agents${r}  ${ANSI.bold}ctrl+p${r} ${d}commands${r}`;
    const shortcutPad = ' '.repeat(Math.max(0, Math.floor((cols - 42) / 2)));
    term.write(`${shortcutPad}${shortcuts}\r\n`);

    if (extraLines) {
      term.write('\r\n');
      for (const line of extraLines) {
        term.write(`${' '.repeat(inputPad)}  ${line}\r\n`);
      }
    }

    // Position cursor in input box
    term.write(`\x1b[${topPad + logoLines.length + 2};${inputPad + 3 + inputBuf.length}H`);
  };

  const exitSession = () => {
    setInteractiveMode(null);
    term.write('\x1b[2J\x1b[H');
    term.writeln(`${d}(Exited opencode)${r}`);
    resetInput();
    writePrompt();
  };

  drawScreen();

  setInteractiveMode((data: string) => {
    const code = data.charCodeAt(0);

    if (code === 3) {
      exitSession();
      return;
    }

    if (code === 13) {
      const cmd = inputBuf.trim();
      if (cmd === '/exit' || cmd === 'exit' || cmd === 'quit' || cmd === '/quit') {
        exitSession();
        return;
      }
      if (cmd) {
        const response = aiResponses[responseIdx % aiResponses.length];
        responseIdx++;
        inputBuf = '';
        drawScreen([
          `${d}> ${cmd}${r}`,
          '',
          `${ANSI.white}${response}${r}`,
        ]);
      } else {
        drawScreen();
      }
      return;
    }

    if (code === 127) {
      if (inputBuf.length > 0) {
        inputBuf = inputBuf.slice(0, -1);
        drawScreen();
      }
      return;
    }

    if (code >= 32 && code < 127) {
      inputBuf += data;
      drawScreen();
    }
  });
}

/**
 * SCP file transfer animation — fire-and-forget (like ssh/make pattern)
 */
export function startScp(ctx: TerminalContext): void {
  const { term, resetInput, writePrompt } = ctx;

  term.write(`\r\nConnecting to otisscott.me...`);

  let progress = 0;
  const totalKB = 372;
  const barWidth = 16;

  const drawProgress = () => {
    const pct = Math.min(progress, 100);
    const filled = Math.round((pct / 100) * barWidth);
    const empty = barWidth - filled;
    const bar = '█'.repeat(filled) + '░'.repeat(empty);
    const kb = Math.round((pct / 100) * totalKB);
    const speed = (1.8 + Math.random() * 0.8).toFixed(1);
    term.write(`\r${ANSI.reset}resume.pdf ${String(pct).padStart(3)}% |${ANSI.green}${bar}${ANSI.reset}| ${String(kb).padStart(3)}KB ${speed}MB/s`);
  };

  setTimeout(() => {
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 12) + 5;
      if (progress >= 100) {
        progress = 100;
        drawProgress();
        clearInterval(interval);
        term.write(`\r\n\r\n${ANSI.green}File received.${ANSI.reset}`);
        term.write(`\r\n${ANSI.dim}(Resume download not wired up yet — drop a PDF in public/ to enable)${ANSI.reset}`);
        resetInput();
        writePrompt();
      } else {
        drawProgress();
      }
    }, 200);
  }, 600);
}

/**
 * Start a background job — returns interval ID so Terminal can track it
 */
export function startBgJob(
  name: string,
  onProgress: (progress: number) => void,
  onDone: () => void,
): number {
  let progress = 0;
  const duration = 10000 + Math.random() * 10000; // 10-20s
  const tickMs = 500;
  const increment = (tickMs / duration) * 100;

  const intervalId = window.setInterval(() => {
    progress += increment + (Math.random() * increment * 0.5);
    if (progress >= 100) {
      progress = 100;
      clearInterval(intervalId);
      onDone();
    }
    onProgress(Math.min(progress, 100));
  }, tickMs);

  return intervalId;
}

// ─── Dev Tool Easter Eggs ────────────────────────────────────────────

/**
 * SSH connection animation — fire-and-forget (like rm -rf pattern)
 */
export function startSsh(ctx: TerminalContext): void {
  const { term, resetInput, writePrompt } = ctx;

  const steps = [
    { text: `${ANSI.dim}ssh otis@otisscott.me${ANSI.reset}`, delay: 0 },
    { text: `Connecting to otisscott.me...`, delay: 400 },
    { text: `${ANSI.dim}Key exchange: curve25519-sha256${ANSI.reset}`, delay: 800 },
    { text: `${ANSI.dim}Host key: SHA256:xT3rm1n4lP0rtf0l10${ANSI.reset}`, delay: 400 },
    { text: `${ANSI.green}Authentication successful.${ANSI.reset}`, delay: 600 },
    { text: `${ANSI.dim}Establishing session...${ANSI.reset}`, delay: 500 },
    { text: '', delay: 300 },
    { text: `${ANSI.bold}Welcome to otisscott.me.${ANSI.reset} ${ANSI.dim}You're already here.${ANSI.reset}`, delay: 0 },
  ];

  let i = 0;
  const next = () => {
    if (i < steps.length) {
      term.write(`\r\n${steps[i].text}`);
      i++;
      if (i < steps.length) {
        setTimeout(next, steps[i].delay);
      } else {
        resetInput();
        writePrompt();
      }
    }
  };
  setTimeout(next, steps[0].delay || 200);
}

/**
 * htop — full-screen takeover, press q or F10 to exit (like vim pattern)
 * Processes reference real projects; CPU/mem values fluctuate each refresh.
 */
export function startHtop(ctx: TerminalContext, loadTime: number): void {
  const { term, setInteractiveMode, resetInput, writePrompt } = ctx;
  const cols = term.cols;
  const rows = term.rows;

  // Base process definitions — cpu/mem are center points that jitter each tick
  const processes = [
    { pid: 1,   user: 'otis', baseCpu: 14, baseMem: 5.0, cmd: 'vault-os', color: ANSI.green },
    { pid: 22,  user: 'otis', baseCpu: 9,  baseMem: 3.8, cmd: 'next-dev-server', color: ANSI.green },
    { pid: 55,  user: 'otis', baseCpu: 7,  baseMem: 3.2, cmd: 'xterm-renderer', color: ANSI.green },
    { pid: 101, user: 'otis', baseCpu: 5,  baseMem: 2.4, cmd: 'lwin-mapper', color: ANSI.cyan },
    { pid: 137, user: 'otis', baseCpu: 4,  baseMem: 1.8, cmd: 'dataearn-api', color: ANSI.cyan },
    { pid: 200, user: 'otis', baseCpu: 3,  baseMem: 1.4, cmd: 'theme-engine', color: ANSI.white },
    { pid: 256, user: 'otis', baseCpu: 2,  baseMem: 0.9, cmd: 'shopify-bridge', color: ANSI.white },
    { pid: 314, user: 'root', baseCpu: 1.5, baseMem: 0.6, cmd: 'sec-scraper', color: ANSI.dim },
    { pid: 420, user: 'root', baseCpu: 0.8, baseMem: 0.3, cmd: 'cowsay-daemon', color: ANSI.dim },
    { pid: 512, user: 'otis', baseCpu: 0.4, baseMem: 0.2, cmd: 'easter-egg-loader', color: ANSI.dim },
    { pid: 666, user: 'root', baseCpu: 0.2, baseMem: 0.1, cmd: 'git-status-poller', color: ANSI.dim },
  ];

  const jitter = (base: number, range: number) => {
    const val = base + (Math.random() * range * 2 - range);
    return Math.max(0.1, val);
  };

  const drawBar = (pct: number, width: number, color: string): string => {
    const filled = Math.min(width, Math.round((pct / 100) * width));
    const empty = width - filled;
    return `${color}${'|'.repeat(filled)}${ANSI.reset}${ANSI.dim}${' '.repeat(empty)}${ANSI.reset}`;
  };

  const drawScreen = () => {
    const now = Date.now();
    const diffMs = now - loadTime;
    const totalSec = Math.floor(diffMs / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    const uptimeStr = min > 0 ? `${min}:${String(sec).padStart(2, '0')}` : `0:${String(sec).padStart(2, '0')}`;

    // Jitter the totals each tick
    const cpuPct = jitter(42, 8);
    const memPct = jitter(26, 4);
    const barW = Math.min(30, cols - 20);

    term.write('\x1b[2J\x1b[H');

    // Header bars
    term.write(`  ${ANSI.bold}CPU${ANSI.reset}[${drawBar(cpuPct, barW, ANSI.green)}${ANSI.dim} ${cpuPct.toFixed(1)}%${ANSI.reset}]\r\n`);
    term.write(`  ${ANSI.bold}Mem${ANSI.reset}[${drawBar(memPct, barW, ANSI.cyan)}${ANSI.dim} ${memPct.toFixed(1)}%${ANSI.reset}]\r\n`);
    term.write(`\r\n`);
    term.write(`  ${ANSI.dim}Tasks: ${ANSI.reset}${ANSI.bold}${processes.length}${ANSI.reset}${ANSI.dim}; Uptime: ${uptimeStr}${ANSI.reset}\r\n`);
    term.write(`\r\n`);

    // Process header
    const header = `${ANSI.bold}\x1b[7m  PID USER      CPU%  MEM%  COMMAND${' '.repeat(Math.max(0, cols - 36))}\x1b[27m${ANSI.reset}`;
    term.write(header + '\r\n');

    // Processes with jittered values, sorted by CPU desc
    const live = processes.map(p => ({
      ...p,
      cpu: jitter(p.baseCpu, p.baseCpu * 0.3),
      mem: jitter(p.baseMem, p.baseMem * 0.2),
    })).sort((a, b) => b.cpu - a.cpu);

    const maxProcs = Math.min(live.length, rows - 9);
    for (let i = 0; i < maxProcs; i++) {
      const p = live[i];
      const line = `  ${String(p.pid).padStart(3)} ${p.user.padEnd(9)} ${p.cpu.toFixed(1).padStart(5)} ${p.mem.toFixed(1).padStart(5)}  ${p.color}${p.cmd}${ANSI.reset}`;
      term.write(line + '\r\n');
    }

    // Fill remaining rows
    for (let i = maxProcs + 7; i < rows - 1; i++) {
      term.write('\r\n');
    }

    // Footer
    const footer = `${ANSI.bold}\x1b[7m F1${ANSI.reset}\x1b[7mHelp ${ANSI.bold}F5${ANSI.reset}\x1b[7mTree ${ANSI.bold}F9${ANSI.reset}\x1b[7mKill ${ANSI.bold}F10${ANSI.reset}\x1b[7mQuit${' '.repeat(Math.max(0, cols - 28))}\x1b[27m`;
    term.write(footer);
  };

  drawScreen();

  // Refresh every 750ms — frequent enough to feel alive, light enough to stay smooth
  const refreshInterval = setInterval(drawScreen, 750);

  const exitHtop = () => {
    clearInterval(refreshInterval);
    setInteractiveMode(null);
    term.write('\x1b[2J\x1b[H');
    term.writeln(`${ANSI.dim}(Exited htop)${ANSI.reset}`);
    resetInput();
    writePrompt();
  };

  setInteractiveMode((data: string) => {
    const code = data.charCodeAt(0);

    if (data === 'q' || data === 'Q' || code === 3) {
      exitHtop();
      return;
    }

    // F10 key (ESC [ 21 ~)
    if (data === '\x1b[21~') {
      exitHtop();
    }
  });
}

/**
 * make — build animation, fire-and-forget (like rm -rf pattern)
 */
export function startMake(ctx: TerminalContext): void {
  const { term, resetInput, writePrompt } = ctx;

  const steps = [
    { text: `${ANSI.dim}make[1]: Entering directory '~/Projects/otisscott.me'${ANSI.reset}`, delay: 300 },
    { text: `Compiling components...`, delay: 600 },
    { text: `${ANSI.dim}  cc -o about.o about.tsx${ANSI.reset}`, delay: 200 },
    { text: `${ANSI.dim}  cc -o terminal.o Terminal.tsx${ANSI.reset}`, delay: 250 },
    { text: `Linking experience.o skills.o projects.o...`, delay: 700 },
    { text: `Bundling assets...`, delay: 500 },
    { text: `Optimizing portfolio...`, delay: 800 },
    { text: '', delay: 200 },
    { text: `${ANSI.green}Build complete. 0 errors, 0 warnings.${ANSI.reset}`, delay: 0 },
  ];

  let i = 0;
  const next = () => {
    if (i < steps.length) {
      term.write(`\r\n${steps[i].text}`);
      i++;
      if (i < steps.length) {
        setTimeout(next, steps[i].delay);
      } else {
        resetInput();
        writePrompt();
      }
    }
  };
  setTimeout(next, steps[0].delay || 200);
}
