/**
 * Terminal Color Themes
 * Each theme provides dark and light variants with xterm.js colors and CSS variable overrides
 */

export interface ThemeVariant {
  xterm: {
    foreground: string;
    background: string;
    cursor: string;
    cursorAccent: string;
    selectionBackground: string;
    selectionForeground: string;
    black: string;
    red: string;
    green: string;
    yellow: string;
    blue: string;
    magenta: string;
    cyan: string;
    white: string;
    brightBlack: string;
    brightRed: string;
    brightGreen: string;
    brightYellow: string;
    brightBlue: string;
    brightMagenta: string;
    brightCyan: string;
    brightWhite: string;
  };
  css: {
    bgPrimary: string;
    bgSecondary: string;
    bgTertiary: string;
  };
}

export interface TerminalTheme {
  name: string;
  dark: ThemeVariant;
  light: ThemeVariant;
}

export const themes: Record<string, TerminalTheme> = {
  'tokyo-night': {
    name: 'Tokyo Night',
    dark: {
      xterm: {
        foreground: '#a9b1d6',
        background: '#1a1b26',
        cursor: '#c0caf5',
        cursorAccent: '#1a1b26',
        selectionBackground: '#24283b',
        selectionForeground: '#c0caf5',
        black: '#16161e',
        red: '#f7768e',
        green: '#9ece6a',
        yellow: '#e0af68',
        blue: '#7aa2f7',
        magenta: '#ff007c',
        cyan: '#7dcfff',
        white: '#a9b1d6',
        brightBlack: '#565f89',
        brightRed: '#f7768e',
        brightGreen: '#9ece6a',
        brightYellow: '#e0af68',
        brightBlue: '#7aa2f7',
        brightMagenta: '#bb9af7',
        brightCyan: '#7dcfff',
        brightWhite: '#c0caf5',
      },
      css: {
        bgPrimary: '#1a1b26',
        bgSecondary: '#16161e',
        bgTertiary: '#24283b',
      },
    },
    light: {
      xterm: {
        foreground: '#343b58',
        background: '#d5d6db',
        cursor: '#343b58',
        cursorAccent: '#d5d6db',
        selectionBackground: '#b6b8c3',
        selectionForeground: '#343b58',
        black: '#0f0f14',
        red: '#8c4351',
        green: '#485e30',
        yellow: '#8f5e15',
        blue: '#34548a',
        magenta: '#5a4a78',
        cyan: '#0f4b6e',
        white: '#343b58',
        brightBlack: '#9699a3',
        brightRed: '#8c4351',
        brightGreen: '#485e30',
        brightYellow: '#8f5e15',
        brightBlue: '#34548a',
        brightMagenta: '#5a4a78',
        brightCyan: '#0f4b6e',
        brightWhite: '#1a1b26',
      },
      css: {
        bgPrimary: '#d5d6db',
        bgSecondary: '#cbccd1',
        bgTertiary: '#b6b8c3',
      },
    },
  },
  'dracula': {
    name: 'Dracula',
    dark: {
      xterm: {
        foreground: '#f8f8f2',
        background: '#282a36',
        cursor: '#f8f8f2',
        cursorAccent: '#282a36',
        selectionBackground: '#44475a',
        selectionForeground: '#f8f8f2',
        black: '#21222c',
        red: '#ff5555',
        green: '#50fa7b',
        yellow: '#f1fa8c',
        blue: '#bd93f9',
        magenta: '#ff79c6',
        cyan: '#8be9fd',
        white: '#f8f8f2',
        brightBlack: '#6272a4',
        brightRed: '#ff6e6e',
        brightGreen: '#69ff94',
        brightYellow: '#ffffa5',
        brightBlue: '#d6acff',
        brightMagenta: '#ff92df',
        brightCyan: '#a4ffff',
        brightWhite: '#ffffff',
      },
      css: {
        bgPrimary: '#282a36',
        bgSecondary: '#21222c',
        bgTertiary: '#44475a',
      },
    },
    light: {
      xterm: {
        foreground: '#282a36',
        background: '#f8f8f2',
        cursor: '#282a36',
        cursorAccent: '#f8f8f2',
        selectionBackground: '#e2e2dc',
        selectionForeground: '#282a36',
        black: '#282a36',
        red: '#d63838',
        green: '#30a14e',
        yellow: '#b08800',
        blue: '#7c5ec3',
        magenta: '#d3508c',
        cyan: '#26889e',
        white: '#f8f8f2',
        brightBlack: '#6272a4',
        brightRed: '#d63838',
        brightGreen: '#30a14e',
        brightYellow: '#b08800',
        brightBlue: '#7c5ec3',
        brightMagenta: '#d3508c',
        brightCyan: '#26889e',
        brightWhite: '#ffffff',
      },
      css: {
        bgPrimary: '#f8f8f2',
        bgSecondary: '#ededea',
        bgTertiary: '#e2e2dc',
      },
    },
  },
  'gruvbox': {
    name: 'Gruvbox',
    dark: {
      xterm: {
        foreground: '#ebdbb2',
        background: '#282828',
        cursor: '#ebdbb2',
        cursorAccent: '#282828',
        selectionBackground: '#3c3836',
        selectionForeground: '#ebdbb2',
        black: '#1d2021',
        red: '#fb4934',
        green: '#b8bb26',
        yellow: '#fabd2f',
        blue: '#83a598',
        magenta: '#d3869b',
        cyan: '#8ec07c',
        white: '#ebdbb2',
        brightBlack: '#928374',
        brightRed: '#fb4934',
        brightGreen: '#b8bb26',
        brightYellow: '#fabd2f',
        brightBlue: '#83a598',
        brightMagenta: '#d3869b',
        brightCyan: '#8ec07c',
        brightWhite: '#fbf1c7',
      },
      css: {
        bgPrimary: '#282828',
        bgSecondary: '#1d2021',
        bgTertiary: '#3c3836',
      },
    },
    light: {
      xterm: {
        foreground: '#3c3836',
        background: '#fbf1c7',
        cursor: '#3c3836',
        cursorAccent: '#fbf1c7',
        selectionBackground: '#d5c4a1',
        selectionForeground: '#3c3836',
        black: '#3c3836',
        red: '#9d0006',
        green: '#79740e',
        yellow: '#b57614',
        blue: '#076678',
        magenta: '#8f3f71',
        cyan: '#427b58',
        white: '#fbf1c7',
        brightBlack: '#928374',
        brightRed: '#9d0006',
        brightGreen: '#79740e',
        brightYellow: '#b57614',
        brightBlue: '#076678',
        brightMagenta: '#8f3f71',
        brightCyan: '#427b58',
        brightWhite: '#f9f5d7',
      },
      css: {
        bgPrimary: '#fbf1c7',
        bgSecondary: '#f2e5bc',
        bgTertiary: '#d5c4a1',
      },
    },
  },
  'nord': {
    name: 'Nord',
    dark: {
      xterm: {
        foreground: '#d8dee9',
        background: '#2e3440',
        cursor: '#d8dee9',
        cursorAccent: '#2e3440',
        selectionBackground: '#434c5e',
        selectionForeground: '#eceff4',
        black: '#3b4252',
        red: '#bf616a',
        green: '#a3be8c',
        yellow: '#ebcb8b',
        blue: '#81a1c1',
        magenta: '#b48ead',
        cyan: '#88c0d0',
        white: '#e5e9f0',
        brightBlack: '#4c566a',
        brightRed: '#bf616a',
        brightGreen: '#a3be8c',
        brightYellow: '#ebcb8b',
        brightBlue: '#81a1c1',
        brightMagenta: '#b48ead',
        brightCyan: '#8ecadb',
        brightWhite: '#eceff4',
      },
      css: {
        bgPrimary: '#2e3440',
        bgSecondary: '#272c36',
        bgTertiary: '#434c5e',
      },
    },
    light: {
      xterm: {
        foreground: '#2e3440',
        background: '#eceff4',
        cursor: '#2e3440',
        cursorAccent: '#eceff4',
        selectionBackground: '#d8dee9',
        selectionForeground: '#2e3440',
        black: '#2e3440',
        red: '#bf616a',
        green: '#a3be8c',
        yellow: '#d08770',
        blue: '#5e81ac',
        magenta: '#b48ead',
        cyan: '#88c0d0',
        white: '#eceff4',
        brightBlack: '#4c566a',
        brightRed: '#bf616a',
        brightGreen: '#a3be8c',
        brightYellow: '#d08770',
        brightBlue: '#5e81ac',
        brightMagenta: '#b48ead',
        brightCyan: '#88c0d0',
        brightWhite: '#e5e9f0',
      },
      css: {
        bgPrimary: '#eceff4',
        bgSecondary: '#e5e9f0',
        bgTertiary: '#d8dee9',
      },
    },
  },
  'monokai': {
    name: 'Monokai',
    dark: {
      xterm: {
        foreground: '#f8f8f2',
        background: '#272822',
        cursor: '#f8f8f0',
        cursorAccent: '#272822',
        selectionBackground: '#49483e',
        selectionForeground: '#f8f8f2',
        black: '#272822',
        red: '#f92672',
        green: '#a6e22e',
        yellow: '#f4bf75',
        blue: '#66d9ef',
        magenta: '#ae81ff',
        cyan: '#a1efe4',
        white: '#f8f8f2',
        brightBlack: '#75715e',
        brightRed: '#f92672',
        brightGreen: '#a6e22e',
        brightYellow: '#f4bf75',
        brightBlue: '#66d9ef',
        brightMagenta: '#ae81ff',
        brightCyan: '#a1efe4',
        brightWhite: '#f9f8f5',
      },
      css: {
        bgPrimary: '#272822',
        bgSecondary: '#1e1f1c',
        bgTertiary: '#49483e',
      },
    },
    light: {
      xterm: {
        foreground: '#272822',
        background: '#fafafa',
        cursor: '#272822',
        cursorAccent: '#fafafa',
        selectionBackground: '#e0e0e0',
        selectionForeground: '#272822',
        black: '#272822',
        red: '#c4265e',
        green: '#86b300',
        yellow: '#b3780a',
        blue: '#2e97c7',
        magenta: '#8c54c7',
        cyan: '#5fa2a0',
        white: '#fafafa',
        brightBlack: '#75715e',
        brightRed: '#c4265e',
        brightGreen: '#86b300',
        brightYellow: '#b3780a',
        brightBlue: '#2e97c7',
        brightMagenta: '#8c54c7',
        brightCyan: '#5fa2a0',
        brightWhite: '#f5f5f5',
      },
      css: {
        bgPrimary: '#fafafa',
        bgSecondary: '#f0f0f0',
        bgTertiary: '#e0e0e0',
      },
    },
  },
  'solarized': {
    name: 'Solarized',
    dark: {
      xterm: {
        foreground: '#839496',
        background: '#002b36',
        cursor: '#839496',
        cursorAccent: '#002b36',
        selectionBackground: '#073642',
        selectionForeground: '#93a1a1',
        black: '#073642',
        red: '#dc322f',
        green: '#859900',
        yellow: '#b58900',
        blue: '#268bd2',
        magenta: '#d33682',
        cyan: '#2aa198',
        white: '#eee8d5',
        brightBlack: '#586e75',
        brightRed: '#cb4b16',
        brightGreen: '#859900',
        brightYellow: '#b58900',
        brightBlue: '#268bd2',
        brightMagenta: '#6c71c4',
        brightCyan: '#2aa198',
        brightWhite: '#fdf6e3',
      },
      css: {
        bgPrimary: '#002b36',
        bgSecondary: '#001f27',
        bgTertiary: '#073642',
      },
    },
    light: {
      xterm: {
        foreground: '#657b83',
        background: '#fdf6e3',
        cursor: '#657b83',
        cursorAccent: '#fdf6e3',
        selectionBackground: '#eee8d5',
        selectionForeground: '#586e75',
        black: '#073642',
        red: '#dc322f',
        green: '#859900',
        yellow: '#b58900',
        blue: '#268bd2',
        magenta: '#d33682',
        cyan: '#2aa198',
        white: '#eee8d5',
        brightBlack: '#586e75',
        brightRed: '#cb4b16',
        brightGreen: '#859900',
        brightYellow: '#b58900',
        brightBlue: '#268bd2',
        brightMagenta: '#6c71c4',
        brightCyan: '#2aa198',
        brightWhite: '#fdf6e3',
      },
      css: {
        bgPrimary: '#fdf6e3',
        bgSecondary: '#eee8d5',
        bgTertiary: '#ddd6c1',
      },
    },
  },
};

export type ColorMode = 'dark' | 'light';

export const themeNames = Object.keys(themes);
