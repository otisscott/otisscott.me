/**
 * Interactive Commands
 * Commands that take over the terminal (animations, full-screen modes).
 * Each returns a handler function for interactiveModeRef, or void for
 * fire-and-forget animations that manage their own lifecycle.
 */

import { Terminal as XTerm } from '@xterm/xterm';
import { ANSI } from '@/lib/filesystem/types';

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
      } else if (r === Math.floor(rows / 2)) {
        const line = 'type :q to exit';
        const pad = Math.max(0, Math.floor((cols - line.length) / 2));
        term.write(`${ANSI.bold}${ANSI.white}~${ANSI.reset}${' '.repeat(pad - 1)}${ANSI.dim}${line}${ANSI.reset}\r\n`);
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
