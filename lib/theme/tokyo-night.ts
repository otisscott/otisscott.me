/**
 * Tokyo Night Theme Colors
 * Based on the popular Tokyo Night VS Code theme
 * https://github.com/enkia/tokyo-night-vscode-theme
 */

export const tokyoNightColors = {
  // Background & Foreground
  bgPrimary: '#1a1b26',      // Main terminal background
  bgSecondary: '#16161e',    // Darker sections, status bar
  bgTertiary: '#24283b',     // Lighter background elements
  fgPrimary: '#a9b1d6',      // Default text color
  fgSecondary: '#565f89',    // Comments, dim text
  fgBright: '#c0caf5',       // Bright text

  // Accent Colors
  red: '#f7768e',            // Errors, deletions
  orange: '#ff9e64',         // Warnings, highlights
  yellow: '#e0af68',         // Cautions, strings
  green: '#9ece6a',          // Success, additions
  teal: '#73daca',           // Prompt user, info
  cyan: '#7dcfff',           // Links, highlights
  blue: '#7aa2f7',           // Directories, primary
  purple: '#bb9af7',         // Keywords, special
  magenta: '#ff007c',        // Git branch, magenta
  white: '#c0caf5',          // Bright white

  // Terminal Chrome (Window Frame)
  chromeClose: '#ff5f56',
  chromeMinimize: '#ffbd2e',
  chromeMaximize: '#27c93f',
} as const;

// CSS Custom Properties for use in global CSS
export const tokyoNightCSSVariables = `
  /* Background & Foreground */
  --bg-primary: ${tokyoNightColors.bgPrimary};
  --bg-secondary: ${tokyoNightColors.bgSecondary};
  --bg-tertiary: ${tokyoNightColors.bgTertiary};
  --fg-primary: ${tokyoNightColors.fgPrimary};
  --fg-secondary: ${tokyoNightColors.fgSecondary};
  --fg-bright: ${tokyoNightColors.fgBright};

  /* Accent Colors */
  --color-red: ${tokyoNightColors.red};
  --color-orange: ${tokyoNightColors.orange};
  --color-yellow: ${tokyoNightColors.yellow};
  --color-green: ${tokyoNightColors.green};
  --color-teal: ${tokyoNightColors.teal};
  --color-cyan: ${tokyoNightColors.cyan};
  --color-blue: ${tokyoNightColors.blue};
  --color-purple: ${tokyoNightColors.purple};
  --color-magenta: ${tokyoNightColors.magenta};
  --color-white: ${tokyoNightColors.white};

  /* Terminal Chrome */
  --chrome-close: ${tokyoNightColors.chromeClose};
  --chrome-minimize: ${tokyoNightColors.chromeMinimize};
  --chrome-maximize: ${tokyoNightColors.chromeMaximize};
`;

// xterm.js theme object matching ITheme interface
export const xtermTheme = {
  foreground: tokyoNightColors.fgPrimary,
  background: tokyoNightColors.bgPrimary,
  cursor: tokyoNightColors.fgBright,
  cursorAccent: tokyoNightColors.bgPrimary,
  selectionBackground: tokyoNightColors.bgTertiary,
  selectionForeground: tokyoNightColors.fgBright,
  
  // ANSI colors (0-15)
  black: tokyoNightColors.bgSecondary,
  red: tokyoNightColors.red,
  green: tokyoNightColors.green,
  yellow: tokyoNightColors.yellow,
  blue: tokyoNightColors.blue,
  magenta: tokyoNightColors.magenta,
  cyan: tokyoNightColors.cyan,
  white: tokyoNightColors.fgPrimary,
  
  brightBlack: tokyoNightColors.fgSecondary,
  brightRed: tokyoNightColors.red,
  brightGreen: tokyoNightColors.green,
  brightYellow: tokyoNightColors.yellow,
  brightBlue: tokyoNightColors.blue,
  brightMagenta: tokyoNightColors.purple,
  brightCyan: tokyoNightColors.cyan,
  brightWhite: tokyoNightColors.fgBright,
};
