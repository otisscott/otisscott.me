(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/theme/tokyo-night.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Tokyo Night Theme Colors
 * Based on the popular Tokyo Night VS Code theme
 * https://github.com/enkia/tokyo-night-vscode-theme
 */ __turbopack_context__.s([
    "tokyoNightCSSVariables",
    ()=>tokyoNightCSSVariables,
    "tokyoNightColors",
    ()=>tokyoNightColors,
    "xtermTheme",
    ()=>xtermTheme
]);
const tokyoNightColors = {
    // Background & Foreground
    bgPrimary: '#1a1b26',
    bgSecondary: '#16161e',
    bgTertiary: '#24283b',
    fgPrimary: '#a9b1d6',
    fgSecondary: '#565f89',
    fgBright: '#c0caf5',
    // Accent Colors
    red: '#f7768e',
    orange: '#ff9e64',
    yellow: '#e0af68',
    green: '#9ece6a',
    teal: '#73daca',
    cyan: '#7dcfff',
    blue: '#7aa2f7',
    purple: '#bb9af7',
    magenta: '#ff007c',
    white: '#c0caf5',
    // Terminal Chrome (Window Frame)
    chromeClose: '#ff5f56',
    chromeMinimize: '#ffbd2e',
    chromeMaximize: '#27c93f'
};
const tokyoNightCSSVariables = `
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
const xtermTheme = {
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
    brightWhite: tokyoNightColors.fgBright
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/filesystem/types.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Filesystem Types
 * Defines the structure for the virtual filesystem
 */ __turbopack_context__.s([
    "ANSI",
    ()=>ANSI,
    "PromptColors",
    ()=>PromptColors
]);
const ANSI = {
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
    bgWhite: '\x1b[47m'
};
const PromptColors = {
    directory: '\x1b[36m',
    gitBranch: '\x1b[35m',
    nodeVersion: '\x1b[32m',
    promptSymbol: '\x1b[36m',
    error: '\x1b[31m',
    reset: '\x1b[0m'
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/filesystem/data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Filesystem Data
 * Virtual filesystem content for the terminal
 */ __turbopack_context__.s([
    "NODE_VERSION",
    ()=>NODE_VERSION,
    "fakeCommits",
    ()=>fakeCommits,
    "rootDirectory",
    ()=>rootDirectory
]);
function createFile(name, content, options = {}) {
    return {
        type: 'file',
        name,
        content,
        permissions: options.permissions ?? '-rw-r--r--',
        owner: options.owner ?? 'otis',
        group: options.group ?? 'staff',
        size: options.size ?? content.length,
        modified: options.modified ?? new Date('2025-01-15')
    };
}
function createDirectory(name, children = [], options = {}) {
    const childrenMap = new Map();
    children.forEach((child)=>{
        childrenMap.set(child.name, child);
    });
    return {
        type: 'directory',
        name,
        children: childrenMap,
        permissions: options.permissions ?? 'drwxr-xr-x',
        owner: options.owner ?? 'otis',
        group: options.group ?? 'staff',
        modified: options.modified ?? new Date('2025-01-15')
    };
}
const rootDirectory = createDirectory('', [
    createDirectory('about', [
        createFile('whoami.txt', `╔════════════════════════════════════════════════════════════════╗
║  Otis Scott                                                    ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  Software Engineer • Open Source Enthusiast • Terminal Addict  ║
║                                                                ║
║  Currently building things that live on the web. I enjoy       ║
║  clean code, fast terminals, and solving interesting problems. ║
║                                                                ║
║  When I'm not coding, you'll find me exploring new tools,      ║
║  contributing to open source, or tinkering with my dotfiles.   ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝`),
        createFile('bio.md', `# About Me

Hello! I'm **Otis Scott**, a software engineer who believes the command line is the highest form of user interface.

## What I Do

I build web applications, developer tools, and occasionally things that make people say "wait, you built that in a terminal?"

## Philosophy

- **Simplicity over complexity** - The best code is no code
- **Terminal-first** - If it can be done in a CLI, it should be
- **Open source everything** - Knowledge wants to be free

## Fun Facts

- My dotfiles are probably over-engineered
- I have strong opinions about shell prompts
- This website is a terminal because why not?

> "The terminal is not a step backward—it's a leap toward control."
`),
        createFile('interests.txt', `Things I'm Into:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Terminal emulators & CLI tools
• Open source software
• Web development (React, Next.js, TypeScript)
• Developer experience & tooling
• Minimalist design
• Mechanical keyboards
• Self-hosting & homelabs
• Neovim (btw)`)
    ]),
    createDirectory('work', [
        createDirectory('experience', [
            createFile('senior-engineer.md', `# Senior Software Engineer
## TechCorp Industries

📅 2023 - Present

Leading a team of 5 engineers building the company's core platform.

### Responsibilities
- Architected and deployed microservices infrastructure
- Reduced API latency by 40% through optimization efforts
- Mentored junior developers and established code review practices
- Implemented CI/CD pipelines reducing deployment time by 60%

### Technologies
TypeScript, Node.js, PostgreSQL, Docker, Kubernetes, AWS`),
            createFile('fullstack-dev.md', `# Full Stack Developer
## StartupXYZ

📅 2021 - 2023

Joined as employee #10, helped scale the platform to 100K+ users.

### Achievements
- Built real-time collaboration features using WebSockets
- Implemented authentication system supporting OAuth, SAML, SSO
- Optimized database queries reducing load times by 50%
- Led migration from REST to GraphQL

### Technologies
React, TypeScript, Python, FastAPI, Redis, PostgreSQL`),
            createFile('junior-dev.md', `# Junior Developer
## WebAgency Pro

📅 2019 - 2021

Started my professional journey building websites for clients.

### Experience
- Developed 20+ client websites using modern frameworks
- Collaborated with designers to implement pixel-perfect UIs
- Maintained and updated legacy PHP applications
- Learned the importance of testing and documentation

### Technologies
JavaScript, PHP, Laravel, Vue.js, MySQL, WordPress`)
        ]),
        createFile('skills.json', JSON.stringify({
            languages: {
                icon: "💻",
                items: [
                    {
                        name: "TypeScript",
                        level: "expert",
                        years: 5
                    },
                    {
                        name: "JavaScript",
                        level: "expert",
                        years: 6
                    },
                    {
                        name: "Python",
                        level: "proficient",
                        years: 4
                    },
                    {
                        name: "Go",
                        level: "proficient",
                        years: 2
                    },
                    {
                        name: "Rust",
                        level: "learning",
                        years: 1
                    },
                    {
                        name: "SQL",
                        level: "proficient",
                        years: 5
                    }
                ]
            },
            frontend: {
                icon: "🎨",
                items: [
                    {
                        name: "React",
                        level: "expert",
                        years: 5
                    },
                    {
                        name: "Next.js",
                        level: "expert",
                        years: 4
                    },
                    {
                        name: "TypeScript",
                        level: "expert",
                        years: 5
                    },
                    {
                        name: "Tailwind CSS",
                        level: "expert",
                        years: 3
                    },
                    {
                        name: "Vue.js",
                        level: "proficient",
                        years: 2
                    },
                    {
                        name: "HTML/CSS",
                        level: "expert",
                        years: 6
                    }
                ]
            },
            backend: {
                icon: "⚙️",
                items: [
                    {
                        name: "Node.js",
                        level: "expert",
                        years: 5
                    },
                    {
                        name: "PostgreSQL",
                        level: "proficient",
                        years: 4
                    },
                    {
                        name: "Redis",
                        level: "proficient",
                        years: 3
                    },
                    {
                        name: "GraphQL",
                        level: "proficient",
                        years: 3
                    },
                    {
                        name: "FastAPI",
                        level: "proficient",
                        years: 2
                    },
                    {
                        name: "MongoDB",
                        level: "familiar",
                        years: 2
                    }
                ]
            },
            devops: {
                icon: "🚀",
                items: [
                    {
                        name: "Docker",
                        level: "proficient",
                        years: 4
                    },
                    {
                        name: "Kubernetes",
                        level: "familiar",
                        years: 2
                    },
                    {
                        name: "AWS",
                        level: "proficient",
                        years: 3
                    },
                    {
                        name: "CI/CD",
                        level: "proficient",
                        years: 4
                    },
                    {
                        name: "Terraform",
                        level: "familiar",
                        years: 2
                    },
                    {
                        name: "Linux",
                        level: "proficient",
                        years: 5
                    }
                ]
            },
            tools: {
                icon: "🛠️",
                items: [
                    {
                        name: "Git",
                        level: "expert",
                        years: 6
                    },
                    {
                        name: "Neovim",
                        level: "expert",
                        years: 3
                    },
                    {
                        name: "VS Code",
                        level: "expert",
                        years: 5
                    },
                    {
                        name: "Figma",
                        level: "proficient",
                        years: 3
                    },
                    {
                        name: "Postman",
                        level: "proficient",
                        years: 4
                    },
                    {
                        name: "Jest/Vitest",
                        level: "proficient",
                        years: 4
                    }
                ]
            }
        }, null, 2))
    ]),
    createDirectory('contact', [
        createFile('email.txt', `📧 Email Contact
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

hello@otisscott.me

For inquiries about:
  • Freelance work & consulting
  • Collaboration opportunities
  • Speaking engagements
  • Just saying hi 👋

Response time: Usually within 24-48 hours`),
        createFile('social.json', JSON.stringify({
            github: {
                url: "github.com/otisscott",
                handle: "@otisscott",
                description: "Code, dotfiles, and open source contributions"
            },
            twitter: {
                url: "twitter.com/otisscott",
                handle: "@otisscott",
                description: "Hot takes on tech, occasional shitposts"
            },
            linkedin: {
                url: "linkedin.com/in/otisscott",
                handle: "Otis Scott",
                description: "Professional networking & career updates"
            },
            bluesky: {
                url: "bsky.app/profile/otisscott.me",
                handle: "@otisscott.me",
                description: "The better Twitter"
            },
            mastodon: {
                url: "fosstodon.org/@otisscott",
                handle: "@otisscott@fosstodon.org",
                description: "Decentralized social (I should post here more)"
            }
        }, null, 2))
    ]),
    createDirectory('projects', [
        createFile('terminal-portfolio.md', `# Terminal Portfolio

**This website!**

A terminal-inspired portfolio built with Next.js and xterm.js.

## Features
- Full terminal emulation with xterm.js
- Virtual filesystem with navigation
- Syntax highlighting for code files
- Pure prompt styling
- Easter eggs (try \`neofetch\` or \`cowsay\`!)

## Tech Stack
- Next.js 16
- React 19
- TypeScript
- xterm.js
- Tokyo Night theme

🔗 github.com/otisscott/terminal-portfolio`),
        createFile('cli-tool.md', `# DevCLI

A command-line tool for common developer workflows.

## What It Does
- Project scaffolding with templates
- Git workflow automation
- Environment setup and configuration
- Deployment helpers

## Installation
\`\`\`bash
npm install -g @otisscott/devcli
\`\`\`

## Usage
\`\`\`bash
devcli init my-project --template nextjs
devcli deploy --env production
\`\`\`

🔗 github.com/otisscott/devcli`),
        createFile('vscode-extension.md', `# Tokyo Night Enhanced

A VS Code theme based on Tokyo Night with additional language support.

## Features
- Enhanced syntax highlighting for 20+ languages
- Semantic token support
- Custom file icon theme
- Matching terminal theme

## Install
Search "Tokyo Night Enhanced" in VS Code extensions.

🔗 marketplace.visualstudio.com/items?itemName=otisscott.tokyo-night-enhanced`),
        createFile('open-source.md', `# Open Source Contributions

## Projects I Maintain
- **termcolors** - Terminal color scheme converter
- **git-aliases** - Sensible git aliases collection
- **dotfiles** - My personal dotfiles (heavily commented)

## Projects I've Contributed To
- neovim/neovim - Documentation improvements
- withastro/astro - Bug fixes
- vercel/next.js - Examples and docs

## Philosophy
I believe in giving back to the tools that make my work possible.

🔗 github.com/otisscott`)
    ]),
    createDirectory('blog', [
        createDirectory('2025', [
            createFile('why-terminal-uis.md', `# Why I Built a Terminal UI for My Portfolio

*Published: January 2025*

The web has become heavy. Every portfolio site is a React app with 50MB of JavaScript, 5 different animation libraries, and a loading spinner that spins for 3 seconds.

I wanted something different...

[Read more - coming soon]`),
            createFile('neovim-setup.md', `# My Neovim Configuration in 2025

*Published: January 2025*

After 3 years of tweaking, I've finally reached a setup I'm happy with. Here's what I'm using...

[Read more - coming soon]`)
        ])
    ]),
    createDirectory('misc', [
        createFile('.hidden-config', `# Hidden Configuration

This is a hidden file that only appears with ls -a`),
        createFile('now.txt', `# Now

What I'm currently focused on:

## Work
• Building developer tools at TechCorp
• Leading platform architecture decisions

## Side Projects
• This terminal portfolio
• A CLI tool for common dev workflows
• Learning Rust (slowly but surely)

## Reading
• "Designing Data-Intensive Applications"
• Various technical blogs and RFCs

## Listening
• Syntax.fm
• The Changelog
• Various lo-fi playlists while coding

Last updated: January 2025`),
        createFile('uses.txt', `# Uses

## Hardware
• MacBook Pro 16" (M3 Max)
• Keychron Q1 Pro (Gateron Brown)
• LG UltraFine 5K Display
• AirPods Pro 2
• Logitech MX Master 3S

## Software
• Neovim (primary editor)
• VS Code (for pair programming)
• iTerm2 (terminal)
• Arc (browser)
• Linear (project management)
• Raycast (launcher)

## Dev Tools
• fish shell
• tmux
• fzf
• ripgrep
• fd
• bat

## Services
• GitHub
• Vercel
• Linear
• Figma`),
        createFile('colophon.md', `# Colophon

This site is built with:

- **Next.js 16** - React framework
- **xterm.js** - Terminal emulator
- **TypeScript** - Type safety
- **Tokyo Night** - Color theme

## Typography
- Monospace: JetBrains Mono / SF Mono

## Hosting
Deployed on Vercel with automatic deployments from GitHub.

## Inspiration
- wttr.in - Weather in the terminal
- github.com/chubin - Terminal services
- All the terminal enthusiasts out there

---

Made with ⌨️ and ☕ by Otis Scott`)
    ])
]);
const fakeCommits = [
    {
        hash: 'a1b2c3d',
        message: 'feat: add neofetch easter egg',
        date: '2025-02-10',
        author: 'Otis Scott'
    },
    {
        hash: 'e4f5g6h',
        message: 'feat: implement tab completion',
        date: '2025-02-09',
        author: 'Otis Scott'
    },
    {
        hash: 'i7j8k9l',
        message: 'style: pure prompt styling',
        date: '2025-02-08',
        author: 'Otis Scott'
    },
    {
        hash: 'm0n1o2p',
        message: 'feat: add filesystem navigation commands',
        date: '2025-02-07',
        author: 'Otis Scott'
    },
    {
        hash: 'q3r4s5t',
        message: 'feat: initial terminal setup',
        date: '2025-02-06',
        author: 'Otis Scott'
    },
    {
        hash: 'u6v7w8x',
        message: 'chore: project setup with next.js',
        date: '2025-02-05',
        author: 'Otis Scott'
    }
];
const NODE_VERSION = 'v20.11.0';
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/filesystem/index.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FileSystem",
    ()=>FileSystem,
    "fileSystem",
    ()=>fileSystem
]);
/**
 * Filesystem Utilities
 * Helper functions for navigating and interacting with the virtual filesystem
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/filesystem/types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/filesystem/data.ts [app-client] (ecmascript)");
;
;
class FileSystem {
    root;
    currentPath;
    constructor(){
        this.root = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rootDirectory"];
        this.currentPath = [];
    }
    getCurrentPath() {
        if (this.currentPath.length === 0) {
            return '~';
        }
        return '~/' + this.currentPath.join('/');
    }
    getCurrentDirectory() {
        let current = this.root;
        for (const segment of this.currentPath){
            const next = current.children.get(segment);
            if (!next || next.type !== 'directory') {
                throw new Error(`Invalid path: ${segment}`);
            }
            current = next;
        }
        return current;
    }
    getNodeAtPath(path) {
        const segments = this.resolvePath(path);
        let current = this.root;
        for (const segment of segments){
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
    resolvePath(path) {
        if (path.startsWith('/')) {
            // Absolute path from root
            return path.slice(1).split('/').filter(Boolean);
        } else if (path.startsWith('~')) {
            // Home directory
            return path.slice(1).split('/').filter(Boolean);
        } else {
            // Relative path
            return [
                ...this.currentPath,
                ...path.split('/').filter(Boolean)
            ];
        }
    }
    normalizePath(segments) {
        const result = [];
        for (const segment of segments){
            if (segment === '..') {
                result.pop();
            } else if (segment !== '.' && segment !== '') {
                result.push(segment);
            }
        }
        return result;
    }
    changeDirectory(path) {
        if (path === '~' || path === '') {
            this.currentPath = [];
            return true;
        }
        const segments = this.normalizePath(this.resolvePath(path));
        let current = this.root;
        for (const segment of segments){
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
    listDirectory(path, options = {}) {
        let targetDir;
        if (path) {
            const node = this.getNodeAtPath(path);
            if (!node) {
                return `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].red}ls: cannot access '${path}': No such file or directory${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}`;
            }
            if (node.type !== 'directory') {
                return `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].red}ls: cannot access '${path}': Not a directory${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}`;
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
            return entries.filter(([name])=>options.all || !name.startsWith('.')).map(([name, node])=>{
                const perms = node.permissions;
                const owner = node.owner.padEnd(8);
                const group = node.group.padEnd(8);
                const size = node.type === 'file' ? String(node.size).padStart(8) : '-'.padStart(8);
                const date = node.modified.toLocaleDateString('en-US', {
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric'
                });
                const color = node.type === 'directory' ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].blue : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].white;
                return `${perms} ${owner} ${group} ${size} ${date} ${color}${name}${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}`;
            }).join('\n');
        }
        return entries.filter(([name])=>options.all || !name.startsWith('.')).map(([name, node])=>{
            if (node.type === 'directory') {
                return `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].blue}${name}/${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}`;
            }
            return name;
        }).join('  ');
    }
    renderTree(dir, prefix, isLast) {
        const entries = Array.from(dir.children.entries());
        let result = '';
        entries.forEach(([name, node], index)=>{
            const isLastEntry = index === entries.length - 1;
            const connector = isLastEntry ? '└── ' : '├── ';
            const color = node.type === 'directory' ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].blue : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].white;
            result += `${prefix}${connector}${color}${name}${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}\n`;
            if (node.type === 'directory') {
                const newPrefix = prefix + (isLastEntry ? '    ' : '│   ');
                result += this.renderTree(node, newPrefix, isLastEntry);
            }
        });
        return result;
    }
    readFile(path) {
        const node = this.getNodeAtPath(path);
        if (!node) {
            return null;
        }
        if (node.type !== 'file') {
            return null;
        }
        return node.content;
    }
    getAllPaths() {
        const paths = [];
        const traverse = (dir, prefix)=>{
            for (const [name, node] of dir.children){
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
    getCompletions(partial) {
        const lastSlashIndex = partial.lastIndexOf('/');
        const dirPath = lastSlashIndex >= 0 ? partial.slice(0, lastSlashIndex) : '';
        const filePrefix = lastSlashIndex >= 0 ? partial.slice(lastSlashIndex + 1) : partial;
        let targetDir;
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
        const matches = [];
        for (const [name, node] of targetDir.children){
            if (name.startsWith(filePrefix)) {
                const fullPath = dirPath ? `${dirPath}/${name}` : name;
                matches.push(node.type === 'directory' ? `${fullPath}/` : fullPath);
            }
        }
        return matches;
    }
}
const fileSystem = new FileSystem();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/commands/handlers.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "catCommand",
    ()=>catCommand,
    "cdCommand",
    ()=>cdCommand,
    "contactCommand",
    ()=>contactCommand,
    "cowsayCommand",
    ()=>cowsayCommand,
    "dateCommand",
    ()=>dateCommand,
    "echoCommand",
    ()=>echoCommand,
    "experienceCommand",
    ()=>experienceCommand,
    "generatePrompt",
    ()=>generatePrompt,
    "generateShortPrompt",
    ()=>generateShortPrompt,
    "getCompletions",
    ()=>getCompletions,
    "getExitCode",
    ()=>getExitCode,
    "glCommand",
    ()=>glCommand,
    "gsCommand",
    ()=>gsCommand,
    "helpCommand",
    ()=>helpCommand,
    "lsCommand",
    ()=>lsCommand,
    "neofetchCommand",
    ()=>neofetchCommand,
    "projectsCommand",
    ()=>projectsCommand,
    "pwdCommand",
    ()=>pwdCommand,
    "setExitCode",
    ()=>setExitCode,
    "skillsCommand",
    ()=>skillsCommand,
    "whoamiCommand",
    ()=>whoamiCommand
]);
/**
 * Command Handlers
 * All terminal command implementations
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/filesystem/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/filesystem/types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/filesystem/data.ts [app-client] (ecmascript)");
;
;
;
// Track last command exit status
let lastExitCode = 0;
function setExitCode(code) {
    lastExitCode = code;
}
function getExitCode() {
    return lastExitCode;
}
function generatePrompt() {
    const currentPath = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fileSystem"].getCurrentPath();
    const gitBranch = 'main'; // Simulated git branch
    const errorIndicator = lastExitCode !== 0 ? `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PromptColors"].error}✘ ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PromptColors"].reset}` : '';
    return `${errorIndicator}${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PromptColors"].directory}${currentPath}${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PromptColors"].reset} ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PromptColors"].gitBranch}on ${gitBranch}${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PromptColors"].reset} ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PromptColors"].nodeVersion}via ⬢ ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NODE_VERSION"]}${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PromptColors"].reset} \n${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PromptColors"].promptSymbol}❯${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PromptColors"].reset} `;
}
function generateShortPrompt() {
    const currentPath = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fileSystem"].getCurrentPath();
    const gitBranch = 'main';
    return `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PromptColors"].directory}${currentPath}${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PromptColors"].reset} ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PromptColors"].gitBranch}on ${gitBranch}${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PromptColors"].reset} ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PromptColors"].nodeVersion}via ⬢ ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NODE_VERSION"]}${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PromptColors"].reset} ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PromptColors"].promptSymbol}❯${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PromptColors"].reset} `;
}
function helpCommand() {
    return `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].bold}Available commands:${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}

  ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].green}help${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}        - Show this help message
  ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].green}clear${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}       - Clear the terminal
  ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].green}date${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}        - Show current date and time
  ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].green}echo${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}        - Print text to the terminal
  ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].green}ls${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}          - List directory contents
  ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].green}cd${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}          - Change directory
  ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].green}pwd${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}         - Print working directory
  ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].green}cat${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}         - Display file contents
  ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].green}whoami${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}      - Display user information
  ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].green}skills${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}      - Display technical skills
  ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].green}experience${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}  - List work history
  ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].green}contact${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}     - Display contact information
  ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].green}projects${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}    - List all projects
  ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].green}gs${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}          - Show git status
  ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].green}gl${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}          - Show git log
  ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].green}neofetch${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}    - Display system info
  ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].green}cowsay${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}      - ASCII cow says a message

${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].dim}Tip: Use Tab for command and path completion${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}`;
}
function lsCommand(args) {
    const options = {
        all: args.includes('-a') || args.includes('-la') || args.includes('-al'),
        long: args.includes('-l') || args.includes('-la') || args.includes('-al'),
        tree: args.includes('--tree')
    };
    const pathArg = args.find((arg)=>!arg.startsWith('-'));
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fileSystem"].listDirectory(pathArg, options);
}
function cdCommand(args) {
    const path = args[0] || '~';
    const success = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fileSystem"].changeDirectory(path);
    if (!success) {
        setExitCode(1);
        return `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].red}cd: no such file or directory: ${path}${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}`;
    }
    setExitCode(0);
    return '';
}
function pwdCommand() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fileSystem"].getCurrentPath().replace('~', '/home/otis');
}
function catCommand(args) {
    if (args.length === 0) {
        setExitCode(1);
        return `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].red}cat: missing file operand${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}`;
    }
    const path = args[0];
    const content = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fileSystem"].readFile(path);
    if (content === null) {
        setExitCode(1);
        return `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].red}cat: ${path}: No such file or directory${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}`;
    }
    setExitCode(0);
    // Check if it's JSON
    if (path.endsWith('.json')) {
        try {
            const parsed = JSON.parse(content);
            return JSON.stringify(parsed, null, 2);
        } catch  {
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
function renderMarkdown(content) {
    return content.split('\n').map((line)=>{
        // Headers
        if (line.startsWith('# ')) {
            return `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].bold}${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].brightCyan}${line.slice(2)}${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}`;
        }
        if (line.startsWith('## ')) {
            return `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].bold}${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].cyan}${line.slice(3)}${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}`;
        }
        if (line.startsWith('### ')) {
            return `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].bold}${line.slice(4)}${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}`;
        }
        // Bold
        line = line.replace(/\*\*(.+?)\*\*/g, `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].bold}$1${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].white}`);
        // Italic
        line = line.replace(/\*(.+?)\*/g, `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].italic}$1${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].white}`);
        // Code
        line = line.replace(/`(.+?)`/g, `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].brightBlack}$1${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].white}`);
        return line;
    }).join('\n');
}
function whoamiCommand() {
    return `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].bold}${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].brightCyan}Otis Scott${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}
${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].dim}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}
${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].white}Software Engineer • Open Source Enthusiast • Terminal Addict${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}`;
}
function skillsCommand() {
    const skillsContent = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fileSystem"].readFile('work/skills.json');
    if (!skillsContent) {
        return `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].red}Error: Could not load skills data${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}`;
    }
    try {
        const skills = JSON.parse(skillsContent);
        let output = `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].bold}Technical Skills${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}\n${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].dim}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}\n\n`;
        for (const [category, data] of Object.entries(skills)){
            const { icon, items } = data;
            const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
            output += `${icon} ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].bold}${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].cyan}${categoryName}${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}\n`;
            for (const item of items){
                const levelColor = item.level === 'expert' ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].green : item.level === 'proficient' ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].yellow : item.level === 'learning' ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].magenta : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].white;
                output += `  ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].brightBlack}•${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset} ${item.name} ${levelColor}(${item.level})${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset} ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].dim}- ${item.years}y${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}\n`;
            }
            output += '\n';
        }
        return output;
    } catch  {
        return `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].red}Error: Could not parse skills data${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}`;
    }
}
function experienceCommand() {
    const expDir = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fileSystem"].getNodeAtPath('work/experience');
    if (!expDir || expDir.type !== 'directory') {
        return `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].red}Error: Could not load experience data${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}`;
    }
    let output = `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].bold}Work Experience${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}\n${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].dim}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}\n\n`;
    const files = Array.from(expDir.children.values()).filter((node)=>node.type === 'file').reverse();
    for (const file of files){
        const content = file.content;
        const lines = content.split('\n');
        const title = lines[0].replace('# ', '');
        const company = lines[1].replace('## ', '');
        const period = lines[3];
        output += `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].bold}${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].cyan}${title}${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}\n`;
        output += `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].yellow}${company}${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset} ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].dim}${period}${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}\n\n`;
    }
    output += `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].dim}Use 'cat work/experience/<file>' to see full details${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}`;
    return output;
}
function contactCommand() {
    let output = `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].bold}Get In Touch${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}\n${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].dim}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}\n\n`;
    output += `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].cyan}📧 Email${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}\n`;
    output += `   ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].white}hello@otisscott.me${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}\n\n`;
    const socialContent = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fileSystem"].readFile('contact/social.json');
    if (socialContent) {
        try {
            const social = JSON.parse(socialContent);
            output += `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].cyan}🌐 Social${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}\n`;
            const icons = {
                github: '🐙',
                twitter: '🐦',
                linkedin: '💼',
                bluesky: '🦋',
                mastodon: '🐘'
            };
            for (const [platform, data] of Object.entries(social)){
                const { url, handle, description } = data;
                const icon = icons[platform] || '🔗';
                output += `   ${icon} ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].green}${platform}${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}: ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].white}${handle}${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}\n`;
                output += `      ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].dim}${description}${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}\n`;
                output += `      ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].blue}https://${url}${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}\n\n`;
            }
        } catch  {
        // Ignore parse errors
        }
    }
    return output;
}
function projectsCommand() {
    const projectsDir = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fileSystem"].getNodeAtPath('projects');
    if (!projectsDir || projectsDir.type !== 'directory') {
        return `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].red}Error: Could not load projects${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}`;
    }
    let output = `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].bold}Projects${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}\n${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].dim}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}\n\n`;
    const files = Array.from(projectsDir.children.values()).filter((node)=>node.type === 'file');
    for (const file of files){
        const lines = file.content.split('\n');
        const title = lines[0].replace('# ', '');
        const description = lines[2] || '';
        output += `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].bold}${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].cyan}${title}${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}\n`;
        output += `   ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].white}${description}${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}\n\n`;
    }
    output += `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].dim}Use 'cat projects/<file>' to see full details${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}`;
    return output;
}
function gsCommand() {
    return `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].green}On branch main${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}
Your branch is up to date with 'origin/main'.

${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].green}nothing to commit, working tree clean${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}`;
}
function glCommand() {
    const output = [];
    for (const commit of __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fakeCommits"].slice(0, 5)){
        const hash = `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].yellow}${commit.hash}${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}`;
        const message = `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].white}${commit.message}${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}`;
        const meta = `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].dim}${commit.date} - ${commit.author}${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}`;
        output.push(`${hash} ${message}\n    ${meta}`);
    }
    return output.join('\n\n');
}
function neofetchCommand() {
    const loadTime = new Date();
    const now = new Date();
    const uptimeMs = now.getTime() - loadTime.getTime();
    const uptimeSec = Math.floor(uptimeMs / 1000);
    const uptimeMin = Math.floor(uptimeSec / 60);
    const uptimeHours = Math.floor(uptimeMin / 60);
    const uptimeStr = uptimeHours > 0 ? `${uptimeHours}h ${uptimeMin % 60}m` : uptimeMin > 0 ? `${uptimeMin}m ${uptimeSec % 60}s` : `${uptimeSec}s`;
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown';
    const os = userAgent.includes('Mac') ? 'macOS' : userAgent.includes('Win') ? 'Windows' : userAgent.includes('Linux') ? 'Linux' : 'Unknown OS';
    return `${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].cyan}╭─────────────── ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].white}otis@otisscott.me${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].cyan} ───────────────╮${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}
${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].cyan}│${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}                                                 ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].cyan}│${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}
${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].cyan}│${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}   ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].blue}╭─────╮${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}  ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].bold}OS:${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset} ${os} / Web Browser              ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].cyan}│${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}
${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].cyan}│${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}   ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].blue}│${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}     ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].blue}│${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}  ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].bold}Shell:${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset} xterm.js                      ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].cyan}│${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}
${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].cyan}│${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}   ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].blue}│${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}  ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].white}O${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}  ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].blue}│${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}  ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].bold}Terminal:${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset} otisscott.me               ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].cyan}│${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}
${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].cyan}│${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}   ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].blue}│${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}     ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].blue}│${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}  ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].bold}Theme:${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset} Tokyo Night                   ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].cyan}│${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}
${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].cyan}│${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}   ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].blue}╰─────╯${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}  ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].bold}Uptime:${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset} ${uptimeStr}                      ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].cyan}│${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}
${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].cyan}│${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}                                                 ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].cyan}│${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}
${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].cyan}╰─────────────────────────────────────────────────╯${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}`;
}
function cowsayCommand(args) {
    const message = args.join(' ') || 'Moo!';
    const lines = message.split('\n');
    const maxLen = Math.max(...lines.map((l)=>l.length));
    const border = '─'.repeat(maxLen + 2);
    let output = ` ${border}\n`;
    for (const line of lines){
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
function echoCommand(args) {
    return args.join(' ');
}
function dateCommand() {
    return new Date().toString();
}
function getCompletions(input) {
    const trimmed = input.trim();
    const parts = trimmed.split(' ');
    // If we're completing a command
    if (parts.length === 1 && !trimmed.includes(' ')) {
        const commands = [
            'help',
            'clear',
            'date',
            'echo',
            'ls',
            'cd',
            'pwd',
            'cat',
            'whoami',
            'skills',
            'experience',
            'contact',
            'projects',
            'gs',
            'gl',
            'neofetch',
            'cowsay'
        ];
        const matches = commands.filter((cmd)=>cmd.startsWith(trimmed));
        return {
            completions: matches,
            prefix: ''
        };
    }
    // If we're completing a path
    if (parts.length >= 1) {
        const cmd = parts[0];
        const pathArg = parts.slice(1).join(' ') || '';
        const completions = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fileSystem"].getCompletions(pathArg);
        return {
            completions,
            prefix: pathArg
        };
    }
    return {
        completions: [],
        prefix: ''
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/terminal/Terminal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Terminal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$xterm$2f$xterm$2f$lib$2f$xterm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@xterm/xterm/lib/xterm.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$xterm$2f$addon$2d$fit$2f$lib$2f$addon$2d$fit$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@xterm/addon-fit/lib/addon-fit.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$xterm$2f$addon$2d$web$2d$links$2f$lib$2f$addon$2d$web$2d$links$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@xterm/addon-web-links/lib/addon-web-links.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$xterm$2f$addon$2d$webgl$2f$lib$2f$addon$2d$webgl$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@xterm/addon-webgl/lib/addon-webgl.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$tokyo$2d$night$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/theme/tokyo-night.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$commands$2f$handlers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/commands/handlers.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/filesystem/types.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
function Terminal({ onCommand, onData }) {
    _s();
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const terminalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const xtermRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const fitAddonRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const inputBufferRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])('');
    const commandHistoryRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const historyIndexRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(-1);
    const cursorPositionRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const tabPressCountRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const lastTabInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])('');
    const writePrompt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Terminal.useCallback[writePrompt]": ()=>{
            if (xtermRef.current) {
                const prompt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$commands$2f$handlers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generatePrompt"])();
                xtermRef.current.write('\r\n' + prompt);
            }
        }
    }["Terminal.useCallback[writePrompt]"], []);
    const writeShortPrompt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Terminal.useCallback[writeShortPrompt]": ()=>{
            if (xtermRef.current) {
                const prompt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$commands$2f$handlers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateShortPrompt"])();
                xtermRef.current.write(prompt);
            }
        }
    }["Terminal.useCallback[writeShortPrompt]"], []);
    const handleTabCompletion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Terminal.useCallback[handleTabCompletion]": ()=>{
            const input = inputBufferRef.current;
            const { completions, prefix } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$commands$2f$handlers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCompletions"])(input);
            if (completions.length === 0) {
                return;
            }
            if (completions.length === 1) {
                const parts = input.split(' ');
                if (parts.length === 1) {
                    inputBufferRef.current = completions[0] + ' ';
                    cursorPositionRef.current = inputBufferRef.current.length;
                } else {
                    const cmd = parts[0];
                    const rest = parts.slice(1).join(' ');
                    const lastSlashIndex = rest.lastIndexOf('/');
                    const dirPart = lastSlashIndex >= 0 ? rest.slice(0, lastSlashIndex + 1) : '';
                    inputBufferRef.current = `${cmd} ${dirPart}${completions[0]}`;
                    cursorPositionRef.current = inputBufferRef.current.length;
                }
                if (xtermRef.current) {
                    xtermRef.current.write('\r\x1b[K');
                    writeShortPrompt();
                    xtermRef.current.write(inputBufferRef.current);
                }
                tabPressCountRef.current = 0;
            } else {
                if (tabPressCountRef.current === 0 || lastTabInputRef.current !== input) {
                    tabPressCountRef.current = 1;
                    lastTabInputRef.current = input;
                    if (xtermRef.current) {
                        xtermRef.current.write('\x07');
                    }
                } else {
                    tabPressCountRef.current = 0;
                    if (xtermRef.current) {
                        xtermRef.current.writeln('');
                        xtermRef.current.writeln(completions.join('  '));
                        writeShortPrompt();
                        xtermRef.current.write(inputBufferRef.current);
                    }
                }
            }
        }
    }["Terminal.useCallback[handleTabCompletion]"], [
        writeShortPrompt
    ]);
    const handleCommand = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Terminal.useCallback[handleCommand]": (command)=>{
            const trimmedCommand = command.trim();
            if (trimmedCommand) {
                commandHistoryRef.current.push(trimmedCommand);
                historyIndexRef.current = commandHistoryRef.current.length;
                if (onCommand) {
                    onCommand(trimmedCommand);
                }
                const parts = trimmedCommand.split(' ');
                const cmd = parts[0];
                const args = parts.slice(1);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$commands$2f$handlers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setExitCode"])(0);
                switch(cmd){
                    case 'help':
                        xtermRef.current?.writeln('');
                        xtermRef.current?.writeln((0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$commands$2f$handlers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["helpCommand"])());
                        break;
                    case 'clear':
                        xtermRef.current?.clear();
                        break;
                    case 'date':
                        xtermRef.current?.writeln('');
                        xtermRef.current?.writeln((0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$commands$2f$handlers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dateCommand"])());
                        break;
                    case 'pwd':
                        xtermRef.current?.writeln('');
                        xtermRef.current?.writeln((0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$commands$2f$handlers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pwdCommand"])());
                        break;
                    case 'whoami':
                        xtermRef.current?.writeln('');
                        xtermRef.current?.writeln((0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$commands$2f$handlers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["whoamiCommand"])());
                        break;
                    case 'ls':
                        xtermRef.current?.writeln('');
                        xtermRef.current?.writeln((0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$commands$2f$handlers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lsCommand"])(args));
                        break;
                    case 'cd':
                        const cdResult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$commands$2f$handlers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cdCommand"])(args);
                        if (cdResult) {
                            xtermRef.current?.writeln('');
                            xtermRef.current?.writeln(cdResult);
                        }
                        break;
                    case 'cat':
                        xtermRef.current?.writeln('');
                        xtermRef.current?.writeln((0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$commands$2f$handlers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["catCommand"])(args));
                        break;
                    case 'echo':
                        xtermRef.current?.writeln('');
                        xtermRef.current?.writeln((0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$commands$2f$handlers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["echoCommand"])(args));
                        break;
                    case 'skills':
                        xtermRef.current?.writeln('');
                        xtermRef.current?.writeln((0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$commands$2f$handlers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["skillsCommand"])());
                        break;
                    case 'experience':
                        xtermRef.current?.writeln('');
                        xtermRef.current?.writeln((0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$commands$2f$handlers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["experienceCommand"])());
                        break;
                    case 'contact':
                        xtermRef.current?.writeln('');
                        xtermRef.current?.writeln((0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$commands$2f$handlers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["contactCommand"])());
                        break;
                    case 'projects':
                        xtermRef.current?.writeln('');
                        xtermRef.current?.writeln((0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$commands$2f$handlers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["projectsCommand"])());
                        break;
                    case 'gs':
                        xtermRef.current?.writeln('');
                        xtermRef.current?.writeln((0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$commands$2f$handlers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["gsCommand"])());
                        break;
                    case 'gl':
                        xtermRef.current?.writeln('');
                        xtermRef.current?.writeln((0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$commands$2f$handlers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["glCommand"])());
                        break;
                    case 'neofetch':
                        xtermRef.current?.writeln('');
                        xtermRef.current?.writeln((0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$commands$2f$handlers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["neofetchCommand"])());
                        break;
                    case 'cowsay':
                        xtermRef.current?.writeln('');
                        xtermRef.current?.writeln((0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$commands$2f$handlers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cowsayCommand"])(args));
                        break;
                    default:
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$commands$2f$handlers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setExitCode"])(1);
                        xtermRef.current?.writeln('');
                        xtermRef.current?.writeln(`${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].red}zsh: command not found: ${cmd}${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}`);
                }
            }
            inputBufferRef.current = '';
            cursorPositionRef.current = 0;
            tabPressCountRef.current = 0;
            writePrompt();
        }
    }["Terminal.useCallback[handleCommand]"], [
        onCommand,
        writePrompt
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutEffect"])({
        "Terminal.useLayoutEffect": ()=>{
            if (!terminalRef.current || xtermRef.current) return;
            const wrapper = terminalRef.current;
            const term = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$xterm$2f$xterm$2f$lib$2f$xterm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Terminal"]({
                theme: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$tokyo$2d$night$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["xtermTheme"],
                fontFamily: '"SF Mono", "Fira Code", "JetBrains Mono", "Consolas", "Monaco", "Courier New", monospace',
                fontSize: 14,
                cursorBlink: true,
                cursorStyle: 'block',
                scrollback: 10000
            });
            const fitAddon = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$xterm$2f$addon$2d$fit$2f$lib$2f$addon$2d$fit$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FitAddon"]();
            fitAddonRef.current = fitAddon;
            term.loadAddon(fitAddon);
            term.loadAddon(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$xterm$2f$addon$2d$web$2d$links$2f$lib$2f$addon$2d$web$2d$links$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WebLinksAddon"]());
            try {
                term.loadAddon(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$xterm$2f$addon$2d$webgl$2f$lib$2f$addon$2d$webgl$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WebglAddon"]());
            } catch  {
            // WebGL not supported
            }
            // Open terminal
            term.open(wrapper);
            // Write welcome message
            const writeWelcome = {
                "Terminal.useLayoutEffect.writeWelcome": ()=>{
                    term.writeln('');
                    term.writeln(`${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].cyan}  +--------------------------------------------------------+${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}`);
                    term.writeln(`${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].cyan}  |                                                        |${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}`);
                    term.writeln(`${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].cyan}  |${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}   Welcome to ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].magenta}otisscott.me${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset} - Terminal Portfolio      ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].cyan}|${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}`);
                    term.writeln(`${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].cyan}  |                                                        |${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}`);
                    term.writeln(`${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].cyan}  |${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}   Type ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].green}help${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset} to see available commands                ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].cyan}|${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}`);
                    term.writeln(`${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].cyan}  |${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}   Try ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].green}neofetch${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset} or ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].green}cowsay${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset} for some fun!               ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].cyan}|${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}`);
                    term.writeln(`${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].cyan}  |                                                        |${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}`);
                    term.writeln(`${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].cyan}  +--------------------------------------------------------+${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$filesystem$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANSI"].reset}`);
                    term.writeln('');
                    writeShortPrompt();
                }
            }["Terminal.useLayoutEffect.writeWelcome"];
            // Fit terminal using FitAddon (which properly measures char dimensions)
            const fitTerminal = {
                "Terminal.useLayoutEffect.fitTerminal": ()=>{
                    if (fitAddonRef.current && xtermRef.current) {
                        fitAddonRef.current.fit();
                    }
                }
            }["Terminal.useLayoutEffect.fitTerminal"];
            // Initialize terminal after fonts load
            const initTerminal = {
                "Terminal.useLayoutEffect.initTerminal": ()=>{
                    // First write welcome (this creates the content)
                    writeWelcome();
                    // Then fit to container
                    fitTerminal();
                    // Scroll viewport to show the prompt at the bottom
                    setTimeout({
                        "Terminal.useLayoutEffect.initTerminal": ()=>{
                            const viewport = wrapper.querySelector('.xterm-viewport');
                            if (viewport) {
                                viewport.scrollTop = viewport.scrollHeight;
                            }
                            xtermRef.current?.scrollToBottom();
                        }
                    }["Terminal.useLayoutEffect.initTerminal"], 0);
                }
            }["Terminal.useLayoutEffect.initTerminal"];
            if (typeof document !== 'undefined' && document.fonts) {
                document.fonts.ready.then({
                    "Terminal.useLayoutEffect": ()=>{
                        initTerminal();
                        // Refit after layout settles
                        setTimeout(fitTerminal, 100);
                    }
                }["Terminal.useLayoutEffect"]).catch({
                    "Terminal.useLayoutEffect": ()=>{
                        initTerminal();
                    }
                }["Terminal.useLayoutEffect"]);
            } else {
                requestAnimationFrame(initTerminal);
            }
            // Window resize handler
            const handleWindowResize = {
                "Terminal.useLayoutEffect.handleWindowResize": ()=>{
                    fitTerminal();
                }
            }["Terminal.useLayoutEffect.handleWindowResize"];
            window.addEventListener('resize', handleWindowResize);
            term.onData({
                "Terminal.useLayoutEffect": (data)=>{
                    const code = data.charCodeAt(0);
                    if (code === 13) {
                        handleCommand(inputBufferRef.current);
                    } else if (code === 127) {
                        if (cursorPositionRef.current > 0) {
                            inputBufferRef.current = inputBufferRef.current.slice(0, cursorPositionRef.current - 1) + inputBufferRef.current.slice(cursorPositionRef.current);
                            cursorPositionRef.current--;
                            term.write('\b \b');
                        }
                    } else if (code === 27 && data.length === 3) {
                        if (data === '\x1b[A') {
                            if (historyIndexRef.current > 0) {
                                historyIndexRef.current--;
                                const prevCommand = commandHistoryRef.current[historyIndexRef.current];
                                inputBufferRef.current = prevCommand;
                                cursorPositionRef.current = prevCommand.length;
                                term.write('\r\x1b[K');
                                writeShortPrompt();
                                term.write(prevCommand);
                            }
                        } else if (data === '\x1b[B') {
                            if (historyIndexRef.current < commandHistoryRef.current.length - 1) {
                                historyIndexRef.current++;
                                const nextCommand = commandHistoryRef.current[historyIndexRef.current];
                                inputBufferRef.current = nextCommand;
                                cursorPositionRef.current = nextCommand.length;
                                term.write('\r\x1b[K');
                                writeShortPrompt();
                                term.write(nextCommand);
                            } else {
                                historyIndexRef.current = commandHistoryRef.current.length;
                                inputBufferRef.current = '';
                                cursorPositionRef.current = 0;
                                term.write('\r\x1b[K');
                                writeShortPrompt();
                            }
                        } else if (data === '\x1b[C') {
                            if (cursorPositionRef.current < inputBufferRef.current.length) {
                                cursorPositionRef.current++;
                                term.write(data);
                            }
                        } else if (data === '\x1b[D') {
                            if (cursorPositionRef.current > 0) {
                                cursorPositionRef.current--;
                                term.write(data);
                            }
                        }
                    } else if (code === 9) {
                        handleTabCompletion();
                    } else if (code === 3) {
                        term.write('^C');
                        inputBufferRef.current = '';
                        cursorPositionRef.current = 0;
                        writePrompt();
                    } else if (code === 4) {
                        inputBufferRef.current = '';
                        cursorPositionRef.current = 0;
                        writePrompt();
                    } else if (code >= 32 && code < 127) {
                        const before = inputBufferRef.current.slice(0, cursorPositionRef.current);
                        const after = inputBufferRef.current.slice(cursorPositionRef.current);
                        inputBufferRef.current = before + data + after;
                        cursorPositionRef.current++;
                        term.write(data + after);
                        if (after.length > 0) {
                            term.write(`\x1b[${after.length}D`);
                        }
                    }
                    if (onData) {
                        onData(data);
                    }
                }
            }["Terminal.useLayoutEffect"]);
            xtermRef.current = term;
            return ({
                "Terminal.useLayoutEffect": ()=>{
                    window.removeEventListener('resize', handleWindowResize);
                    term.dispose();
                    xtermRef.current = null;
                }
            })["Terminal.useLayoutEffect"];
        }
    }["Terminal.useLayoutEffect"], [
        handleCommand,
        handleTabCompletion,
        onData,
        writePrompt,
        writeShortPrompt
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: containerRef,
        className: "terminal-container",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            ref: terminalRef,
            className: "terminal-wrapper"
        }, void 0, false, {
            fileName: "[project]/components/terminal/Terminal.tsx",
            lineNumber: 389,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/terminal/Terminal.tsx",
        lineNumber: 385,
        columnNumber: 5
    }, this);
}
_s(Terminal, "xNyA4iT+Z4vtoRuJMG+HOZ5F19Q=");
_c = Terminal;
var _c;
__turbopack_context__.k.register(_c, "Terminal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/terminal/Terminal.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/components/terminal/Terminal.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=_37dde4e2._.js.map