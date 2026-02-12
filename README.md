# otisscott.me

A terminal-emulated personal website built with Next.js, TypeScript, and xterm.js. Features a fully functional terminal interface with 40+ commands, multiple themes, and easter eggs.

![Terminal Portfolio](screenshots/06-neofetch.png)

## Features

- **Full Terminal Emulation** — xterm.js with WebGL rendering
- **40+ Commands** — navigation, portfolio, dev tools, easter eggs
- **Multiple Themes** — Tokyo Night, Dracula, Nord, and more (light/dark auto-detection)
- **Pure Prompt** — git-aware prompt with branch and Node version
- **Tab Completion** — commands and file paths with ghost text suggestions
- **Command History** — arrow key navigation with `history | grep` support
- **Persistent State** — todo list and aliases saved to localStorage
- **Responsive** — auto-fits viewport, handles resize

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Terminal**: xterm.js with FitAddon, WebLinksAddon, WebglAddon
- **Styling**: CSS Modules + Global CSS
- **Deployment**: Vercel

## Getting Started

```bash
bun install
bun dev
# Open http://localhost:3000
```

## Commands

### Navigation
| Command | Description |
|---------|-------------|
| `ls [-la]` | List directory contents |
| `cd [path]` | Change directory |
| `cat [file]` | Display file contents (renders markdown/JSON) |
| `pwd` | Print working directory |
| `tree [path]` | Directory tree view |
| `grep <pattern>` | Search file contents |
| `open <file\|url>` | Open URL in new tab |

### Portfolio
| Command | Description |
|---------|-------------|
| `whoami` | User identity |
| `skills` | Technical skills by category |
| `experience` | Work history |
| `projects` | Portfolio projects |
| `contact` | Email and social links |

### Tools
| Command | Description |
|---------|-------------|
| `help` | All available commands |
| `man <cmd>` | Manual pages for any command |
| `history` | Command history (`history \| grep` supported) |
| `todo` | Persistent todo list (add/done/rm/clear) |
| `alias` | Define command aliases (persistent) |
| `cal` | Calendar with today highlighted |
| `theme [name]` | Switch color theme |
| `neofetch` | System info display |
| `ping [host]` | Simulated ICMP |
| `date` | Current date/time |

### Easter Eggs
| Command | Description |
|---------|-------------|
| `docker` | Container management (ps, images, compose) |
| `ssh` | Connection animation |
| `htop` | Live process viewer with project-themed processes |
| `scp` | File transfer animation |
| `make` | Build animation |
| `jobs` / `fg` / `bg` | Background job system (append `&` to any command) |
| `uptime` | Session uptime |
| `vim` | Good luck getting out |
| `cowsay` | ASCII cow |
| `sl` | Steam locomotive |
| `rm -rf /` | Don't worry about it |
| `claude` / `codex` / `opencode` | AI tool easter eggs |

## Project Structure

```
app/
├── globals.css            # Global styles
├── layout.tsx             # Root layout
└── page.tsx               # Terminal page

components/
├── terminal/
│   └── Terminal.tsx        # Main terminal + input handling
└── commands/
    ├── handlers.ts         # Command implementations
    ├── interactive.ts      # Animations + full-screen modes
    └── man-pages.ts        # Man page content

lib/
├── filesystem/
│   ├── data.ts            # Virtual filesystem content
│   └── types.ts           # Types + ANSI codes
└── theme/
    ├── themes.ts          # Theme registry
    └── tokyo-night.ts     # Base theme
```

## License

MIT
