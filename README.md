# otisscott.me

A terminal-emulated personal website built with Next.js, TypeScript, and xterm.js. Features a fully functional terminal interface with custom commands, Tokyo Night theme, and Pure prompt styling.

![Terminal Portfolio](screenshots/terminal.png)

## Features

- **Full Terminal Emulation** - xterm.js powered terminal with accurate rendering
- **Custom Commands** - `ls`, `cd`, `cat`, `help`, `neofetch`, `cowsay`, and more
- **Tokyo Night Theme** - Beautiful dark theme matching the popular VS Code theme
- **Pure Prompt Style** - Git-aware prompt showing branch and Node version
- **Tab Completion** - Smart command and file path completion
- **Command History** - Navigate previous commands with arrow keys
- **Responsive Design** - Terminal fits viewport and handles window resizing

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Terminal**: xterm.js with FitAddon, WebLinksAddon, WebglAddon
- **Styling**: CSS Modules + Global CSS
- **Theme**: Tokyo Night color palette

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## Available Commands

| Command | Description |
|---------|-------------|
| `help` | Show available commands |
| `ls [path]` | List directory contents |
| `cd [path]` | Change directory |
| `cat [file]` | Display file contents |
| `pwd` | Print working directory |
| `whoami` | Show user info |
| `skills` | List technical skills |
| `experience` | Show work experience |
| `projects` | List projects |
| `contact` | Show contact info |
| `neofetch` | System info display |
| `cowsay [text]` | ASCII cow says something |
| `clear` | Clear terminal |
| `date` | Show current date |

## Project Structure

```
app/
├── globals.css          # Global styles + Tokyo Night theme
├── layout.tsx           # Root layout
└── page.tsx             # Terminal page

components/
├── terminal/
│   └── Terminal.tsx     # Main terminal component
└── commands/
    └── handlers.ts      # Command implementations

lib/
├── filesystem/
│   ├── data.ts          # Virtual filesystem content
│   └── types.ts         # TypeScript types
└── theme/
    └── tokyo-night.ts   # xterm.js theme config

content/                  # Markdown content for commands
```

## Deployment

Built for static export and deployed on Vercel:

```bash
npm run build  # Creates static export in dist/
```

## License

MIT
