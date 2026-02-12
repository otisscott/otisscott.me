/**
 * Filesystem Data
 * Virtual filesystem content for the terminal
 */

import { DirectoryNode, FileNode } from './types';

function createFile(
  name: string,
  content: string,
  options: Partial<Omit<FileNode, 'type' | 'name' | 'content'>> = {}
): FileNode {
  return {
    type: 'file',
    name,
    content,
    permissions: options.permissions ?? '-rw-r--r--',
    owner: options.owner ?? 'otis',
    group: options.group ?? 'staff',
    size: options.size ?? content.length,
    modified: options.modified ?? new Date('2025-01-15'),
  };
}

function createDirectory(
  name: string,
  children: (FileNode | DirectoryNode)[] = [],
  options: Partial<Omit<DirectoryNode, 'type' | 'name' | 'children'>> = {}
): DirectoryNode {
  const childrenMap = new Map<string, FileNode | DirectoryNode>();
  children.forEach(child => {
    childrenMap.set(child.name, child);
  });

  return {
    type: 'directory',
    name,
    children: childrenMap,
    permissions: options.permissions ?? 'drwxr-xr-x',
    owner: options.owner ?? 'otis',
    group: options.group ?? 'staff',
    modified: options.modified ?? new Date('2025-01-15'),
  };
}

// Create the filesystem structure
export const rootDirectory = createDirectory('', [
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
• Neovim (btw)`),
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
JavaScript, PHP, Laravel, Vue.js, MySQL, WordPress`),
    ]),
    createFile('skills.json', JSON.stringify({
      languages: {
        icon: "💻",
        items: [
          { name: "TypeScript", level: "expert", years: 5 },
          { name: "JavaScript", level: "expert", years: 6 },
          { name: "Python", level: "proficient", years: 4 },
          { name: "Go", level: "proficient", years: 2 },
          { name: "Rust", level: "learning", years: 1 },
          { name: "SQL", level: "proficient", years: 5 }
        ]
      },
      frontend: {
        icon: "🎨",
        items: [
          { name: "React", level: "expert", years: 5 },
          { name: "Next.js", level: "expert", years: 4 },
          { name: "TypeScript", level: "expert", years: 5 },
          { name: "Tailwind CSS", level: "expert", years: 3 },
          { name: "Vue.js", level: "proficient", years: 2 },
          { name: "HTML/CSS", level: "expert", years: 6 }
        ]
      },
      backend: {
        icon: "⚙️",
        items: [
          { name: "Node.js", level: "expert", years: 5 },
          { name: "PostgreSQL", level: "proficient", years: 4 },
          { name: "Redis", level: "proficient", years: 3 },
          { name: "GraphQL", level: "proficient", years: 3 },
          { name: "FastAPI", level: "proficient", years: 2 },
          { name: "MongoDB", level: "familiar", years: 2 }
        ]
      },
      devops: {
        icon: "🚀",
        items: [
          { name: "Docker", level: "proficient", years: 4 },
          { name: "Kubernetes", level: "familiar", years: 2 },
          { name: "AWS", level: "proficient", years: 3 },
          { name: "CI/CD", level: "proficient", years: 4 },
          { name: "Terraform", level: "familiar", years: 2 },
          { name: "Linux", level: "proficient", years: 5 }
        ]
      },
      tools: {
        icon: "🛠️",
        items: [
          { name: "Git", level: "expert", years: 6 },
          { name: "Neovim", level: "expert", years: 3 },
          { name: "VS Code", level: "expert", years: 5 },
          { name: "Figma", level: "proficient", years: 3 },
          { name: "Postman", level: "proficient", years: 4 },
          { name: "Jest/Vitest", level: "proficient", years: 4 }
        ]
      }
    }, null, 2)),
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
    }, null, 2)),
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

🔗 github.com/otisscott`),
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

[Read more - coming soon]`),
    ]),
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

Made with ⌨️ and ☕ by Otis Scott`),
  ]),
]);

// Git-like fake commits for the git log command
export const fakeCommits = [
  { hash: 'a1b2c3d', message: 'feat: add neofetch easter egg', date: '2025-02-10', author: 'Otis Scott' },
  { hash: 'e4f5g6h', message: 'feat: implement tab completion', date: '2025-02-09', author: 'Otis Scott' },
  { hash: 'i7j8k9l', message: 'style: pure prompt styling', date: '2025-02-08', author: 'Otis Scott' },
  { hash: 'm0n1o2p', message: 'feat: add filesystem navigation commands', date: '2025-02-07', author: 'Otis Scott' },
  { hash: 'q3r4s5t', message: 'feat: initial terminal setup', date: '2025-02-06', author: 'Otis Scott' },
  { hash: 'u6v7w8x', message: 'chore: project setup with next.js', date: '2025-02-05', author: 'Otis Scott' },
];

// Node version for prompt
export const NODE_VERSION = 'v20.11.0';
