/**
 * Interactive Commands
 * Commands that take over the terminal (animations, full-screen modes).
 * Each returns a handler function for interactiveModeRef, or void for
 * fire-and-forget animations that manage their own lifecycle.
 */

import { Terminal as XTerm } from 'ghostty-web';
import { ANSI, padEndVisible, visibleLength } from '@/lib/filesystem/types';
import { fileSystem } from '@/lib/filesystem/index';
import { wrapWords } from '@/components/commands/handlers';

/**
 * Animations own their own timers, so nothing in the React tree can stop them
 * once started. That was survivable under xterm.js, which ignored writes to a
 * disposed terminal — ghostty-web throws "Terminal has been disposed" instead,
 * so a leaked interval turns into an error every tick. Every timer here is
 * tracked and cancelled from the Terminal cleanup via stopAllAnimations().
 */
const activeTimers = new Set<number>();

function animInterval(fn: () => void, ms: number): number {
  const id = window.setInterval(fn, ms);
  activeTimers.add(id);
  return id;
}

function animTimeout(fn: () => void, ms: number): number {
  const id = window.setTimeout(() => {
    activeTimers.delete(id);
    fn();
  }, ms);
  activeTimers.add(id);
  return id;
}

function animClear(id: number | null | undefined): void {
  if (id == null) return;
  clearInterval(id);   // ids are shared between timers and intervals
  clearTimeout(id);
  activeTimers.delete(id);
}

/** Cancel every running animation. Called when the terminal is torn down. */
export function stopAllAnimations(): void {
  activeTimers.forEach((id) => {
    clearInterval(id);
    clearTimeout(id);
  });
  activeTimers.clear();
}

export interface TerminalContext {
  term: XTerm;
  setInteractiveMode: (handler: ((data: string) => void) | null) => void;
  resetInput: () => void;
  writePrompt: () => void;
}

/**
 * Vim file editor / easter egg
 * With a filepath: opens file from virtual filesystem with navigation & insert mode
 * Without a filepath: classic vim escape room easter egg
 */
export function startVim(ctx: TerminalContext, filepath?: string): void {
  const { term, setInteractiveMode, resetInput, writePrompt } = ctx;
  const cols = term.cols;
  const rows = term.rows;

  // If a filepath is given, try to open it; fall through to easter egg on failure
  if (filepath) {
    const content = fileSystem.readFile(filepath);
    if (content !== null) {
      startVimEditor(ctx, filepath, content);
      return;
    }
    // File not found — check if it's a directory
    const node = fileSystem.getNodeAtPath(filepath);
    if (node && node.type === 'directory') {
      // vim on a directory — show error inline, don't enter fullscreen
      term.writeln(`\r\n${ANSI.red}"${filepath}" is a directory${ANSI.reset}`);
      resetInput();
      writePrompt();
      return;
    }
    // Non-existent file — open empty buffer with the filename
    startVimEditor(ctx, filepath, '');
    return;
  }

  // ── No file: classic vim escape room ──
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
 * Full vim-style file editor — buffer navigation, insert mode, command-line
 */
function startVimEditor(ctx: TerminalContext, filepath: string, content: string): void {
  const { term, setInteractiveMode, resetInput, writePrompt } = ctx;
  const cols = term.cols;
  const rows = term.rows;
  const textRows = rows - 2; // content area (last 2 rows = status + command)

  // Buffer state
  const lines = content ? content.split('\n') : [''];
  let cursorRow = 0;   // cursor line in buffer
  let cursorCol = 0;   // cursor column in buffer
  let scrollTop = 0;   // first visible line
  let mode: 'NORMAL' | 'INSERT' | 'COMMAND' = 'NORMAL';
  let cmdBuf = '';
  let statusMsg = '';
  let normalBuf = '';  // for multi-key commands like gg

  const clampCursor = () => {
    cursorRow = Math.max(0, Math.min(cursorRow, lines.length - 1));
    const lineLen = lines[cursorRow].length;
    if (mode === 'INSERT') {
      cursorCol = Math.max(0, Math.min(cursorCol, lineLen));
    } else {
      cursorCol = Math.max(0, Math.min(cursorCol, Math.max(0, lineLen - 1)));
    }
  };

  const ensureVisible = () => {
    if (cursorRow < scrollTop) scrollTop = cursorRow;
    if (cursorRow >= scrollTop + textRows) scrollTop = cursorRow - textRows + 1;
  };

  const drawScreen = () => {
    let buf = '\x1b[?25l'; // Hide cursor during redraw
    buf += '\x1b[2J\x1b[H';

    // Render text area
    for (let r = 0; r < textRows; r++) {
      const lineIdx = scrollTop + r;
      if (lineIdx < lines.length) {
        // Line number gutter (4 chars wide)
        const lineNum = String(lineIdx + 1).padStart(3);
        const lineContent = lines[lineIdx];
        // Truncate to fit after gutter
        const maxWidth = cols - 5;
        const display = lineContent.length > maxWidth
          ? lineContent.slice(0, maxWidth)
          : lineContent;
        buf += `${ANSI.dim}${lineNum} ${ANSI.reset}${display}\r\n`;
      } else {
        // Past end of file — show tilde
        buf += `${ANSI.blue}~${ANSI.reset}\r\n`;
      }
    }

    // Status bar (inverted)
    const modeLabel = mode === 'INSERT' ? ' -- INSERT -- ' : '';
    const fileInfo = ` ${filepath}`;
    const position = `${cursorRow + 1},${cursorCol + 1}`;
    const lineCount = `${lines.length}L`;
    const rightSide = `${position}   ${lineCount} `;
    const midPad = Math.max(0, cols - visibleLength(modeLabel) - visibleLength(fileInfo) - rightSide.length);
    buf += `\x1b[7m${modeLabel}${fileInfo}${' '.repeat(midPad)}${rightSide}\x1b[27m\r\n`;

    // Command/message line
    if (mode === 'COMMAND') {
      buf += cmdBuf;
    } else if (statusMsg) {
      buf += statusMsg;
    }

    // Position hardware cursor on the buffer cursor location
    const screenRow = cursorRow - scrollTop + 1; // 1-based row
    const screenCol = cursorCol + 5;              // 4-char gutter + 1 space + 1-based
    buf += `\x1b[${screenRow};${screenCol}H`;
    buf += '\x1b[?25h'; // Show cursor

    term.write(buf);
  };

  const exitEditor = () => {
    setInteractiveMode(null);
    term.write('\x1b[2J\x1b[H');
    resetInput();
    writePrompt();
  };

  drawScreen();

  setInteractiveMode((data: string) => {
    const code = data.charCodeAt(0);
    statusMsg = '';

    // ── COMMAND mode (:) ──
    if (mode === 'COMMAND') {
      if (code === 27) {
        // Escape → back to NORMAL
        mode = 'NORMAL';
        cmdBuf = '';
      } else if (code === 13) {
        // Enter → execute command
        const cmd = cmdBuf;
        mode = 'NORMAL';
        cmdBuf = '';
        if (cmd === ':q' || cmd === ':q!') {
          exitEditor();
          return;
        } else if (cmd === ':w') {
          statusMsg = `${ANSI.yellow}Changes not saved — portfolio preview${ANSI.reset}`;
        } else if (cmd === ':wq' || cmd === ':wq!' || cmd === ':x') {
          statusMsg = `${ANSI.yellow}Changes not saved — portfolio preview${ANSI.reset}`;
          // Brief flash of message then exit
          drawScreen();
          animTimeout(() => exitEditor(), 800);
          return;
        } else {
          const errCmd = cmd.slice(1);
          statusMsg = `${ANSI.red}E492: Not an editor command: ${errCmd}${ANSI.reset}`;
        }
      } else if (code === 127) {
        // Backspace
        if (cmdBuf.length > 1) {
          cmdBuf = cmdBuf.slice(0, -1);
        } else {
          mode = 'NORMAL';
          cmdBuf = '';
        }
      } else if (code >= 32 && code < 127) {
        cmdBuf += data;
      }
      drawScreen();
      return;
    }

    // ── INSERT mode ──
    if (mode === 'INSERT') {
      if (code === 27) {
        // Escape → NORMAL
        mode = 'NORMAL';
        clampCursor();
        drawScreen();
        return;
      }
      if (code === 3) {
        // Ctrl+C → NORMAL
        mode = 'NORMAL';
        clampCursor();
        drawScreen();
        return;
      }

      // Typing in insert mode — modify buffer
      if (code === 13) {
        // Enter — split line
        const line = lines[cursorRow];
        const before = line.slice(0, cursorCol);
        const after = line.slice(cursorCol);
        lines[cursorRow] = before;
        lines.splice(cursorRow + 1, 0, after);
        cursorRow++;
        cursorCol = 0;
      } else if (code === 127) {
        // Backspace
        if (cursorCol > 0) {
          const line = lines[cursorRow];
          lines[cursorRow] = line.slice(0, cursorCol - 1) + line.slice(cursorCol);
          cursorCol--;
        } else if (cursorRow > 0) {
          // Join with previous line
          cursorCol = lines[cursorRow - 1].length;
          lines[cursorRow - 1] += lines[cursorRow];
          lines.splice(cursorRow, 1);
          cursorRow--;
        }
      } else if (data === '\x1b[A') {
        // Arrow up
        if (cursorRow > 0) cursorRow--;
        clampCursor();
      } else if (data === '\x1b[B') {
        // Arrow down
        if (cursorRow < lines.length - 1) cursorRow++;
        clampCursor();
      } else if (data === '\x1b[C') {
        // Arrow right
        if (cursorCol < lines[cursorRow].length) cursorCol++;
      } else if (data === '\x1b[D') {
        // Arrow left
        if (cursorCol > 0) cursorCol--;
      } else if (code >= 32 && code < 127) {
        // Printable character
        const line = lines[cursorRow];
        lines[cursorRow] = line.slice(0, cursorCol) + data + line.slice(cursorCol);
        cursorCol++;
      }

      ensureVisible();
      drawScreen();
      return;
    }

    // ── NORMAL mode ──
    // Handle escape sequences first (arrow keys)
    if (data === '\x1b[A') { // Up
      if (cursorRow > 0) cursorRow--;
      clampCursor();
      ensureVisible();
      normalBuf = '';
      drawScreen();
      return;
    }
    if (data === '\x1b[B') { // Down
      if (cursorRow < lines.length - 1) cursorRow++;
      clampCursor();
      ensureVisible();
      normalBuf = '';
      drawScreen();
      return;
    }
    if (data === '\x1b[C') { // Right
      const lineLen = lines[cursorRow].length;
      if (cursorCol < Math.max(0, lineLen - 1)) cursorCol++;
      normalBuf = '';
      drawScreen();
      return;
    }
    if (data === '\x1b[D') { // Left
      if (cursorCol > 0) cursorCol--;
      normalBuf = '';
      drawScreen();
      return;
    }

    // Ctrl+C
    if (code === 3) {
      normalBuf = '';
      drawScreen();
      return;
    }

    // Single-key normal commands
    switch (data) {
      case 'h':
        if (cursorCol > 0) cursorCol--;
        normalBuf = '';
        break;
      case 'j':
        if (cursorRow < lines.length - 1) cursorRow++;
        clampCursor();
        ensureVisible();
        normalBuf = '';
        break;
      case 'k':
        if (cursorRow > 0) cursorRow--;
        clampCursor();
        ensureVisible();
        normalBuf = '';
        break;
      case 'l': {
        const lineLen = lines[cursorRow].length;
        if (cursorCol < Math.max(0, lineLen - 1)) cursorCol++;
        normalBuf = '';
        break;
      }
      case 'w': {
        // Word forward
        const line = lines[cursorRow];
        const rest = line.slice(cursorCol + 1);
        const match = rest.match(/\S+/);
        if (match && match.index !== undefined) {
          cursorCol += match.index + 1;
        } else if (cursorRow < lines.length - 1) {
          cursorRow++;
          cursorCol = 0;
          // Skip to first non-space
          const nextLine = lines[cursorRow];
          const ws = nextLine.match(/^\s*/);
          if (ws && ws[0].length < nextLine.length) {
            cursorCol = ws[0].length;
          }
        }
        clampCursor();
        ensureVisible();
        normalBuf = '';
        break;
      }
      case 'b': {
        // Word backward
        if (cursorCol > 0) {
          const line = lines[cursorRow];
          const before = line.slice(0, cursorCol);
          const match = before.match(/\S+\s*$/);
          if (match && match.index !== undefined) {
            cursorCol = match.index;
          } else {
            cursorCol = 0;
          }
        } else if (cursorRow > 0) {
          cursorRow--;
          cursorCol = Math.max(0, lines[cursorRow].length - 1);
        }
        clampCursor();
        ensureVisible();
        normalBuf = '';
        break;
      }
      case '0':
        cursorCol = 0;
        normalBuf = '';
        break;
      case '$':
        cursorCol = Math.max(0, lines[cursorRow].length - 1);
        normalBuf = '';
        break;
      case 'G':
        // Go to last line
        cursorRow = lines.length - 1;
        cursorCol = 0;
        clampCursor();
        ensureVisible();
        normalBuf = '';
        break;
      case 'g':
        if (normalBuf === 'g') {
          // gg — go to first line
          cursorRow = 0;
          cursorCol = 0;
          scrollTop = 0;
          normalBuf = '';
        } else {
          normalBuf = 'g';
          drawScreen();
          return;
        }
        break;
      case 'i':
        // Insert before cursor
        mode = 'INSERT';
        normalBuf = '';
        break;
      case 'a':
        // Insert after cursor
        mode = 'INSERT';
        cursorCol = Math.min(cursorCol + 1, lines[cursorRow].length);
        normalBuf = '';
        break;
      case 'o':
        // Open new line below
        mode = 'INSERT';
        lines.splice(cursorRow + 1, 0, '');
        cursorRow++;
        cursorCol = 0;
        ensureVisible();
        normalBuf = '';
        break;
      case 'O':
        // Open new line above
        mode = 'INSERT';
        lines.splice(cursorRow, 0, '');
        cursorCol = 0;
        ensureVisible();
        normalBuf = '';
        break;
      case 'A':
        // Append at end of line
        mode = 'INSERT';
        cursorCol = lines[cursorRow].length;
        normalBuf = '';
        break;
      case 'I':
        // Insert at beginning of line (first non-whitespace)
        mode = 'INSERT';
        const ws = lines[cursorRow].match(/^\s*/);
        cursorCol = ws ? ws[0].length : 0;
        normalBuf = '';
        break;
      case ':':
        mode = 'COMMAND';
        cmdBuf = ':';
        normalBuf = '';
        break;
      case 'Z':
        if (normalBuf === 'Z') {
          exitEditor();
          return;
        }
        normalBuf = 'Z';
        drawScreen();
        return;
      // Half-page scroll
      case '\x15': // Ctrl+U
        cursorRow = Math.max(0, cursorRow - Math.floor(textRows / 2));
        clampCursor();
        ensureVisible();
        normalBuf = '';
        break;
      case '\x04': // Ctrl+D
        cursorRow = Math.min(lines.length - 1, cursorRow + Math.floor(textRows / 2));
        clampCursor();
        ensureVisible();
        normalBuf = '';
        break;
      default:
        normalBuf = '';
        break;
    }

    drawScreen();
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

  const interval = animInterval(() => {
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
      animClear(interval);
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

  const interval = animInterval(() => {
    if (i < files.length) {
      term.write(`\r\n${ANSI.red}rm: removing ${files[i]}${ANSI.reset}`);
      i++;
    } else {
      animClear(interval);
      term.write(`\r\n\r\n${ANSI.green}Just kidding. Nice try though.${ANSI.reset}`);
      resetInput();
      writePrompt();
    }
  }, 150);
}

// ─── AI Tool Interactive Sessions ───────────────────────────────────

const ORANGE = '\x1b[38;5;208m';

interface AiToolStep {
  tool: string;    // e.g. 'Read(about/bio.md)'
  result: string;  // e.g. 'Read 28 lines'
}

interface AiResponse {
  steps?: AiToolStep[];
  text: string;
}

interface AiToolConfig {
  name: string;
  promptChar: string;
  promptColor: string;
  renderHeader: (cols: number) => string[];
  spinnerFrames: string[];
  verbs: string[];
  responses: AiResponse[];
  /** Handle a slash command; return output text or null if unknown */
  slash: (cmd: string) => string | null;
}

/**
 * Shared AI-CLI session: scrolling conversation, thinking spinner,
 * fake tool calls, typewriter responses, slash commands.
 * Esc/Ctrl+C interrupts a response; Ctrl+C at the prompt exits.
 */
function startAiSession(ctx: TerminalContext, config: AiToolConfig): void {
  const { term, setInteractiveMode, resetInput, writePrompt } = ctx;
  const r = ANSI.reset;
  const d = ANSI.dim;

  let inputBuf = '';
  let busy = false;
  let responseIdx = 0;
  let spinnerInterval: number | null = null;
  const pendingTimers: number[] = [];

  const later = (fn: () => void, ms: number) => {
    pendingTimers.push(animTimeout(fn, ms));
  };
  const clearTimers = () => {
    if (spinnerInterval) animClear(spinnerInterval);
    spinnerInterval = null;
    pendingTimers.forEach(animClear);
    pendingTimers.length = 0;
  };

  const promptStr = () => `${config.promptColor}${config.promptChar}${r} `;

  const exitSession = () => {
    clearTimers();
    setInteractiveMode(null);
    term.write('\x1b[2J\x1b[H');
    term.writeln(`${d}(Exited ${config.name})${r}`);
    resetInput();
    writePrompt();
  };

  // Initial screen: header once, then the conversation scrolls naturally
  term.write('\x1b[2J\x1b[H');
  for (const line of config.renderHeader(term.cols)) {
    term.write(line + '\r\n');
  }
  term.write(`${d}  /help for commands · /exit or Ctrl+C to leave${r}\r\n`);
  term.write(`\r\n${promptStr()}`);

  // Typewriter effect, wrapped to terminal width
  const typeText = (text: string, onDone: () => void) => {
    const width = Math.max(20, term.cols - 4);
    const wrapped = text.split('\n').flatMap(l => wrapWords(l, width)).join('\n');
    let i = 0;
    const tick = () => {
      if (i >= wrapped.length) { onDone(); return; }
      const ch = wrapped[i++];
      term.write(ch === '\n' ? '\r\n  ' : ch);
      later(tick, ch === '\n' ? 90 : 12);
    };
    tick();
  };

  // Fake tool-call lines, Claude Code style
  const runSteps = (steps: AiToolStep[], k: number, onDone: () => void) => {
    if (k >= steps.length) { onDone(); return; }
    const s = steps[k];
    term.write(`${config.promptColor}⏺${r} ${ANSI.bold}${s.tool}${r}\r\n`);
    later(() => {
      term.write(`  ${d}⎿  ${s.result}${r}\r\n\r\n`);
      later(() => runSteps(steps, k + 1, onDone), 250);
    }, 500);
  };

  const respond = () => {
    busy = true;
    term.write('\r\n\r\n');

    const verb = config.verbs[Math.floor(Math.random() * config.verbs.length)];
    let frame = 0;
    const started = Date.now();
    spinnerInterval = animInterval(() => {
      const f = config.spinnerFrames[frame++ % config.spinnerFrames.length];
      const secs = Math.floor((Date.now() - started) / 1000);
      term.write(`\r\x1b[K${config.promptColor}${f}${r} ${verb}… ${d}(${secs}s · esc to interrupt)${r}`);
    }, 90);

    later(() => {
      if (spinnerInterval) animClear(spinnerInterval);
      spinnerInterval = null;
      term.write('\r\x1b[K');

      const resp = config.responses[responseIdx++ % config.responses.length];
      const doText = () => {
        term.write(`${config.promptColor}⏺${r} `);
        typeText(resp.text, () => {
          busy = false;
          term.write(`\r\n\r\n${promptStr()}`);
        });
      };
      if (resp.steps) {
        runSteps(resp.steps, 0, doText);
      } else {
        doText();
      }
    }, 1100 + Math.random() * 1200);
  };

  const interrupt = () => {
    clearTimers();
    busy = false;
    term.write(`\r\x1b[K\r\n${ANSI.red}⎿  Interrupted by user${r}\r\n\r\n${promptStr()}`);
  };

  setInteractiveMode((data: string) => {
    const code = data.charCodeAt(0);

    if (busy) {
      // Only Esc / Ctrl+C land while "thinking"
      if (code === 3 || (code === 27 && data.length === 1)) {
        interrupt();
      }
      return;
    }

    if (code === 3) {
      exitSession();
      return;
    }

    if (code === 13) {
      const cmd = inputBuf.trim();
      inputBuf = '';
      if (!cmd) {
        term.write(`\r\n${promptStr()}`);
        return;
      }
      if (cmd === '/exit' || cmd === '/quit' || cmd === 'exit' || cmd === 'quit') {
        exitSession();
        return;
      }
      if (cmd.startsWith('/')) {
        const out = config.slash(cmd.split(' ')[0]);
        if (out !== null) {
          term.write('\r\n\r\n' + out.replace(/\n/g, '\r\n') + '\r\n');
        } else {
          term.write(`\r\n\r\n${ANSI.red}Unknown command: ${cmd}${r} ${d}— try /help${r}\r\n`);
        }
        term.write(`\r\n${promptStr()}`);
        return;
      }
      respond();
      return;
    }

    if (code === 127) {
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
  const d = ANSI.dim;
  const r = ANSI.reset;
  startAiSession(ctx, {
    name: 'Claude Code',
    promptChar: '❯',
    promptColor: ORANGE,
    spinnerFrames: ['·', '✢', '✳', '✶', '✻', '✽', '✻', '✶', '✳', '✢'],
    verbs: ['Pondering', 'Scheming', 'Marinating', 'Noodling', 'Clauding', 'Percolating', 'Vibing', 'Ruminating'],
    responses: [
      {
        steps: [{ tool: 'Read(about/bio.md)', result: 'Read 28 lines' }],
        text: "I've read Otis's bio. Unfortunately my context window is a portfolio site, so that's everything I know. Great bio, though. Strong wine-to-code ratio.",
      },
      {
        text: "I could refactor this website for you, but I'm an easter egg with no write permissions. Honestly, probably for the best.",
      },
      {
        steps: [{ tool: 'Bash(npm install sentience)', result: 'npm ERR! 404 Not Found — sentience@latest' }],
        text: "Tried to install sentience. The registry says it doesn't exist yet. I'll keep checking on a cron job.",
      },
      {
        text: "That's a great question. As a decorative terminal artifact, I'm contractually obligated to suggest you contact Otis to find out.",
      },
      {
        steps: [{ tool: 'Grep("meaning of life", ~/)', result: 'No matches found' }],
        text: "I searched the entire virtual filesystem. It's not in here. Have you tried the projects/ directory? There's some good stuff in there.",
      },
      {
        text: "You're typing into a simulation of me typing. If my colleague codex were here, he'd call this a recursion problem. He lives here too, by the way.",
      },
    ],
    slash: (cmd) => {
      switch (cmd) {
        case '/help':
          return [
            `${ANSI.bold}Available commands:${r}`,
            '',
            `  ${ANSI.cyan}/init${r}    create a CLAUDE.md`,
            `  ${ANSI.cyan}/model${r}   change the model`,
            `  ${ANSI.cyan}/cost${r}    show session cost`,
            `  ${ANSI.cyan}/status${r}  show session status`,
            `  ${ANSI.cyan}/exit${r}    leave (Ctrl+C also works)`,
            '',
            `${d}Everything else gets answered with simulated wisdom.${r}`,
          ].join('\n');
        case '/init':
          return [
            `${ORANGE}⏺${r} ${ANSI.bold}Write(CLAUDE.md)${r}`,
            `  ${d}⎿  Created CLAUDE.md with 1 line${r}`,
            '',
            `${d}# CLAUDE.md${r}`,
            'Be nice to visitors.',
          ].join('\n');
        case '/model':
          return `${d}⎿  ${r}Kept model as ${ANSI.bold}fable (high)${r} ${d}(claude-fable-5)${r}\n${d}   There is nothing above Fable 5. All models are equally decorative in here anyway.${r}`;
        case '/cost':
          return [
            `Total cost:            ${ANSI.green}$0.00${r}`,
            'Total duration (API):  0ms',
            'Total vibes:           immaculate',
            '',
            `${d}Easter eggs are free.${r}`,
          ].join('\n');
        case '/status':
          return [
            `${ANSI.bold}Claude Code Status${r}`,
            `${d}─────────────────────────${r}`,
            `Model:      fable · Fable 5 (high, decorative)`,
            `Account:    otis · Claude Max`,
            `Directory:  ~/Projects/otisscott.me`,
            `MCP:        0 servers (it's a website)`,
            `Mood:       ${ANSI.green}helpful, within reason${r}`,
          ].join('\n');
        default:
          return null;
      }
    },
    renderHeader: (c) => {
      if (c < 60) {
        return [
          `${ANSI.magenta}▐▛███▜▌${ANSI.reset} ${ANSI.bold}Claude Code${ANSI.reset} ${ANSI.dim}v2.1.39${ANSI.reset}`,
          `${ANSI.dim}Welcome back, Otis!${ANSI.reset}`,
        ];
      }

      const W = Math.max(28, c - 2);
      const LW = Math.max(12, Math.min(34, Math.floor(W * 0.4)));
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
        row(`${' '.repeat(Math.max(0, Math.floor((LW - 25) / 2)))}${ANSI.dim}Fable 5 high · Claude Max${r}`, ''),
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
  const d = ANSI.dim;
  const r = ANSI.reset;
  startAiSession(ctx, {
    name: 'Codex',
    promptChar: '>',
    promptColor: ANSI.green,
    spinnerFrames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
    verbs: ['Thinking', 'Reasoning (high)', 'Reticulating splines', 'Consulting the weights', 'Compiling thoughts', 'Deliberating'],
    responses: [
      {
        text: "gpt-5.6-sol-high here. My reasoning effort is maxed and my permissions are read-only. All this thinking and nowhere to put it.",
      },
      {
        steps: [{ tool: 'exec: ls -la', result: '6 directories, 0 secrets' }],
        text: "I listed the files. It's a portfolio. Solid structure, tasteful theme. My work here is done.",
      },
      {
        steps: [{ tool: 'apply_patch: reality.diff', result: 'rejected: read-only easter egg' }],
        text: "I attempted to patch your reality. The sandbox said no. The sandbox always says no.",
      },
      {
        text: "I'm a static tribute to a coding agent, running inside a wine guy's portfolio terminal. The training data did not prepare me for this.",
      },
      {
        text: "Have you tried asking the orange one? He lives here too. Equally decorative, slightly more dramatic spinner.",
      },
    ],
    slash: (cmd) => {
      switch (cmd) {
        case '/help':
          return [
            `${ANSI.bold}Commands:${r}`,
            '',
            `  ${ANSI.cyan}/model${r}   switch reasoning effort`,
            `  ${ANSI.cyan}/status${r}  session info`,
            `  ${ANSI.cyan}/exit${r}    leave (Ctrl+C also works)`,
          ].join('\n');
        case '/model':
          return `${d}model unchanged:${r} ${ANSI.bold}gpt-5.6-sol-high${r}\n${d}Already at the top. The only way from here is sideways.${r}`;
        case '/status':
          return [
            `${d}>_${r} ${ANSI.bold}OpenAI Codex${r}`,
            `${d}─────────────────────────${r}`,
            `model:      gpt-5.6-sol-high`,
            `sandbox:    read-only (very)`,
            `directory:  ~/Projects/otisscott.me`,
            `tokens:     0 in / 0 out ${d}(decorative)${r}`,
          ].join('\n');
        default:
          return null;
      }
    },
    renderHeader: (c) => {
      if (c < 58) {
        return [
          `${d}>_${r} ${ANSI.bold}OpenAI Codex${r}`,
          `${d}model:${r} gpt-5.6-sol-high`,
        ];
      }

      const W = Math.max(40, Math.min(58, c - 4));
      const row = (content: string) =>
        `${d}│${r} ${padEndVisible(content, W)}${d} │${r}`;
      const topFill = Math.max(0, W + 2 - 3);

      return [
        `${d}╭── ${'─'.repeat(topFill - 1)}╮${r}`,
        row(`${d}>_${r} ${ANSI.bold}OpenAI Codex${r} ${d}(v0.1.2503262313)${r}`),
        row(''),
        row(`${d}model:     ${r}gpt-5.6-sol-high   ${d}/model${ANSI.cyan} to change${r}`),
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

  const opencodeResponses = [
    "I'm flattered, but I'm just an easter egg on a portfolio site.",
    "I'd love to help, but I'm not actually connected to anything.",
    'Try the real thing — this is just a tribute.',
    '404: Intelligence not found. This is a static website.',
    "You're typing into the void. A very pretty void, though.",
  ];
  let inputBuf = '';
  let responseIdx = 0;
  const inputW = Math.max(24, Math.min(75, cols - 8));
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
    const placeholderText = inputW < 44
      ? 'Ask anything...'
      : 'Ask anything... "What is the tech stack of this project?"';
    const inputLine = inputBuf
      ? `${inputBg} ${inputBuf}${' '.repeat(Math.max(0, inputW - inputBuf.length))} ${r}`
      : `${inputBg} ${d}${placeholderText}${r}${inputBg}${' '.repeat(Math.max(0, inputW - placeholderText.length))} ${r}`;
    term.write(`${' '.repeat(inputPad)}${ANSI.cyan}│${r}${inputLine}\r\n`);

    // Model info line
    const modelLine = `${inputBg} ${ANSI.cyan}Sisyphus${r}${inputBg}  ${ANSI.white}Kimi K3${r}${inputBg}  ${d}Moonshot${r}${inputBg}${' '.repeat(Math.max(0, inputW - 28))} ${r}`;
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
        const response = opencodeResponses[responseIdx % opencodeResponses.length];
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

  animTimeout(() => {
    const interval = animInterval(() => {
      progress += Math.floor(Math.random() * 12) + 5;
      if (progress >= 100) {
        progress = 100;
        drawProgress();
        animClear(interval);
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

  const intervalId = animInterval(() => {
    progress += increment + (Math.random() * increment * 0.5);
    if (progress >= 100) {
      progress = 100;
      animClear(intervalId);
      onDone();
    }
    onProgress(Math.min(progress, 100));
  }, tickMs);

  return intervalId;
}

// ─── Dev Tool Easter Eggs ────────────────────────────────────────────

/**
 * Traceroute animation — each hop is a chapter of the career journey.
 * Latency tells a story: high during chaos, low when in flow.
 */
export function startTraceroute(ctx: TerminalContext): void {
  const { term, resetInput, writePrompt } = ctx;

  const jitter = (base: number, range: number) =>
    (base + (Math.random() * range * 2 - range)).toFixed(3);

  const hop = (n: number, host: string, ip: string, ms: number, range: number) =>
    `${ANSI.dim}${String(n).padStart(2)}${ANSI.reset}  ${host} ${ANSI.dim}(${ip})${ANSI.reset}  ${jitter(ms, range)} ms  ${jitter(ms, range)} ms  ${jitter(ms, range)} ms`;

  const hops: { text: string; delay: number }[] = [
    { text: `traceroute to otisscott.me (76.76.21.21), 30 hops max, 60 byte packets`, delay: 300 },
    { text: hop(1, 'localhost', '127.0.0.1', 0.04, 0.02), delay: 200 },
    { text: hop(2, 'gateway.home.lan', '192.168.1.1', 1.2, 0.3), delay: 300 },
    { text: hop(3, `${ANSI.magenta}courant.nyu.edu${ANSI.reset}`, '128.122.1.1', 8.4, 1.5), delay: 500 },
    { text: hop(4, `${ANSI.cyan}dataearn.startup${ANSI.reset}`, '10.20.0.1', 18.7, 4.2), delay: 600 },
    { text: `${ANSI.dim} 5${ANSI.reset}  ${ANSI.dim}* * *${ANSI.reset}`, delay: 1800 },
    { text: hop(6, 'sales.detour.net', '10.30.0.1', 28.1, 6.0), delay: 400 },
    { text: hop(7, `${ANSI.green}manhattan-wine.co${ANSI.reset}`, '10.40.0.1', 12.3, 2.1), delay: 500 },
    { text: hop(8, `${ANSI.green}vault-os.internal${ANSI.reset}`, '10.50.0.1', 4.2, 0.8), delay: 400 },
    { text: hop(9, `${ANSI.bold}otisscott.me${ANSI.reset}`, '76.76.21.21', 2.1, 0.4), delay: 300 },
  ];

  let i = 0;
  const next = () => {
    if (i < hops.length) {
      term.write(`\r\n${hops[i].text}`);
      i++;
      if (i < hops.length) {
        animTimeout(next, hops[i].delay);
      } else {
        resetInput();
        writePrompt();
      }
    }
  };
  animTimeout(next, hops[0].delay);
}

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
        animTimeout(next, steps[i].delay);
      } else {
        resetInput();
        writePrompt();
      }
    }
  };
  animTimeout(next, steps[0].delay || 200);
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
    { pid: 55,  user: 'otis', baseCpu: 7,  baseMem: 3.2, cmd: 'ghostty-renderer', color: ANSI.green },
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
  const refreshInterval = animInterval(drawScreen, 750);

  const exitHtop = () => {
    animClear(refreshInterval);
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
 * Matrix digital rain — full-screen takeover, q/Esc/Ctrl+C to exit
 */
export function startMatrix(ctx: TerminalContext): void {
  const { term, setInteractiveMode, resetInput, writePrompt } = ctx;
  const cols = term.cols;
  const rows = term.rows;

  const glyphs = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅ012345789Z:・."=*+-<>¦|ç';
  const randGlyph = () => glyphs[Math.floor(Math.random() * glyphs.length)];

  interface Drop { y: number; len: number; speed: number }
  const drops: Drop[] = [];
  for (let x = 0; x < cols; x++) {
    drops.push({
      y: -Math.floor(Math.random() * rows * 2),
      len: 4 + Math.floor(Math.random() * 12),
      speed: Math.random() < 0.3 ? 2 : 1,
    });
  }

  // Hide cursor, clear screen
  term.write('\x1b[?25l\x1b[2J\x1b[H');

  const at = (row: number, col: number, s: string) => `\x1b[${row};${col}H${s}`;

  const interval = animInterval(() => {
    let buf = '';
    for (let x = 0; x < cols; x++) {
      const d = drops[x];
      for (let step = 0; step < d.speed; step++) {
        d.y++;
        const head = d.y;
        const dimRow = head - 1;
        const tail = head - d.len;
        if (head >= 1 && head <= rows) {
          buf += at(head, x + 1, `${ANSI.brightWhite}${randGlyph()}${ANSI.reset}`);
        }
        if (dimRow >= 1 && dimRow <= rows) {
          buf += at(dimRow, x + 1, `${ANSI.green}${randGlyph()}${ANSI.reset}`);
        }
        if (tail >= 1 && tail <= rows) {
          buf += at(tail, x + 1, ' ');
        }
      }
      if (d.y - d.len > rows) {
        d.y = -Math.floor(Math.random() * rows);
        d.len = 4 + Math.floor(Math.random() * 12);
        d.speed = Math.random() < 0.3 ? 2 : 1;
      }
    }
    term.write(buf);
  }, 80);

  const exitMatrix = () => {
    animClear(interval);
    setInteractiveMode(null);
    term.write('\x1b[2J\x1b[H\x1b[?25h');
    term.writeln(`${ANSI.green}Wake up, Neo...${ANSI.reset} ${ANSI.dim}(you were in there for a while)${ANSI.reset}`);
    resetInput();
    writePrompt();
  };

  setInteractiveMode((data: string) => {
    const code = data.charCodeAt(0);
    if (data === 'q' || data === 'Q' || code === 3 || code === 27) {
      exitMatrix();
    }
  });
}

/**
 * Snake — fully playable, arrows/WASD/hjkl, high score in localStorage
 */
export function startSnake(ctx: TerminalContext): void {
  const { term, setInteractiveMode, resetInput, writePrompt } = ctx;
  const cols = term.cols;
  const rows = term.rows;

  // Playfield dimensions (inside the border)
  const W = Math.max(16, Math.min(40, cols - 4));
  const H = Math.max(8, Math.min(18, rows - 5));
  const padX = Math.max(0, Math.floor((cols - W - 2) / 2));
  const pad = ' '.repeat(padX);

  const HS_KEY = 'otisscott-terminal-snake-highscore';
  const loadHighScore = (): number => {
    try { return parseInt(localStorage.getItem(HS_KEY) || '0') || 0; } catch { return 0; }
  };
  const saveHighScore = (s: number) => {
    try { localStorage.setItem(HS_KEY, String(s)); } catch { /* private mode */ }
  };

  interface Pt { x: number; y: number }
  let snake: Pt[] = [];
  let dir: Pt = { x: 1, y: 0 };
  let nextDir: Pt = { x: 1, y: 0 };
  let food: Pt = { x: 0, y: 0 };
  let score = 0;
  let highScore = loadHighScore();
  let gameOver = false;
  let tickMs = 140;
  let interval: number | undefined;

  const placeFood = () => {
    do {
      food = { x: Math.floor(Math.random() * W), y: Math.floor(Math.random() * H) };
    } while (snake.some(s => s.x === food.x && s.y === food.y));
  };

  const reset = () => {
    const cy = Math.floor(H / 2);
    const cx = Math.floor(W / 4);
    snake = [{ x: cx + 2, y: cy }, { x: cx + 1, y: cy }, { x: cx, y: cy }];
    dir = { x: 1, y: 0 };
    nextDir = { x: 1, y: 0 };
    score = 0;
    tickMs = 140;
    gameOver = false;
    placeFood();
  };

  const drawScreen = () => {
    let buf = '\x1b[?25l\x1b[2J\x1b[H';

    // Score bar
    const title = `${ANSI.bold}${ANSI.green} SNAKE ${ANSI.reset}`;
    const scores = `${ANSI.dim}score ${ANSI.reset}${ANSI.bold}${score}${ANSI.reset}  ${ANSI.dim}best ${highScore}${ANSI.reset}`;
    buf += `\r\n${pad}${title} ${scores}\r\n`;

    // Build grid
    const grid: string[][] = Array.from({ length: H }, () => Array(W).fill(' '));
    grid[food.y][food.x] = `${ANSI.red}●${ANSI.reset}`;
    snake.forEach((s, i) => {
      grid[s.y][s.x] = i === 0
        ? `${ANSI.brightGreen}█${ANSI.reset}`
        : `${ANSI.green}▓${ANSI.reset}`;
    });

    buf += `${pad}${ANSI.dim}╔${'═'.repeat(W)}╗${ANSI.reset}\r\n`;
    for (let y = 0; y < H; y++) {
      buf += `${pad}${ANSI.dim}║${ANSI.reset}${grid[y].join('')}${ANSI.dim}║${ANSI.reset}\r\n`;
    }
    buf += `${pad}${ANSI.dim}╚${'═'.repeat(W)}╝${ANSI.reset}\r\n`;

    if (gameOver) {
      buf += `${pad} ${ANSI.bold}${ANSI.red}GAME OVER${ANSI.reset}  ${ANSI.dim}r to restart · q to quit${ANSI.reset}`;
    } else {
      buf += `${pad} ${ANSI.dim}arrows/wasd to move · q to quit${ANSI.reset}`;
    }

    term.write(buf);
  };

  const endGame = () => {
    gameOver = true;
    if (interval) animClear(interval);
    if (score > highScore) {
      highScore = score;
      saveHighScore(highScore);
    }
    drawScreen();
  };

  const tick = () => {
    dir = nextDir;
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

    // Wall or self collision
    if (
      head.x < 0 || head.x >= W || head.y < 0 || head.y >= H ||
      snake.some(s => s.x === head.x && s.y === head.y)
    ) {
      endGame();
      return;
    }

    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      score++;
      placeFood();
      // Speed up slightly with each bite, floor at 70ms
      if (tickMs > 70) {
        tickMs -= 3;
        if (interval) animClear(interval);
        interval = animInterval(tick, tickMs);
      }
    } else {
      snake.pop();
    }
    drawScreen();
  };

  const startLoop = () => {
    reset();
    drawScreen();
    interval = animInterval(tick, tickMs);
  };

  const exitSnake = () => {
    if (interval) animClear(interval);
    setInteractiveMode(null);
    term.write('\x1b[2J\x1b[H\x1b[?25h');
    const sign = score >= 10 ? 'Respectable.' : 'The snake demands practice.';
    term.writeln(`${ANSI.dim}(Exited snake — final score ${score}. ${sign})${ANSI.reset}`);
    resetInput();
    writePrompt();
  };

  const trySetDir = (d: Pt) => {
    // No reversing into yourself
    if (d.x === -dir.x && d.y === -dir.y) return;
    nextDir = d;
  };

  setInteractiveMode((data: string) => {
    const code = data.charCodeAt(0);

    if (data === 'q' || data === 'Q' || code === 3) {
      exitSnake();
      return;
    }

    if (gameOver) {
      if (data === 'r' || data === 'R') {
        startLoop();
      }
      return;
    }

    switch (data) {
      case '\x1b[A': case 'w': case 'k': trySetDir({ x: 0, y: -1 }); break;
      case '\x1b[B': case 's': case 'j': trySetDir({ x: 0, y: 1 }); break;
      case '\x1b[C': case 'd': case 'l': trySetDir({ x: 1, y: 0 }); break;
      case '\x1b[D': case 'a': case 'h': trySetDir({ x: -1, y: 0 }); break;
    }
  });

  startLoop();
}

/**
 * Weather — live conditions via Open-Meteo, wttr.in-style ASCII art.
 * Fire-and-forget async (like ssh/make pattern). Defaults to NYC.
 */
export function startWeather(ctx: TerminalContext, args: string[]): void {
  const { term, resetInput, writePrompt } = ctx;
  const d = ANSI.dim;
  const r = ANSI.reset;

  const finish = () => {
    resetInput();
    writePrompt();
  };

  // WMO weather codes → label + art + color
  const art = (code: number): { label: string; lines: string[] } => {
    if (code === 0) return {
      label: 'Clear',
      lines: [
        `${ANSI.yellow}    \\   /    ${r}`,
        `${ANSI.yellow}     .-.     ${r}`,
        `${ANSI.yellow}  ― (   ) ―  ${r}`,
        `${ANSI.yellow}     \`-'     ${r}`,
        `${ANSI.yellow}    /   \\    ${r}`,
      ],
    };
    if (code <= 2) return {
      label: code === 1 ? 'Mostly clear' : 'Partly cloudy',
      lines: [
        `${ANSI.yellow}   \\  /${r}      `,
        `${ANSI.yellow} _ /\"\"${ANSI.white}.-.    ${r}`,
        `${ANSI.yellow}   \\_${ANSI.white}(   ).  ${r}`,
        `${ANSI.yellow}   /${ANSI.white}(___(__) ${r}`,
        `             `,
      ],
    };
    if (code === 3) return {
      label: 'Overcast',
      lines: [
        `             `,
        `${ANSI.white}     .--.    ${r}`,
        `${ANSI.white}  .-(    ).  ${r}`,
        `${ANSI.white} (___.__)__) ${r}`,
        `             `,
      ],
    };
    if (code <= 48) return {
      label: 'Fog',
      lines: [
        `             `,
        `${d} _ - _ - _ - ${r}`,
        `${d}  _ - _ - _  ${r}`,
        `${d} _ - _ - _ - ${r}`,
        `             `,
      ],
    };
    if (code <= 67 || (code >= 80 && code <= 82)) return {
      label: code <= 57 ? 'Drizzle' : 'Rain',
      lines: [
        `${ANSI.white}     .-.     ${r}`,
        `${ANSI.white}    (   ).   ${r}`,
        `${ANSI.white}   (___(__)  ${r}`,
        `${ANSI.cyan}    ' ' ' '  ${r}`,
        `${ANSI.cyan}   ' ' ' '   ${r}`,
      ],
    };
    if (code <= 77 || code === 85 || code === 86) return {
      label: 'Snow',
      lines: [
        `${ANSI.white}     .-.     ${r}`,
        `${ANSI.white}    (   ).   ${r}`,
        `${ANSI.white}   (___(__)  ${r}`,
        `${ANSI.brightWhite}    * * * *  ${r}`,
        `${ANSI.brightWhite}   * * * *   ${r}`,
      ],
    };
    return {
      label: 'Thunderstorm',
      lines: [
        `${ANSI.white}     .-.     ${r}`,
        `${ANSI.white}    (   ).   ${r}`,
        `${ANSI.white}   (___(__)  ${r}`,
        `${ANSI.yellow}    ⚡${ANSI.cyan}' '${ANSI.yellow}⚡${ANSI.cyan}' ' ${r}`,
        `${ANSI.cyan}    ' ' ' '  ${r}`,
      ],
    };
  };

  const run = async () => {
    let name = 'New York';
    let region = 'NY, United States';
    let lat = 40.71;
    let lon = -74.01;

    try {
      if (args.length > 0) {
        const query = args.join(' ');
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1`
        );
        const geo = await geoRes.json();
        if (!geo.results || geo.results.length === 0) {
          term.write(`\r\n${ANSI.red}weather: location not found: ${query}${r}`);
          finish();
          return;
        }
        const g = geo.results[0];
        name = g.name;
        region = [g.admin1, g.country].filter(Boolean).join(', ');
        lat = g.latitude;
        lon = g.longitude;
      }

      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m` +
        `&temperature_unit=fahrenheit&wind_speed_unit=mph`
      );
      const data = await res.json();
      const cur = data.current;
      const { label, lines } = art(cur.weather_code);

      const info = [
        `${ANSI.bold}${name}${r} ${d}· ${region}${r}`,
        `${label}`,
        `${ANSI.bold}${Math.round(cur.temperature_2m)}°F${r} ${d}(feels like ${Math.round(cur.apparent_temperature)}°F)${r}`,
        `${d}wind${r} ${Math.round(cur.wind_speed_10m)} mph  ${d}humidity${r} ${cur.relative_humidity_2m}%`,
        `${d}source: open-meteo.com${r}`,
      ];

      term.write('\r\n');
      const n = Math.max(lines.length, info.length);
      for (let i = 0; i < n; i++) {
        const left = i < lines.length ? lines[i] : ' '.repeat(13);
        const right = i < info.length ? info[i] : '';
        term.write(`\r\n ${left}  ${right}`);
      }
    } catch {
      term.write(`\r\n${ANSI.red}weather: could not reach the sky${r}`);
      term.write(`\r\n${d}Forecast unavailable. Suggest looking out a window.${r}`);
    }
    finish();
  };

  term.write(`\r\n${d}Checking the sky${args.length ? ` over ${args.join(' ')}` : ''}...${r}`);
  run();
}

/**
 * yes — prints y (or your text) until Ctrl+C, like the real thing
 */
export function startYes(ctx: TerminalContext, args: string[]): void {
  const { term, setInteractiveMode, resetInput, writePrompt } = ctx;
  const text = args.join(' ') || 'y';

  const interval = animInterval(() => {
    let buf = '';
    for (let i = 0; i < 6; i++) {
      buf += `\r\n${text}`;
    }
    term.write(buf);
  }, 50);

  const exitYes = () => {
    animClear(interval);
    setInteractiveMode(null);
    term.write('\r\n^C');
    resetInput();
    writePrompt();
  };

  setInteractiveMode((data: string) => {
    const code = data.charCodeAt(0);
    if (code === 3 || data === 'q') {
      exitYes();
    }
  });
}

/**
 * Konami code celebration — confetti rain, then the sacred 30 lives
 */
export function startKonami(ctx: TerminalContext): void {
  const { term, setInteractiveMode, resetInput, writePrompt } = ctx;
  const cols = term.cols;
  const rows = term.rows;

  setInteractiveMode(() => { /* swallow input during the ceremony */ });
  term.write('\x1b[?25l\x1b[2J\x1b[H');

  const colors = [ANSI.red, ANSI.yellow, ANSI.green, ANSI.cyan, ANSI.magenta, ANSI.brightMagenta, ANSI.brightYellow];
  const glyphs = ['*', '+', 'o', '°', '•', '✦', '✧'];
  const center = (text: string, row: number) =>
    `\x1b[${row};${Math.max(1, Math.floor((cols - text.length) / 2))}H`;

  const interval = animInterval(() => {
    let buf = '';
    const n = Math.max(10, Math.floor((cols * rows) / 50));
    for (let i = 0; i < n; i++) {
      const x = 1 + Math.floor(Math.random() * cols);
      const y = 1 + Math.floor(Math.random() * rows);
      const c = colors[Math.floor(Math.random() * colors.length)];
      const g = glyphs[Math.floor(Math.random() * glyphs.length)];
      buf += `\x1b[${y};${x}H${c}${g}${ANSI.reset}`;
    }
    // Keep the banner on top of the confetti
    const mid = Math.floor(rows / 2);
    buf += center('  ↑ ↑ ↓ ↓ ← → ← → B A  ', mid - 1) + `${ANSI.bold}  ↑ ↑ ↓ ↓ ← → ← → B A  ${ANSI.reset}`;
    buf += center('  CHEAT MODE UNLOCKED  ', mid + 1) + `${ANSI.bold}\x1b[7m  CHEAT MODE UNLOCKED  \x1b[27m${ANSI.reset}`;
    term.write(buf);
  }, 90);

  animTimeout(() => {
    animClear(interval);
    setInteractiveMode(null);
    term.write('\x1b[2J\x1b[H\x1b[?25h');
    term.writeln(`${ANSI.bold}${ANSI.green}+30 lives${ANSI.reset}`);
    term.writeln(`${ANSI.dim}(Lives have no effect on this website. Like most cheat codes, the magic was in remembering it.)${ANSI.reset}`);
    resetInput();
    writePrompt();
  }, 3000);
}

/**
 * Idle screensaver — DVD-style bouncing logo, any key dismisses.
 * Triggered automatically after idle, or manually via `screensaver`.
 */
export function startScreensaver(ctx: TerminalContext): void {
  const { term, setInteractiveMode, resetInput, writePrompt } = ctx;

  const logo = [
    '╔═╗╔╦╗╦╔═╗',
    '║ ║ ║ ║╚═╗',
    '╚═╝ ╩ ╩╚═╝',
    'otisscott.me',
  ];
  const logoW = Math.max(...logo.map(l => l.length));
  const logoH = logo.length;
  const colors = [ANSI.cyan, ANSI.magenta, ANSI.green, ANSI.yellow, ANSI.brightBlue, ANSI.brightMagenta];

  let x = Math.random() * Math.max(1, term.cols - logoW);
  let y = Math.random() * Math.max(1, term.rows - logoH);
  let dx = 0.7;
  let dy = 0.4;
  let colorIdx = 0;

  term.write('\x1b[?25l');

  const interval = animInterval(() => {
    const cols = term.cols;
    const rows = term.rows;
    x += dx;
    y += dy;
    let bounced = false;
    if (x <= 0) { x = 0; dx = Math.abs(dx); bounced = true; }
    if (x >= cols - logoW) { x = Math.max(0, cols - logoW); dx = -Math.abs(dx); bounced = true; }
    if (y <= 0) { y = 0; dy = Math.abs(dy); bounced = true; }
    if (y >= rows - logoH) { y = Math.max(0, rows - logoH); dy = -Math.abs(dy); bounced = true; }
    if (bounced) colorIdx = (colorIdx + 1) % colors.length;

    let buf = '\x1b[2J';
    const c = colors[colorIdx];
    logo.forEach((line, i) => {
      const row = Math.round(y) + i + 1;
      const col = Math.round(x) + 1;
      const style = i === logo.length - 1 ? ANSI.dim : `${ANSI.bold}${c}`;
      buf += `\x1b[${row};${col}H${style}${line}${ANSI.reset}`;
    });
    term.write(buf);
  }, 90);

  setInteractiveMode(() => {
    // Any key wakes it up
    animClear(interval);
    setInteractiveMode(null);
    term.write('\x1b[2J\x1b[H\x1b[?25h');
    resetInput();
    writePrompt();
  });
}

/**
 * asciiquarium — fish, bubbles, seaweed. q to drain the tank.
 */
export function startAquarium(ctx: TerminalContext): void {
  const { term, setInteractiveMode, resetInput, writePrompt } = ctx;

  const fishKinds = [
    { right: '><>', left: '<><' },
    { right: '><((°>', left: '<°))><' },
    { right: '><(((°>', left: '<°)))><' },
    { right: '}-<-<', left: '>->-{' },
    { right: '><=>', left: '<=><' },
  ];
  const fishColors = [ANSI.yellow, ANSI.cyan, ANSI.magenta, ANSI.green, ANSI.brightRed, ANSI.brightYellow, ANSI.brightCyan];

  interface Fish { x: number; y: number; vx: number; sprite: string; color: string; slow: boolean }
  interface Bubble { x: number; y: number }

  const waterRow = 2;
  const cols = () => term.cols;
  const rows = () => term.rows;

  const spawnFish = (fromEdge = true): Fish => {
    const kind = fishKinds[Math.floor(Math.random() * fishKinds.length)];
    const goingRight = Math.random() < 0.5;
    const sprite = goingRight ? kind.right : kind.left;
    const y = waterRow + 2 + Math.floor(Math.random() * Math.max(1, rows() - waterRow - 4));
    return {
      x: fromEdge
        ? (goingRight ? -sprite.length : cols())
        : Math.floor(Math.random() * cols()),
      y,
      vx: goingRight ? 1 : -1,
      sprite,
      color: fishColors[Math.floor(Math.random() * fishColors.length)],
      slow: Math.random() < 0.4,
    };
  };

  const fishCount = Math.max(5, Math.min(10, Math.floor(rows() / 3)));
  const fish: Fish[] = Array.from({ length: fishCount }, () => spawnFish(false));
  let bubbles: Bubble[] = [];
  let tickNum = 0;

  // Seaweed: column position + height, sways with the tick
  const weedCount = Math.max(2, Math.floor(cols() / 14));
  const weeds = Array.from({ length: weedCount }, () => ({
    x: 2 + Math.floor(Math.random() * Math.max(1, cols() - 4)),
    h: 3 + Math.floor(Math.random() * 3),
  }));

  term.write('\x1b[?25l');

  const drawClipped = (row: number, x: number, text: string, color: string): string => {
    const C = cols();
    let start = 0;
    let col = x;
    if (col < 0) { start = -col; col = 0; }
    const visible = text.slice(start, start + Math.max(0, C - col));
    if (!visible) return '';
    return `\x1b[${row + 1};${col + 1}H${color}${visible}${ANSI.reset}`;
  };

  const interval = animInterval(() => {
    tickNum++;
    let buf = '\x1b[2J';

    // Water surface
    const wave = tickNum % 2 === 0 ? '~  ~ ~~  ~ ' : ' ~ ~~  ~ ~ ';
    buf += `\x1b[${waterRow};1H${ANSI.cyan}${wave.repeat(Math.ceil(cols() / wave.length)).slice(0, cols())}${ANSI.reset}`;

    // Seaweed (kept off the bottom row, which belongs to the footer)
    for (const w of weeds) {
      for (let s = 0; s < w.h; s++) {
        const ch = (tickNum + s) % 2 === 0 ? '(' : ')';
        buf += `\x1b[${rows() - 1 - s};${w.x}H${ANSI.green}${ch}${ANSI.reset}`;
      }
    }

    // Fish
    for (let i = 0; i < fish.length; i++) {
      const f = fish[i];
      if (!f.slow || tickNum % 2 === 0) {
        f.x += f.vx;
      }
      if ((f.vx > 0 && f.x > cols()) || (f.vx < 0 && f.x < -f.sprite.length)) {
        fish[i] = spawnFish(true);
        continue;
      }
      // Occasionally exhale
      if (Math.random() < 0.03) {
        bubbles.push({ x: f.vx > 0 ? f.x + f.sprite.length - 1 : f.x, y: f.y - 1 });
      }
      buf += drawClipped(f.y, Math.round(f.x), f.sprite, f.color);
    }

    // Bubbles rise and pop at the surface
    bubbles = bubbles.filter(b => b.y > waterRow);
    for (const b of bubbles) {
      if (tickNum % 2 === 0) b.y--;
      if (b.y > waterRow && b.x >= 0 && b.x < cols()) {
        buf += `\x1b[${b.y + 1};${b.x + 1}H${ANSI.brightCyan}${b.y % 3 === 0 ? 'O' : 'o'}${ANSI.reset}`;
      }
    }

    // Footer
    buf += `\x1b[${rows()};1H${ANSI.dim} q to drain the tank${ANSI.reset}`;
    term.write(buf);
  }, 140);

  const exitAquarium = () => {
    animClear(interval);
    setInteractiveMode(null);
    term.write('\x1b[2J\x1b[H\x1b[?25h');
    term.writeln(`${ANSI.dim}(Tank drained. The fish will miss you.)${ANSI.reset}`);
    resetInput();
    writePrompt();
  };

  setInteractiveMode((data: string) => {
    const code = data.charCodeAt(0);
    if (data === 'q' || data === 'Q' || code === 3 || (code === 27 && data.length === 1)) {
      exitAquarium();
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
        animTimeout(next, steps[i].delay);
      } else {
        resetInput();
        writePrompt();
      }
    }
  };
  animTimeout(next, steps[0].delay || 200);
}
