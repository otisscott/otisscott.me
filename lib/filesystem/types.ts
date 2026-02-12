/**
 * Filesystem Types
 * Defines the structure for the virtual filesystem
 */

export type FileType = 'file' | 'directory';

export interface FileNode {
  type: 'file';
  name: string;
  content: string;
  permissions: string;
  owner: string;
  group: string;
  size: number;
  modified: Date;
}

export interface DirectoryNode {
  type: 'directory';
  name: string;
  children: Map<string, FileSystemNode>;
  permissions: string;
  owner: string;
  group: string;
  modified: Date;
}

export type FileSystemNode = FileNode | DirectoryNode;

export interface FileSystemState {
  root: DirectoryNode;
  currentPath: string;
}

// ANSI color codes for terminal output
export const ANSI = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  italic: '\x1b[3m',
  underline: '\x1b[4m',

  // Foreground colors
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',

  // Bright foreground colors
  brightBlack: '\x1b[90m',
  brightRed: '\x1b[91m',
  brightGreen: '\x1b[92m',
  brightYellow: '\x1b[93m',
  brightBlue: '\x1b[94m',
  brightMagenta: '\x1b[95m',
  brightCyan: '\x1b[96m',
  brightWhite: '\x1b[97m',

  // Background colors
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m',
} as const;

// Pure prompt colors
export const PromptColors = {
  directory: '\x1b[36m',      // Cyan for current directory
  gitBranch: '\x1b[35m',      // Magenta for git branch
  nodeVersion: '\x1b[32m',    // Green for node version
  promptSymbol: '\x1b[36m',   // Cyan/teal for ❯ symbol
  error: '\x1b[31m',          // Red for error indicator
  reset: '\x1b[0m',
} as const;

// ANSI-aware string utilities
export function stripAnsi(str: string): string {
  return str.replace(/\x1b\[[0-9;]*m/g, '');
}

export function visibleLength(str: string): number {
  return stripAnsi(str).length;
}

export function padEndVisible(str: string, targetLen: number): string {
  const pad = targetLen - visibleLength(str);
  return pad > 0 ? str + ' '.repeat(pad) : str;
}
