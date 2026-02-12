/**
 * Filesystem Utilities
 * Helper functions for navigating and interacting with the virtual filesystem
 */

import { DirectoryNode, FileNode, FileSystemNode, ANSI } from './types';
import { rootDirectory } from './data';

export class FileSystem {
  private root: DirectoryNode;
  private currentPath: string[];

  constructor() {
    this.root = rootDirectory;
    this.currentPath = [];
  }

  getCurrentPath(): string {
    if (this.currentPath.length === 0) {
      return '~';
    }
    return '~/' + this.currentPath.join('/');
  }

  getCurrentDirectory(): DirectoryNode {
    let current: DirectoryNode = this.root;
    for (const segment of this.currentPath) {
      const next = current.children.get(segment);
      if (!next || next.type !== 'directory') {
        throw new Error(`Invalid path: ${segment}`);
      }
      current = next;
    }
    return current;
  }

  getNodeAtPath(path: string): FileSystemNode | null {
    const segments = this.resolvePath(path);
    let current: FileSystemNode = this.root;

    for (const segment of segments) {
      if (current.type !== 'directory') {
        return null;
      }
      const next = current.children.get(segment);
      if (!next) {
        return null;
      }
      current = next;
    }

    return current;
  }

  resolvePath(path: string): string[] {
    if (path.startsWith('/')) {
      // Absolute path from root
      return path.slice(1).split('/').filter(Boolean);
    } else if (path.startsWith('~')) {
      // Home directory
      return path.slice(1).split('/').filter(Boolean);
    } else {
      // Relative path
      return [...this.currentPath, ...path.split('/').filter(Boolean)];
    }
  }

  normalizePath(segments: string[]): string[] {
    const result: string[] = [];
    for (const segment of segments) {
      if (segment === '..') {
        result.pop();
      } else if (segment !== '.' && segment !== '') {
        result.push(segment);
      }
    }
    return result;
  }

  changeDirectory(path: string): boolean {
    if (path === '~' || path === '') {
      this.currentPath = [];
      return true;
    }

    const segments = this.normalizePath(this.resolvePath(path));
    let current: DirectoryNode = this.root;

    for (const segment of segments) {
      const next = current.children.get(segment);
      if (!next) {
        return false;
      }
      if (next.type !== 'directory') {
        return false;
      }
      current = next;
    }

    this.currentPath = segments;
    return true;
  }

  listDirectory(path?: string, options: { all?: boolean; long?: boolean; tree?: boolean } = {}): string {
    let targetDir: DirectoryNode;

    if (path) {
      const node = this.getNodeAtPath(path);
      if (!node) {
        return `${ANSI.red}ls: cannot access '${path}': No such file or directory${ANSI.reset}`;
      }
      if (node.type !== 'directory') {
        return `${ANSI.red}ls: cannot access '${path}': Not a directory${ANSI.reset}`;
      }
      targetDir = node;
    } else {
      targetDir = this.getCurrentDirectory();
    }

    if (options.tree) {
      return this.renderTree(targetDir, '', true);
    }

    const entries = Array.from(targetDir.children.entries());

    if (entries.length === 0) {
      return '';
    }

    if (options.long) {
      return entries
        .filter(([name]) => options.all || !name.startsWith('.'))
        .map(([name, node]) => {
          const perms = node.permissions;
          const owner = node.owner.padEnd(8);
          const group = node.group.padEnd(8);
          const size = node.type === 'file' ? String(node.size).padStart(8) : '-'.padStart(8);
          const date = node.modified.toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
          });
          const color = node.type === 'directory' ? ANSI.blue : ANSI.white;
          return `${perms} ${owner} ${group} ${size} ${date} ${color}${name}${ANSI.reset}`;
        })
        .join('\n');
    }

    return entries
      .filter(([name]) => options.all || !name.startsWith('.'))
      .map(([name, node]) => {
        if (node.type === 'directory') {
          return `${ANSI.blue}${name}/${ANSI.reset}`;
        }
        return name;
      })
      .join('  ');
  }

  private renderTree(dir: DirectoryNode, prefix: string, isLast: boolean): string {
    const entries = Array.from(dir.children.entries());
    let result = '';

    entries.forEach(([name, node], index) => {
      const isLastEntry = index === entries.length - 1;
      const connector = isLastEntry ? '└── ' : '├── ';
      const color = node.type === 'directory' ? ANSI.blue : ANSI.white;
      result += `${prefix}${connector}${color}${name}${ANSI.reset}\n`;

      if (node.type === 'directory') {
        const newPrefix = prefix + (isLastEntry ? '    ' : '│   ');
        result += this.renderTree(node, newPrefix, isLastEntry);
      }
    });

    return result;
  }

  readFile(path: string): string | null {
    const node = this.getNodeAtPath(path);
    if (!node) {
      return null;
    }
    if (node.type !== 'file') {
      return null;
    }
    return node.content;
  }

  getAllPaths(): string[] {
    const paths: string[] = [];
    const traverse = (dir: DirectoryNode, prefix: string) => {
      for (const [name, node] of dir.children) {
        const fullPath = prefix ? `${prefix}/${name}` : name;
        paths.push(fullPath);
        if (node.type === 'directory') {
          traverse(node, fullPath);
        }
      }
    };
    traverse(this.root, '');
    return paths;
  }

  getCompletions(partial: string): string[] {
    const lastSlashIndex = partial.lastIndexOf('/');
    const dirPath = lastSlashIndex >= 0 ? partial.slice(0, lastSlashIndex) : '';
    const filePrefix = lastSlashIndex >= 0 ? partial.slice(lastSlashIndex + 1) : partial;

    let targetDir: DirectoryNode;
    if (dirPath === '' || dirPath === '.') {
      targetDir = this.getCurrentDirectory();
    } else if (dirPath === '~') {
      targetDir = this.root;
    } else {
      const node = this.getNodeAtPath(dirPath);
      if (!node || node.type !== 'directory') {
        return [];
      }
      targetDir = node;
    }

    const matches: string[] = [];
    for (const [name, node] of targetDir.children) {
      if (name.startsWith(filePrefix)) {
        const fullPath = dirPath ? `${dirPath}/${name}` : name;
        matches.push(node.type === 'directory' ? `${fullPath}/` : fullPath);
      }
    }

    return matches;
  }
}

// Singleton instance
export const fileSystem = new FileSystem();
